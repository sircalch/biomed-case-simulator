import { NextRequest } from "next/server";

import { getAllCases } from "@/lib/case-engine";

function parseLimit(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.min(Math.floor(parsed), 200);
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const difficulty = (params.get("difficulty") ?? "all").trim();
  const limit = parseLimit(params.get("limit"));

  let scenarios = getAllCases().filter((scenario) => {
    if (
      difficulty !== "all" &&
      difficulty !== "Basico" &&
      difficulty !== "Intermedio"
    ) {
      return true;
    }

    if (difficulty !== "all" && scenario.difficulty !== difficulty) {
      return false;
    }

    if (!q) {
      return true;
    }

    const searchable = `${scenario.title} ${scenario.equipment} ${scenario.initialReport}`.toLowerCase();
    return searchable.includes(q);
  });

  scenarios = scenarios.sort((a, b) => a.title.localeCompare(b.title, "es"));
  if (limit) {
    scenarios = scenarios.slice(0, limit);
  }

  return Response.json({
    source: "seed",
    count: scenarios.length,
    scenarios,
  });
}
