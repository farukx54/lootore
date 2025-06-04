-- Create profiles table for admin and role management
CREATE TABLE IF NOT EXISTS public.profiles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user', -- 'user', 'admin', 'super_admin' gibi roller için
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Create updated_at trigger
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile (but only non-admin fields)
-- Normal users cannot change is_admin or role fields
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can update any profile (including admin status)
CREATE POLICY "Admins can update any profile" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can insert new profiles
CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Auto-create profile when user signs up (trigger function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check admin status from profiles table
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

-- Function to prevent non-admins from changing admin status
CREATE OR REPLACE FUNCTION public.prevent_admin_self_promotion()
RETURNS TRIGGER AS $$
BEGIN
    -- If the user is not an admin and trying to change is_admin or role
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true) THEN
        -- Prevent changing is_admin or role fields
        IF NEW.is_admin != OLD.is_admin OR NEW.role != OLD.role THEN
            RAISE EXCEPTION 'Only admins can change admin status or roles';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to prevent self-promotion to admin
CREATE TRIGGER prevent_admin_self_promotion_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_admin_self_promotion();

-- Insert initial admin user profile (replace with your admin user's UUID)
-- Bu satırı çalıştırmadan önce, admin kullanıcınızın UUID'sini öğrenmeniz gerekiyor
-- Supabase Dashboard > Authentication > Users'dan admin kullanıcınızın UUID'sini kopyalayın
-- INSERT INTO public.profiles (user_id, is_admin, role) 
-- VALUES ('YOUR_ADMIN_USER_UUID_HERE', true, 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET is_admin = true, role = 'admin';

-- Örnek: Eğer admin kullanıcınızın UUID'si biliyorsanız, aşağıdaki satırı uncomment edip UUID'yi değiştirin
-- INSERT INTO public.profiles (user_id, is_admin, role) 
-- VALUES ('12345678-1234-1234-1234-123456789012', true, 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET is_admin = true, role = 'admin';
