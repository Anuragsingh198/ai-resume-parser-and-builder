import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <Image src="/JH.png" alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg shadow-sm" />
              <span className="text-2xl font-black text-slate-900">Job<span className="text-blue-600">Hunch</span></span>
            </Link>
            <p className="mb-6 max-w-sm text-slate-500">
              The smartest way to find and list job opportunities. AI-powered parsing, verified listings, and direct access to top companies.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-400 transition-colors hover:text-blue-600">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 transition-colors hover:text-blue-600">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 transition-colors hover:text-blue-600">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 transition-colors hover:text-blue-600">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-900">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/jobs" className="text-slate-600 transition-colors hover:text-blue-600 font-medium">Browse Jobs</Link>
              </li>
              <li>
                <Link href="/jobs" className="text-slate-600 transition-colors hover:text-blue-600 font-medium">Job Alerts</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-900">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-slate-600 transition-colors hover:text-blue-600 font-medium">About Us</Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 transition-colors hover:text-blue-600 font-medium">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 transition-colors hover:text-blue-600 font-medium">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 text-center md:flex md:items-center md:justify-between md:text-left">
          <p className="text-sm font-medium text-slate-400">
            © {new Date().getFullYear()} JobHunch. All rights reserved.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-400 md:mt-0">
            Designed for the future of work.
          </p>
        </div>
      </div>
    </footer>
  );
}
