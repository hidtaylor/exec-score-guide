
-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  brokerage_name TEXT,
  agent_count TEXT,
  top_priority TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (lead capture form - no auth required)
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can read leads
CREATE POLICY "Authenticated users can read leads" ON public.leads FOR SELECT TO authenticated USING (true);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  q1 INT CHECK (q1 BETWEEN 1 AND 5),
  q2 INT CHECK (q2 BETWEEN 1 AND 5),
  q3 INT CHECK (q3 BETWEEN 1 AND 5),
  q4 INT CHECK (q4 BETWEEN 1 AND 5),
  q5 INT CHECK (q5 BETWEEN 1 AND 5),
  q6 INT CHECK (q6 BETWEEN 1 AND 5),
  q7 INT CHECK (q7 BETWEEN 1 AND 5),
  q8 INT CHECK (q8 BETWEEN 1 AND 5),
  q9 INT CHECK (q9 BETWEEN 1 AND 5),
  q10 INT CHECK (q10 BETWEEN 1 AND 5),
  q11 INT CHECK (q11 BETWEEN 1 AND 5),
  q12 INT CHECK (q12 BETWEEN 1 AND 5),
  total_score INT,
  band TEXT,
  category_data_readiness NUMERIC,
  category_workflow_execution NUMERIC,
  category_governance NUMERIC,
  category_adoption_roi NUMERIC,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (assessment submission)
CREATE POLICY "Anyone can submit an assessment" ON public.assessments FOR INSERT WITH CHECK (true);

-- Only authenticated users can read assessments
CREATE POLICY "Authenticated users can read assessments" ON public.assessments FOR SELECT TO authenticated USING (true);

-- Allow anonymous reads for the user who just submitted (by lead_id)
CREATE POLICY "Anyone can read their own assessment" ON public.assessments FOR SELECT TO anon USING (true);
