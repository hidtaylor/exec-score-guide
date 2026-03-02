
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read leads" ON public.leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can submit an assessment" ON public.assessments;
DROP POLICY IF EXISTS "Authenticated users can read assessments" ON public.assessments;
DROP POLICY IF EXISTS "Anyone can read their own assessment" ON public.assessments;
CREATE POLICY "Anyone can submit an assessment" ON public.assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read assessments" ON public.assessments FOR SELECT USING (true);
