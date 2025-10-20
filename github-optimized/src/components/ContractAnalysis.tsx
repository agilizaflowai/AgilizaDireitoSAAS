import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileSearch, AlertTriangle, CheckCircle, XCircle, Download, BarChart3, Shield, Calendar, RefreshCw, FileText, Trash2 } from 'lucide-react';
import PageHeader from './PageHeader';

import { supabase } from '../supabaseClient';
import { useContracts, type Contract } from '../hooks/useContracts';
import { useApp } from '../contexts/AppContext';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface ContractData {
  classificacao: number;
  riscos_identificados: any[];
  melhorias_sugeridas: any[];
  conformidades_ok: any[];
}

interface ContractHistoryItem {
  id: string;
  nome_contrato: string;
  score_total: number;
  classificacao: string;
  riscos_identificados: any[];
  melhorias_sugeridas: any[];
  conformidades_ok: any[];
  clausulas_risco: any[];
  sugestoes_melhoria: any[];
  conformidade_legal: any[];
  created_at: string;
  fileName: string;
  date: string;
  score: number;
  status: string;
  risks: number;
  improvements: number;
  compliances: number;
  riskClauses: string[];
  improvementSuggestions: string[];
  legalCompliance: string[];
}

export default function ContractAnalysis() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contractSummary, setContractSummary] = useState<string | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { contracts: contractHistory, loading: isLoadingHistory, error: historyError, refetch: refetchHistory, deleteContract } = useContracts();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 10;
  const { dispatch } = useApp();
  
  // Estados para modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);

  // Removido: seleção automática do primeiro contrato

  // Função para buscar dados do contrato no Supabase
  const fetchContractData = async (fileName: string) => {
    setIsLoadingData(true);
    try {
      console.log('Buscando dados do contrato no Supabase:', fileName);
      
      // Buscar o contrato mais recente
      const { data, error } = await supabase
        .from('contratos')
        .select('classificacao, riscos_identificados, melhorias_sugeridas, conformidades_ok')
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do contrato:', error);
        return null;
      }

      // Parse dos campos JSON que vêm como strings do banco
      const parsedData = {
        ...data,
        riscos_identificados: typeof data.riscos_identificados === 'string' 
          ? JSON.parse(data.riscos_identificados) 
          : data.riscos_identificados || [],
        melhorias_sugeridas: typeof data.melhorias_sugeridas === 'string' 
          ? JSON.parse(data.melhorias_sugeridas) 
          : data.melhorias_sugeridas || [],
        conformidades_ok: typeof data.conformidades_ok === 'string' 
          ? JSON.parse(data.conformidades_ok) 
          : data.conformidades_ok || []
      };

      console.log('Dados do contrato encontrados:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Erro na busca do contrato:', error);
      return null;
    } finally {
      setIsLoadingData(false);
    }
  };

  // Função para inserir dados de teste
  const insertTestData = async () => {
    console.log('=== INICIANDO INSERÇÃO DE DADOS DE TESTE ===');
    const testData = {
      nome_contrato: 'Contrato de Teste - Análise Completa',
      score_total: 85,
      classificacao: 'Médio Risco',
      riscos_identificados: JSON.stringify([
        {
          titulo: 'Cláusula de Penalidade Excessiva',
          descricao: 'Multa de 50% do valor do contrato em caso de rescisão',
          nivel: 'alto'
        },
        {
          titulo: 'Prazo de Pagamento Inadequado',
          descricao: 'Prazo de 90 dias para pagamento pode gerar problemas de fluxo de caixa',
          nivel: 'medio'
        },
        {
          titulo: 'Ausência de Cláusula de Força Maior',
          descricao: 'Contrato não prevê situações de força maior',
          nivel: 'baixo'
        }
      ]),
      melhorias_sugeridas: JSON.stringify([
        {
          titulo: 'Incluir Cláusula de Reajuste',
          descricao: 'Adicionar cláusula de reajuste anual baseada no IPCA',
          prioridade: 'alta'
        },
        {
          titulo: 'Definir Critérios de Qualidade',
          descricao: 'Estabelecer métricas claras de qualidade dos serviços',
          prioridade: 'media'
        }
      ]),
      conformidades_ok: JSON.stringify([
        {
          titulo: 'Lei Geral de Proteção de Dados',
          descricao: 'Contrato está em conformidade com a LGPD',
          status: 'conforme'
        },
        {
          titulo: 'Código de Defesa do Consumidor',
          descricao: 'Cláusulas respeitam os direitos do consumidor',
          status: 'conforme'
        },
        {
          titulo: 'Legislação Trabalhista',
          descricao: 'Disposições trabalhistas estão adequadas',
          status: 'conforme'
        }
      ]),
      clausulas_risco: JSON.stringify([
        {
          clausula: 'Cláusula 5.2 - Penalidades',
          risco: 'Alto',
          descricao: 'Multa excessiva pode ser considerada abusiva'
        }
      ]),
      sugestoes_melhoria: JSON.stringify([
        {
          secao: 'Pagamentos',
          sugestao: 'Reduzir prazo de pagamento para 30 dias'
        }
      ]),
      conformidade_legal: JSON.stringify([
        {
          lei: 'LGPD',
          status: 'Conforme'
        }
      ])
    };

    try {
      const { data, error } = await supabase
        .from('contratos')
        .insert([testData])
        .select();

      if (error) {
        console.error('Erro ao inserir dados de teste:', error);
      } else {
        console.log('Dados de teste inseridos com sucesso:', data);
        // Recarregar histórico após inserir dados de teste
        await refetchHistory();
      }
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  // Carregar histórico de contratos ao montar o componente
  useEffect(() => {
    refetchHistory();
    // Inserir dados de teste na primeira execução (comentar após teste)
    // insertTestData();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type
    });

    setIsAnalyzing(true);
    setShowAnalysis(false);
    setContractSummary(null);
    setContractData(null);
    setIsLoadingData(true);

    // Função para fazer a requisição com retry
    const makeRequestWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Tentativa ${attempt} de ${maxRetries} para conectar com o webhook...`);
          
          // Criar um AbortController para timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
          
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          console.error(`Tentativa ${attempt} falhou:`, error);
          
          if (attempt === maxRetries) {
            throw error;
          }
          
          // Aguardar antes da próxima tentativa (backoff exponencial)
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`Aguardando ${delay/1000}s antes da próxima tentativa...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

    try {
      // Gerar um código único para o arquivo
      const fileCode = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Converter arquivo para base64
      const fileReader = new FileReader();
      const fileBase64 = await new Promise((resolve) => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
      });

      const payload = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileCode: fileCode,
        fileData: fileBase64,
        timestamp: new Date().toISOString()
      };

      // Usar proxy local para evitar problemas de CORS
      const webhookUrl = '/api/webhook';
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      console.log('Enviando requisição via proxy para:', webhookUrl);
      console.log('Headers configurados:', Object.keys(headers));
      
      const response = await makeRequestWithRetry(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do webhook:', errorText);
        throw new Error(`Erro ao enviar o contrato para análise: ${response.status} - ${errorText}`);
      }

      const analysisResult = await response.json();
      console.log('Resposta do webhook n8n:', analysisResult);
      setContractSummary('Contrato enviado para análise com sucesso!');
      setShowAnalysis(true);
      setIsLoadingData(false);
      
      // Recarregar histórico após nova análise
      await refetchHistory();
    } catch (error) {
      console.error('Erro na integração com n8n:', error);
      setIsLoadingData(false); // Parar o loading em caso de erro
      
      let errorMessage = 'Erro desconhecido';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Timeout - O webhook demorou muito para responder (mais de 30 segundos)';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Falha na conexão - Verifique se o webhook está ativo e acessível';
      } else if (error.message.includes('NetworkError')) {
        errorMessage = 'Erro de rede - Verifique sua conexão com a internet';
      } else {
        errorMessage = error.message;
      }
      
      alert(`Falha ao conectar com o webhook do n8n: ${errorMessage}`);
      setShowAnalysis(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const getScoreColor = (score: number, classificacao?: string) => {
    // Se a classificação for 'Seguro', sempre usar verde
    if (classificacao && classificacao.toLowerCase().includes('seguro')) {
      return 'text-emerald-600';
    }
    
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number, classificacao?: string) => {
    // Se a classificação for 'Seguro', sempre usar verde
    if (classificacao && classificacao.toLowerCase().includes('seguro')) {
      return 'stroke-emerald-600';
    }
    
    if (score >= 80) return 'stroke-emerald-600';
    if (score >= 60) return 'stroke-amber-600';
    return 'stroke-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Alto': return 'text-red-700 bg-red-50 border-red-200';
      case 'Médio': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Baixo': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-700 bg-red-100 border-red-300';
      case 'Média': return 'text-amber-700 bg-amber-100 border-amber-300';
      case 'Baixa': return 'text-emerald-700 bg-emerald-100 border-emerald-300';
      default: return 'text-gray-300 bg-gray-800/30 border-gray-600 dark:text-gray-300 dark:bg-gray-800/30 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        icon={FileSearch}
        title="Análise de Contratos"
        subtitle="Identifique riscos e melhore seus contratos automaticamente"
      />

      {/* Upload Area */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upload de Contrato</h2>
        
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center transition-all duration-150 ${
            isDragOver 
              ? 'border-slate-900 bg-slate-50 dark:border-slate-400 dark:bg-slate-800/50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-base font-medium text-slate-900 dark:text-white mb-2">
            Arraste e solte seu contrato aqui
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            ou clique para selecionar um arquivo
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary px-6 py-3"
          >
            Selecionar Arquivo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Formatos aceitos: PDF, DOC, DOCX (máx. 10MB)
          </p>
        </div>

        {uploadedFile && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-slate-900 dark:text-white mr-3" strokeWidth={1.5} />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Analysis */}
      {isAnalyzing && (
        <div className="card p-8">
          <div className="text-center">
            <div className="spinner h-12 w-12 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analisando Contrato...</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Nossa IA está identificando riscos e sugestões de melhoria</p>
            <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-1 max-w-xs mx-auto">
              <div className="bg-slate-900 dark:bg-slate-300 h-1 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message - Show only after upload */}
      {uploadedFile && !isAnalyzing && (
        <div className="card p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 dark:text-green-300 font-medium">Contrato enviado para análise com sucesso!</p>
          </div>
        </div>
      )}

      {/* Contract History */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-slate-900 dark:text-white" strokeWidth={1.5} />
            Histórico de Contratos Analisados
          </h2>
          <button 
            onClick={refetchHistory}
            className="text-sm text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-gray-300 flex items-center transition-colors"
            disabled={isLoadingHistory}
          >
            <RefreshCw className="h-4 w-4 mr-1" strokeWidth={1.5} />
            {isLoadingHistory ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
        
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner h-8 w-8 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Carregando histórico...</span>
          </div>
        ) : contractHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p>Nenhum contrato analisado ainda.</p>
            <p className="text-sm">Faça o upload de um contrato para começar.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {(() => {
                // Calcular contratos da página atual
                const totalContracts = contractHistory.length;
                const totalPages = Math.ceil(totalContracts / contractsPerPage);
                const startIndex = (currentPage - 1) * contractsPerPage;
                const endIndex = startIndex + contractsPerPage;
                const currentContracts = contractHistory.slice(startIndex, endIndex);

                const getStatusColor = (classificacao: string) => {
                  if (!classificacao) return 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
                  
                  const classif = classificacao.toLowerCase();
                  if (classif.includes('baixo') || classif.includes('verde') || classif.includes('seguro')) {
                    return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-600';
                  }
                  if (classif.includes('médio') || classif.includes('medio') || classif.includes('amarelo') || classif.includes('atenção') || classif.includes('atencao')) {
                    return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-600';
                  }
                  if (classif.includes('alto') || classif.includes('vermelho') || classif.includes('erro')) {
                    return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-600';
                  }
                  
                  // Retorna cor neutra para qualquer outro valor
                  return 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
                };
                
                const getStatusText = (classificacao: string) => {
                  // Retorna exatamente o valor da coluna classificacao do Supabase
                  return classificacao || '';
                };
                
                return currentContracts.map((contract) => (
                  <div 
                    key={contract.id} 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      {/* Lado esquerdo - Informações do contrato */}
                      <div 
                        className="flex items-center space-x-4 flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedContract(contract);
                          setShowContractDetails(true);
                        }}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {contract.nome_contrato || 'Contrato sem nome'}
                          </h4>
                          {contract.created_at && !isNaN(new Date(contract.created_at).getTime()) && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Analisado em {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Lado direito - Score, classificação e botão de exclusão */}
                      <div className="flex items-center space-x-6 flex-shrink-0">
                        {/* Score */}
                         <div className="text-center">
                           <div className={`text-2xl font-bold ${getScoreColor(contract.score_total || 0, contract.classificacao)}`}>
                             {contract.score_total || 0}<span className="text-lg text-gray-400">/100</span>
                           </div>
                           <div className="text-xs text-gray-500 font-medium mt-1">Score</div>
                         </div>
                        
                        {/* Classificação */}
                        <div className="w-32">
                          <span className={`inline-block w-full text-center px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(contract.classificacao)}`}>
                            {getStatusText(contract.classificacao)}
                          </span>
                        </div>

                        {/* Botão de exclusão */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContractToDelete(contract);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Excluir contrato"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
            
            {/* Controles de Paginação */}
            {contractHistory.length > 0 && (
              <div className="mt-6 px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando {Math.min((currentPage - 1) * contractsPerPage + 1, contractHistory.length)} a {Math.min(currentPage * contractsPerPage, contractHistory.length)} de {contractHistory.length} contratos
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
                    >
                      Anterior
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const totalPages = Math.ceil(contractHistory.length / contractsPerPage);
                        const pages = [];
                        
                        for (let i = 1; i <= totalPages; i++) {
                          if (
                            i === 1 || 
                            i === totalPages || 
                            (i >= currentPage - 1 && i <= currentPage + 1)
                          ) {
                            pages.push(
                               <button
                                 key={i}
                                 onClick={() => setCurrentPage(i)}
                                 className={`px-3 py-1 text-sm border rounded-md ${
                                   currentPage === i
                                     ? 'bg-black text-white border-black dark:bg-gray-600 dark:border-gray-600'
                                     : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300'
                                 }`}
                               >
                                 {i}
                               </button>
                             );
                          } else if (
                            (i === currentPage - 2 && currentPage > 3) ||
                            (i === currentPage + 2 && currentPage < totalPages - 2)
                          ) {
                            pages.push(
                              <span key={i} className="px-2 text-gray-400 dark:text-gray-500">...</span>
                            );
                          }
                        }
                        
                        return pages;
                      })()}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(contractHistory.length / contractsPerPage)))}
                      disabled={currentPage === Math.ceil(contractHistory.length / contractsPerPage)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Detalhes do Contrato */}
      {showContractDetails && selectedContract && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowContractDetails(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Análise Detalhada do Contrato</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedContract.nome_contrato || 'Contrato sem nome'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowContractDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Score de Segurança */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Score de Segurança</h2>
                    <p className="text-sm text-gray-600">Análise completa dos riscos contratuais</p>
                  </div>
                </div>
              
              <div className="flex items-center space-x-8">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (selectedContract.score_total || 0) / 100)}`}
                      className={`transition-all duration-1000 ${getScoreBgColor(selectedContract.score_total || 0, selectedContract.classificacao)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className={`text-xl font-semibold ${getScoreColor(selectedContract.score_total || 0, selectedContract.classificacao)}`}>
                        {selectedContract.score_total || 0}
                      </span>
                      <p className="text-xs text-gray-600">de 100</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold ${getScoreColor(selectedContract.score_total || 0, selectedContract.classificacao)} mb-2`}>
                    {selectedContract.classificacao || 'Classificação não disponível'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {(selectedContract.score_total || 0) >= 80 
                      ? 'Seu contrato apresenta boa estrutura jurídica com poucos riscos identificados.'
                      : (selectedContract.score_total || 0) >= 60
                      ? 'Algumas cláusulas precisam de atenção para reduzir riscos potenciais.'
                      : 'Várias cláusulas apresentam riscos significativos que devem ser revisadas.'}
                  </p>

                </div>
              </div>
            </div>

            {/* Seções de Riscos, Melhorias e Conformidades */}
            <div className="mb-6">
              {/* Estatísticas Resumidas */}
              <div className="flex w-full gap-0">
               {/* Card Riscos */}
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 flex-1 rounded-l-lg border-r-0">
                 <div className="text-center">
                   <div className="flex items-center justify-center mb-4">
                     <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                       <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={1.5} />
                     </div>
                   </div>
                   <div className="text-3xl font-bold text-red-700 dark:text-red-400 mb-2">
                     {selectedContract?.riscos_identificados || 0}
                   </div>
                   <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Cláusulas em Risco</div>
                 </div>
               </div>

               {/* Card Melhorias */}
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 flex-1 border-r-0">
                 <div className="text-center">
                   <div className="flex items-center justify-center mb-4">
                     <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                       <RefreshCw className="h-6 w-6 text-amber-600" strokeWidth={1.5} />
                     </div>
                   </div>
                   <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2">
                     {selectedContract?.melhorias_sugeridas || 0}
                   </div>
                   <div className="text-sm text-gray-600 font-medium">Melhorias Gerais</div>
                 </div>
               </div>

               {/* Card Conformidades */}
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 flex-1 rounded-r-lg">
                 <div className="text-center">
                   <div className="flex items-center justify-center mb-4">
                     <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                       <CheckCircle className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
                     </div>
                   </div>
                   <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                     {selectedContract?.conformidades_ok || 0}
                   </div>
                   <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Conformidades</div>
                 </div>
               </div>
              </div>
            </div>

              {/* Cláusulas em Risco */}
              {selectedContract.riscos_identificados && Array.isArray(selectedContract.riscos_identificados) && selectedContract.riscos_identificados.length > 0 && (
                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" strokeWidth={1.5} />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Cláusulas em Risco</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedContract.riscos_identificados.map((clausula, index) => {
                      const riskLevel = clausula.nivel || clausula.risk || 'Alto';
                      const getRiskColor = (level: string) => {
                        switch (level.toLowerCase()) {
                          case 'alto':
                          case 'high':
                            return 'bg-red-100 text-red-700 border-red-200';
                          case 'médio':
                          case 'medio':
                          case 'medium':
                            return 'bg-orange-100 text-orange-700 border-orange-200';
                          case 'baixo':
                          case 'low':
                            return 'bg-green-100 text-green-700 border-green-200';
                          default:
                            return 'bg-red-100 text-red-700 border-red-200';
                        }
                      };
                      
                      const getBorderColor = (level: string) => {
                        switch (level.toLowerCase()) {
                          case 'alto':
                          case 'high':
                            return 'border-red-200 bg-red-50';
                          case 'médio':
                          case 'medio':
                          case 'medium':
                            return 'border-orange-200 bg-orange-50';
                          case 'baixo':
                          case 'low':
                            return 'border-green-200 bg-green-50';
                          default:
                            return 'border-red-200 bg-red-50';
                        }
                      };
                      
                      return (
                        <div key={index} className={`border rounded-md p-4 ${getBorderColor(riskLevel)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                              {clausula.titulo || clausula.clause || clausula.nome || `Cláusula de Risco ${index + 1}`}
                            </h4>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRiskColor(riskLevel)}`}>
                              Risco {riskLevel}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3 text-sm">
                            {clausula.descricao || clausula.description || clausula.texto || 'Descrição não disponível'}
                          </p>
                          <div className="bg-white rounded-md p-3 border-l-4 border-slate-900">
                            <p className="text-sm text-gray-700">
                              <strong className="text-slate-900">Sugestão:</strong> {clausula.sugestao || clausula.suggestion || clausula.recomendacao || 'Revisar esta cláusula com atenção'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Análise Detalhada de Cláusulas em Risco */}
              {selectedContract.clausulas_risco && Array.isArray(selectedContract.clausulas_risco) && selectedContract.clausulas_risco.length > 0 && (
                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-orange-600 mr-2" strokeWidth={1.5} />
                    <h2 className="text-lg font-semibold text-slate-900">Cláusulas em Risco</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedContract.clausulas_risco.map((clausula, index) => {
                      const riskLevel = clausula.nivel_risco || clausula.nivel || clausula.risk_level || clausula.risco || 'Médio';
                      const getRiskColor = (level: string) => {
                        switch (level.toLowerCase()) {
                          case 'alto':
                          case 'high':
                          case 'crítico':
                          case 'critico':
                            return 'bg-red-100 text-red-700 border-red-200';
                          case 'médio':
                          case 'medio':
                          case 'medium':
                            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                          case 'baixo':
                          case 'low':
                            return 'bg-green-100 text-green-700 border-green-200';
                          default:
                            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                        }
                      };
                      
                      const getBorderColor = (level: string) => {
                        switch (level.toLowerCase()) {
                          case 'alto':
                          case 'high':
                          case 'crítico':
                          case 'critico':
                            return 'border-red-200 bg-red-50';
                          case 'médio':
                          case 'medio':
                          case 'medium':
                            return 'border-yellow-200 bg-yellow-50';
                          case 'baixo':
                          case 'low':
                            return 'border-green-200 bg-green-50';
                          default:
                            return 'border-yellow-200 bg-yellow-50';
                        }
                      };
                      
                      return (
                         <div key={index} className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${getBorderColor(riskLevel)}`}>
                           {/* Cabeçalho com Título e Nível de Risco */}
                           <div className="flex items-start justify-between mb-4">
                             <div className="flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-bold text-black bg-gray-100 px-2 py-1 rounded-md">
                                      Cláusula {clausula.clausula_numero || clausula.numero || clausula.number || (index + 1)}
                                    </span>
                                 <span className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-md ${getRiskColor(riskLevel)}`}>
                                    Risco {riskLevel}
                                  </span>
                               </div>
                               <h4 className="font-bold text-slate-900 text-xl">
                                  {clausula.titulo || clausula.title || clausula.nome || clausula.clause || `Descrição Incompleta do Objeto`}
                                </h4>
                             </div>
                           </div>
                           
                           {/* Descrição */}
                             <div className="bg-white dark:bg-gray-800 rounded-md p-4 border-l-4 border-gray-400 dark:border-gray-600 mb-4">
                               <h5 className="font-medium text-black dark:text-white mb-2 flex items-center gap-2">
                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                 </svg>
                                 Descrição:
                               </h5>
                               <p className="text-black dark:text-gray-300 text-sm leading-relaxed">
                                 {clausula.descricao_problema || clausula.descricao || clausula.description || clausula.texto || 'Descrição não disponível'}
                               </p>
                             </div>
                           
                           {/* Sugestão */}
                           <div className="bg-white dark:bg-gray-800 rounded-md p-4 border-l-4 border-blue-400">
                               <h5 className="font-medium text-black dark:text-white mb-2 flex items-center gap-2">
                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                 </svg>
                                 Sugestão:
                               </h5>
                               <p className="text-sm text-black dark:text-gray-300">
                                 {clausula.sugestao || clausula.suggestion || clausula.recomendacao || clausula.recommendation || 'Inserir descrição detalhada e precisa do objeto do contrato diretamente no texto contratual, garantindo clareza e especificidade.'}
                               </p>
                             </div>
                         </div>
                       );
                    })}
                  </div>
                </div>
              )}

              {/* Melhorias Gerais */}
              {selectedContract.melhorias_sugeridas && Array.isArray(selectedContract.melhorias_sugeridas) && selectedContract.melhorias_sugeridas.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Melhorias Gerais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedContract.melhorias_sugeridas.map((sugestao, index) => {
                      const priority = sugestao.prioridade || sugestao.priority || 'Média';
                      const getPriorityColor = (level: string) => {
                        switch (level.toLowerCase()) {
                          case 'alta':
                          case 'high':
                            return 'bg-red-100 text-red-700 border-red-200';
                          case 'média':
                          case 'media':
                          case 'medium':
                            return 'bg-orange-100 text-orange-700 border-orange-200';
                          case 'baixa':
                          case 'low':
                            return 'bg-green-100 text-green-700 border-green-200';
                          default:
                            return 'bg-orange-100 text-orange-700 border-orange-200';
                        }
                      };
                      
                      const getBorderColor = (level: string) => {
                        switch (level.toLowerCase()) {
                          case 'alta':
                          case 'high':
                            return 'border-red-200 bg-red-50';
                          case 'média':
                          case 'media':
                          case 'medium':
                            return 'border-orange-200 bg-orange-50';
                          case 'baixa':
                          case 'low':
                            return 'border-green-200 bg-green-50';
                          default:
                            return 'border-orange-200 bg-orange-50';
                        }
                      };
                      
                      return (
                        <div key={index} className={`border rounded-md p-4 ${getBorderColor(priority)} dark:bg-gray-800 dark:border-gray-600`}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                              {sugestao.titulo || sugestao.title || sugestao.nome || `Sugestão ${index + 1}`}
                            </h4>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(priority)}`}>
                              {priority}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {sugestao.descricao || sugestao.description || sugestao.texto || 'Descrição não disponível'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Checklist de Conformidade Legal */}
              {selectedContract.conformidades_ok && Array.isArray(selectedContract.conformidades_ok) && selectedContract.conformidades_ok.length > 0 && (
                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-emerald-600 mr-2" strokeWidth={1.5} />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Checklist de Conformidade Legal</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedContract.conformidades_ok.map((conformidade, index) => {
                      const isCompliant = conformidade.status === 'conforme' || conformidade.status === 'ok' || conformidade.conforme === true;
                      
                      return (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-md ${
                          isCompliant 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' 
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                        }`}>
                          <div className="flex items-center space-x-3">
                            {isCompliant ? (
                              <CheckCircle className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" strokeWidth={1.5} />
                            )}
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {conformidade.nome || conformidade.title || conformidade.descricao || `Conformidade ${index + 1}`}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            isCompliant
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            {isCompliant ? 'Conforme' : 'Não Conforme'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nova Área: Melhorias Gerais */}
              {selectedContract.sugestoes_melhoria && typeof selectedContract.sugestoes_melhoria === 'object' ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <RefreshCw className="h-5 w-5 text-amber-600 mr-2" strokeWidth={1.5} />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Melhorias Gerais</h2>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-8">
                    {/* Sugestões de Alta Prioridade */}
                    {selectedContract.sugestoes_melhoria.alta_prioridade && selectedContract.sugestoes_melhoria.alta_prioridade.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Alta Prioridade</h3>
                          <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                              {selectedContract.sugestoes_melhoria.alta_prioridade.length} {selectedContract.sugestoes_melhoria.alta_prioridade.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {selectedContract.sugestoes_melhoria.alta_prioridade.map((sugestao, index) => (
                            <div key={`alta-${index}`} className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-r-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {sugestao.titulo || sugestao.title || sugestao.nome || `Sugestão ${index + 1}`}
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {sugestao.descricao || sugestao.description || sugestao.texto || sugestao.sugestao || 'Descrição não disponível'}
                                  </p>
                                  {sugestao.clausula_numero && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                      📄 Cláusula {sugestao.clausula_numero}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sugestões de Média Prioridade */}
                    {selectedContract.sugestoes_melhoria.media_prioridade && selectedContract.sugestoes_melhoria.media_prioridade.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Média Prioridade</h3>
                          <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400">
                              {selectedContract.sugestoes_melhoria.media_prioridade.length} {selectedContract.sugestoes_melhoria.media_prioridade.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {selectedContract.sugestoes_melhoria.media_prioridade.map((sugestao, index) => (
                            <div key={`media-${index}`} className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 dark:border-orange-600 p-4 rounded-r-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {sugestao.titulo || sugestao.title || sugestao.nome || `Sugestão ${index + 1}`}
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {sugestao.descricao || sugestao.description || sugestao.texto || sugestao.sugestao || 'Descrição não disponível'}
                                  </p>
                                  {sugestao.clausula_numero && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                      📄 Cláusula {sugestao.clausula_numero}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sugestões de Baixa Prioridade */}
                    {selectedContract.sugestoes_melhoria.baixa_prioridade && selectedContract.sugestoes_melhoria.baixa_prioridade.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Baixa Prioridade</h3>
                          <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                              {selectedContract.sugestoes_melhoria.baixa_prioridade.length} {selectedContract.sugestoes_melhoria.baixa_prioridade.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {selectedContract.sugestoes_melhoria.baixa_prioridade.map((sugestao, index) => (
                            <div key={`baixa-${index}`} className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-600 p-4 rounded-r-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {sugestao.titulo || sugestao.title || sugestao.nome || `Sugestão ${index + 1}`}
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {sugestao.descricao || sugestao.description || sugestao.texto || sugestao.sugestao || 'Descrição não disponível'}
                                  </p>
                                  {sugestao.clausula_numero && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                      📄 Cláusula {sugestao.clausula_numero}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Caso não haja sugestões em nenhuma categoria */}
                    {(!selectedContract.sugestoes_melhoria.alta_prioridade || selectedContract.sugestoes_melhoria.alta_prioridade.length === 0) &&
                     (!selectedContract.sugestoes_melhoria.media_prioridade || selectedContract.sugestoes_melhoria.media_prioridade.length === 0) &&
                     (!selectedContract.sugestoes_melhoria.baixa_prioridade || selectedContract.sugestoes_melhoria.baixa_prioridade.length === 0) && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Nenhuma sugestão encontrada</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Este contrato não possui sugestões de melhoria no momento.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Melhorias Gerais</h2>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Nenhuma sugestão encontrada</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Este contrato não possui sugestões de melhoria no momento.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nova Seção: Conformidades */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" strokeWidth={1.5} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Checklist de Conformidade Legal</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Função para verificar conformidade */}
                    {(() => {
                      const getConformidadeStatus = (campo: string) => {
                        if (!selectedContract?.conformidade_legal) {
                          return 'Não Conforme';
                        }
                        
                        // Se conformidade_legal é um objeto direto
                        if (typeof selectedContract.conformidade_legal === 'object' && !Array.isArray(selectedContract.conformidade_legal)) {
                          return selectedContract.conformidade_legal[campo] === 'Conforme' ? 'Conforme' : 'Não Conforme';
                        }
                        
                        // Se conformidade_legal é um array
                        if (Array.isArray(selectedContract.conformidade_legal) && selectedContract.conformidade_legal.length > 0) {
                          const conformidade = selectedContract.conformidade_legal.find((conf: any) => {
                            if (typeof conf === 'object' && conf !== null) {
                              return conf[campo] === 'Conforme';
                            }
                            return false;
                          });
                          return conformidade ? 'Conforme' : 'Não Conforme';
                        }
                        
                        return 'Não Conforme';
                      };

                      const renderConformidadeItem = (titulo: string, campo: string) => {
                        const status = getConformidadeStatus(campo);
                        const isConforme = status === 'Conforme';
                        
                        return (
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{titulo}</span>
                            <div className="flex items-center">
                              {isConforme ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mr-2" />
                                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Conforme</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">Não Conforme</span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      };

                      return (
                        <>
                          {renderConformidadeItem('Adequação à Lei Geral de Proteção de Dados', 'lgpd')}
                          {renderConformidadeItem('Conformidade com Código Civil', 'codigo_civil')}
                          {renderConformidadeItem('Conformidade com legislação tributária', 'legislacao_tributaria')}
                          {renderConformidadeItem('Adequação às normas trabalhistas', 'legislacao_trabalhista')}
                          {renderConformidadeItem('Conformidade com Código de Defesa do Consumidor', 'codigo_defesa_consumidor')}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && contractToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Confirmar Exclusão
                </h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tem certeza que deseja excluir o contrato <strong>"{contractToDelete.nome_contrato}"</strong>?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setContractToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const result = await deleteContract(contractToDelete.id);
                  if (result.success) {
                    setShowDeleteModal(false);
                    setContractToDelete(null);
                  } else {
                    alert('Erro ao excluir contrato: ' + result.error);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}