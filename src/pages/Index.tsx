import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const DELIVERS = [
  "A structured AI maturity assessment across four operational dimensions",
  "Rules-based priority recommendations tailored to your brokerage profile",
  "A phased 90-day implementation roadmap with measurable milestones",
  "Baseline KPI targets to track return on AI investment",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="space-y-6 animate-fade-in max-w-lg">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                AI Transformation Advisory
              </p>
              <h1 className="text-display-lg text-foreground">
                Assess Your Brokerage's AI Readiness
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Identify gaps, prioritize initiatives, and build a 90-day action plan — in under 15 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="hero" asChild>
                  <a href="#get-started">Begin Assessment</a>
                </Button>
                <Button variant="hero-outline" asChild>
                  <Link to="/thanks">Schedule a Consultation</Link>
                </Button>
              </div>
            </div>

            {/* Lead Form */}
            <div id="get-started" className="border border-border rounded bg-card p-8 md:p-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-display-sm text-foreground mb-1">Start Your Assessment</h2>
              <p className="text-sm text-muted-foreground mb-8">10 minutes. Immediate results. No cost.</p>
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* What This Delivers */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-24 max-w-3xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">What This Delivers</p>
          <h2 className="text-display-md text-foreground mb-10">
            A Complete AI Readiness Framework
          </h2>
          <div className="space-y-5">
            {DELIVERS.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="text-accent font-semibold text-sm mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Credibility */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 md:py-24 text-center max-w-2xl">
          <h2 className="text-display-md mb-5">Built for Brokerage Executives</h2>
          <p className="text-primary-foreground/75 text-base leading-relaxed">
            Designed around measurable ROI, operational leverage, and governance — not hype. A structured framework for leaders who need clarity on their path to AI transformation.
          </p>
          <Button variant="hero-outline" className="mt-10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <a href="#get-started">Begin Assessment</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container text-center text-xs text-muted-foreground tracking-wide">
          © {new Date().getFullYear()} Brokerage AI Advisory. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
