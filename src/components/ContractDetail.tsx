import React from 'react';
import { ArrowLeft, BarChart3, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { useContract } from "../hooks/useContracts";
import { useApp } from '../contexts/AppContext';

const ContractDetail = () => {
  const { navigationParams, dispatch } = useApp();
  const contractId = navigationParams?.id;
  const { contract, loading, error } = useContract(contractId);

  const navigate = (page: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando contrato...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive">Erro: {error}</p>
            <button 
              onClick={() => navigate('contracts')} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voltar à lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Contrato não encontrado</p>
            <button 
              onClick={() => navigate('contracts')} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voltar à lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (classificacao: string) => {
    switch (classificacao) {
      case "Alto Risco":
        return "bg-red-500 text-white";
      case "Atenção Necessária":
        return "bg-yellow-500 text-white";
      case "Seguro":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getScoreColor = (score: number, classificacao?: string) => {
    // Se a classificação for 'Seguro', sempre usar verde
    if (classificacao && classificacao.toLowerCase().includes('seguro')) {
      return "text-emerald-600";
    }
    
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreStrokeColor = (score: number, classificacao?: string) => {
    // Se a classificação for 'Seguro', sempre usar verde
    if (classificacao && classificacao.toLowerCase().includes('seguro')) {
      return "#059669"; // emerald-600
    }
    
    if (score >= 80) return "#059669"; // emerald-600
    if (score >= 60) return "#d97706"; // amber-600
    return "#dc2626"; // red-600
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('contracts')}
              className="h-10 w-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Análise Detalhada do Contrato</h1>
              <p className="text-gray-600 text-sm mt-1">
                {contract.nome_contrato} - ID: {contract.id} • {new Date(contract.data_analise).toLocaleDateString('pt-BR')}
              </p>
            </div>
        </div>
        

      </div>

      {/* Score Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Score de Segurança
          </h3>
          <p className="text-sm text-gray-600 mt-1">Análise completa dos riscos contratuais</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-8">
            {/* Circular Progress */}
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke={getScoreStrokeColor(contract.score_total, contract.classificacao)}
                    strokeWidth="3"
                    strokeDasharray={`${contract.score_total}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(contract.score_total, contract.classificacao)}`}>
                      {contract.score_total}
                    </div>
                    <div className="text-xs text-gray-500">de 100</div>
                  </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(contract.classificacao)}`}>
                    {contract.classificacao}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{contract.analise_contrato}</p>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {contract.riscos_identificados ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Riscos Identificados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {contract.melhorias_sugeridas ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Melhorias Sugeridas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {contract.conformidades_ok ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Conformidades OK</div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional sections can be added here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Análise de Riscos
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Riscos Identificados</h4>
                <p className="text-red-700 text-sm">
                  {contract.riscos_identificados ?? 0} riscos foram identificados neste contrato.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              Oportunidades de Melhoria
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Melhorias Sugeridas</h4>
                <p className="text-yellow-700 text-sm">
                  {contract.melhorias_sugeridas ?? 0} melhorias foram sugeridas para este contrato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
