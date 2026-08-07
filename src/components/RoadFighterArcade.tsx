"use client";
import { useEffect, useRef, useState } from "react";

declare global { interface Window { jsnes: any } }

export default function RoadFighterArcade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nesRef = useRef<any>(null);
  const [status, setStatus] = useState("CARGANDO ROAD FIGHTER...");

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.jsnes) {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/jsnes@1.0.4/dist/jsnes.min.js";
          document.body.appendChild(s);
          await new Promise(r => s.onload = r);
        }

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d", { alpha: false })!;
        const img = ctx.createImageData(256, 240);

        const nes = new window.jsnes.NES({
          onFrame: (buf: number[]) => {
            for (let i = 0; i < 256 * 240; i++) {
              const c = buf[i];
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

        // NOMBRE EXACTO COMO EN TU FOTO
        const res = await fetch("/roms/RoadFighterJapan.nes");
        if (!res.ok) throw new Error(`No encuentra /roms/RoadFighterJapan.nes - Status ${res.status}`);

        const ab = await res.arrayBuffer();
        let rom = "";
        const bytes = new Uint8Array(ab);
        for (let i=0;i<bytes.length;i++) rom += String.fromCharCode(bytes[i]);
        nes.loadROM(rom);
        setStatus("");

        const loop = () => { nes.frame(); requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      } catch (e:any) {
        setStatus("ERROR: " + e.message);
      }
    };
    init();
  }, []);

  const d = (b:number) => nesRef.current?.buttonDown(1,b);
  const u = (b:number) => nesRef.current?.buttonUp(1,b);
  const Btn = ({l,onDown,onUp,c}:{l:string,onDown:()=>void,onUp:()=>void,c:string}) => (
    <button onPointerDown={e=>{e.preventDefault(); onDown()}} onPointerUp={e=>{e.preventDefault(); onUp()}} onPointerCancel={onUp} onPointerLeave={onUp} className={`touch-none select-none active:scale-90 ${c}`}>{l}</button>
  );

  return (
    <section id="juego" className="bg-black w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
      <div className="w-full bg-black flex justify-center">
        <canvas ref={canvasRef} width={256} height={240} className="w-full max-w- aspect-[256/240] h-" />
      </div>
      <div className="w-full bg-[#0f0f0f] p-2.5 flex flex-col gap-2">
        {status && <p className="text-white/70 text- text-center">{status}</p>}
        <div className="grid grid-cols-2 gap-2">
          <Btn l="V = FICHA" c="py-3 bg-yellow-400 text-black font-black rounded text-sm" onDown={()=>d(2)} onUp={()=>u(2)} />
          <Btn l="ENTER = START" c="py-3 bg-white text-black font-black rounded text-sm" onDown={()=>d(3)} onUp={()=>u(3)} />
        </div>
        <div className="flex justify-between bg-[#1a1a1a] rounded-lg p-2">
          <div className="flex gap-2">
            <Btn l="◀" c="w-12 h-12 bg-black border border-white/20 text-white rounded-full" onDown={()=>d(6)} onUp={()=>u(6)} />
            <Btn l="▶" c="w-12 h-12 bg-black border border-white/20 text-white rounded-full" onDown={()=>d(7)} onUp={()=>u(7)} />
          </div>
          <div className="flex gap-2">
            <Btn l="Z" c="w-12 h-11 bg-zinc-800 text-white rounded font-bold" onDown={()=>d(1)} onUp={()=>u(1)} />
            <Btn l="X" c="w-16 h-11 bg-red-600 text-white rounded font-black border" onDown={()=>d(0)} onUp={()=>u(0)} />
          </div>
        </div>
      </div>
    </section>
  );
}