import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductTable } from "@/components/admin/product-table";
import { products } from "@/modules/catalog/local-products";
import { requireAdmin } from "@/modules/auth/require-admin";
export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  try { requireAdmin(session as { user?: { role?: string } } | null); } catch { redirect("/admin/login"); }
  return <AdminShell><div className="mb-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5"><p className="text-sm text-[var(--brand-muted)]">Produtos ativos</p><p className="mt-2 text-3xl font-black">{products.length}</p></div><div className="rounded-2xl bg-white p-5"><p className="text-sm text-[var(--brand-muted)]">Preço padrão</p><p className="mt-2 text-3xl font-black">R$ 39,90</p></div><div className="rounded-2xl bg-white p-5"><p className="text-sm text-[var(--brand-muted)]">Desconto empresa</p><p className="mt-2 text-3xl font-black">20%</p></div></div><ProductTable products={products} /></AdminShell>;
}
