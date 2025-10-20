-- Script para criar usuário no Supabase Auth e conectar à tabela advogados
-- Execute este SQL no editor SQL do Supabase

-- 1. Primeiro, vamos verificar se a tabela advogados tem o campo user_id
-- Se não tiver, vamos adicionar
ALTER TABLE public.advogados 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_advogados_user_id ON public.advogados(user_id);

-- 3. Inserir usuário no auth.users (isso normalmente é feito via signup, mas podemos fazer manualmente)
-- IMPORTANTE: Substitua 'SENHA_HASH' pelo hash da senha real
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  '726e47eb-2d15-4067-b408-412251a8c958',
  '00000000-0000-0000-0000-000000000000',
  'thempreendedormilionario@gmail.com',
  '$2a$10$HASH_DA_SENHA_AQUI', -- Você precisa gerar o hash da senha
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 4. Inserir ou atualizar registro na tabela advogados
INSERT INTO public.advogados (
  user_id,
  nome,
  email,
  oab,
  uf,
  created_at,
  updated_at
) VALUES (
  '726e47eb-2d15-4067-b408-412251a8c958',
  'Advogado Teste',
  'thempreendedormilionario@gmail.com',
  '123456',
  'SP',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- 5. Verificar se foi criado corretamente
SELECT 
  a.id,
  a.user_id,
  a.nome,
  a.email,
  a.oab,
  a.uf,
  u.email as auth_email
FROM public.advogados a
LEFT JOIN auth.users u ON a.user_id = u.id
WHERE a.user_id = '726e47eb-2d15-4067-b408-412251a8c958';