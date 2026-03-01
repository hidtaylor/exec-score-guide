
-- Fix: explicitly grant anon role insert access
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit an assessment" ON public.assessments;
CREATE POLICY "Anyone can submit an assessment" ON public.assessments FOR INSERT TO anon, authenticated WITH CHECK (true);
