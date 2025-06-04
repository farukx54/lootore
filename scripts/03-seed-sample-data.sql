-- Insert sample publishers
INSERT INTO public.publishers (name, platform, username, avatar, follower_count, is_active) VALUES
('GamerTurk', 'twitch', 'gamerturk', '/neon-city-stream.png', 15000, true),
('KickMaster', 'kick', 'kickmaster', '/intense-fps-action.png', 8500, true),
('ProPlayer', 'twitch', 'proplayer', '/epic-moba-battle.png', 25000, true),
('StreamKing', 'kick', 'streamking', '/intense-battle-royale.png', 12000, true),
('GameGuru', 'twitch', 'gameguru', '/modern-streaming-interface.png', 18500, true)
ON CONFLICT (platform, username) DO NOTHING;

-- Insert sample coupons
INSERT INTO public.coupons (title, description, image, category, ore_points_required, stock_quantity, is_active) VALUES
('Discord Nitro (1 Ay)', 'Discord Nitro 1 aylık üyelik', '/digital-gift-explosion.png', 'Sosyal Medya', 10000, 50, true),
('Steam Gift Card (50 TL)', 'Steam mağazasında kullanabileceğiniz 50 TL değerinde hediye kartı', '/steam-gift-card-display.png', 'Oyun', 15000, 30, true),
('Valorant VP (1000)', '1000 Valorant Point', '/valorant-skin.png', 'Oyun', 8000, 25, true),
('CS2 Skin Paketi', 'Counter-Strike 2 için özel skin paketi', '/cs2-skin.png', 'Oyun', 12000, 20, true),
('Fortnite V-Bucks (1000)', '1000 Fortnite V-Bucks', '/fortnite-vbucks.png', 'Oyun', 7500, 40, true),
('Xbox Game Pass (1 Ay)', 'Xbox Game Pass Ultimate 1 aylık üyelik', '/game-pass-card.png', 'Oyun', 9000, 35, true),
('Gaming Koltuğu', 'Profesyonel gaming koltuğu', '/limited-gaming-chair.png', 'Donanım', 50000, 5, true),
('Streamer Hoodie', 'LootOre özel tasarım hoodie', '/streamer-collab-hoodie.png', 'Giyim', 20000, 15, true)
ON CONFLICT DO NOTHING;

-- Insert sample categories (for reference)
-- Categories are stored as strings in coupons table: 'Oyun', 'Sosyal Medya', 'Donanım', 'Giyim'
