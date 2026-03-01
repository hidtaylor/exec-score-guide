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
      <div className="container max-w-2xl py-10 md:py-16">
        {/* Progress */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>AI Maturity Scorecard</span>
            <span>{answeredCount} of {QUESTIONS.length} answered · ~{Math.max(1, Math.ceil((QUESTIONS.length - answeredCount) * 0.8))} min left</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Category */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => {
                if (i <= currentCategory) setCurrentCategory(i);
              }}
              className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
                i === currentCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : i < currentCategory
                  ? "bg-secondary text-foreground border-border cursor-pointer"
                  : "bg-muted text-muted-foreground border-border cursor-default"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {categoryQuestions.map((q) => (
            <div key={q.id} className="space-y-3 animate-fade-in">
              <p className="text-foreground font-medium leading-relaxed">
                {q.id}. {q.question}
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
                    className={`flex-1 h-11 rounded-md border text-sm font-medium transition-all ${
                      answers[q.id] === v
                        ? "bg-accent text-accent-foreground border-accent shadow-sm"
                        : "bg-background text-foreground border-border hover:bg-secondary"
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
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentCategory > 0) setCurrentCategory((p) => p - 1);
            }}
            disabled={currentCategory === 0}
          >
            ← Previous
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
