-- Örnek kuponlar ekle
INSERT INTO public.coupons (title, description, category, ore_points_required, stock_quantity, is_active, code, image_url) VALUES
('Steam 10 TL Hediye Kartı', 'Steam platformu için 10 TL değerinde hediye kartı', 'gift-cards', 1000, 50, true, 'STEAM10', '/steam-gift-card-display.png'),
('Valorant VP 1000', 'Valorant için 1000 VP (Valorant Points)', 'in-game-items', 800, 30, true, 'VAL1000', '/valorant-skin.png'),
('CS2 Skin Paketi', 'Counter-Strike 2 için özel skin paketi', 'in-game-items', 1500, 20, true, 'CS2SKIN', '/cs2-skin.png'),
('Discord Nitro 1 Ay', 'Discord Nitro 1 aylık abonelik', 'subscriptions', 600, 100, true, 'NITRO1', '/digital-gift-explosion.png'),
('Fortnite V-Bucks 1000', 'Fortnite için 1000 V-Bucks', 'in-game-items', 700, 75, true, 'FORT1000', '/fortnite-vbucks.png'),
('Gaming Kulaklık', 'Profesyonel gaming kulaklık', 'equipment', 2500, 10, true, 'HEADSET', '/limited-gaming-chair.png'),
('Minecraft Java Edition', 'Minecraft Java Edition oyun kodu', 'digital-games', 1200, 25, true, 'MCJAVA', '/early-access-game.png'),
('Twitch Prime 1 Ay', 'Twitch Prime 1 aylık abonelik', 'subscriptions', 500, 80, true, 'PRIME1', '/game-pass-card.png');
