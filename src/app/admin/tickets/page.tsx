export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Page() {
  return (
    <div className="min-h-screen bg-black text-white grid place-items-center p-4 font-mono relative overflow-hidden">
      {/* puntito REC falso */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
        <span className="text-red-600 font-black text-sm tracking-widest">REC • CAM_04</span>
      </div>

      <div className="text-center">
        <h1 className="text-6xl md:text- font-black italic -skew-x-12 leading-[0.85] tracking-tighter">
          TE TOME <br />
          <span className="text-red-600">UNA FOTO</span> <br />
          LARRY!!!
        </h1>

        <p className="mt-6 text-xl md:text-2xl font-bold bg-red-600 text-black px-6 py-2 inline-block -skew-x-12">
          TE ESTOY VIENDO BRO 👁️
        </p>

        <img
          src="https://cataas.com/cat/gif"
          alt="gatito hacker"
          className="w- h- md:w- md:h- object-cover rounded-3xl border-4 border-red-600 mx-auto mt-8 shadow-[0_0_80px_rgba(255,0,0,0.6)]"
        />

        
      </div>
    </div>
  )
}