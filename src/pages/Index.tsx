import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { BarChart3, Target, Calendar, Activity } from "lucide-react";

const FEATURES = [
  { icon: BarChart3, title: "10-Minute AI Maturity Snapshot", desc: "Assess your brokerage across 4 key AI-readiness dimensions." },
  { icon: Target, title: "Top 3 Priority Selector", desc: "Rules-based recommendations for where to focus first." },
  { icon: Calendar, title: "90-Day QuickStart Plan", desc: "A phased action plan to move from assessment to execution." },
  { icon: Activity, title: "KPI Starter Dashboard", desc: "Baseline metrics to track AI ROI from day one." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl leading-tight tracking-tight text-foreground">
                Brokerage AI Transformation QuickStart Kit
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Assess where you are, identify your top 3 priorities, and launch a 90-day AI plan — in under 15 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="hero" asChild>
                  <a href="#get-started">Start the 10-Minute Scorecard</a>
                </Button>
                <Button variant="hero-outline" asChild>
                  <Link to="/thanks">Book a Strategy Call</Link>
                </Button>
              </div>
            </div>

            {/* Lead Form (mobile-first: appears above fold) */}
            <div id="get-started" className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <h2 className="text-xl font-semibold text-foreground mb-1">Get Your Free Assessment</h2>
              <p className="text-sm text-muted-foreground mb-6">Takes 10 minutes. Results are immediate.</p>
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl text-foreground mb-10 text-center">What's Inside the QuickStart Kit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="bg-card border border-border rounded-lg p-6 space-y-3 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 md:py-20 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl mb-4">Built for Brokerage Leaders</h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Focused on measurable ROI, operational leverage, and governance — not hype. This framework is designed for executives who need a clear, structured path to AI transformation.
          </p>
          <Button variant="hero-outline" className="mt-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <a href="#get-started">Get Started Free</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Brokerage AI QuickStart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
