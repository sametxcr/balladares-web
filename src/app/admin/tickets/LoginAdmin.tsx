'use client'
import { useState } from 'react'
export default function LoginAdmin(){
  const [key,setKey]=useState('')
  const [err,setErr]=useState(false)
  const submit=async(e:any)=>{
    e.preventDefault()
    const r=await fetch('/api/admin-auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key})})
    if(r.ok) location.reload()
    else setErr(true)
  }
  return (
    <div className="min-h-screen bg-black grid place-items-center">
      <form onSubmit={submit} className="w- bg-[#111] border border-zinc-800 rounded-2xl p-7 flex flex-col gap-4">
        <img src="/BB.png" className="h-10 mx-auto object-contain" />
        <h1 className="text-white font-black text-center tracking-widest text-xs">ADMIN BALLADARES</h1>
        <input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Clave" className="h-12 bg-black border border-zinc-700 rounded-full px-5 text-white outline-none focus:border-red-600" />
        {err && <p className="text-red-500 text-xs text-center font-bold">Clave mala wn</p>}
        <button className="h-12 bg-white text-black rounded-full font-black">ENTRAR</button>
      </form>
    </div>
  )
}