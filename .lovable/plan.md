# Home page updates from founder notes

Three changes to the hero section, all in the left column.

## 1. Eyebrow line above the headline

Add a small uppercase kicker above "Assess Your Brokerage's AI Readiness":

`T3 ANCHOR — AI Navigation, Compliance, Human Oversight, Roadmap`

Styled as the existing eyebrow treatment (xs, semibold, wide tracking, muted), matching the "What This Delivers" label.

## 2. Fix the timing copy

Subhead currently says "in under 15 minutes". The notes say 10 minutes, which also matches the form panel ("10 minutes. Immediate results. No cost."). Change to "in under 10 minutes".

## 3. Derek Taylor quote block

Below the two hero buttons, add a testimonial: Derek's headshot on the left, quote and attribution to the right.

- Quote: "The T3 ANCHOR program helps a brokerage decide what stays with people and what an AI agent runs under supervision."
- Attribution: Derek Taylor, SVP T3 Technology Consulting

Photo rendered as a square with rounded corners, sized to sit alongside the quote; stacks above the quote on mobile. Quote in foreground text, attribution in muted small caps. Separated from the buttons by a top border for a clean editorial break.

## Technical notes

- Edit only `src/pages/Index.tsx` plus a new `src/components/DerekQuote.tsx` if the hero block gets long.
- Derek's photo is registered through the asset CLI as `src/assets/derek-taylor.jpg.asset.json` and imported by URL, so the binary stays out of the repo.
- All colors via existing semantic tokens (`text-muted-foreground`, `border-border`, `text-accent`). No new tokens.
- No copy uses Oxford commas.
