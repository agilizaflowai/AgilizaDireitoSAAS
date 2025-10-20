import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step4FundamentosJuridicos({ data, updateForm, nextStep, prevStep }) {
  const [isLoading, setIsLoading] = useState(false);
  const [fundamentosJuridicos, setFundamentosJuridicos] = useState(data.fundamentosJuridicos || '');

  // Função para buscar dados da última linha gerada da tabela documentos_ia
  const fetchFundamentosJuridicos = async () => {
    try {
      console.log('🔍 Buscando dados dos fundamentos jurídicos da última linha gerada...');
      
      // Busca a linha mais recente da tabela documentos_ia com dos_fundamentos_juridicos não nulo
      const { data: documentosIA, error } = await supabase
        .from('documentos_ia')
        .select('dos_fundamentos_juridicos')
        .not('dos_fundamentos_juridicos', 'is', null)
        .neq('dos_fundamentos_juridicos', '')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Erro ao buscar dados dos fundamentos jurídicos:', error);
        return null;
      }

      if (documentosIA && documentosIA.length > 0 && documentosIA[0].dos_fundamentos_juridicos) {
        console.log('✅ Dados dos fundamentos jurídicos encontrados:', documentosIA[0].dos_fundamentos_juridicos);
        return documentosIA[0].dos_fundamentos_juridicos;
      }

      console.log('⚠️ Nenhum dado dos fundamentos jurídicos encontrado');
      return null;
    } catch (error) {
      console.error('💥 Erro ao buscar dados dos fundamentos jurídicos:', error);
      return null;
    }
  };

  // Carregar dados dos fundamentos jurídicos ao montar o componente
  useEffect(() => {
    const loadFundamentosJuridicos = async () => {
      if (!data.fundamentosJuridicos) {
        setIsLoading(true);
        const dadosFundamentosJuridicos = await fetchFundamentosJuridicos();
        if (dadosFundamentosJuridicos) {
          setFundamentosJuridicos(dadosFundamentosJuridicos);
          updateForm({ fundamentosJuridicos: dadosFundamentosJuridicos });
        }
        setIsLoading(false);
      }
    };

    loadFundamentosJuridicos();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setFundamentosJuridicos(value);
    updateForm({ fundamentosJuridicos: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados dos fundamentos jurídicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Fundamentos Jurídicos</h2>
        <p className="text-slate-700 dark:text-gray-300">Descreva os fundamentos jurídicos que embasam a ação judicial.</p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        <div>
          <label htmlFor="fundamentosJuridicos" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            DOS FUNDAMENTOS JURÍDICOS *
          </label>
          <textarea
            id="fundamentosJuridicos"
            name="fundamentosJuridicos"
            value={fundamentosJuridicos}
            onChange={handleChange}
            placeholder="Descreva os fundamentos jurídicos que embasam a ação judicial..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors duration-200 resize-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            rows={15}
            required
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {fundamentosJuridicos.length} de 5000 caracteres permitidos.
          </p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="btn-secondary"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Próximo
          </button>
        </div>
      </form>
    </div>
  );
}