-- Script para corrigir RLS (Row Level Security) do Supabase Storage
-- Execute este script no SQL Editor do Supabase

-- 1. Criar o bucket peticoes_geradas se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'peticoes_geradas',
  'peticoes_geradas', 
  false,
  10485760, -- 10MB
  ARRAY['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar política para permitir inserção de arquivos no bucket peticoes_geradas
CREATE POLICY "Permitir upload de petições" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'peticoes_geradas'
  );

-- 3. Criar política para permitir leitura de arquivos no bucket peticoes_geradas
CREATE POLICY "Permitir leitura de petições" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'peticoes_geradas'
  );

-- 4. Criar política para permitir atualização de arquivos no bucket peticoes_geradas
CREATE POLICY "Permitir atualização de petições" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'peticoes_geradas'
  );

-- 5. Criar política para permitir exclusão de arquivos no bucket peticoes_geradas
CREATE POLICY "Permitir exclusão de petições" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'peticoes_geradas'
  );

-- 6. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 7. Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'peticoes_geradas';