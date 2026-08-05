import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

const CATEGORY_COLUMNS = {
  "Data Readiness": "category_data_readiness",
  "Workflow Execution": "category_workflow_execution",
  Governance: "category_governance",
  "Adoption & ROI": "category_adoption_roi",
} as const;

function average(values: number[]) {
  if (!values.length) return null;
  return Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100;
}

export default defineTool({
  name: "assessment_summary",
  title: "Assessment summary",
  description:
    "Aggregate statistics across all AI readiness assessments: total count, average score, band distribution and average score per category.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("assessments")
      .select(
        "total_score, band, category_data_readiness, category_workflow_execution, category_governance, category_adoption_roi",
      );

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = (data ?? []) as any[];
    const bands: Record<string, number> = {};
    for (const row of rows) {
      const band = row.band ?? "Unknown";
      bands[band] = (bands[band] ?? 0) + 1;
    }

    const categories = Object.fromEntries(
      Object.entries(CATEGORY_COLUMNS).map(([label, column]) => [
        label,
        average(rows.map((r) => r[column]).filter((v): v is number => typeof v === "number")),
      ]),
    );

    const summary = {
      total_assessments: rows.length,
      average_total_score: average(
        rows.map((r) => r.total_score).filter((v): v is number => typeof v === "number"),
      ),
      band_distribution: bands,
      average_category_scores: categories,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
