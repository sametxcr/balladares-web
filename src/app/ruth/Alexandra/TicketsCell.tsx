'use client';
import { useState } from 'react';
export default function TicketsCell({ tickets }: { tickets: string[] }) {
  const [open, setOpen] = useState(false);
  const visible = open ? tickets : tickets.slice(0, 6);
  if (!tickets.length) return <span className="text-zinc-600">—</span>;
  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {visible.map(c => <span key={c} className="px-1.5 py-0.5 bg-black border border-zinc-800 rounded text-zinc-300 font-mono">{c.trim()}</span>)}
      </div>
      {tickets.length > 6 && (
        <button onClick={()=>setOpen(!open)} className="mt-1.5 px-2 py-0.5 bg-zinc-800 hover:bg-red-600 hover:text-white rounded text- font-bold transition">
          {open ? '▲ OCULTAR' : `+${tickets.length-6} VER TODOS (${tickets.length})`}
        </button>
      )}
    </div>
  );
}