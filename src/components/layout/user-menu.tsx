"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse border border-slate-700" />
    );
  }

  if (!session?.user) {
    return (
      <Link href="/login">
        <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-700">
          <UserIcon className="w-3.5 h-3.5" />
          Sign In
        </Button>
      </Link>
    );
  }

  const name = session.user.name || "Student";
  const email = session.user.email || "";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer"
        aria-label="User profile menu"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[120px] truncate">
          {name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800 mb-1">
            <p className="text-xs font-semibold text-white truncate">{name}</p>
            <p className="text-[11px] text-slate-400 truncate">{email}</p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            My Workspace
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
