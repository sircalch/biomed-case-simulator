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
      <body className="min-h-full flex flex-col bg-slate-50">
        <header className="border-b border-slate-300 bg-white">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 md:px-6">
            <p className="text-xs font-medium text-slate-600">
              Flujo por etapas para diagnostico tecnico y retroalimentacion inmediata.
            </p>
            <Link
              href="/cases"
              className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Iniciar practica
            </Link>
          </div>
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                BioMed Tools MX
              </p>
              <Link href="/" className="text-xl font-semibold text-slate-900">
                BioMed Case Simulator
              </Link>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/cases"
                className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                <FolderKanban className="h-4 w-4" aria-hidden="true" />
                Casos
              </Link>
              <Link
                href="/results"
                className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Resultados
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
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
