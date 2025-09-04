-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  telefone TEXT,
  data_nascimento DATE,
  endereco JSONB,
  foto_perfil TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create pets table
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL CHECK (especie IN ('cão', 'gato', 'outro')),
  raca TEXT,
  idade INTEGER,
  peso DECIMAL,
  sexo TEXT CHECK (sexo IN ('macho', 'fêmea')),
  cor TEXT,
  observacoes TEXT,
  foto TEXT,
  vacinacao_em_dia BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pets
CREATE POLICY "Users can view their own pets" 
ON public.pets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own pets" 
ON public.pets 
FOR ALL 
USING (auth.uid() = user_id);

-- Create establishments table
CREATE TABLE public.establishments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT,
  telefone TEXT,
  endereco JSONB,
  descricao TEXT,
  horario_funcionamento JSONB,
  avaliacao_media DECIMAL DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0,
  fotos JSONB,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on establishments (public read)
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for establishments (public read)
CREATE POLICY "Establishments are publicly viewable" 
ON public.establishments 
FOR SELECT 
USING (status = 'ativo');

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL NOT NULL,
  duracao INTEGER NOT NULL, -- em minutos
  categoria TEXT NOT NULL CHECK (categoria IN ('banho', 'tosa', 'veterinario', 'vacinacao')),
  especies_atendidas JSONB, -- array de espécies
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for services (public read)
CREATE POLICY "Services are publicly viewable" 
ON public.services 
FOR SELECT 
USING (status = 'ativo');

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  data_agendamento DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')),
  observacoes TEXT,
  preco_final DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own appointments" 
ON public.appointments 
FOR ALL 
USING (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews
CREATE POLICY "Users can view all reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for their appointments" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_establishments_updated_at
  BEFORE UPDATE ON public.establishments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, cpf)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'nome', ''),
    COALESCE(new.raw_user_meta_data->>'cpf', '')
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert mock data for establishments
INSERT INTO public.establishments (nome, email, telefone, endereco, descricao, avaliacao_media, total_avaliacoes, fotos) VALUES
('Pet Care Premium', 'contato@petcarepremium.com', '(11) 99999-0001', 
 '{"rua": "Rua das Flores, 123", "bairro": "Centro", "cidade": "São Paulo", "cep": "01000-000"}',
 'Centro veterinário completo com banho, tosa e consultas especializadas', 4.8, 127,
 '["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop"]'),

('Clínica Veterinária Amigo Fiel', 'contato@amigofiel.com', '(11) 99999-0002',
 '{"rua": "Av. Principal, 456", "bairro": "Vila Nova", "cidade": "São Paulo", "cep": "02000-000"}', 
 'Clínica veterinária com atendimento 24h e emergência', 4.6, 89,
 '["https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=200&fit=crop"]'),

('Banho & Tosa Felicidade', 'contato@felicidade.com', '(11) 99999-0003',
 '{"rua": "Rua do Comércio, 789", "bairro": "Jardins", "cidade": "São Paulo", "cep": "03000-000"}',
 'Especialistas em estética animal com produtos premium', 4.9, 203,
 '["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=200&fit=crop"]'),

('Pet Shop Carinho Animal', 'contato@carinhoanimal.com', '(11) 99999-0004',
 '{"rua": "Praça da Liberdade, 321", "bairro": "Centro", "cidade": "São Paulo", "cep": "04000-000"}',
 'Pet shop completo com produtos e serviços de qualidade', 4.7, 156,
 '["https://images.unsplash.com/photo-1594736797933-d0804ba79552?w=400&h=200&fit=crop"]');

-- Insert mock services
INSERT INTO public.services (establishment_id, nome, descricao, preco, duracao, categoria, especies_atendidas) VALUES
((SELECT id FROM public.establishments WHERE nome = 'Pet Care Premium'), 'Banho e Tosa Completa', 'Banho com shampoo especial, secagem e tosa higiênica', 45.00, 90, 'banho', '["cão", "gato"]'),
((SELECT id FROM public.establishments WHERE nome = 'Pet Care Premium'), 'Consulta Veterinária', 'Consulta completa com exame clínico e orientações', 120.00, 45, 'veterinario', '["cão", "gato", "outro"]'),
((SELECT id FROM public.establishments WHERE nome = 'Clínica Veterinária Amigo Fiel'), 'Vacinação V8', 'Aplicação de vacina V8 com acompanhamento veterinário', 80.00, 30, 'vacinacao', '["cão"]'),
((SELECT id FROM public.establishments WHERE nome = 'Banho & Tosa Felicidade'), 'Tosa Higiênica', 'Tosa especializada com corte de unhas', 35.00, 60, 'tosa', '["cão", "gato"]');