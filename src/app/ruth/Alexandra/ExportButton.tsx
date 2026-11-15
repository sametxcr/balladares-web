'use client';
export default function ExportButton({ q, region }: { q: string, region: string }) {
  const href = `/api/ruth/export?q=${encodeURIComponent(q)}&region=${encodeURIComponent(region)}`;
  return (
    <a href={href} download className="h-9 px-4 rounded-full bg-[#FFD000] text-black font-black text-xs tracking-widest grid place-items-center hover:bg-[#FFE600] shadow-[0_0_12px_rgba(255,208,0,0.5)] whitespace-nowrap -skew-x-6">
      <span className="skew-x-6">⬇ EXPORTAR</span>
    </a>
  );
}