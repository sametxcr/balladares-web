'use client'
import { useState } from 'react'

export default function LoginTombola() {
  const [key, setKey] = useState('')
  const [error, setError] = useState(false)

  const login = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/tombola-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    })
    if (res.ok) window.location.reload()
    else setError(true)
  }

  return (
    <div className="min-h-screen bg-black grid place-items-center">
      <form onSubmit={login} className="w- bg-[#111] border border-zinc-800 rounded-2xl p-7 flex flex-col gap-4">
        <img src="/BB.png" className="w-32 mx-auto" alt="" />
        <h1 className="text-white font-black text-center text-xs tracking-">ACCESO TÓMBOLA</h1>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Escribe la clave admin"
          className="h-12 bg-black border border-zinc-700 rounded-full px-5 text-white outline-none focus:border-[#E10600]"
        />
        {error && <p className="text-red-500 text-xs text-center font-bold">Clave mala wn</p>}
        <button className="h-12 rounded-full bg-white text-black font-black text-sm hover:bg-[#FFD000]">ENTRAR</button>
      </form>
    </div>
	
	
  )
}