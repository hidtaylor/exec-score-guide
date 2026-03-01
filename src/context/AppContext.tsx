import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Band, Recommendation } from "@/lib/scorecard-config";

export interface LeadData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  brokerageName: string;
  agentCount: string;
  topPriority: string;
  consent: boolean;
}

export interface AssessmentResult {
  answers: Record<number, number>;
  totalScore: number;
  band: Band;
  categoryScores: Record<string, number>;
  recommendations: Recommendation[];
}

interface AppContextType {
  lead: LeadData | null;
  setLead: (lead: LeadData) => void;
  assessment: AssessmentResult | null;
  setAssessment: (result: AssessmentResult) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lead, setLead] = useState<LeadData | null>(null);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);

  return (
    <AppContext.Provider value={{ lead, setLead, assessment, setAssessment }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
