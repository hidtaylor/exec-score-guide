import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-lg text-foreground tracking-tight">
          Brokerage AI <span className="text-accent">QuickStart</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/scorecard" className="hover:text-foreground transition-colors">Scorecard</Link>
        </nav>
      </div>
    </header>
  );
}
