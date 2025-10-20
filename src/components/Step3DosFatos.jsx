import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step3DosFatos({ data, updateForm, nextStep, prevStep }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dosFatos, setDosFatos] = useState(data.dosFatos || '');

  // Função para buscar dados da última linha gerada da tabela documentos_ia
  const fetchDosFatos = async () => {
    try {
      console.log('🔍 Buscando dados dos fatos da última linha gerada...');
      
      // Busca a linha mais recente da tabela documentos_ia com dos_fatos não nulo
      const { data: documentosIA, error } = await supabase
        .from('documentos_ia')
        .select('dos_fatos')
        .not('dos_fatos', 'is', null)
        .neq('dos_fatos', '')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Erro ao buscar dados dos fatos:', error);
        return null;
      }

      if (documentosIA && documentosIA.length > 0 && documentosIA[0].dos_fatos) {
        console.log('✅ Dados dos fatos encontrados:', documentosIA[0].dos_fatos);
        return documentosIA[0].dos_fatos;
      }

      console.log('⚠️ Nenhum dado dos fatos encontrado');
      return null;
    } catch (error) {
      console.error('💥 Erro ao buscar dados dos fatos:', error);
      return null;
    }
  };

  // Carregar dados dos fatos ao montar o componente
  useEffect(() => {
    const loadDosFatos = async () => {
      if (!data.dosFatos) {
        setIsLoading(true);
        const dadosDosFatos = await fetchDosFatos();
        if (dadosDosFatos) {
          setDosFatos(dadosDosFatos);
          updateForm({ dosFatos: dadosDosFatos });
        }
        setIsLoading(false);
      }
    };

    loadDosFatos();
  }, []);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const value = e.target.value;
    setDosFatos(value);
    updateForm({ dosFatos: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!dosFatos?.trim()) {
      newErrors.dosFatos = 'Este campo é obrigatório';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    nextStep();
  };

  const handlePrev = (e) => {
    e.preventDefault();
    prevStep();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados dos fatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dos Fatos</h2>
        <p className="text-gray-600">Descreva os fatos relevantes que fundamentam a ação judicial.</p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        <div>
          <label htmlFor="dosFatos" className="block text-sm font-medium text-gray-700 mb-2">
            DOS FATOS *
          </label>
          <textarea
            id="dosFatos"
            name="dosFatos"
            value={dosFatos}
            onChange={handleChange}
            placeholder="Descreva os fatos relevantes que fundamentam a ação judicial..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-400 transition-colors duration-200 resize-none"
            rows={15}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {dosFatos.length} de 5000 caracteres permitidos.
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