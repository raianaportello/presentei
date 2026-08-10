export function requireAdmin(session: { user?: { role?: string } } | null | undefined) {
  if (session?.user?.role !== "ADMIN") throw new Error("Acesso administrativo necessário");
  return session.user;
}
