import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Contract } from '../types/database';

export { type Contract };

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('data_analise', { ascending: false });

      if (error) {
        throw error;
      }

      // Parse dos campos JSON que vêm como strings do banco
      const parsedData = (data || []).map(contract => ({
        ...contract,
        riscos_identificados: typeof contract.riscos_identificados === 'string' 
          ? JSON.parse(contract.riscos_identificados) 
          : contract.riscos_identificados || [],
        melhorias_sugeridas: typeof contract.melhorias_sugeridas === 'string' 
          ? JSON.parse(contract.melhorias_sugeridas) 
          : contract.melhorias_sugeridas || [],
        conformidades_ok: typeof contract.conformidades_ok === 'string' 
          ? JSON.parse(contract.conformidades_ok) 
          : contract.conformidades_ok || [],
        clausulas_risco: typeof contract.clausulas_risco === 'string' 
          ? JSON.parse(contract.clausulas_risco) 
          : contract.clausulas_risco || [],
        sugestoes_melhoria: typeof contract.sugestoes_melhoria === 'string' 
          ? JSON.parse(contract.sugestoes_melhoria) 
          : contract.sugestoes_melhoria || [],
        conformidade_legal: typeof contract.conformidade_legal === 'string' 
          ? JSON.parse(contract.conformidade_legal) 
          : contract.conformidade_legal || []
      }));

      setContracts(parsedData);
    } catch (err) {
      console.error('Erro ao buscar contratos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const deleteContract = async (contractId: string) => {
    try {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', contractId);

      if (error) {
        throw error;
      }

      // Atualizar a lista local removendo o contrato excluído
      setContracts(prev => prev.filter(contract => contract.id !== contractId));
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao excluir contrato:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  };

  return { contracts, loading, error, refetch: fetchContracts, deleteContract };
};

export const useContract = (id: string) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchContract(id);
    }
  }, [id]);

  const fetchContract = async (contractId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .eq('id', contractId)
        .single();

      if (error) {
        throw error;
      }

      setContract(data);
    } catch (err) {
      console.error('Erro ao buscar contrato:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return { contract, loading, error, refetch: () => fetchContract(id) };
};