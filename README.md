# Creator Kit - Deploy rápido

1. Crear cuentas: Stripe, Supabase, GitHub, Vercel, SendGrid.
2. Subir archivos (pack .zip) a Supabase en bucket privado.
3. Crear Product+Price en Stripe y copiar PRICE_ID.
4. En Vercel -> Environment Variables pegar claves (ver .env.example).
5. Subir repo a GitHub -> Importar proyecto en Vercel -> Deploy.
6. En Stripe -> Webhooks -> agregar endpoint: https://<tu-proyecto>.vercel.app/api/webhook -> copiar webhook secret a STRIPE_WEBHOOK_SECRET en Vercel.
7. Probar con tarjeta test 4242 4242 4242 4242.
