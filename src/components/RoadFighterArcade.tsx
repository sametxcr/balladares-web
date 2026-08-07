"use client";
import { useEffect, useState } from "react";

export default function RoadFighterArcade(){
  const [failed, setFailed] = useState(false);

  useEffect(()=>{
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo"; // <--- CAMBIO CLAVE
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_color = "#000000";

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);

    // si en 8 seg sigue con failed, mostramos alternativa
    const t = setTimeout(()=>{
      const el = document.getElementById("game");
      if(el && el.innerText.includes("Failed")) setFailed(true);
    }, 8000);

    return () => {
      clearTimeout(t);
      if(document.body.contains(script)) document.body.removeChild(script);
    };
  },[]);

  if(failed){
    return (
      <section className="bg-black py-10 px-4 flex flex-col items-center">
        <h2 className="text-white font-black italic text-3xl mb-4">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>
        <div className="w-full max-w- h- border-2 border-white bg-zinc-900 flex items-center justify-center text-white/50 text-sm text-center p-4">
          Este navegador bloqueó el emulador MAME. Estoy cargando la versión HTML5.
          <br/><br/>
          <a href="/juego/roadfighter.html" className="bg-red-600 text-white px-4 py-2 font-bold">JUGAR VERSIÓN HTML5</a>
        </div>
      </section>
    )
  }

  return (
    <section id="juego" className="bg-black py-10 px-4 flex flex-col items-center">
      <h2 className="text-white font-black italic text-3xl mb-1">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>
      <p className="text-white/40 text-xs mb-4">Original 1984 Konami</p>
      <div className="w-full max-w- border-2 border-white bg-black" style={{boxShadow:"4px 4px 0px #dc2626"}}>
        <div id="game" className="w-full h-" />
      </div>
      <p className="text-white/40 text- mt-2">ENTER = Moneda | 1 = Start | Flechas = Manejar</p>
    </section>
  )
}