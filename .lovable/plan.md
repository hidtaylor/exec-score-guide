

## Problem
The header navigation includes a direct "Assessment" link to `/scorecard`, allowing users to bypass the lead capture form entirely. Additionally, the Scorecard page doesn't guard against missing lead data.

## Solution

### 1. Remove "Assessment" link from Header
Remove the nav link to `/scorecard` from `src/components/Header.tsx` so users cannot navigate directly to the scorecard without going through the form.

### 2. Add route guard to Scorecard page
In `src/pages/Scorecard.tsx`, add a check at the top of the component: if `lead` is `null` (meaning the user hasn't submitted the form), redirect them back to the home page (`/`) with a toast message like "Please complete the form to begin your assessment."

### Technical Details

**`src/components/Header.tsx`**
- Remove the `<Link to="/scorecard">Assessment</Link>` nav item (or replace with a link back to `/#get-started`)

**`src/pages/Scorecard.tsx`**
- Add a `useEffect` that checks if `lead` is null and, if so, calls `navigate("/")` and shows a toast notification
- This serves as a safety net in case someone bookmarks or manually enters the URL

