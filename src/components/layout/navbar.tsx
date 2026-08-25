"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Brain, BookOpen, Menu, X, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/common/github-icon";
import { UserMenu } from "./user-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Workspace", href: "/dashboard", icon: Brain },
    { name: "My Studies", href: "/history", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              AI Study <span className="text-blue-400">Summarizer</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono -mt-0.5">PDF • Flashcards • Quiz</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-800/90 text-blue-400 border border-slate-700/60 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition-colors"
            title="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4" />
          </Link>

          <Link href="/dashboard">
            <Button size="sm" variant="glow" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Launch Workspace
            </Button>
          </Link>

          {/* User Profile / Auth Action */}
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <UserMenu />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-slate-800 text-blue-400 font-semibold"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 flex items-center gap-1.5"
            >
              <GithubIcon className="w-4 h-4" /> {siteConfig.author.github}
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" variant="glow">
                Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
