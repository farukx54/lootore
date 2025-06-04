-- Test kuponları ekle
INSERT INTO public.coupons (title, description, category, ore_points_required, stock_quantity, image_url, code, expires_at) VALUES
('Steam 50 TL Hediye Kartı', 'Steam platformu için 50 TL değerinde hediye kartı', 'gift-cards', 5000, 10, '/steam-gift-card-display.png', 'STEAM50TL', '2024-12-31 23:59:59+00'),
('Valorant VP 1000', 'Valorant için 1000 VP (Valorant Points)', 'in-game-items', 3000, 15, '/valorant-skin.png', 'VAL1000VP', '2024-12-31 23:59:59+00'),
('CS2 AK-47 Skin', 'Counter-Strike 2 için özel AK-47 skin', 'in-game-items', 7500, 5, '/cs2-skin.png', 'CS2AK47', '2024-12-31 23:59:59+00'),
('Gaming Koltuğu', 'Profesyonel gaming koltuğu', 'equipment', 25000, 2, '/limited-gaming-chair.png', 'GAMCHAIR', '2024-12-31 23:59:59+00'),
('Fortnite V-Bucks 1000', 'Fortnite için 1000 V-Bucks', 'in-game-items', 2500, 20, '/fortnite-vbucks.png', 'FN1000VB', '2024-12-31 23:59:59+00');

-- Test yayıncıları ekle
INSERT INTO public.publishers (name, platform, username, avatar_url, follower_count, channel_url, description, category, points_per_minute) VALUES
('GameMaster Pro', 'twitch', 'gamemaster_pro', '/placeholder.svg?width=400&height=400', 125000, 'https://twitch.tv/gamemaster_pro', 'Profesyonel FPS oyuncusu ve eğitmen', 'FPS', 2),
('StreamQueen', 'twitch', 'streamqueen', '/placeholder.svg?width=400&height=400', 89000, 'https://twitch.tv/streamqueen', 'Variety streamer ve gaming content creator', 'Variety', 1),
('ProGamer TR', 'kick', 'progamer_tr', '/placeholder.svg?width=400&height=400', 67000, 'https://kick.com/progamer_tr', 'Türk gaming topluluğu lideri', 'MOBA', 2),
('TechReviewer', 'twitch', 'techreviewer', '/placeholder.svg?width=400&height=400', 45000, 'https://twitch.tv/techreviewer', 'Gaming ekipmanları ve teknoloji incelemeleri', 'Tech', 1),
('SpeedRunner', 'kick', 'speedrunner', '/placeholder.svg?width=400&height=400', 32000, 'https://kick.com/speedrunner', 'Speedrun dünya rekortmeni', 'Speedrun', 3);

-- Kullanıcılara test puanları ekle (eğer kullanıcı varsa)
UPDATE public.users SET ore_points = 10000 WHERE ore_points < 1000;
