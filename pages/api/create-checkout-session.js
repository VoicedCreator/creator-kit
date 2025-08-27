import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-11-15' });

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body || {};
  try{
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
    });
    res.status(200).json({ url: session.url });
  }catch(e){
    console.error(e); res.status(500).json({ error: 'error' });
  }
}
