import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.AUTH_SECRET,
  providers: [CredentialsProvider({
    name: "Administração Presentei",
    credentials: { email: { label: "E-mail", type: "email" }, password: { label: "Senha", type: "password" } },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const hash = process.env.ADMIN_PASSWORD_HASH;
      if (!email || !credentials?.password || !expectedEmail || !hash || email !== expectedEmail) return null;
      if (!(await compare(credentials.password, hash))) return null;
      return { id: "environment-admin", email, name: "Admin Presentei", role: "ADMIN" };
    },
  })],
  callbacks: {
    async jwt({ token, user }) { if (user) token.role = "ADMIN"; return token; },
    async session({ session, token }) { if (session.user) (session.user as typeof session.user & { role: string }).role = String(token.role ?? ""); return session; },
  },
};
