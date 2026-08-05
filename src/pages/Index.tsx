import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import derekPhoto from "@/assets/derek-taylor.png.asset.json";

const DELIVERS = [
"A structured AI maturity assessment across four operational dimensions",
"Rules-based priority recommendations tailored to your brokerage profile",
"A phased 90-day implementation roadmap with measurable milestones",
"Baseline KPI targets to track return on AI investment"];


const HOME_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "T3 Sixty",
    url: "https://readiness.t360.com",
    logo: "https://readiness.t360.com/favicon.png",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "T3 Anchor",
    url: "https://readiness.t360.com",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="T3 Anchor — Brokerage AI Readiness Assessment"
        description="Free 10 minute T3 Anchor assessment scoring your brokerage's AI readiness across four dimensions, with a phased 90-day roadmap."
        path="/"
        jsonLd={HOME_JSON_LD}
      />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] h-[520px] w-[520px] rounded-full bg-brand-light/15 blur-3xl"
        />
        <div className="container relative py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="space-y-6 animate-fade-in max-w-lg">
              <p className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                Free · 10 minute assessment
              </p>

              <h1 className="text-display-lg text-foreground">
                Assess Your Brokerage's{" "}
                <span className="bg-gradient-text bg-clip-text text-transparent">AI Readiness</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Identify gaps, prioritize initiatives and build a 90-day action plan — in under 10 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="hero" asChild>
                  <a href="#get-started">Begin Assessment</a>
                </Button>
                <Button variant="hero-outline" asChild>
                  <Link to="/thanks">Schedule a Consultation</Link>
                </Button>
              </div>

              <figure className="relative flex flex-col sm:flex-row gap-5 items-start rounded-lg border border-accent/15 bg-brand-light/5 p-6 mt-10">
                <span aria-hidden className="absolute -top-3 left-5 font-display text-5xl leading-none text-warning">
                  “
                </span>
                <img
                  src={derekPhoto.url}
                  alt="Derek Taylor, SVP T3 Technology Consulting"
                  loading="lazy"
                  className="h-20 w-20 rounded-full object-cover shrink-0 bg-accent/10 ring-2 ring-accent/20"
                />
                <div>
                  <blockquote className="text-foreground leading-relaxed">
                    The T3 Sixty Brokerage Anchor&nbsp; program helps a brokerage decide what stays with people and what an AI agent runs under supervision.
                  </blockquote>
                  <figcaption className="mt-3 text-xs tracking-widest uppercase text-accent font-semibold">
                    Derek Taylor — SVP T3 Technology Consulting
                  </figcaption>
                </div>
              </figure>
            </div>


            {/* Lead Form */}
            <div
              id="get-started"
              className="relative overflow-hidden border border-border rounded-lg bg-card p-8 md:p-10 shadow-card animate-fade-in"
              style={{ animationDelay: "0.1s" }}>
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-cta" />
              <h2 className="text-display-sm text-foreground mb-1">Start Your Assessment</h2>
              <p className="text-sm text-muted-foreground mb-8">10 minutes. Immediate results. No cost.</p>
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* What This Delivers */}
      <section className="border-b border-border bg-gradient-soft">
        <div className="container py-20 md:py-24 max-w-3xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">What This Delivers</p>
          <h2 className="text-display-md text-foreground mb-10">
            A Complete AI Readiness Framework
          </h2>
          <div className="space-y-5">
            {DELIVERS.map((item, i) =>
            <div
              key={i}
              className="flex gap-4 items-start animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}>
              
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-cta text-xs font-semibold text-accent-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-foreground leading-relaxed pt-0.5">{item}</p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Credibility */}
      <section className="bg-gradient-deep text-primary-foreground">
        <div className="container py-20 md:py-24 text-center max-w-2xl">
          <h2 className="text-display-md mb-5">Built for Brokerage Executives</h2>
          <p className="text-primary-foreground/80 text-base leading-relaxed">
            Designed around measurable ROI, operational leverage and governance — not hype. A structured framework for leaders who need clarity on their path to AI transformation.
          </p>
          <Button variant="hero-yellow" className="mt-10" asChild>
            <a href="#get-started">Begin Assessment</a>
          </Button>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t-2 border-accent/30 py-10">
        <div className="container text-center text-xs text-muted-foreground tracking-wide">
          © {new Date().getFullYear()} T3 Sixty. All rights reserved.
        </div>
      </footer>

    </div>);

}