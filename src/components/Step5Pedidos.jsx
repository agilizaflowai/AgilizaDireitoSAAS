import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step5Pedidos({ data, updateForm, nextStep, prevStep }) {
  const [isLoading, setIsLoading] = useState(false);
  const [pedidos, setPedidos] = useState(data.pedidos || '');

  // Função para buscar dados da última linha gerada da tabela documentos_ia
  const fetchPedidos = async () => {
    try {
      console.log('🔍 Buscando dados dos pedidos da última linha gerada...');
      
      // Busca a linha mais recente da tabela documentos_ia com dos_pedidos não nulo
      const { data: documentosIA, error } = await supabase
        .from('documentos_ia')
        .select('dos_pedidos')
        .not('dos_pedidos', 'is', null)
        .neq('dos_pedidos', '')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Erro ao buscar dados dos pedidos:', error);
        return null;
      }

      if (documentosIA && documentosIA.length > 0 && documentosIA[0].dos_pedidos) {
        console.log('✅ Dados dos pedidos encontrados:', documentosIA[0].dos_pedidos);
        return documentosIA[0].dos_pedidos;
      }

      console.log('⚠️ Nenhum dado dos pedidos encontrado');
      return null;
    } catch (error) {
      console.error('💥 Erro ao buscar dados dos pedidos:', error);
      return null;
    }
  };

  // Carregar dados dos pedidos ao montar o componente - REMOVIDO PARA NÃO PRÉ-PREENCHER
  // useEffect(() => {
  //   const loadPedidos = async () => {
  //     if (!data.pedidos) {
  //       setIsLoading(true);
  //       const dadosPedidos = await fetchPedidos();
  //       if (dadosPedidos) {
  //         setPedidos(dadosPedidos);
  //         updateForm({ pedidos: dadosPedidos });
  //       }
  //       setIsLoading(false);
  //     }
  //   };

  //   loadPedidos();
  // }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setPedidos(value);
    updateForm({ pedidos: value });
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
          <p className="text-gray-600">Carregando dados dos pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedidos</h2>
        <p className="text-gray-600">Descreva os pedidos que devem ser formulados na ação judicial.</p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        <div>
          <label htmlFor="pedidos" className="block text-sm font-medium text-gray-700 mb-2">
            DOS PEDIDOS *
          </label>
          <textarea
            id="pedidos"
            name="pedidos"
            value={pedidos}
            onChange={handleChange}
            placeholder="Descreva os pedidos que devem ser formulados na ação judicial..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-400 transition-colors duration-200 resize-none"
            rows={15}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {pedidos.length} de 5000 caracteres permitidos.
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