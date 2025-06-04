-- Enable Row Level Security for all relevant tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin status from user_metadata
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true;
$$;

-- USERS Table Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated users can insert their own user record" ON public.users;
CREATE POLICY "Authenticated users can insert their own user record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id AND auth.role() = 'authenticated');

-- PUBLISHERS Table Policies
DROP POLICY IF EXISTS "All users can view active publishers" ON public.publishers;
CREATE POLICY "All users can view active publishers" ON public.publishers
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage publishers" ON public.publishers;
CREATE POLICY "Admins can manage publishers" ON public.publishers
  FOR ALL -- Covers INSERT, UPDATE, DELETE, SELECT (admin can see all, active or not)
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- COUPONS Table Policies
DROP POLICY IF EXISTS "All users can view active coupons" ON public.coupons;
CREATE POLICY "All users can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()) AND stock_quantity > 0);

DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL -- Covers INSERT, UPDATE, DELETE, SELECT (admin can see all, active or not)
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- USER_ACTIVITIES Table Policies
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
CREATE POLICY "Users can view their own activities" ON public.user_activities
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;
CREATE POLICY "Users can insert their own activities" ON public.user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all user activities" ON public.user_activities;
CREATE POLICY "Admins can view all user activities" ON public.user_activities
  FOR SELECT USING (public.is_admin_user()); -- Changed from service_role to is_admin_user for consistency if admin panel needs this

-- CATEGORIES Table Policies
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories" ON public.categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ÖNEMLİ NOT:
-- `public.is_admin_user()` fonksiyonu ve `user_metadata` kullanımı,
-- client-side admin paneli için daha güvenli bir RLS yönetimi sağlar.
-- Bu fonksiyon `SECURITY DEFINER` olarak tanımlanmalıdır ki, fonksiyonun içindeki
-- `auth.jwt()` çağrısı, fonksiyonu çağıran kullanıcının değil, fonksiyon sahibinin (genellikle postgres süper kullanıcısı)
-- yetkileriyle çalışsın ve JWT'ye erişebilsin. Ancak, `auth.jwt()` çağrısı zaten çağıran kullanıcının JWT'sini döndürür.
-- `SECURITY DEFINER` burada JWT'ye erişim için değil, potansiyel olarak fonksiyonun içindeki diğer tablolara erişim yetkilerini
-- genişletmek için kullanılır, bu senaryoda doğrudan JWT okuduğumuz için `SECURITY INVOKER` (varsayılan) da yeterli olabilir.
-- Ancak `auth.jwt()` gibi fonksiyonlar genellikle `SECURITY INVOKER` ile daha iyi çalışır.
-- Test edip `SECURITY INVOKER` olarak değiştirebiliriz veya `DEFINER` ile bırakabiliriz.
-- Şimdilik `DEFINER` ile bırakalım, sorun olursa `INVOKER`'a çeviririz.
-- Daha basit bir yol: `((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true)` doğrudan politika içinde kullanılabilir.
-- Fonksiyonu kaldırıp doğrudan politika içine gömmek daha temiz olabilir.

-- Fonksiyonu kaldırıp doğrudan politika içine gömülmüş hali:
-- (Yukarıdaki fonksiyon tanımını ve politikalardaki public.is_admin_user() çağrılarını silip bunları kullanın)
/*
-- PUBLISHERS Table Policies
DROP POLICY IF EXISTS "Admins can manage publishers" ON public.publishers;
CREATE POLICY "Admins can manage publishers" ON public.publishers
  FOR ALL
  USING (((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true))
  WITH CHECK (((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true));

-- COUPONS Table Policies
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL
  USING (((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true))
  WITH CHECK (((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true));

-- CATEGORIES Table Policies
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL
  USING (((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true))
  WITH CHECK (((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true));

-- USER_ACTIVITIES Table Policies
DROP POLICY IF EXISTS "Admins can view all user activities" ON public.user_activities;
CREATE POLICY "Admins can view all user activities" ON public.user_activities
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true));
*/
-- Şimdilik fonksiyonlu yapıyı koruyalım, daha okunabilir.
