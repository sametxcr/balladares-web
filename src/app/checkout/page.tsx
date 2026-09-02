"use client"
import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const REGIONES: Record<string, string[]> = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
  "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
  "Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
  "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
  "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
  "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Trehuaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
  "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
  "La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
  "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
  "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
  "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
  "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"],
}

function validarRUT(rut: string) {
  if (!rut) return false
  const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase()
  if (clean.length < 2) return false
  const cuerpo = clean.slice(0, -1)
  const dv = clean.slice(-1)
  let suma = 0, multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo
    multiplo = multiplo < 7? multiplo + 1 : 2
  }
  const resto = 11 - (suma % 11)
  let dvEsperado = resto === 11? "0" : resto === 10? "K" : resto.toString()
  return dv === dvEsperado
}
function formatearRUT(rut: string) {
  let clean = rut.replace(/[^0-9kK]/g, "").toUpperCase()
  if (clean.length <= 1) return clean
  const cuerpo = clean.slice(0, -1)
  const dv = clean.slice(-1)
  let formateado = "", j = 0
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    formateado = cuerpo[i] + formateado
    j++
    if (j % 3 === 0 && i!== 0) formateado = "." + formateado
  }
  return formateado + "-" + dv
}
const validarEmail = (e:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validarNombre = (n:string) => n.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(n);
const validarTelefono = (t:string) => {
  const clean = t.replace(/\s/g,'');
  return /^(\+?56)?9\d{8}$/.test(clean);
}

function CheckoutContent() {
  const sp = useSearchParams()
  const pack = sp.get('pack') || 'x1'
  const qtyParam = parseInt(sp.get('qty') || '1')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", nombre: "", rut: "", direccion: "", ciudad: "", region: "", telefono: "" })
  const [errors, setErrors] = useState<Record<string,string>>({})

  const total = pack === 'x1'? 3000 * qtyParam : 10000 * qtyParam
  const totalStickers = pack === 'x1'? qtyParam : qtyParam * 4
  const comunas = useMemo(() => REGIONES[form.region] || [], [form.region])

  function validarTodo(){
    const e: Record<string,string> = {}
    if(!validarEmail(form.email)) e.email = "Email no válido (ej: tu@email.com)"
    if(!validarNombre(form.nombre)) e.nombre = "Nombre muy corto o con caracteres raros (mín 3 letras)"
    if(!validarRUT(form.rut)) e.rut = "RUT no válido. Ej: 12.345.678-9"
    if(form.direccion.trim().length < 5) e.direccion = "Dirección muy corta"
    if(!form.region) e.region = "Selecciona región"
    if(!form.ciudad) e.ciudad = "Selecciona comuna"
    if(!validarTelefono(form.telefono)) e.telefono = "Teléfono chileno inválido. Ej: +56 9 1234 5678"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function pagar(e:any){
    e.preventDefault()
    if(!validarTodo()) return
    setLoading(true)
    try {
      const res = await fetch('/api/webpay/create',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          email: form.email.trim(),
          nombre: form.nombre.trim(),
          rut: form.rut,
          celular: form.telefono,
          direccion: form.direccion.trim(),
          comuna: form.ciudad,
          ciudad: form.ciudad,
          region: form.region,
          pack_id: pack,
          pack_qty: qtyParam
        })
      })
      const data = await res.json()
      if(data.url && data.token){
        const formEl = document.createElement('form')
        formEl.method = 'POST'
        formEl.action = data.url
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'token_ws'
        input.value = data.token
        formEl.appendChild(input)
        document.body.appendChild(formEl)
        formEl.submit()
      } else {
        console.error(data)
        alert('Error Transbank: '+JSON.stringify(data));
        setLoading(false)
      }
    } catch(err) {
      console.error(err)
      alert('Error conectando con Webpay')
      setLoading(false)
    }
  }

  const inputBase = "w-full bg-zinc-100 border p-4 rounded-xl font-bold outline-none text- transition"
  const getBorder = (field:string) => errors[field]? "border-red-500 bg-red-50 focus:border-red-500 focus:bg-white" : "border-zinc-200 focus:bg-white focus:border-black"

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-black py-4 flex justify-center border-b-4 border-red-600">
        <img src="/BB.png" alt="Balladares Motors" className="h-16 object-contain" />
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_0.6fr]">
        <form onSubmit={pagar} noValidate className="p-5 md:p-10">
          <div className="flex items-center gap-2.5 mb-6 md:mb-8">
            <div className="w-14 h-14 bg-white border border-black/10 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
              <img src="/escudo.png" alt="Checkout seguro" className="w-full h-full object-contain" />
            </div>
            <span className="text- md:text-xs font-black tracking-widest text-zinc-500">CHECKOUT SEGURO · CONCEPCIÓN</span>
          </div>

          <h2 className="font-black text-sm tracking-widest mb-3">CONTACTO</h2>
          <div className="mb-6 md:mb-8">
            <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="tu@email.com" className={`${inputBase} ${getBorder('email')}`} />
            {errors.email && <p className="text- font-bold text-red-600 mt-1 ml-1">{errors.email}</p>}
          </div>

          <h2 className="font-black text-sm tracking-widest mb-3">DATOS DE FACTURACIÓN</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Nombre completo" className={`${inputBase} ${getBorder('nombre')}`} />
              {errors.nombre && <p className="text- font-bold text-red-600 mt-1 ml-1">{errors.nombre}</p>}
            </div>
            <div className="w-full">
              <input value={form.rut} onChange={e=>{ const f = formatearRUT(e.target.value); setForm({...form,rut:f}); }} placeholder="RUT 12.345.678-9" className={`${inputBase} ${getBorder('rut')}`} />
              {errors.rut && <p className="text- font-bold text-red-600 mt-1 ml-1">{errors.rut}</p>}
            </div>
            <div className="md:col-span-2">
              <input value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} placeholder="Dirección - Paicavi 1234" className={`${inputBase} ${getBorder('direccion')}`} />
              {errors.direccion && <p className="text- font-bold text-red-600 mt-1 ml-1">{errors.direccion}</p>}
            </div>
            <div className="relative">
              <select value={form.region} onChange={e=>setForm({...form, region: e.target.value, ciudad: ""})} className={`${inputBase} ${getBorder('region')} appearance-none`}>
                <option value="">Región</option>
                {Object.keys(REGIONES).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">▼</div>
              {errors.region && <p className="text- font-bold text-red-600 mt-1 ml-1">{errors.region}</p>}
            </div>
            <div className="relative">
              <select value={form.ciudad} onChange={e=>setForm({...form,ciudad:e.target.value})} className={`${inputBase} ${getBorder('ciudad')} appearance-none`}>
                <option value="">Ciudad / Comuna</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">▼</div>
              {errors.ciudad && <p className="text- font-bold text-red-600 mt-1 ml-1">{errors.ciudad}</p>}
            </div>
            <div className="md:col-span-2">
              <input value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value.replace(/[^0-9+ ]/g,"")})} placeholder="Teléfono +56 9 1234 5678" className={`${inputBase} ${getBorder('telefono')}`} />
              {errors.telefono && <p className="text- font-bold text-red-600 mt-1 ml-1">{errors.telefono}</p>}
            </div>
          </div>

          <button disabled={loading} className="w-full mt-6 md:mt-8 bg-[#d50000] hover:bg-black text-white font-black text- md:text-base py-4 rounded-full tracking-wide transition-colors disabled:opacity-50 shadow-[0_4px_14px_rgba(213,0,0,0.4)]">
            {loading? 'CONECTANDO CON WEBPAY...' : `PAGAR $${total.toLocaleString("es-CL")} CON WEBPAY →`}
          </button>
        </form>

        <div className="bg-[#f5f5f5] p-5 md:p-10 flex flex-col order-first md:order-last">
          <div className="flex gap-3 items-start">
            <div className="w-14 h-14 bg-white border border-black/10 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
              <img src="/logo_abanico_4stickers.png" alt="Pack stickers" className="w-full h-full object-contain scale-[1.15]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text- md:text-sm leading-tight">PACK {pack.toUpperCase()}<br/>BALLADARES MOTORS</div>
              <div className="text-xs text-zinc-500 mt-1">{totalStickers} stickers + {totalStickers} tickets</div>
            </div>
            <div className="font-black text-sm md:text-base shrink-0">${total.toLocaleString("es-CL")}</div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 border-t border-black/10 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span className="text-black font-bold">${total.toLocaleString("es-CL")}</span></div>
            <div className="flex justify-between font-black text-base md:text-lg pt-2"><span>Total</span><span>CLP ${total.toLocaleString("es-CL")}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-black flex items-center justify-center font-black">CARGANDO CHECKOUT...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}