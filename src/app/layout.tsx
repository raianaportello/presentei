import type { Metadata } from "next";
import { Bricolage_Grotesque, Nunito_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const body = Nunito_Sans({ variable: "--font-nunito", subsets: ["latin"] });

// `??` only guards null/undefined — an env var set to an empty string
// (as happens on Vercel when the value is left blank) sails straight
// through and crashes `new URL("")`. Guard against both.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Presentei | Presentes personalizados", template: "%s | Presentei" },
  description: "Transforme uma ideia, memória ou marca em uma caneca personalizada por R$ 39,90.",
  alternates: { canonical: "/" },
  openGraph: { title: "Presentei | Presentes personalizados", description: "Uma ideia. Um presente só seu.", type: "website", locale: "pt_BR", images: [{ url: "/brand/presentei-logo.jpeg", width: 1254, height: 1254, alt: "Presentei" }] },
  twitter: { card: "summary_large_image", title: "Presentei", description: "Canecas personalizadas para pessoas e empresas.", images: ["/brand/presentei-logo.jpeg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="pt-BR" className={`${display.variable} ${body.variable} h-full antialiased`}><body className="flex min-h-full flex-col"><a href="#conteudo" className="sr-only z-[100] rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Pular para o conteúdo</a><CartProvider><SiteHeader /><main id="conteudo" className="flex-1">{children}</main><SiteFooter /></CartProvider></body></html>;
}
