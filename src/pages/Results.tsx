import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { getBandDescription, QUICKSTART_TIMELINE, CATEGORIES } from "@/lib/scorecard-config";
import { CheckCircle, Download, Calendar } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/your-link";

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
      <div className="container max-w-3xl py-10 md:py-16 space-y-12">
        {/* Score Overview */}
        <div className="text-center space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Your AI Maturity Score</p>
          <div className={`text-6xl md:text-7xl font-display ${scoreColor}`}>
            {totalScore}<span className="text-2xl text-muted-foreground">/60</span>
          </div>
          <div className="inline-block bg-secondary px-4 py-1.5 rounded-md text-sm font-medium text-foreground">
            {band}
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {getBandDescription(band)}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {CATEGORIES.map((cat) => {
            const score = categoryScores[cat] || 0;
            return (
              <div key={cat} className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-display text-foreground">{score.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat}</p>
              </div>
            );
          })}
        </div>

        {/* Top 3 Priorities */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl text-foreground">Your Top 3 Priorities</h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                    <span className="inline-block text-xs text-accent mt-2">{rec.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Timeline */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl text-foreground">90-Day QuickStart Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICKSTART_TIMELINE.map((phase) => (
              <div key={phase.phase} className="bg-card border border-border rounded-lg p-5 space-y-3">
                <div>
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">{phase.phase}</span>
                  <h3 className="font-semibold text-foreground mt-1">{phase.title}</h3>
                </div>
                <ul className="space-y-2">
                  {phase.actions.map((action, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-accent shrink-0">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Block */}
        <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-10 text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-2xl">Ready to Accelerate Your AI Transformation?</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto">
            Book a 30-minute strategy call to review your results and build a custom roadmap for your brokerage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="hero-outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to="/thanks">
                <Calendar className="h-4 w-4 mr-2" />
                Book a Strategy Call
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href="/quickstart-kit.pdf" download>
                <Download className="h-4 w-4 mr-2" />
                Download QuickStart Kit (PDF)
              </a>
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Brokerage AI QuickStart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
