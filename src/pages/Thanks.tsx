import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/your-link";

export default function Thanks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl py-10 md:py-16 space-y-10">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl text-foreground">Thank You</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Your AI Maturity Scorecard results are ready. Schedule a complimentary 30-minute strategy call to walk through your results and identify quick wins.
          </p>
        </div>

        {/* Calendly Embed */}
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Schedule Your Strategy Call</h2>
            <p className="text-sm text-muted-foreground mt-1">30 minutes · Free · Video call</p>
          </div>
          <div className="bg-muted flex items-center justify-center" style={{ minHeight: 500 }}>
            <iframe
              src={CALENDLY_URL}
              width="100%"
              height="500"
              frameBorder="0"
              title="Schedule a strategy call"
              className="w-full"
              style={{ minHeight: 500 }}
            />
          </div>
        </div>

        {/* Fallback */}
        <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm text-muted-foreground">
            Prefer email? Reach out directly:
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
