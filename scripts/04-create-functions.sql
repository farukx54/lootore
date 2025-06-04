-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 8 character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = code) INTO exists;
        
        -- If code doesn't exist, return it
        IF NOT exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate referral code for new user
    NEW.referral_code := generate_referral_code();
    
    -- Set initial ore points
    NEW.ore_points := 1000; -- Welcome bonus
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user registration
CREATE TRIGGER on_user_created
    BEFORE INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to add ore points
CREATE OR REPLACE FUNCTION add_ore_points(
    user_id_param UUID,
    points INTEGER,
    activity_type_param TEXT,
    description_param TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Update user's ore points
    UPDATE public.users 
    SET ore_points = ore_points + points,
        updated_at = NOW()
    WHERE id = user_id_param;
    
    -- Insert activity record
    INSERT INTO public.user_activities (user_id, activity_type, points_earned, description)
    VALUES (user_id_param, activity_type_param, points, description_param);
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to redeem coupon
CREATE OR REPLACE FUNCTION redeem_coupon(
    user_id_param UUID,
    coupon_id_param UUID
)
RETURNS JSON AS $$
DECLARE
    user_points INTEGER;
    coupon_cost INTEGER;
    coupon_stock INTEGER;
    coupon_title TEXT;
    result JSON;
BEGIN
    -- Get user's current points
    SELECT ore_points INTO user_points FROM public.users WHERE id = user_id_param;
    
    -- Get coupon details
    SELECT ore_points_required, stock_quantity, title 
    INTO coupon_cost, coupon_stock, coupon_title
    FROM public.coupons 
    WHERE id = coupon_id_param AND is_active = true;
    
    -- Check if coupon exists
    IF coupon_cost IS NULL THEN
        result := json_build_object('success', false, 'error', 'Kupon bulunamadı');
        RETURN result;
    END IF;
    
    -- Check if user has enough points
    IF user_points < coupon_cost THEN
        result := json_build_object('success', false, 'error', 'Yetersiz Ore Points');
        RETURN result;
    END IF;
    
    -- Check if coupon is in stock
    IF coupon_stock <= 0 THEN
        result := json_build_object('success', false, 'error', 'Kupon stokta yok');
        RETURN result;
    END IF;
    
    -- Deduct points from user
    UPDATE public.users 
    SET ore_points = ore_points - coupon_cost,
        updated_at = NOW()
    WHERE id = user_id_param;
    
    -- Decrease coupon stock
    UPDATE public.coupons 
    SET stock_quantity = stock_quantity - 1,
        updated_at = NOW()
    WHERE id = coupon_id_param;
    
    -- Add activity record
    INSERT INTO public.user_activities (user_id, activity_type, points_earned, description)
    VALUES (user_id_param, 'coupon_redeem', -coupon_cost, 'Kupon kullanıldı: ' || coupon_title);
    
    result := json_build_object('success', true, 'message', 'Kupon başarıyla kullanıldı');
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object('success', false, 'error', 'Bir hata oluştu');
        RETURN result;
END;
$$ LANGUAGE plpgsql;
