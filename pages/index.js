import { useState } from "react";

export default function Home(){
  const [loading,setLoading] = useState(false);
  const [email,setEmail] = useState("");

  const handleBuy = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email})
    });
    const d = await res.json();
    if (d?.url) window.location = d.url;
    else { alert('Error creando sesión'); setLoading(false); }
  };

  return (
    <main style={{padding:32,fontFamily:"Inter,system-ui"}}>
      <h1>Creator Kit — Prompts & Presets</h1>
      <p>20 prompts premium + 10 plantillas editables. Descarga automática tras pago.</p>

      <input placeholder="tu@mail.com" value={email} onChange={(e)=>setEmail(e.target.value)} style={{padding:10,marginTop:12,width:320}} />
      <div style={{marginTop:12}}>
        <button onClick={handleBuy} disabled={loading} style={{padding:'10px 16px'}}>{loading ? 'Cargando...' : 'Comprar $10 USD'}</button>
      </div>
      <p style={{marginTop:24,fontSize:13,color:'#666'}}>Prueba con tarjeta Stripe: 4242 4242 4242 4242</p>
    </main>
  );
}
