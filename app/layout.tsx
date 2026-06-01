import type { Metadata } from "next";
import { BarChart3, CircleHelp, FolderKanban, FlaskConical } from "lucide-react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BioMed Case Simulator Web",
  description:
    "Simulador web de casos tecnicos para practicar diagnostico de fallas en equipos medicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
          <div className="bg-cyan-50/80">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 border-b border-cyan-100 px-4 py-2 md:px-6">
              <p className="text-xs font-medium text-slate-700">
              Flujo por etapas para diagnostico tecnico y retroalimentacion inmediata.
              </p>
              <Link
                href="/cases"
                className="inline-flex min-h-9 items-center gap-2 rounded-md bg-cyan-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-cyan-600"
              >
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                Iniciar practica
              </Link>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                BioMed Tools MX
              </p>
              <Link href="/" className="text-xl font-semibold text-slate-900">
                BioMed Case Simulator
              </Link>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/cases"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-3 py-2 font-medium text-slate-700 hover:border-cyan-200 hover:bg-cyan-50"
              >
                <FolderKanban className="h-4 w-4" aria-hidden="true" />
                Casos
              </Link>
              <Link
                href="/results"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-3 py-2 font-medium text-slate-700 hover:border-cyan-200 hover:bg-cyan-50"
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Resultados
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-3 py-2 font-medium text-slate-700 hover:border-cyan-200 hover:bg-cyan-50"
              >
                <CircleHelp className="h-4 w-4" aria-hidden="true" />
                Acerca
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
