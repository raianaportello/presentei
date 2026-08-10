"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState(false); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(false); const data = new FormData(event.currentTarget); const result = await signIn("credentials", { email: data.get("email"), password: data.get("password"), redirect: false }); if (result?.ok) router.push("/admin"); else { setError(true); setLoading(false); } }
  return <form onSubmit={submit} className="mx-auto max-w-md rounded-[var(--radius-lg)] bg-white p-7 shadow-sm"><label className="block text-sm font-bold">E-mail<input name="email" type="email" autoComplete="username" required className="mt-2 min-h-12 w-full rounded-full border border-[var(--brand-border)] px-4" /></label><label className="mt-5 block text-sm font-bold">Senha<input name="password" type="password" autoComplete="current-password" required className="mt-2 min-h-12 w-full rounded-full border border-[var(--brand-border)] px-4" /></label>{error && <p role="alert" className="mt-4 text-sm font-bold text-red-700">E-mail ou senha inválidos.</p>}<button disabled={loading} className="mt-6 min-h-12 w-full rounded-full bg-[var(--brand-orange)] px-5 font-extrabold text-white disabled:opacity-60">{loading ? "Entrando…" : "Entrar"}</button></form>;
}
