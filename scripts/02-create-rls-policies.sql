-- Enable Row Level Security for all relevant tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- USERS Table Policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
-- Users can update their own profile (dikkatli olunmalı, hangi alanları güncelleyebilecekleri kısıtlanmalı)
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id); -- Sadece belirli alanların güncellenmesine izin vermek için (USING (id = auth.uid()) AND (column_name = new.column_name)) gibi daha detaylı kontrol eklenebilir.
-- Authenticated users can insert their own record (auth callback tarafından kullanılır)
CREATE POLICY "Authenticated users can insert their own user record" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id AND auth.role() = 'authenticated');

-- PUBLISHERS Table Policies
-- All users can view active publishers
CREATE POLICY "All users can view active publishers" ON public.publishers
    FOR SELECT USING (is_active = true);
-- Admin users (service_role or specific admin role) can manage publishers
CREATE POLICY "Admins can manage publishers" ON public.publishers
    FOR ALL USING (auth.role() = 'service_role') -- VEYA özel bir admin rolü kontrolü (örn: get_my_claim('userrole') = 'admin')
    WITH CHECK (auth.role() = 'service_role');

-- COUPONS Table Policies
-- All users can view active coupons
CREATE POLICY "All users can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()) AND stock_quantity > 0);
-- Admin users (service_role or specific admin role) can manage coupons
CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL USING (auth.role() = 'service_role') -- VEYA özel bir admin rolü kontrolü
    WITH CHECK (auth.role() = 'service_role');

-- USER_ACTIVITIES Table Policies
-- Users can view their own activities
CREATE POLICY "Users can view their own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);
-- Users can insert their own activities (örn: client-side bir izleme logu için, ama puanlama server-side olmalı)
-- VEYA SADECE backend (service_role) üzerinden aktivite eklenebilir.
CREATE POLICY "Users can insert their own activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admin users (service_role or specific admin role) can view all activities (dikkatli olunmalı, veri gizliliği)
CREATE POLICY "Admins can view all user activities" ON public.user_activities
    FOR SELECT USING (auth.role() = 'service_role'); -- VEYA özel bir admin rolü kontrolü

-- ÖNEMLİ NOT: Admin yetkilendirmesi için `auth.role() = 'service_role'` kullanmak,
-- backend'den Supabase'e `service_role_key` ile yapılan isteklerde tam yetki anlamına gelir.
-- Eğer client tarafında (admin paneli) admin işlemleri yapılacaksa,
-- Supabase Auth kullanıcılarına özel bir 'admin' rolü atanmalı (custom claims ile)
-- ve RLS politikaları bu role göre (`get_my_claim('userrole') = 'admin'` gibi) düzenlenmelidir.
-- Ya da admin işlemleri sadece backend API rotaları üzerinden yapılmalı ve bu rotalar korunmalıdır.
