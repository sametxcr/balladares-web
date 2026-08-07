"use client";
import { useEffect, useRef, useState } from "react";
declare global { interface Window { jsnes: any } }

export default function RoadFighterArcade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nesRef = useRef<any>(null);
  const [msg, setMsg] = useState("CARGANDO ROAD FIGHTER...");

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.jsnes) {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/jsnes@1.0.4/dist/jsnes.min.js";
          document.body.appendChild(s);
          await new Promise(r => s.onload = r);
        }
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d", { alpha: false })!;
        ctx.imageSmoothingEnabled = false;
        const img = ctx.createImageData(256, 240);

        const nes = new window.jsnes.NES({
          onFrame: (b: number[]) => {
            for (let i = 0; i < 61440; i++) {
              const c = b[i];
              img.data[i*4] = (c>>16)&255;
              img.data[i*4+1] = (c>>8)&255;
              img.data[i*4+2] = c&255;
              img.data[i*4+3] = 255;
            }
            ctx.putImageData(img, 0, 0);
          },
          onAudioSample: () => {},
        });
        nesRef.current = nes;

        const paths = ["/roms/RoadFighterJapan.nes", "/roms/roadfighter.nes", "/RoadFighterJapan.nes"];
        let res: Response | null = null;
        let usedPath = "";
        for (const p of paths) {
          const r = await fetch(p);
          if (r.ok) { res = r; usedPath = p; break; }
        }
        if (!res) throw new Error(`Vercel no encuentra el.nes en /public/roms/ - Probaste con git add -f?`);

        setMsg(`Cargando ${usedPath}...`);
        const ab = await res.arrayBuffer();
        let romStr = "";
        const u8 = new Uint8Array(ab);
        for (let i = 0; i < u8.length; i++) romStr += String.fromCharCode(u8[i]);

        nes.loadROM(romStr);
        setMsg("");
        const tick = () => { nes.frame(); requestAnimationFrame(tick); };
        tick();
      } catch (e:any) { setMsg("ERROR: " + e.message); }
    };
    init();
  }, []);

  const d=(b:number)=>nesRef.current?.buttonDown(1,b);
  const u=(b:number)=>nesRef.current?.buttonUp(1,b);
  const B=({l,dn,up,c}:{l:string,dn:()=>void,up:()=>void,c:string})=><button onPointerDown={e=>{e.preventDefault(); dn()}} onPointerUp={e=>{e.preventDefault(); up()}} onPointerCancel={up} onPointerLeave={up} className={`touch-manipulation select-none active:scale-95 ${c}`}>{l}</button>;

  return (
    <section className="bg-black w-full flex flex-col items-center">
      {/* CONTENEDOR NO ESTIRADO */}
      <div className="w-full bg-black flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={256}
          height={240}
          className="w-full max-w- aspect-[256/240] h-auto"
          style={{ imageRendering: 'pixelated' } as any}
        />
      </div>

      <div className="w-full max-w- bg-[#111] p-2 flex flex-col gap-2">
        {msg && <p className="text-white text-center text- py-1">{msg}</p>}
        <div className="grid grid-cols-2 gap-2">
          <B l="V = FICHA" c="py-3 bg-yellow-400 text-black font-black rounded" dn={()=>d(2)} up={()=>u(2)} />
          <B l="ENTER = START" c="py-3 bg-white text-black font-black rounded" dn={()=>d(3)} up={()=>u(3)} />
        </div>
        <div className="flex justify-between bg-[#1a1a1a] rounded-lg p-2">
          <div className="flex gap-3">
            <B l="◀" c="w-12 h-12 bg-black border border-white/20 text-white rounded-full text-xl" dn={()=>d(6)} up={()=>u(6)} />
            <B l="▶" c="w-12 h-12 bg-black border border-white/20 text-white rounded-full text-xl" dn={()=>d(7)} up={()=>u(7)} />
          </div>
          <div className="flex gap-2 items-center">
            <B l="Z" c="w-12 h-11 bg-zinc-800 text-white rounded font-bold" dn={()=>d(1)} up={()=>u(1)} />
            <B l="X" c="w-16 h-11 bg-red-600 text-white rounded font-black border-2 border-white/20" dn={()=>d(0)} up={()=>u(0)} />
          </div>
        </div>
      </div>
    </section>
  );
}