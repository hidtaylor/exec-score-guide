

## Add Hover Tooltips to Scorecard Questions

Each of the 12 scorecard questions will get a hover tooltip that shows a simplified, plain-language explanation of what the question is asking and why it matters.

### Changes

**1. Update `src/lib/scorecard-config.ts`**
- Add a `tooltip` field to the `ScorecardQuestion` interface
- Add plain-language tooltip text for all 12 questions (e.g., Q1: "Do all your systems talk to each other, or is your data stuck in different tools that don't connect?")

**2. Update `src/pages/Scorecard.tsx`**
- Import `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` from the existing UI components
- Wrap the question text with a Tooltip that shows the simplified explanation on hover
- Add a small info icon (HelpCircle from lucide-react) next to each question to signal the tooltip is available

### Tooltip Content (Plain Language)

| Q | Simplified Tooltip |
|---|---|
| 1 | "Can your team easily find all client, deal, and agent info in one place -- or is it spread across spreadsheets, email, and different apps?" |
| 2 | "Is your data organized and labeled well enough that a computer could read and learn from it without a lot of cleanup first?" |
| 3 | "Is there a specific person or team responsible for making sure your data stays accurate and up to date?" |
| 4 | "How much of your day-to-day work (like onboarding new agents or sending marketing) runs on autopilot vs. requiring manual effort?" |
| 5 | "Are any AI tools (like smart assistants, auto-responses, or predictive analytics) actually being used in daily work?" |
| 6 | "Do your CRM, marketing tools, transaction platform, etc. share data automatically, or do people have to copy-paste between them?" |
| 7 | "Has your company written down rules about how and when AI tools should (and shouldn't) be used?" |
| 8 | "When AI creates content or makes suggestions, does someone review it before it goes to clients? Is there a record of what was checked?" |
| 9 | "Is there a senior leader actively pushing for AI adoption and willing to fund it?" |
| 10 | "Out of all your agents, how many are actually logging in and using the AI tools you provide?" |
| 11 | "Do you track whether your tech investments are actually saving time or making money, with real numbers?" |
| 12 | "Do your agents find the AI tools helpful and easy to use, or do they ignore or complain about them?" |

### Technical Details
- Uses the existing `Tooltip` component from `@radix-ui/react-tooltip` (already installed)
- Wraps the Scorecard page content in a `TooltipProvider`
- Each question gets an inline `HelpCircle` icon (16px, muted color) that triggers the tooltip on hover
- Mobile-friendly: tooltips also work on tap

