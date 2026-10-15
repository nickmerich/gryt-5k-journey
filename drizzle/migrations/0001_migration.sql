CREATE TABLE public.sponsor_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  role text,
  website text,
  package text NOT NULL,
  budget text NOT NULL,
  goals text,
  status text NOT NULL DEFAULT 'new'
);
GRANT ALL ON public.sponsor_inquiries TO service_role;
ALTER TABLE public.sponsor_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No client access" ON public.sponsor_inquiries AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);