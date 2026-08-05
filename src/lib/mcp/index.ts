import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLeadsTool from "./tools/list-leads";
import getLeadAssessmentTool from "./tools/get-lead-assessment";
import assessmentSummaryTool from "./tools/assessment-summary";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ai-brokerage-accelerator",
  title: "AI Brokerage Accelerator",
  version: "0.1.0",
  instructions:
    "Tools for the AI Brokerage Accelerator readiness scorecard. Use `list_leads` to browse submitted leads, `get_lead_assessment` for one lead's full answers and recommendations, and `assessment_summary` for aggregate benchmarks. Access is scoped to the signed-in user's permissions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listLeadsTool, getLeadAssessmentTool, assessmentSummaryTool],
});
