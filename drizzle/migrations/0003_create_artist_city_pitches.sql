CREATE TABLE public.artist_city_pitches (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 email text NOT NULL,
 artist_project text NOT NULL,
 city text NOT NULL,
 neighborhood text NOT NULL,
 timing text,
 links text,
 message text,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.artist_city_pitches TO service_role;
ALTER TABLE public.artist_city_pitches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages artist city pitches" ON public.artist_city_pitches FOR ALL TO service_role USING (true) WITH CHECK (true);