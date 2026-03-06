import { Link } from "react-router-dom";
import T3SixtyLogo from "./T3SixtyLogo";

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-foreground">
          <T3SixtyLogo className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-widest uppercase">Brokerage</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        </nav>
      </div>
    </header>
  );
}
