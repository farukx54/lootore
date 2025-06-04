-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar TEXT,
    email TEXT UNIQUE,
    provider TEXT,
    provider_username TEXT,
    provider_user_id TEXT,
    ore_points INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create publishers table
CREATE TABLE IF NOT EXISTS public.publishers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'twitch', 'kick'
    channel_url TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL, -- Platformdaki kullanıcı adı
    avatar_url TEXT,
    description TEXT,
    category TEXT, -- Oyun kategorisi vb.
    follower_count INTEGER DEFAULT 0,
    points_per_minute INTEGER DEFAULT 1, -- Admin tarafından ayarlanacak, izleme başına puan için
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    code TEXT UNIQUE, -- Otomatik veya manuel
    ore_points_required INTEGER NOT NULL,
    category TEXT,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0, -- 0: sınırsız veya stokta yok
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'watch_stream', 'referral_bonus', 'coupon_redeem', 'admin_grant'
    points_earned INTEGER DEFAULT 0,
    description TEXT,
    related_entity_id UUID, -- Örn: publisher_id, coupon_id
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_provider_user_id ON public.users(provider_user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_publishers_platform_username ON public.publishers(platform, username);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_coupons_category ON public.coupons(category);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publishers_updated_at BEFORE UPDATE ON public.publishers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User Subscriptions to Publishers (MVP sonrası için)
-- CREATE TABLE IF NOT EXISTS public.user_publisher_subscriptions (
--     user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
--     publisher_id UUID REFERENCES public.publishers(id) ON DELETE CASCADE,
--     subscribed_at TIMESTAMPTZ DEFAULT NOW(),
--     PRIMARY KEY (user_id, publisher_id)
-- );

-- User Redeemed Coupons (MVP sonrası için daha detaylı loglama)
-- CREATE TABLE IF NOT EXISTS public.user_redeemed_coupons (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
--     coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
--     redeemed_at TIMESTAMPTZ DEFAULT NOW(),
--     points_spent INTEGER
-- );

-- Admin Users Table (Eğer Supabase Auth'dan ayrı bir admin yönetimi olacaksa)
-- CREATE TABLE IF NOT EXISTS public.admin_users (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase auth user'ına bağlanır
--   role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin'
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- Comment: Supabase Auth içindeki kullanıcıları admin olarak işaretlemek için user_metadata kullanılabilir.
-- Veya RLS'de `auth.uid()` ile belirli admin UUID'leri kontrol edilebilir.
-- Ayrı bir admin_users tablosu, adminlere özel ek bilgiler (örn: departman) tutulacaksa mantıklı olabilir.
-- MVP için, Supabase Auth kullanıcılarından belirli UUID'leri admin olarak kabul etmek daha basit olabilir.
