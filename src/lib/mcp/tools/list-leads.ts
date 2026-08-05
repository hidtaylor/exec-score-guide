import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_leads",
  title: "List leads",
  description:
    "List brokerage leads who submitted the AI readiness scorecard, newest first, with their assessment score and band.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).optional().describe("Max leads to return (default 20)."),
    band: z.string().optional().describe("Filter by readiness band, e.g. 'Emerging'."),
    search: z.string().optional().describe("Case-insensitive match on email or brokerage name."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, band, search }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("leads")
      .select(
        "id, first_name, last_name, email, brokerage_name, agent_count, top_priority, created_at, assessments(total_score, band)",
      )
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);

    if (search) {
      query = query.or(`email.ilike.%${search}%,brokerage_name.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = (data ?? []).filter(
      (row: any) => !band || (row.assessments ?? []).some((a: any) => a.band === band),
    );

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, leads: rows },
    };
  },
});
