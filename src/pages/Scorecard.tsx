import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl py-12 md:py-20">
        {/* Progress */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wide">
            <span>AI Maturity Assessment</span>
            <span>{answeredCount} of {QUESTIONS.length} complete</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 mb-10 flex-wrap">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => {
                if (i <= currentCategory) setCurrentCategory(i);
              }}
              className={`text-xs font-medium px-4 py-2 rounded transition-colors tracking-wide uppercase ${
                i === currentCategory
                  ? "bg-primary text-primary-foreground"
                  : i < currentCategory
                  ? "bg-muted text-foreground cursor-pointer hover:bg-muted/80"
                  : "text-muted-foreground cursor-default"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Label */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">
            Section {currentCategory + 1} of {CATEGORIES.length}
          </p>
          <h2 className="text-display-sm text-foreground">{CATEGORIES[currentCategory]}</h2>
        </div>

        {/* Questions */}
        <div className="space-y-10">
          {categoryQuestions.map((q) => (
            <div key={q.id} className="space-y-3 animate-fade-in">
              <p className="text-foreground font-medium leading-relaxed">
                {q.question}
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
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
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
  );
}
