# Brighter, on-brand home page

## Goal
Add on-brand color and energy to the home page so visitors are drawn to start the assessment, while staying within the T3 Sixty palette: Dark Blue #243655, Medium Blue #0050a3, Light Blue #0095cd, Yellow #f9c80e, Grey #b9bcb5.

## Design moves
- Hero: replace the flat white band with a soft brand gradient wash (white into light blue tint) plus a subtle Light Blue glow behind the lead form. Headline gets a Medium-to-Light Blue gradient on the key phrase "AI Readiness".
- Eyebrow line above the headline: a small Yellow-accented pill/tag replacing the currently empty line, e.g. "Free · 10 minute assessment".
- Primary CTA: Medium Blue to Light Blue gradient button with a colored shadow and a lift on hover. Secondary CTA stays outlined but picks up the accent border.
- Lead form card: white card on the tinted background, Light Blue top border accent, brand-colored shadow, so it reads as the focal point.
- Testimonial: light blue tinted panel with a Yellow quote mark, Derek's photo on a soft brand-tinted circle.
- "What This Delivers": numbered markers become filled Light Blue badges; section gets a very light tinted background instead of plain white.
- Credibility band: keep the Dark Blue background but add a subtle Medium Blue gradient and make its CTA Yellow with dark blue text so it pops.
- Footer keeps a thin brand accent rule.

## Guardrails
- All colors come from design tokens; no hardcoded hex in components.
- Keep the minimalist executive tone: color as accents and washes, not heavy blocks or playful shapes.
- No new copy beyond the eyebrow tag; no social proof additions.

## Technical detail
- `src/index.css`: add tokens for Light Blue (`--brand-light`), brand Grey, plus gradient and shadow tokens (`--gradient-hero`, `--gradient-cta`, `--shadow-brand`, `--shadow-card`), including dark-mode values.
- `tailwind.config.ts`: expose `brand.light` / `brand.grey` colors and the gradient/shadow tokens as utilities (`bg-gradient-hero`, `shadow-brand`).
- `src/components/ui/button.tsx`: update the `hero` variant to the gradient + brand shadow, add a `cta-yellow` variant for the dark section.
- `src/pages/Index.tsx`: apply the section backgrounds, eyebrow tag, gradient headline span, form card accent, testimonial panel and numbered badges.
