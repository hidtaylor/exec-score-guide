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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl py-12 md:py-20 space-y-16">
        {/* Score Overview */}
        <div className="text-center space-y-5 animate-fade-in">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            AI Maturity Assessment Results
          </p>
          <div className={`text-6xl md:text-7xl font-display font-semibold ${scoreColor}`}>
            {totalScore}<span className="text-xl text-muted-foreground font-sans font-normal">/60</span>
          </div>
          <div className="inline-block border border-border px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wide text-foreground">
            {band}
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm">
            {getBandDescription(band)}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Category Scores</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const score = categoryScores[cat] || 0;
              return (
                <div key={cat} className="border border-border rounded p-5 text-center">
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
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Recommendations</p>
            <h2 className="text-display-sm text-foreground">Your Top 3 Priorities</h2>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="border border-border rounded p-6 space-y-2">
                <div className="flex items-start gap-4">
                  <span className="text-accent font-semibold text-sm mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
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
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Implementation</p>
            <h2 className="text-display-sm text-foreground">90-Day Action Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICKSTART_TIMELINE.map((phase) => (
              <div key={phase.phase} className="border border-border rounded p-6 space-y-4">
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

        {/* CTA Block */}
        <div className="bg-primary text-primary-foreground rounded p-10 md:p-14 text-center space-y-5 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <h2 className="text-display-sm">Schedule a Strategy Review</h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto text-sm leading-relaxed">
            Book a complimentary 30-minute consultation to review your results and develop a tailored roadmap for your brokerage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="hero-outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
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
              <a href="/quickstart-kit.pdf" download>
                <Download className="h-4 w-4 mr-2" />
                Download Report (PDF)
              </a>
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-10">
        <div className="container text-center text-xs text-muted-foreground tracking-wide">
          © {new Date().getFullYear()} Brokerage AI Advisory. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
