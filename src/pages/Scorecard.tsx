import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import { useAppContext } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  QUESTIONS,
  CATEGORIES,
  getBand,
  getRecommendations,
} from "@/lib/scorecard-config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Scorecard() {
  const navigate = useNavigate();
  const { lead, setAssessment } = useAppContext();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentCategory, setCurrentCategory] = useState(0);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!lead) {
      toast.error("Please complete the form to begin your assessment.");
      navigate("/");
    }
  }, [lead, navigate]);

  const categoryQuestions = QUESTIONS.filter(
    (q) => q.category === CATEGORIES[currentCategory]
  );
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;
  const allCurrentAnswered = categoryQuestions.every((q) => answers[q.id] !== undefined);
  const isLastCategory = currentCategory === CATEGORIES.length - 1;

  const handleAnswer = (qId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleNext = () => {
    if (!allCurrentAnswered) {
      toast.error("Please answer all questions in this section.");
      return;
    }
    if (isLastCategory) {
      handleSubmit();
    } else {
      setCurrentCategory((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const band = getBand(totalScore);

    const categoryScores: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      const qs = QUESTIONS.filter((q) => q.category === cat);
      const avg = qs.reduce((sum, q) => sum + (answers[q.id] || 0), 0) / qs.length;
      categoryScores[cat] = Math.round(avg * 100) / 100;
    }

    const recommendations = getRecommendations(categoryScores);

    setAssessment({ answers, totalScore, band, categoryScores, recommendations });

    if (lead?.id) {
      setLoading(true);
      try {
        const { error } = await supabase.from("assessments").insert({
          lead_id: lead.id,
          q1: answers[1], q2: answers[2], q3: answers[3],
          q4: answers[4], q5: answers[5], q6: answers[6],
          q7: answers[7], q8: answers[8], q9: answers[9],
          q10: answers[10], q11: answers[11], q12: answers[12],
          total_score: totalScore,
          band,
          category_data_readiness: categoryScores["Data Readiness"],
          category_workflow_execution: categoryScores["Workflow Execution"],
          category_governance: categoryScores["Governance"],
          category_adoption_roi: categoryScores["Adoption & ROI"],
          recommendations: recommendations as any,
        });
        if (error) throw error;

        // Fire webhook to Zapier (fire-and-forget)
        supabase.functions.invoke('zapier-webhook', {
          body: {
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email,
            brokerageName: lead.brokerageName,
            agentCount: lead.agentCount,
            topPriority: lead.topPriority,
            q1: answers[1], q2: answers[2], q3: answers[3],
            q4: answers[4], q5: answers[5], q6: answers[6],
            q7: answers[7], q8: answers[8], q9: answers[9],
            q10: answers[10], q11: answers[11], q12: answers[12],
            totalScore,
            band,
            categoryScores,
            recommendations,
          },
        }).then(({ error: fnErr }) => {
          if (fnErr) console.error("Zapier webhook error:", fnErr);
          else console.log("Zapier webhook sent successfully");
        });
      } catch (err) {
        console.error(err);
        toast.error("Could not save results, but we'll show them now.");
      } finally {
        setLoading(false);
      }
    }

    navigate("/results");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-gradient-soft">
        <Header />
        <div className="container max-w-2xl py-12 md:py-20">
          {/* Progress */}
          <div className="mb-10 space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide">
              <span className="font-semibold text-accent">T3 Anchor</span>
              <span className="text-muted-foreground">{answeredCount} of {QUESTIONS.length} complete</span>
            </div>
            <Progress value={progress} className="h-1.5 [&>div]:bg-gradient-cta" />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 mb-10 flex-wrap">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => {
                  if (i <= currentCategory) setCurrentCategory(i);
                }}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-colors tracking-wide uppercase ${
                  i === currentCategory
                    ? "bg-gradient-cta text-accent-foreground shadow-brand"
                    : i < currentCategory
                    ? "bg-brand-light/15 text-foreground cursor-pointer hover:bg-brand-light/25"
                    : "text-muted-foreground cursor-default"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Section Label */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-1">
              Section {currentCategory + 1} of {CATEGORIES.length}
            </p>
            <h1 className="text-display-sm text-foreground">
              T3 Anchor Assessment: {CATEGORIES[currentCategory]}
            </h1>
          </div>

          {/* Questions */}
          <div className="space-y-10">
            {categoryQuestions.map((q) => (
              <div key={q.id} className="space-y-3 animate-fade-in">
                <p className="text-foreground font-medium leading-relaxed flex items-start gap-1.5">
                  <span>{q.question}</span>
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="shrink-0 mt-0.5" aria-label="More info">
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="start" className="max-w-xs text-sm">
                        {q.tooltip}
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="shrink-0 mt-0.5" aria-label="More info">
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-sm">
                        {q.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{q.labels[0]}</span>
                  <span>{q.labels[1]}</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => handleAnswer(q.id, v)}
                      className={`flex-1 h-11 rounded border text-sm font-medium transition-all ${
                        answers[q.id] === v
                          ? "bg-gradient-cta text-accent-foreground border-transparent shadow-brand"
                          : "bg-card text-foreground border-border hover:border-accent/40 hover:bg-brand-light/10"
                      }`}
                      aria-label={`Rate ${v} out of 5`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => {
                if (currentCategory > 0) setCurrentCategory((p) => p - 1);
              }}
              disabled={currentCategory === 0}
            >
              ← Previous Section
            </Button>
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!allCurrentAnswered || loading}
            >
              {loading ? "Saving..." : isLastCategory ? "View Results" : "Next Section →"}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
