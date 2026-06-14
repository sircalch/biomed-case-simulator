import type { Metadata } from "next";
import { BarChart3, FolderKanban, FlaskConical } from "lucide-react";
import Image from "next/image";
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

const DONATION_URL = process.env.NEXT_PUBLIC_DONATION_URL ?? "";
const SHOW_INTERNAL_NAV = process.env.NEXT_PUBLIC_SHOW_INTERNAL_NAV === "true";

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
        <header className="sticky top-0 z-40 border-b border-blue-800 bg-blue-950 text-white shadow-sm">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                BioMed Tools MX
              </p>
              <Link href="/" className="text-xl font-semibold text-white">
                BioMed Case Simulator
              </Link>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/cases"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-3 py-2 font-medium text-blue-100 hover:bg-white/10 hover:text-white"
              >
                <FolderKanban className="h-4 w-4" aria-hidden="true" />
                Casos
              </Link>
              <Link
                href="/results"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-3 py-2 font-medium text-blue-100 hover:bg-white/10 hover:text-white"
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Resultados
              </Link>
              {SHOW_INTERNAL_NAV ? (
                <Link
                  href="/about"
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-3 py-2 font-medium text-blue-100 hover:bg-white/10 hover:text-white"
                >
                  Acerca
                </Link>
              ) : null}
              <Link
                href="/cases"
                className="inline-flex min-h-9 items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-blue-950 transition hover:bg-blue-50"
              >
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                Iniciar practica
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200/80 bg-white/90">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
            <div className="flex items-center gap-4">
              <Image
                src="/topic-tales-biomedica-logo.png"
                alt="Topic Tales Biomedica"
                width={126}
                height={89}
                className="h-12 w-auto object-contain"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Creado por
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Ing. Andres Monreal
                </p>
                <p className="text-xs text-slate-600">
                  Ingeniero Biomedico / Topic Tales Biomedica
                </p>
              </div>
            </div>
            {DONATION_URL ? (
              <div className="rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  Apoya el proyecto
                </p>
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex min-h-8 items-center justify-center rounded-md bg-cyan-700 px-3 py-1 text-xs font-medium text-white transition hover:bg-cyan-600"
                >
                  Donar con PayPal
                </a>
              </div>
            ) : null}
          </div>
        </footer>
      </body>
    </html>
  );
}
