# Header wordmark on one line

## Goal
The text next to the T3 Sixty logo in the header should read "Brokerage AI Strategy and Roadmap Engagement" and stay on a single horizontal line instead of wrapping to two.

## Changes
- In the header, replace the current "BROKERAGE" label with "Brokerage AI Strategy and Roadmap Engagement".
- Keep it on one line at all widths: prevent wrapping and slightly reduce the letter-spacing/size so the longer label fits beside the logo without pushing the nav.
- On small screens, shrink the label further (or scale it down) so it still fits one line rather than wrapping.

## Technical detail
Edit `src/components/Header.tsx`: update the `<span>` text, add `whitespace-nowrap`, tighten tracking (e.g. `tracking-wide` instead of `tracking-widest`) and use a responsive size (`text-[11px] sm:text-sm`) so the full phrase renders on one line.
