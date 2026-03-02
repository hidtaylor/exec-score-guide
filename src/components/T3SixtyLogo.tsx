export default function T3SixtyLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="T3 Sixty"
    >
      <circle cx="50" cy="50" r="48" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      <text
        x="50"
        y="38"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="28"
        fill="hsl(var(--background))"
        letterSpacing="-1"
      >
        T3
      </text>
      <text
        x="50"
        y="68"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="28"
        fill="hsl(var(--background))"
        letterSpacing="-1"
      >
        60
      </text>
    </svg>
  );
}
