'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md">
              <Image
                src="/JH.png"
                alt="JH Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Job<span className="text-blue-600">Hunch</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/jobs" className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600">
              Browse Jobs
            </Link>
            <Link href="/jobs" className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600">
              Job Alerts
            </Link>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-8">
              <Button asChild size="sm" className="bg-blue-600 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95">
                <Link href="/jobs">
                  <Search className="mr-2 h-4 w-4" />
                  Find Jobs
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden animate-in slide-in-from-top duration-300">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/jobs"
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Browse Jobs
            </Link>
            <Link
              href="/jobs"
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Job Alerts
            </Link>
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-slate-100">
              <Button asChild className="w-full justify-center bg-blue-600 hover:bg-blue-700">
                <Link href="/jobs" onClick={() => setIsOpen(false)}>
                  <Search className="mr-2 h-4 w-4" />
                  Find Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
