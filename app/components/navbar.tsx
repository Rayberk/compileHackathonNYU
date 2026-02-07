"use client";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { Suspense } from "react";

export function Navbar() {
  return (
    <nav className="w-full fixed top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            TransitArchitect
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-6">
          <Link
            href="/auth/login"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Suspense fallback={<div className="w-32 h-10" />}>
            <LanguageSwitcher />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
