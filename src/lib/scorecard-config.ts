export interface ScorecardQuestion {
  id: number;
  category: string;
  question: string;
  labels: [string, string]; // [low label, high label]
}

export const CATEGORIES = [
  "Data Readiness",
  "Workflow Execution",
  "Governance",
  "Adoption & ROI",
] as const;

export const QUESTIONS: ScorecardQuestion[] = [
  // Data Readiness (q1-q3)
  {
    id: 1,
    category: "Data Readiness",
    question: "How centralized and accessible is your brokerage's transaction, client, and agent data?",
    labels: ["Scattered across systems", "Fully centralized and accessible"],
  },
  {
    id: 2,
    category: "Data Readiness",
    question: "How clean and standardized is your data for AI/ML consumption?",
    labels: ["Inconsistent and messy", "Clean, tagged, and ML-ready"],
  },
  {
    id: 3,
    category: "Data Readiness",
    question: "Do you have a defined data governance owner or process?",
    labels: ["No ownership", "Dedicated data steward/process"],
  },
  // Workflow Execution (q4-q6)
  {
    id: 4,
    category: "Workflow Execution",
    question: "How automated are your core operational workflows (onboarding, compliance, marketing)?",
    labels: ["Mostly manual", "Fully automated end-to-end"],
  },
  {
    id: 5,
    category: "Workflow Execution",
    question: "Are AI tools currently integrated into any agent-facing or back-office workflows?",
    labels: ["No AI in use", "AI embedded in multiple workflows"],
  },
  {
    id: 6,
    category: "Workflow Execution",
    question: "How well do your current tech systems integrate with each other?",
    labels: ["Siloed and disconnected", "Seamless API-driven integration"],
  },
  // Governance (q7-q9)
  {
    id: 7,
    category: "Governance",
    question: "Does your brokerage have a formal AI usage policy?",
    labels: ["No policy exists", "Documented and enforced policy"],
  },
  {
    id: 8,
    category: "Governance",
    question: "How do you manage compliance and risk related to AI-generated outputs?",
    labels: ["No process in place", "Systematic review and audit trail"],
  },
  {
    id: 9,
    category: "Governance",
    question: "Is there executive sponsorship for AI transformation initiatives?",
    labels: ["No executive sponsor", "C-level champion with budget"],
  },
  // Adoption & ROI (q10-q12)
  {
    id: 10,
    category: "Adoption & ROI",
    question: "What percentage of your agents actively use AI tools provided by the brokerage?",
    labels: ["Less than 10%", "More than 75%"],
  },
  {
    id: 11,
    category: "Adoption & ROI",
    question: "Do you measure ROI on your AI/technology investments?",
    labels: ["No measurement", "Clear KPIs and dashboards"],
  },
  {
    id: 12,
    category: "Adoption & ROI",
    question: "How would you rate agent satisfaction with current AI tools?",
    labels: ["Frustrated or unaware", "High satisfaction and demand for more"],
  },
];

export const AGENT_COUNT_OPTIONS = [
  "1–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,001–5,000",
  "5,000+",
];

export const TOP_PRIORITY_OPTIONS = [
  "Agent Productivity",
  "Lead Generation & Conversion",
  "Transaction Management",
  "Marketing Automation",
  "Compliance & Risk Management",
  "Data & Analytics",
  "Recruiting & Retention",
  "Client Experience",
];

export type Band = "Transformation-Ready" | "Operational but Fragmented" | "Early Stage";

export function getBand(score: number): Band {
  if (score >= 48) return "Transformation-Ready";
  if (score >= 30) return "Operational but Fragmented";
  return "Early Stage";
}

export function getBandDescription(band: Band): string {
  switch (band) {
    case "Transformation-Ready":
      return "Your brokerage has strong foundations for AI adoption. You're positioned to scale AI across operations and drive measurable competitive advantage.";
    case "Operational but Fragmented":
      return "You have meaningful AI capabilities but they're not yet connected into a cohesive strategy. Focused alignment can unlock significant ROI.";
    case "Early Stage":
      return "You're at the beginning of your AI journey. The good news: with the right roadmap, early-stage brokerages can leapfrog competitors by avoiding legacy pitfalls.";
  }
}

export interface Recommendation {
  title: string;
  description: string;
  category: string;
}

export function getRecommendations(categoryScores: Record<string, number>): Recommendation[] {
  const sorted = Object.entries(categoryScores).sort(([, a], [, b]) => a - b);
  const recommendations: Recommendation[] = [];

  for (const [category] of sorted.slice(0, 3)) {
    switch (category) {
      case "Data Readiness":
        recommendations.push({
          title: "Centralize and Clean Your Data",
          description: "Audit all data sources, establish a single source of truth, and implement data quality standards. This is the foundation for every AI initiative.",
          category,
        });
        break;
      case "Workflow Execution":
        recommendations.push({
          title: "Automate High-Impact Workflows",
          description: "Identify the top 3 manual processes consuming agent and staff time. Deploy automation starting with the highest-volume, lowest-complexity tasks.",
          category,
        });
        break;
      case "Governance":
        recommendations.push({
          title: "Establish AI Governance Framework",
          description: "Draft an AI usage policy, assign an executive sponsor, and create a review process for AI-generated outputs before they reach clients.",
          category,
        });
        break;
      case "Adoption & ROI":
        recommendations.push({
          title: "Build an Adoption & Measurement Program",
          description: "Define KPIs for AI tool usage and ROI. Launch a pilot training program and create feedback loops to iterate on agent-facing AI tools.",
          category,
        });
        break;
    }
  }

  return recommendations;
}

export const QUICKSTART_TIMELINE = [
  {
    phase: "Days 1–30",
    title: "Foundation",
    actions: [
      "Complete data audit and identify integration gaps",
      "Draft AI governance policy v1",
      "Select 1 high-impact workflow for automation pilot",
      "Align executive sponsor and secure budget",
    ],
  },
  {
    phase: "Days 31–60",
    title: "Pilot & Build",
    actions: [
      "Launch workflow automation pilot with 10–20 agents",
      "Implement data centralization for pilot workflows",
      "Begin agent AI training program",
      "Establish baseline KPIs for measurement",
    ],
  },
  {
    phase: "Days 61–90",
    title: "Scale & Measure",
    actions: [
      "Expand pilot to full agent population",
      "Review and publish governance policy",
      "Measure ROI against baseline KPIs",
      "Plan Phase 2 initiatives based on results",
    ],
  },
];
