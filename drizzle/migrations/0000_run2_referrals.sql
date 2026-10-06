ALTER TABLE public.run2_interest ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE public.run2_interest ADD COLUMN IF NOT EXISTS referred_by text;
CREATE UNIQUE INDEX IF NOT EXISTS run2_interest_referral_code_key ON public.run2_interest (referral_code);
CREATE INDEX IF NOT EXISTS run2_interest_referred_by_idx ON public.run2_interest (referred_by);