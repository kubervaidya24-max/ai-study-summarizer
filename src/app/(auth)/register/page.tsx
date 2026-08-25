"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      // Auto-sign in registered user credentials
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Failed to create session with provided credentials.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during account creation.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              AI Study <span className="text-blue-400">Summarizer</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-2">Create Your Account</h1>
          <p className="text-xs text-slate-400">Join thousands of students mastering complex study materials</p>
        </div>

        {/* Register Card */}
        <Card className="border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-white">Student Registration</CardTitle>
            <CardDescription className="text-xs">
              Fill in your details to start generating study flashcards and quizzes.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Smith"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                variant="glow"
                className="w-full h-10 text-xs font-semibold mt-2"
              >
                {isLoading ? "Creating Account..." : "Create Account & Start"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex items-center justify-between text-xs text-slate-400 pt-0">
            <Link href="/" className="hover:text-slate-200">
              ← Back to Home
            </Link>
            <Link href="/login" className="text-blue-400 hover:underline flex items-center gap-1">
              Already have an account? <ArrowRight className="w-3 h-3" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
