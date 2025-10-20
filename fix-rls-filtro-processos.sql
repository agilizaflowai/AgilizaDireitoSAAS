-- Script para corrigir o acesso à tabela filtro_de_processos
-- Problema: RLS (Row Level Security) está bloqueando o acesso aos dados

-- Opção 1: Desabilitar RLS completamente (mais simples para desenvolvimento)
ALTER TABLE filtro_de_processos DISABLE ROW LEVEL SECURITY;

-- Opção 2: Manter RLS mas criar política que permite acesso total (mais seguro)
-- ALTER TABLE filtro_de_processos ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Permitir acesso total para usuários autenticados" ON filtro_de_processos
--   FOR ALL USING (true);
-- 
-- -- Ou para permitir acesso público (sem autenticação)
-- CREATE POLICY "Permitir acesso público" ON filtro_de_processos
--   FOR ALL USING (true);

-- Verificar se a política foi aplicada
-- SELECT * FROM filtro_de_processos LIMIT 5;