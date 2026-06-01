import { NextRequest } from "next/server";

import { addSimulationRun, listSimulationRuns } from "@/lib/server/runs-store";

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 30;
  }
  return Math.min(Math.floor(parsed), 200);
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limit = parseLimit(request.nextUrl.searchParams.get("limit"));
  const { source, runs } = await listSimulationRuns(limit);

  return Response.json({
    source,
    count: runs.length,
    runs,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;
    const result = await addSimulationRun(body);
    if (!result.ok) {
      return Response.json(
        { ok: false, error: result.error ?? "No se pudo guardar la corrida." },
        { status: 400 },
      );
    }

    return Response.json({
      ok: true,
      storage: result.storage,
      run: result.run,
    });
  } catch {
    return Response.json(
      { ok: false, error: "Solicitud invalida." },
      { status: 400 },
    );
  }
}
