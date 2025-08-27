import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabaseServer';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-11-15' });

export default async function handler(req,res){
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ ok:false, message:'missing' });
  try{
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') return res.status(400).json({ ok:false, message:'not paid' });

    const bucket = process.env.SUPABASE_BUCKET;
    const filePath = process.env.SUPABASE_FILE_PATH;
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(filePath, 60 * 60);
    if (error) throw error;
    return res.status(200).json({ ok:true, signedUrl: data.signedURL });
  }catch(e){
    console.error(e); res.status(500).json({ ok:false, message:'error' });
  }
}
