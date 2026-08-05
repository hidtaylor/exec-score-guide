import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/derek-taylor-2/t3-sixty-brokerage-ai-readiness-consultation";

export default function Thanks() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <div className="container max-w-2xl py-12 md:py-20 space-y-12">
        <div className="text-center space-y-4 animate-fade-in">
          <p className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            Next Step
          </p>
          <h1 className="text-display-md text-foreground">
            Schedule Your{" "}
            <span className="bg-gradient-text bg-clip-text text-transparent">Strategy Review</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Book a complimentary 30-minute consultation to review your assessment results and identify high-impact next steps.
          </p>
        </div>

        {/* Calendly Embed */}
        <div className="relative overflow-hidden border border-border rounded-lg bg-card shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-cta" />
          <div className="p-6 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Book a Consultation</h2>
            <p className="text-xs text-muted-foreground mt-1">30 minutes · Complimentary · Video call</p>
          </div>
          <div className="bg-brand-light/5 flex items-center justify-center" style={{ minHeight: 500 }}>
            <iframe
              src={CALENDLY_URL}
              width="100%"
              height="500"
              frameBorder="0"
              title="Schedule a consultation"
              className="w-full"
              style={{ minHeight: 500 }}
            />
          </div>
        </div>

        {/* Fallback */}
        <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Prefer email?
          </p>
          <Button variant="outline" asChild>
            <a href="mailto:derek.taylor@t3sixty.com">
              <Mail className="h-4 w-4 mr-2" />
              derek.taylor@t3sixty.com
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
