export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          whatsapp: string;
          nome: string;
          assunto: string;
          created_at: string;
          pausar_ia: boolean;
          classificacao: string;
          area_direito: string;
          probabilidade_conversao: string;
          tipo_cliente: string;
        };
        Insert: {
          whatsapp: string;
          nome: string;
          assunto: string;
          created_at?: string;
          pausar_ia?: boolean;
          classificacao: string;
          area_direito: string;
          probabilidade_conversao: string;
          tipo_cliente: string;
        };
        Update: {
          whatsapp?: string;
          nome?: string;
          assunto?: string;
          created_at?: string;
          pausar_ia?: boolean;
          classificacao?: string;
          area_direito?: string;
          probabilidade_conversao?: string;
          tipo_cliente?: string;
        };
      };
      contratos: {
        Row: {
          analise_contrato: string | null;
          classificacao: string | null;
          clausulas_risco: Json | null;
          conformidade_legal: Json | null;
          conformidades_ok: number | null;
          data_analise: string | null;
          id: number;
          melhorias_sugeridas: number | null;
          nome_contrato: string;
          riscos_identificados: number | null;
          score_total: number | null;
          sugestoes_melhoria: Json | null;
        };
        Insert: {
          analise_contrato?: string | null;
          classificacao?: string | null;
          clausulas_risco?: Json | null;
          conformidade_legal?: Json | null;
          conformidades_ok?: number | null;
          data_analise?: string | null;
          id?: number;
          melhorias_sugeridas?: number | null;
          nome_contrato: string;
          riscos_identificados?: number | null;
          score_total?: number | null;
          sugestoes_melhoria?: Json | null;
        };
        Update: {
          analise_contrato?: string | null;
          classificacao?: string | null;
          clausulas_risco?: Json | null;
          conformidade_legal?: Json | null;
          conformidades_ok?: number | null;
          data_analise?: string | null;
          id?: number;
          melhorias_sugeridas?: number | null;
          nome_contrato?: string;
          riscos_identificados?: number | null;
          score_total?: number | null;
          sugestoes_melhoria?: Json | null;
        };
      };
      processos_juridicos: {
        Row: {
          id: number;
          numero_cnj: string;
          numero_processo: string;
          tribunal: string;
          vara: string;
          classe_judicial: string;
          assunto: string;
          data_distribuicao: string;
          data_ultima_movimentacao: string | null;
          situacao: string;
          valor_causa: number | null;
          partes_ativas: Json;
          partes_passivas: Json;
          advogados: Json | null;
          movimentacoes: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          numero_cnj: string;
          numero_processo: string;
          tribunal: string;
          vara: string;
          classe_judicial: string;
          assunto: string;
          data_distribuicao: string;
          data_ultima_movimentacao?: string | null;
          situacao: string;
          valor_causa?: number | null;
          partes_ativas: Json;
          partes_passivas: Json;
          advogados?: Json | null;
          movimentacoes?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          numero_cnj?: string;
          numero_processo?: string;
          tribunal?: string;
          vara?: string;
          classe_judicial?: string;
          assunto?: string;
          data_distribuicao?: string;
          data_ultima_movimentacao?: string | null;
          situacao?: string;
          valor_causa?: number | null;
          partes_ativas?: Json;
          partes_passivas?: Json;
          advogados?: Json | null;
          movimentacoes?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      filtro_de_processos: {
        Row: {
          id: number;
          created_at: string;
          numero_processo: string;
          classe: string | null;
          assunto: string | null;
          area_direito: string | null;
          tribunal: string | null;
          comarca: string | null;
          estado: string | null;
          situacao: string | null;
          segredo: string | null;
          arquivado: string | null;
          movimentacoes: string | number | null;
          data_inicio: string | null;
          ultima_movimentacao: string | null;
          tempo_tramitacao: string | null;
          partes: Json | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          numero_processo: string;
          numero_cnj?: string | null;
          classe?: string | null;
          assunto?: string | null;
          area_direito?: string | null;
          tribunal?: string | null;
          comarca?: string | null;
          estado?: string | null;
          situacao?: string | null;
          segredo?: boolean | null;
          arquivado?: boolean | null;
          movimentacoes?: Json | null;
          data_inicio?: string | null;
          ultima_movimentacao?: string | null;
          tempo_tramitacao?: number | null;
          partes?: Json | null;
          advogados?: Json | null;
          valor_causa?: number | null;
          prioridade?: string | null;
          observacoes?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          updated_at?: string;
          numero_processo?: string;
          numero_cnj?: string | null;
          classe?: string | null;
          assunto?: string | null;
          area_direito?: string | null;
          tribunal?: string | null;
          comarca?: string | null;
          estado?: string | null;
          situacao?: string | null;
          segredo?: boolean | null;
          arquivado?: boolean | null;
          movimentacoes?: Json | null;
          data_inicio?: string | null;
          ultima_movimentacao?: string | null;
          tempo_tramitacao?: number | null;
          partes?: Json | null;
          advogados?: Json | null;
          valor_causa?: number | null;
          prioridade?: string | null;
          observacoes?: string | null;
        };
      };
    };
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Contract = Database['public']['Tables']['contratos']['Row'];
export type ProcessoJuridico = Database['public']['Tables']['processos_juridicos']['Row'];
export type FiltroProcesso = Database['public']['Tables']['filtro_de_processos']['Row'];