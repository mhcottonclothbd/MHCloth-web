-- Reduce OTP expiry to recommended threshold and enable leaked password protection

-- OTP expiry to 3600 seconds (1 hour) or less
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_settings WHERE name = 'app.settings.otp_expiry'
  ) THEN
    PERFORM set_config('app.settings.otp_expiry', '3600', false);
  END IF;
END$$;

-- Enable leaked password protection if available (requires Supabase managed setting)
-- This is typically configured via the dashboard, but we leave a marker here.
-- SELECT extensions.http(); -- example placeholder if needed for RPC configuration


