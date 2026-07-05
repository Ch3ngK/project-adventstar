'use client'

import Image from 'next/image'
import { useState } from 'react'

const materials = [
  {
    id: 'plain',
    name: 'Plain',
    tagline: 'Everyday reliability',
    description:
      'Our most versatile fabric range, suited for school and corporate uniforms that need consistent colour, comfortable wear, and reliable performance across large order volumes.',
    image: '/plain.png',
    swatchColor: '#b82018',
    variants: ['Cotton Combed 20S, 24S & 30S', 'Cotton Carded 24S & 30S', 'CVC 24S & 30S'],
    usedFor: ['School uniforms', 'Corporate wear', 'PE attire'],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Elevated comfort',
    description:
      'Softer, finer fabrics for uniforms where comfort and presentation matter most — ideal for client-facing roles and environments where the feel of the garment is part of the brand.',
    image: '/premium.png',
    swatchColor: '#7c5ab8',
    variants: [
      'Cotton Bamboo 30S',
      'Tencel™ Modal blended with Cotton 30S',
      'U.S. Pima Cotton 30S',
    ],
    usedFor: ['Hospitality wear', 'Premium corporate', 'Healthcare'],
  },
  {
    id: 'fancy',
    name: 'Fancy Fabrics',
    tagline: 'Textured distinction',
    description:
      'Structured, textured fabrics with visual depth — suited for team wear and branded uniforms that benefit from subtle pattern and a premium finish that stands out.',
    image: '/fancy.png',
    swatchColor: '#1a4540',
    variants: [
      'Cotton Galaxy 30S',
      'Cotton Combed Stripes 30S',
      'CVC Astro 30S',
      'CVC Fuzy 30S',
      'CVC Threetone 30S',
    ],
    usedFor: ['Team and event wear', 'Government uniforms', 'Branded collections'],
  },
  {
    id: 'pique',
    name: 'Pique',
    tagline: 'Structured texture',
    description:
      'A textured weave that holds shape and resists wear — popular for polo shirts, PE uniforms, and sportswear where both durability and breathability matter.',
    image: '/pique.png',
    swatchColor: '#c85010',
    variants: ['Cotton Combed Pique', 'CVC Pique'],
    usedFor: ['Polo shirts', 'PE uniforms', 'Sports and team wear'],
  },
  {
    id: 'terry',
    name: 'Terry',
    tagline: 'Soft and absorbent',
    description:
      'Looped cotton fabric that is highly absorbent and gentle on skin — used where softness and moisture management are the priority across active and sports applications.',
    image: '/terry.png',
    swatchColor: '#2a7a1c',
    variants: ['Cotton Combed Baby Terry'],
    usedFor: ['Sports towels', 'Sweat-wicking wear', 'PE accessories'],
  },
]

export default function MaterialsShowcase() {
  const [activeId, setActiveId] = useState('plain')
  const active = materials.find((m) => m.id === activeId)!

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#10284a] uppercase">
            Materials
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-slate-950">
            Fabrics we work with.
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Every order includes fabric selection. Choose from our range of materials suited
            to different garment types, sectors, and performance requirements.
          </p>
        </div>

        {/* Tab row */}
        <div className="mb-6 flex flex-wrap gap-2">
          {materials.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveId(m.id)}
              className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold ${
                activeId === m.id
                  ? 'border-transparent bg-[#10284a] text-white shadow-sm'
                  : 'border-slate-200 bg-[#f5f7fa] text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: m.swatchColor }}
              />
              {m.name}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">

          {/* Image banner — wide landscape format matches the natural shape of fabric strip photos */}
          <div className="relative h-52 overflow-hidden bg-[#0d1f3c] sm:h-64">
            <div
              key={activeId}
              className="absolute inset-4 sm:inset-5"
              style={{ animation: 'mat-fade-in 0.4s ease' }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <Image
                  src={active.image}
                  alt={`${active.name} fabric texture`}
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  className="object-cover"
                  quality={100}
                />
              </div>
            </div>
            {/* Gradient fades into the details panel below */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f3c]/70 via-transparent to-transparent" />
            <div
              key={`c-${activeId}`}
              className="absolute inset-0 flex flex-col justify-end px-8 py-6 sm:px-10"
              style={{ animation: 'mat-fade-in 0.3s ease' }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                {active.tagline}
              </p>
              <h3 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                {active.name}
              </h3>
            </div>
          </div>

          {/* Details panel */}
          <div
            key={activeId}
            className="grid gap-8 bg-white p-8 sm:p-10 lg:grid-cols-[1fr_1.1fr]"
            style={{ animation: 'mat-fade-in 0.3s ease' }}
          >
            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                Available variants
              </p>
              <ul className="space-y-3">
                {active.variants.map((v) => (
                  <li key={v} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span className="text-sm text-slate-700">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-base leading-8 text-slate-600">{active.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {active.usedFor.map((u) => (
                  <span
                    key={u}
                    className="rounded-full border border-slate-200 bg-[#f5f7fa] px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
