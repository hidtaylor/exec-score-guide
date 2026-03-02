import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/your-link";

export default function Thanks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl py-12 md:py-20 space-y-12">
        <div className="text-center space-y-4 animate-fade-in">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Next Step</p>
          <h1 className="text-display-md text-foreground">Schedule Your Strategy Review</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Book a complimentary 30-minute consultation to review your assessment results and identify high-impact next steps.
          </p>
        </div>

        {/* Calendly Embed */}
        <div className="border border-border rounded overflow-hidden animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="p-6 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Book a Consultation</h2>
            <p className="text-xs text-muted-foreground mt-1">30 minutes · Complimentary · Video call</p>
          </div>
          <div className="bg-muted flex items-center justify-center" style={{ minHeight: 500 }}>
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
            <a href="mailto:ai@yourbrokerage.com">
              <Mail className="h-4 w-4 mr-2" />
              ai@yourbrokerage.com
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
