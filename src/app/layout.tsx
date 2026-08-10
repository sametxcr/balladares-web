import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.balladares-motors.cl"),
  title: {
    default: "Taller Mecánico en Concepción | Balladares Motors - Repro Stage 1/2",
    template: "%s | Balladares Motors",
  },
  description: "Taller mecánico en Concepción, base en Chiguayante. +15 años en pista y calle. Especialistas en Repro Stage 1 y 2, DPF-EGR-ADBLUE OFF, scanner multimarca, alineación láser 3D, ajuste de motor y mecánica general. Rodolfo Briceño 2718.",
  keywords: [
    "taller mecánico concepción",
    "taller mecánico chiguayante",
    "repro stage 1 concepción",
    "dpf off concepción",
    "scanner automotriz concepción",
    "alineación 3d concepción",
    "mecánico a domicilio concepción"
  ],
  openGraph: {
    title: "Taller Mecánico en Concepción | Balladares Motors",
    description: "El poder de un buen servicio. Repro, scanner última generación y servicio de pista en Concepción.",
    url: "https://www.balladares-motors.cl",
    siteName: "Balladares Motors",
    images: ["/hero/repro.jpg"],
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Balladares Motors",
    "image": "https://www.balladares-motors.cl/balladares_motors_workshop.webp",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rodolfo Briceño 2718",
      "addressLocality": "Chiguayante",
      "addressRegion": "Biobío",
      "addressCountry": "CL"
    },
    "url": "https://www.balladares-motors.cl",
    "telephone": "+56982637808",
    "priceRange": "$$",
    "openingHours": "Mo-Sa 09:00-19:00",
    "areaServed": ["Concepción", "Chiguayante", "Hualpén", "San Pedro de la Paz", "Talcahuano"]
  };

  return (
    <html lang="es-CL">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}