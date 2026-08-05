import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { getBandDescription, QUICKSTART_TIMELINE, CATEGORIES } from "@/lib/scorecard-config";
import { generateResultsPDF } from "@/lib/generate-results-pdf";
import QRCode from "@/components/QRCode";
import { Download, Calendar, Mail } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/derek-taylor-2/t3-sixty-brokerage-ai-readiness-consultation";

export default function Results() {
  const { assessment, lead } = useAppContext();

  if (!assessment) return <Navigate to="/" replace />;

  const { totalScore, band, categoryScores, recommendations } = assessment;

  const scoreColor =
    totalScore >= 48 ? "text-score-high" :
    totalScore >= 30 ? "text-score-mid" : "text-score-low";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <div className="container max-w-3xl py-12 md:py-20 space-y-16">
        {/* Score Overview */}
        <div className="text-center space-y-5 animate-fade-in">
          <p className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            T3 Anchor Results
          </p>
          <div className={`text-6xl md:text-7xl font-display font-semibold ${scoreColor}`}>
            {totalScore}<span className="text-xl text-muted-foreground font-sans font-normal">/60</span>
          </div>
          <div className="inline-block border border-accent/30 bg-accent/10 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide text-accent">
            {band}
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm">
            {getBandDescription(band)}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">Category Scores</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const score = categoryScores[cat] || 0;
              return (
                <div key={cat} className="relative overflow-hidden border border-border rounded-lg bg-card p-5 text-center shadow-card">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-cta" />
                  <p className="text-2xl font-display font-semibold text-foreground">{score.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 tracking-wide">{cat}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 3 Priorities */}
        <div className="space-y-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-1">Recommendations</p>
            <h2 className="text-display-sm text-foreground">Your Top 3 Priorities</h2>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="border border-border rounded-lg bg-card p-6 space-y-2 shadow-card">
                <div className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-cta text-xs font-semibold text-accent-foreground mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{rec.description}</p>
                    <span className="inline-block text-xs text-muted-foreground mt-2 uppercase tracking-wide">{rec.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Timeline */}
        <div className="space-y-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-1">Implementation</p>
            <h2 className="text-display-sm text-foreground">90-Day Action Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICKSTART_TIMELINE.map((phase) => (
              <div key={phase.phase} className="relative overflow-hidden border border-border rounded-lg bg-card p-6 space-y-4 shadow-card">
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-widest">{phase.phase}</span>
                  <h3 className="font-semibold text-foreground mt-1">{phase.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {phase.actions.map((action, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2.5 leading-relaxed">
                      <span className="text-border shrink-0 mt-1">—</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Download */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <Button
            variant="hero"
            onClick={() => generateResultsPDF(assessment, lead)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Your Results (PDF)
          </Button>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-deep text-primary-foreground rounded-lg p-10 md:p-14 shadow-brand animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/60">
                Next Step
              </p>
              <h2 className="text-display-sm">Let's Build Your AI Roadmap</h2>
              <div className="space-y-1">
                <p className="font-semibold text-sm">Derek Taylor</p>
                <p className="text-primary-foreground/70 text-sm">
                  SVP T3 Technology Consulting
                </p>
                <p className="text-primary-foreground/70 text-sm">T3 Sixty</p>
              </div>
              <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-md">
                Book a complimentary 30-minute consultation to review your results and develop a tailored roadmap for your brokerage.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                <Button
                  variant="hero-yellow"
                  asChild
                >
                  <Link to="/thanks">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href="mailto:derek.taylor@t3sixty.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Derek
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="bg-primary-foreground rounded-lg p-3">
                <QRCode
                  url="https://calendly.com/derek-taylor-2/t3-sixty-brokerage-ai-readiness-consultation"
                  size={140}
                />
              </div>
              <p className="text-xs text-primary-foreground/50 text-center">
                Scan to schedule a<br />30-min consultation
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t-2 border-accent/30 py-10">
        <div className="container text-center text-xs text-muted-foreground tracking-wide">
          © {new Date().getFullYear()} T3 Sixty. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
