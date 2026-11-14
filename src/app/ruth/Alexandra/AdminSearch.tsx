'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function AdminSearch({ defaultValue, region }: { defaultValue: string, region: string }) {
  const [val, setVal] = useState(defaultValue);
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams();
        if (val) params.set('q', val);
        if (region) params.set('region', region);
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [val, region, pathname, router]);

  return (
    <div className="flex items-center gap-2">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Buscar RUT / NOMBRE / REGIÓN..."
        className="w- md:w- bg-zinc-900 border border-zinc-800 rounded-full px-5 h-10 text-xs font-bold placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
      />
      {val && <button onClick={()=>setVal('')} className="text-zinc-500 hover:text-white text-lg leading-none">×</button>}
    </div>
  );
}