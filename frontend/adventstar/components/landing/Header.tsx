'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import adventstarLogo from '@/public/adventstar-logo.png'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a href="#top" className="flex min-w-0 items-center">
          <Image
            src={adventstarLogo}
            alt="Advent Star Uniform Supplier"
            placeholder="blur"
            className="h-auto w-[10.5rem] sm:w-[12rem]"
            style={{
              filter: scrolled ? 'none' : 'brightness(0) invert(1)',
              transition: 'filter 0.35s ease',
            }}
            preload
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: scrolled ? '#475569' : 'rgba(255,255,255,0.75)' }}
            >
              {label}
            </a>
          ))}
        </nav>

        <Link
          href="/enquiry"
          className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300"
          style={
            scrolled
              ? { background: '#10284a', color: '#ffffff' }
              : {
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                }
          }
        >
          Request a Quote
        </Link>
      </div>
    </header>
  )
}
