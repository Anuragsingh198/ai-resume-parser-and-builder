'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  Search,
  PlusCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 lg:py-32">
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-32" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 opacity-40"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-800 shadow-sm">
                <Zap className="mr-2 h-4 w-4" />
                Smartest Job Board on the Web
              </div>
              <h1 className="mb-6 text-5xl font-black tracking-tight text-slate-900 sm:text-7xl">
                Unlock your next <span className="text-blue-600">career move</span>
              </h1>
              <p className="mb-10 text-lg leading-relaxed text-slate-600 sm:text-xl">
                JobHunch is the smarter way to find and manage your career opportunities. Browse verified listings from top companies and find your next role with ease.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button asChild size="xl" className="bg-blue-600 px-10 font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95">
                  <Link href="/jobs">
                    <Search className="mr-2 h-5 w-5" />
                    Browse All Jobs
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative lg:ml-auto">
              <div className="relative mx-auto max-w-[550px] lg:max-w-none">
                <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/JobHunch.png"
                    alt="JobHunch Dashboard"
                    width={800}
                    height={600}
                    className="rounded-xl object-cover"
                    priority
                  />
                </div>
                {/* Decorative blobs */}
                <div className="absolute -bottom-10 -right-10 -z-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
                <div className="absolute -top-10 -left-10 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-base font-black uppercase tracking-[0.2em] text-blue-600">Platform Features</h2>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Everything you need to succeed</p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Powerful tools designed specifically for job seekers. Smart, fast, and secure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Global Reach",
                description: "Connect with talent worldwide. No middleman—apply directly on verified company portals.",
                icon: Globe,
                color: "bg-indigo-600"
              },
              {
                title: "Verified Trust",
                description: "Every job listing is verified for legitimacy. No spam, no scams, just real opportunities.",
                icon: ShieldCheck,
                color: "bg-emerald-600"
              },
              {
                title: "Rich Insights",
                description: "Detailed salary ranges, experience requirements, and skill breakdowns for every listing.",
                icon: BarChart3,
                color: "bg-amber-600"
              },
              {
                title: "One-Click Filters",
                description: "Effortlessly find remote, hybrid, or in-office roles with our advanced filtering system.",
                icon: CheckCircle2,
                color: "bg-rose-600"
              },
              {
                title: "Modern UI/UX",
                description: "A premium, responsive interface designed to make your job search as smooth as possible.",
                icon: ArrowRight,
                color: "bg-purple-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} text-white shadow-lg shadow-blue-200 transition-transform group-hover:rotate-6`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-blue-600 py-24 sm:py-32">
        <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-[100px]"></div>
        
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-4xl font-black text-white sm:text-6xl">
            Join the future of <br className="hidden sm:block" /> job searching
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-blue-100/90 leading-relaxed">
            Ready to find your next career move? Start browsing verified jobs or list a new position in seconds.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="xl" className="bg-white px-12 font-black text-blue-600 hover:bg-slate-100 active:scale-95">
              <Link href="/jobs">
                Start Searching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/JH.png" alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg shadow-sm" />
              <span className="text-2xl font-black text-slate-900">Job<span className="text-blue-600">Hunch</span></span>
            </div>
            <div className="flex gap-10">
              <Link href="/jobs" className="text-sm font-bold text-slate-500 transition-colors hover:text-blue-600">Browse Jobs</Link>
              <Link href="#" className="text-sm font-bold text-slate-500 transition-colors hover:text-blue-600">Privacy Policy</Link>
            </div>
            <p className="text-sm font-medium text-slate-400">
              © {new Date().getFullYear()} JobHunch. Built for the future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
