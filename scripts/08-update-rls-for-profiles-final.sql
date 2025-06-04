-- Update RLS policies to use profiles table instead of user_metadata

-- Drop old policies that used user_metadata
DROP POLICY IF EXISTS "Admins can manage publishers" ON public.publishers;
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can view all user activities" ON public.user_activities;

-- Drop old helper function if exists
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Recreate helper function to use profiles table
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND is_admin = true
    );
$$;

-- PUBLISHERS Table Policies
CREATE POLICY "Admins can manage publishers" ON public.publishers
    FOR ALL -- Covers INSERT, UPDATE, DELETE, SELECT
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

-- COUPONS Table Policies  
CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL -- Covers INSERT, UPDATE, DELETE, SELECT
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

-- USER_ACTIVITIES Table Policies
CREATE POLICY "Admins can view all user activities" ON public.user_activities
    FOR SELECT USING (public.is_admin_user());
