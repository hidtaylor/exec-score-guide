

## Fix Tooltips for iPhone / Touch Devices

The tooltips don't work on iPhone because the `TooltipTrigger` wraps a raw SVG icon (`HelpCircle`) via `asChild`. On iOS, SVG elements aren't natively focusable or tappable, so the Radix tooltip never activates.

### Fix

**`src/pages/Scorecard.tsx`** -- Wrap the `HelpCircle` icon inside a `<button>` element so it becomes a proper tappable target on touch devices:

```tsx
<TooltipTrigger asChild>
  <button type="button" className="shrink-0 mt-0.5" aria-label="More info">
    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
  </button>
</TooltipTrigger>
```

This gives iOS a real interactive element to register tap events on, which Radix then interprets as a focus/hover trigger to show the tooltip.

Single file change, one line replaced.
