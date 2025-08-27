import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Success(){
  const router = useRouter();
  const { session_id } = router.query;
  const [msg,setMsg] = useState("Verificando pago...");

  useEffect(()=>{
    if (!session_id) return;
    (async ()=>{
      const res = await fetch(`/api/verify-session?session_id=${session_id}`);
      const d = await res.json();
      if (d.ok) {
        setMsg("Pago confirmado. Revisa tu email: ahí está tu descarga (o haz clic para descargar).");
        // optional: open download
      } else setMsg("Pago no confirmado: "+(d.message||""));
    })();
  },[session_id]);

  return (<main style={{padding:32}}><h1>Gracias</h1><p>{msg}</p></main>);
}
