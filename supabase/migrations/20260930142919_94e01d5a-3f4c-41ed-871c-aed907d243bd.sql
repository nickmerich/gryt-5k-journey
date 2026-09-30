CREATE TABLE public.run2_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('runner','brand')),
  name text NOT NULL,
  email text NOT NULL,
  pace text,
  brand text,
  role text,
  category text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.run2_interest TO service_role;
ALTER TABLE public.run2_interest ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages run2 interest" ON public.run2_interest
  FOR ALL TO service_role USING (true) WITH CHECK (true);