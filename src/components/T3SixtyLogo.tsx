import logo from "@/assets/T360_DisplayLogo_Black.png";

export default function T3SixtyLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="T3 Sixty"
      className={className}
    />
  );
}
