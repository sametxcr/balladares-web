'use client';
import { useRouter, usePathname } from 'next/navigation';
export default function RegionFilter({ regiones, current, q }: { regiones: string[], current: string, q: string }) {
  const router = useRouter(); const pathname = usePathname();
  return (
    <select
      value={current}
      onChange={e => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (e.target.value) params.set('region', e.target.value);
        params.set('page','1');
        router.replace(`${pathname}?${params.toString()}`);
      }}
      className="bg-zinc-900 border border-zinc-800 rounded-full px-4 h-10 text-xs font-bold focus:outline-none focus:border-red-600 cursor-pointer"
    >
      <option value="">TODAS LAS REGIONES</option>
      {regiones.map(r => <option key={r} value={r}>{r}</option>)}
    </select>
  );
}