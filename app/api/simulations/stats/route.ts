import { NextRequest } from "next/server";

import { buildSimulationStats, listSimulationRuns } from "@/lib/server/runs-store";

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 250;
  }
  return Math.min(Math.floor(parsed), 500);
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limit = parseLimit(request.nextUrl.searchParams.get("limit"));
  const { source, runs } = await listSimulationRuns(limit);
  const stats = buildSimulationStats(runs);

  return Response.json({
    source,
    sampleSize: runs.length,
    stats,
    generatedAt: new Date().toISOString(),
  });
}
