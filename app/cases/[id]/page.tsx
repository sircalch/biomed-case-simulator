import { notFound } from "next/navigation";

import { CaseSimulation } from "@/components/CaseSimulation";
import { getAllCases, getCaseById } from "@/lib/case-engine";

type CasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return getAllCases().map((scenario) => ({ id: scenario.id }));
}

export default async function CaseDetailPage({ params }: CasePageProps) {
  const { id } = await params;
  const scenario = getCaseById(id);

  if (!scenario) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <CaseSimulation scenario={scenario} />
      </main>
    </div>
  );
}
