import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Wordmark } from "@/components/brand/wordmark";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-sm bg-white p-8 shadow-sm">
        <div className="text-center"><Wordmark /></div>
        <h1 className="mt-6 text-center text-xs uppercase tracking-luxe text-warm-dark">Admin Console</h1>
        <Suspense><LoginForm /></Suspense>
      </div>
    </main>
  );
}
