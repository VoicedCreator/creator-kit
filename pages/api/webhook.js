import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabaseAdmin } from '../../lib/supabaseServer';
import sgMail from '@sendgrid/mail';
export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-11-15' });
if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event;
  try { event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch(err) { console.error(err); return res.status(400).send(`Webhook Error: ${err.message}`); }

  if (event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    try {
      const { data } = await supabaseAdmin.storage.from(process.env.SUPABASE_BUCKET).createSignedUrl(process.env.SUPABASE_FILE_PATH, 60 * 60);
      const signedUrl = data.signedURL;
      if (email && signedUrl && process.env.SENDGRID_API_KEY) {
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM,
          subject: 'Tu compra — descarga aquí',
          html: `<p>Gracias por tu compra. Descarga tu pack aquí (válido 1 hora): <a href="${signedUrl}">Descargar</a></p>`
        };
        await sgMail.send(msg);
      }
    } catch(e){ console.error('err sending mail',e); }
  }
  res.status(200).json({ received: true });
}
