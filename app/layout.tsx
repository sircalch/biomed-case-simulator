import type { Metadata } from "next";
import {
  BarChart3,
  BookOpenCheck,
  Boxes,
  BrainCircuit,
  ExternalLink,
  FileText,
  FolderKanban,
  FlaskConical,
  Home,
} from "lucide-react";
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://biomed-case-simulator.vercel.app";
const OG_IMAGE = "/biomed-equipment-atlas.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BioMed Case Simulator",
    template: "%s | BioMed Case Simulator",
  },
  description:
    "Simulador web de casos tecnicos para practicar diagnostico de fallas en equipos medicos.",
  applicationName: "BioMed Case Simulator",
  authors: [{ name: "Ing. Andres Monreal" }],
  creator: "Ing. Andres Monreal / Topic Tales Biomedica",
  keywords: [
    "simulador biomedico",
    "casos tecnicos",
    "equipos medicos",
    "diagnostico de fallas",
    "ingenieria clinica",
  ],
  openGraph: {
    title: "BioMed Case Simulator",
    description:
      "Casos simulados de fallas en equipos medicos para razonamiento tecnico y documentacion.",
    url: SITE_URL,
    siteName: "BioMedTools MX Core",
    images: [
      {
        url: OG_IMAGE,
        width: 1600,
        height: 1000,
        alt: "Simulador de casos tecnicos para equipos medicos",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BioMed Case Simulator",
    description:
      "Practica diagnostico tecnico de fallas en equipos medicos mediante casos guiados.",
    images: [OG_IMAGE],
  },
};

const DONATION_URL = process.env.NEXT_PUBLIC_DONATION_URL ?? "";
const SHOW_INTERNAL_NAV = process.env.NEXT_PUBLIC_SHOW_INTERNAL_NAV === "true";
const CORE_URL =
  process.env.NEXT_PUBLIC_CORE_URL ?? "https://biomedtools-mx-core.vercel.app";
const CORE_RESOURCES_URL = new URL("/recursos", CORE_URL).toString();
const QUIZ_ARENA_URL =
  process.env.NEXT_PUBLIC_QUIZ_ARENA_URL ??
  "https://biomed-quiz-arena.vercel.app";
const REPORT_BUILDER_URL =
  process.env.NEXT_PUBLIC_REPORT_BUILDER_URL ??
  "https://clinical-report-builder.vercel.app";
const BIOMED_3D_LAB_URL =
  process.env.NEXT_PUBLIC_BIOMED_3D_LAB_URL ??
  "https://biomed-3d-engineering-lab.vercel.app";

const ecosystemLinks = [
  { label: "Core", href: CORE_URL, icon: Home },
  { label: "Quiz", href: QUIZ_ARENA_URL, icon: BookOpenCheck },
  { label: "3D Lab", href: BIOMED_3D_LAB_URL, icon: Boxes },
  { label: "Casos", href: "/", icon: BrainCircuit, active: true },
  { label: "Reportes", href: REPORT_BUILDER_URL, icon: FileText },
];

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
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-40 border-b border-blue-900 bg-blue-950/95 text-white shadow-sm backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-cyan-100">
                <FlaskConical className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                  BioMedTools MX Core
                </p>
                <Link href="/" className="text-xl font-semibold text-white">
                  BioMed Case Simulator
                </Link>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <a
                href={CORE_URL}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-transparent px-3 py-2 font-medium text-blue-100 hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Core
              </a>
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
          <div className="border-t border-white/10 bg-blue-900/55">
            <nav
              aria-label="Modulos BioMedTools MX"
              className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-2 text-xs font-semibold md:px-6"
            >
              {ecosystemLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={[
                    "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border px-3 py-2 transition",
                    item.active
                      ? "border-cyan-200 bg-white text-blue-950"
                      : "border-white/10 bg-white/5 text-blue-100 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-blue-900 bg-blue-950 text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1.35fr_1fr_auto] md:px-6">
            <div className="flex items-center gap-4">
              <Image
                src="/topic-tales-biomedica-logo.png"
                alt="Topic Tales Biomedica"
                width={126}
                height={89}
                className="h-14 w-auto rounded-md bg-white p-1.5 object-contain"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">
                  Topic Tales Biomedica
                </p>
                <p className="text-sm font-semibold text-white">
                  Ing. Andres Monreal
                </p>
                <p className="max-w-sm text-xs leading-5 text-blue-200">
                  Ingeniero Biomedico / Topic Tales Biomedica
                </p>
              </div>
            </div>
            <div className="text-xs leading-5 text-blue-200">
              <p className="font-semibold uppercase tracking-wide text-cyan-100">
                Simulacion tecnica
              </p>
              <p>
                Casos diagnosticos para razonamiento biomedico, seguridad,
                documentacion y practica academica supervisada.
              </p>
              <a
                href={CORE_RESOURCES_URL}
                className="mt-2 inline-flex font-semibold text-cyan-100 hover:text-white"
              >
                Recursos abiertos y licencias
              </a>
            </div>
            {DONATION_URL ? (
              <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">
                  Apoya el proyecto
                </p>
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex min-h-8 items-center justify-center rounded-md bg-white px-3 py-1 text-xs font-semibold text-blue-950 transition hover:bg-blue-50"
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
