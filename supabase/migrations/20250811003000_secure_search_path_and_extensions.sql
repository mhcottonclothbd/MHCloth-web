-- Secure function search_path and move extensions to "extensions" schema

-- Ensure extensions schema exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move common extensions out of public
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER EXTENSION pg_trgm SET SCHEMA extensions';
  EXCEPTION WHEN others THEN
    NULL;
  END;
  BEGIN
    EXECUTE 'ALTER EXTENSION ltree SET SCHEMA extensions';
  EXCEPTION WHEN others THEN
    NULL;
  END;
END$$;

-- Set immutable search_path for listed public functions
DO $$
DECLARE
  fn RECORD;
  target_names TEXT[] := ARRAY[
    'set_updated_at',
    'get_dashboard_metrics',
    'get_revenue_timeseries',
    'get_category_sales',
    'get_top_products',
    'get_recent_orders',
    'verify_admin_credentials',
    'mark_admin_login',
    'is_admin',
    'categories_set_path_depth',
    'list_products_by_department',
    'list_products_by_category',
    'upsert_category',
    'upsert_product'
  ];
BEGIN
  FOR fn IN
    SELECT (p.oid::regprocedure)::text AS regproc
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY(target_names)
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public', fn.regproc);
  END LOOP;
END$$;


