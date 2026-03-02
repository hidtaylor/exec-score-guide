import logo from "@/assets/t360-logo.webp";

export default function T3SixtyLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="T3 Sixty"
      className={className}
    />
  );
}
