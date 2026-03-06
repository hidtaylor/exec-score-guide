

## Plan: Zapier Webhook on Assessment Submission

### Overview
Create an edge function that forwards assessment + lead data to a Zapier webhook URL. Fire it from the Scorecard page after the assessment is saved to the database.

### Where the webhook URL lives
Store the Zapier webhook URL as a backend secret (`ZAPIER_WEBHOOK_URL`) so it's not exposed client-side.

### Implementation Steps

1. **Add the `ZAPIER_WEBHOOK_URL` secret** — prompt you to enter your Zapier webhook URL via the secrets tool.

2. **Create edge function `supabase/functions/zapier-webhook/index.ts`**
   - Accepts POST with lead + assessment data
   - Reads `ZAPIER_WEBHOOK_URL` from env
   - Forwards the full payload (name, email, brokerage, agent count, priority, all scores, band, category scores, recommendations) to Zapier
   - Uses `no-cors` isn't needed server-side; the edge function calls Zapier directly with full response handling
   - Returns success/failure to the client

3. **Update `supabase/config.toml`** — add `[functions.zapier-webhook]` with `verify_jwt = false` (the function validates its own context)

4. **Update `src/pages/Scorecard.tsx`** — after the successful database insert in `handleSubmit`, call the edge function via `supabase.functions.invoke('zapier-webhook', { body: { ...leadData, ...assessmentData } })`. Fire-and-forget (don't block navigation on webhook success/failure).

### Data sent to Zapier
Every field the user submitted plus computed results:
- First name, last name, email, brokerage name, agent count, top priority
- Individual question answers (q1–q12)
- Total score, band (e.g. "Emerging", "Advancing")
- Category scores (Data Readiness, Workflow Execution, Governance, Adoption & ROI)
- Recommendations array

This gives you everything needed to personalize automated outreach in Zapier.

