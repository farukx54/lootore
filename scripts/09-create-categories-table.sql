-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.categories (
    id bigint primary key generated always as identity,
    name varchar(255) not null unique,
    description text,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);

-- Insert some default categories
INSERT INTO public.categories (name, description) VALUES 
    ('Oyun', 'Oyun kategorisi'),
    ('Teknoloji', 'Teknoloji ürünleri'),
    ('Hediye Kartı', 'Çeşitli hediye kartları')
ON CONFLICT (name) DO NOTHING;
