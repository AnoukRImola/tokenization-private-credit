"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PILLS = [
  { label: "Apoyo", className: "rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-medium text-sky-800 shadow-sm" },
  { label: "Confianza", className: "rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-medium text-sky-800 shadow-sm" },
  { label: "Progreso", className: "rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-800 shadow-sm" },
] as const;

const CARDS = [
  { title: "Financiación", description: "Soluciones de crédito pensadas para impulsar el crecimiento de emprendedores y microempresas." },
  { title: "Acompañamiento", description: "Orientación y apoyo para fortalecer capacidades, tomar decisiones y avanzar con confianza." },
  { title: "Fortalecimiento Empresarial", description: "Herramientas y oportunidades para consolidar negocios sostenibles y con impacto." },
  { title: "Oportunidades", description: "Conectamos a emprendedores y microempresas con soluciones que abren camino al crecimiento y la consolidación de sus negocios." },
] as const;

const cardClassName = "rounded-2xl border border-slate-200 bg-white p-3 shadow-lg backdrop-blur-sm";

export const HeroSection = () => {
  return (
    <section className="relative flex w-full flex-col gap-4 overflow-hidden px-4 py-12 md:min-h-[80vh] md:flex-row md:items-center md:gap-0 md:px-0 md:py-16">
      {/* Fila 1 / Columna 1: info — fondo sólido siempre */}
      <div className="relative z-10 flex w-full flex-col gap-5 bg-[#def1f8] px-0 py-6 md:w-[38%] md:gap-6 md:py-8 md:pl-4 md:pr-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Apoyo al emprendedor
        </h1>
        <p className="text-lg text-muted-foreground">
          Acompañamos a emprendedores y microempresarios con soluciones que impulsan el crecimiento de sus negocios.
        </p>
        <p className="text-2xl font-bold italic tracking-tight text-sky-600 md:text-3xl">
          Crecimiento con impacto.
        </p>
        <Link
          href="/campaigns"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-700"
        >
          Abrir backoffice
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Móvil: fila 2 = imagen de fondo + pills + cards (mismo orden: Financiación → Acompañamiento → Fortalecimiento → Oportunidades) */}
      <div className="relative min-h-[55vh] w-full bg-[url('/landing-bg.jpg')] bg-contain bg-center bg-no-repeat md:hidden">
        <div className="relative z-10 flex flex-col gap-6 py-6">
          <div className="flex flex-wrap justify-center gap-2">
            {PILLS.map((p) => (
              <span key={p.label} className={p.className}>{p.label}</span>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {CARDS.map((c) => (
              <div key={c.title} className={cardClassName}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600 md:text-xs">{c.title}</p>
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: zona derecha con imagen completa (1639×1437) sin recortar */}
      <div className="relative hidden flex-1 items-center justify-center bg-[#def1f8] bg-contain bg-center bg-no-repeat md:flex md:min-h-[520px] md:bg-[url('/landing-bg.jpg')] [perspective:1200px]">
        {PILLS.map((p, i) => {
          const pos = [
            "left-[10%] top-[15%]",
            "right-[10%] top-[12%]",
            "left-1/2 bottom-[32%] -translate-x-1/2",
          ][i];
          return (
            <div key={p.label} className={`absolute ${pos} ${p.className}`}>{p.label}</div>
          );
        })}
        <div className={`card-3d-left absolute left-0 top-1/2 w-[160px] ${cardClassName} border-slate-200/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_12px_24px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform hover:scale-[1.02] md:left-2 md:w-[175px]`}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600 md:text-xs">{CARDS[0].title}</p>
          <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{CARDS[0].description}</p>
        </div>
        <div className={`card-3d-top absolute left-1/2 top-2 w-[170px] ${cardClassName} border-slate-200/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_12px_24px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform hover:scale-[1.02] md:top-4 md:w-[185px]`}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600 md:text-xs">{CARDS[1].title}</p>
          <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{CARDS[1].description}</p>
        </div>
        <div className={`card-3d-right absolute right-0 top-1/2 w-[160px] ${cardClassName} border-slate-200/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_12px_24px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform hover:scale-[1.02] md:right-2 md:w-[175px]`}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600 md:text-xs">{CARDS[2].title}</p>
          <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{CARDS[2].description}</p>
        </div>
        <div className={`card-3d-bottom absolute bottom-2 left-1/2 w-[170px] ${cardClassName} border-slate-200/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08),0_12px_24px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform hover:scale-[1.02] md:w-[185px]`}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600 md:text-xs">{CARDS[3].title}</p>
          <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{CARDS[3].description}</p>
        </div>
      </div>
    </section>
  );
}
