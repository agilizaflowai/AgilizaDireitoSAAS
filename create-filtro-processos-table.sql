-- Criação da tabela filtro_de_processos
-- Execute este SQL no editor SQL do Supabase

CREATE TABLE IF NOT EXISTS public.filtro_de_processos (
    -- Campos básicos
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Número do processo
    numero_processo TEXT NOT NULL,
    numero_cnj TEXT,
    
    -- Classificação
    classe TEXT,
    assunto TEXT,
    area_direito TEXT,
    
    -- Localização
    tribunal TEXT,
    comarca TEXT,
    estado TEXT,
    
    -- Status
    situacao TEXT,
    segredo BOOLEAN DEFAULT false,
    arquivado BOOLEAN DEFAULT false,
    movimentacoes JSONB,
    
    -- Datas principais
    data_inicio DATE,
    ultima_movimentacao TIMESTAMP WITH TIME ZONE,
    tempo_tramitacao INTEGER, -- em dias
    
    -- Partes e advogados
    partes JSONB,
    advogados JSONB,
    
    -- Campos adicionais para filtros
    valor_causa DECIMAL(15,2),
    prioridade TEXT DEFAULT 'normal',
    observacoes TEXT
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_filtro_processos_numero_processo ON public.filtro_de_processos(numero_processo);
CREATE INDEX IF NOT EXISTS idx_filtro_processos_numero_cnj ON public.filtro_de_processos(numero_cnj);
CREATE INDEX IF NOT EXISTS idx_filtro_processos_tribunal ON public.filtro_de_processos(tribunal);
CREATE INDEX IF NOT EXISTS idx_filtro_processos_situacao ON public.filtro_de_processos(situacao);
CREATE INDEX IF NOT EXISTS idx_filtro_processos_area_direito ON public.filtro_de_processos(area_direito);
CREATE INDEX IF NOT EXISTS idx_filtro_processos_created_at ON public.filtro_de_processos(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_filtro_processos_updated_at 
    BEFORE UPDATE ON public.filtro_de_processos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.filtro_de_processos ENABLE ROW LEVEL SECURITY;

-- Política básica para permitir todas as operações (ajuste conforme necessário)
CREATE POLICY "Enable all operations for authenticated users" ON public.filtro_de_processos
    FOR ALL USING (auth.role() = 'authenticated');

-- Comentários para documentação
COMMENT ON TABLE public.filtro_de_processos IS 'Tabela para armazenar dados filtrados de processos jurídicos';
COMMENT ON COLUMN public.filtro_de_processos.numero_processo IS 'Número do processo no formato do tribunal';
COMMENT ON COLUMN public.filtro_de_processos.numero_cnj IS 'Número CNJ padronizado do processo';
COMMENT ON COLUMN public.filtro_de_processos.tempo_tramitacao IS 'Tempo de tramitação em dias';
COMMENT ON COLUMN public.filtro_de_processos.partes IS 'JSON com informações das partes do processo';
COMMENT ON COLUMN public.filtro_de_processos.advogados IS 'JSON com informações dos advogados';
COMMENT ON COLUMN public.filtro_de_processos.movimentacoes IS 'JSON com histórico de movimentações';