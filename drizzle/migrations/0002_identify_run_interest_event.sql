ALTER TABLE public.run2_interest ADD COLUMN event_code text NOT NULL DEFAULT 'run-02';
CREATE INDEX run2_interest_event_code_idx ON public.run2_interest (event_code, created_at DESC);
COMMENT ON COLUMN public.run2_interest.event_code IS 'Identifies the run interest list; existing submissions remain run-02.';