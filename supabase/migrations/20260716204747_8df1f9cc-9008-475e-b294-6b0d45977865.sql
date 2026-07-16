CREATE TABLE public.rtwl_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  ticket text NOT NULL,
  waiver_accepted boolean NOT NULL DEFAULT false,
  strava_athlete_id bigint,
  strava_athlete_firstname text,
  strava_athlete_lastname text,
  strava_athlete_username text,
  strava_athlete_profile text,
  strava_connected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rtwl_registrations_email_idx ON public.rtwl_registrations (lower(email));
GRANT ALL ON public.rtwl_registrations TO service_role;
ALTER TABLE public.rtwl_registrations ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: all reads/writes flow through the service role in server routes.