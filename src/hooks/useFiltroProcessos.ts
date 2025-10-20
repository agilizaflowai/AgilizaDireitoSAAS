import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { FiltroProcesso } from '../types/database';

export { type FiltroProcesso };

export const useFiltroProcessos = () => {
  const [processos, setProcessos] = useState<FiltroProcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcessos();
  }, []);

  const fetchProcessos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('filtro_de_processos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Parse dos campos JSON que vêm como strings do banco
      const parsedData = (data || []).map(processo => ({
        ...processo,
        partes: typeof processo.partes === 'string' 
          ? JSON.parse(processo.partes) 
          : processo.partes || [],
        movimentacoes: typeof processo.movimentacoes === 'string' 
          ? JSON.parse(processo.movimentacoes) 
          : processo.movimentacoes || []
      }));

      console.log('Processos carregados:', parsedData);
      setProcessos(parsedData);
    } catch (err) {
      console.error('Erro ao buscar processos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const searchProcessos = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchProcessos();
        return;
      }

      const { data, error } = await supabase
        .from('filtro_de_processos')
        .select('*')
        .or(`numero_processo.ilike.%${searchTerm}%,classe.ilike.%${searchTerm}%,assunto.ilike.%${searchTerm}%,tribunal.ilike.%${searchTerm}%,comarca.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Parse dos campos JSON que vêm como strings do banco
      const parsedData = (data || []).map(processo => ({
        ...processo,
        partes: typeof processo.partes === 'string' 
          ? JSON.parse(processo.partes) 
          : processo.partes || [],
        movimentacoes: typeof processo.movimentacoes === 'string' 
          ? JSON.parse(processo.movimentacoes) 
          : processo.movimentacoes || []
      }));

      console.log('Processos encontrados:', parsedData);
      setProcessos(parsedData);
    } catch (err) {
      console.error('Erro ao buscar processos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const deleteProcesso = async (id: number) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('filtro_de_processos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Atualizar a lista local removendo o processo excluído
      setProcessos(prev => prev.filter(processo => processo.id !== id));
      
      console.log('Processo excluído com sucesso:', id);
      return true;
    } catch (err) {
      console.error('Erro ao excluir processo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir processo');
      return false;
    }
  };

  return {
    processos,
    loading,
    error,
    refetch: fetchProcessos,
    searchProcessos,
    deleteProcesso
  };
};

// Hook para buscar um processo específico por ID
export const useFiltroProcesso = (id: number) => {
  const [processo, setProcesso] = useState<FiltroProcesso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProcesso();
    }
  }, [id]);

  const fetchProcesso = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('filtro_de_processos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      // Parse dos campos JSON que vêm como strings do banco
      const parsedData = {
        ...data,
        partes: typeof data.partes === 'string' 
          ? JSON.parse(data.partes) 
          : data.partes || [],
        movimentacoes: typeof data.movimentacoes === 'string' 
          ? JSON.parse(data.movimentacoes) 
          : data.movimentacoes || []
      };

      setProcesso(parsedData);
    } catch (err) {
      console.error('Erro ao buscar processo:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return {
    processo,
    loading,
    error,
    refetch: fetchProcesso
  };
};