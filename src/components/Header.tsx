import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="text-sm font-semibold tracking-widest uppercase text-foreground">
          Brokerage AI
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/scorecard" className="hover:text-foreground transition-colors">Assessment</Link>
        </nav>
      </div>
    </header>
  );
}
