import { cookies } from 'next/headers';
import LoginAdmin from './LoginAdmin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Page() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth')?.value;
  const VALID = process.env.ADMIN_SECRET;

  if (auth!== VALID) {
    return <LoginAdmin />;
  }

  // BROMA: si pasó el login, puro gatito
  return (
    <div className="min-h-screen bg-black text-white grid place-items-center p-4 font-mono">
      <div className="text-center">
        <h1 className="text-3xl font-black italic -skew-x-12 mb-4">
          SISTEMA <span className="text-red-600">HACKEADO</span> POR MICHIS
        </h1>
        <p className="text-zinc-500 mb-6 text-sm tracking-widest">MEOW MEOW • ACCESO DENEGADO • MEOW</p>

        {/* gatito random */}
        <img
          src="https://cataas.com/cat/gif"
          alt="gatito hacker"
          className="w- h- object-cover rounded-3xl border border-zinc-800 mx-auto shadow-[0_0_50px_rgba(255,0,0,0.3)]"
        />

        <p className="mt-6 text-xs text-zinc-600">att: balladares motors ha sido tomado por la asociación de michis 🐱</p>
      </div>
    </div>
  )
}