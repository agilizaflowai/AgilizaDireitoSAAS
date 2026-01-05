import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Calendar, Building, User, Scale, FileText, Folder, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useApp } from '../contexts/AppContext';
import PageHeader from './PageHeader';

interface ProcessFilters {
  dateFrom: string;
  dateTo: string;
  tribunal: string;
  sortOrder: string;
}

interface ProcessDetails {
  numero_cnj?: string;
  ano_inicio?: number;
  data_inicio?: string;
  estado_origem?: { sigla?: string };
  unidade_origem?: { nome?: string; cidade?: string };
  fontes?: Array<{
    nome?: string;
    tipo?: string;
    capa?: {
      classe?: string;
      assunto?: string;
      orgao_julgador?: string;
      data_distribuicao?: string;
      assunto_principal_normalizado?: {
        nome?: string;
        path_completo?: string;
      };
    };
    envolvidos?: Array<{
      nome?: string;
      tipo_normalizado?: string;
      oabs?: Array<{ numero?: string }>;
    }>;
  }>;
  status_predito?: string;
  segredo_justica?: boolean;
  data_ultima_movimentacao?: string;
  quantidade_movimentacoes?: number;
}

interface Movimentacao {
  id?: number | string;
  numero_cnj?: string;
  data?: string;
  data_movimentacao?: string;
  descricao?: string;
  tipo?: string;
  complemento?: string;
  created_at?: string;
}

interface Process {
  numero_cnj: string;
  tribunal_sigla: string;
  titulo_polo_ativo: string;
  titulo_polo_passivo: string;
  data: string;
  assunto?: string;
  details?: ProcessDetails;
}

export default function ProcessFilter() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingProcesses, setIsLoadingProcesses] = useState(true);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [selectedProcessMovimentacoes, setSelectedProcessMovimentacoes] = useState<Process | null>(null);
  const [showMovimentacoesModal, setShowMovimentacoesModal] = useState(false);
  
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [isLoadingMovimentacoes, setIsLoadingMovimentacoes] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filters, setFilters] = useState<ProcessFilters>({
    dateFrom: '',
    dateTo: '',
    tribunal: 'Todos',
    sortOrder: 'mais_recentes'
  });

  const tribunalOptions = [
    'Todos',
    'TJRJ',
    'TRF2'
  ];

  const applyFilters = useCallback(() => {
    let filtered = processes;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(process => 
        (process.numero_cnj && process.numero_cnj.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (process.titulo_polo_ativo && process.titulo_polo_ativo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (process.titulo_polo_passivo && process.titulo_polo_passivo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (process.assunto && process.assunto.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por tribunal
    if (filters.tribunal !== 'Todos') {
      filtered = filtered.filter(process => process.tribunal_sigla === filters.tribunal);
    }

    // Filtro por data de início
    if (filters.dateFrom && filters.dateFrom.length === 10) {
      // Converte DD/MM/AAAA para AAAA-MM-DD
      const [day, month, year] = filters.dateFrom.split('/');
      const dateFromISO = `${year}-${month}-${day}`;
      
      filtered = filtered.filter(process => {
        // Usa data_inicio dos detalhes se disponível, senão usa a data padrão
        const processDate = process.details?.data_inicio || process.data;
        return processDate && new Date(processDate) >= new Date(dateFromISO);
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter(process => 
        process.data && new Date(process.data) <= new Date(filters.dateTo)
      );
    }

    // Ordenação por data
    filtered.sort((a, b) => {
      const dateA = new Date(a.details?.data_inicio || a.data || '1900-01-01');
      const dateB = new Date(b.details?.data_inicio || b.data || '1900-01-01');
      
      if (filters.sortOrder === 'mais_recentes') {
        // Mais recentes primeiro (datas mais novas primeiro)
        return dateB.getTime() - dateA.getTime();
      } else {
        // Mais antigos primeiro (datas mais antigas primeiro)
        return dateA.getTime() - dateB.getTime();
      }
    });

    setFilteredProcesses(filtered);
  }, [searchTerm, filters, processes]);

  useEffect(() => {
    fetchProcesses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Verificar se há parâmetros de navegação para abrir processo específico
  useEffect(() => {
    if (state?.navigationParams?.numeroCnj && processes.length > 0 && !isLoadingProcesses) {
      const targetProcess = processes.find(p => p.numero_cnj === state.navigationParams?.numeroCnj);
      if (targetProcess) {
        // Definir o termo de busca para filtrar o processo
        setSearchTerm(state.navigationParams?.numeroCnj);
        setShowResults(true);
        // Abrir automaticamente os detalhes do processo imediatamente
        openDetailsModal(targetProcess);
        // Limpar os parâmetros de navegação após usar
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 'processes' });
      }
    }
  }, [state?.navigationParams, processes, isLoadingProcesses, dispatch]);

  const fetchProcesses = async () => {
    setIsLoadingProcesses(true);
    try {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        console.error('Erro ao buscar processos:', error);
        return;
      }

      // Processar os dados para extrair o assunto e detalhes completos
      const processedData = (data || []).map(process => {
        let assunto = 'Assunto não informado';
        const details: ProcessDetails = {};
        
        try {
          const processData = process.data;
          
          // Extrair campos básicos
          details.numero_cnj = processData?.numero_cnj;
          details.ano_inicio = processData?.ano_inicio;
          details.data_inicio = processData?.data_inicio;
          details.estado_origem = processData?.estado_origem;
          details.unidade_origem = processData?.unidade_origem;
          
          // Extrair campos de status
          details.status_predito = processData?.status_predito;
          details.segredo_justica = processData?.segredo_justica;
          details.data_ultima_movimentacao = processData?.data_ultima_movimentacao;
          details.quantidade_movimentacoes = processData?.quantidade_movimentacoes;
          
          // Extrair dados das fontes
          if (processData?.fontes) {
            const fontesArray = Object.values(processData.fontes);
            details.fontes = fontesArray;
            
            // Extrair assunto da primeira fonte
            if (fontesArray.length > 0 && fontesArray[0].capa?.assunto) {
              assunto = fontesArray[0].capa.assunto;
            }
          }
        } catch (e) {
          console.warn('Erro ao extrair dados do processo:', process.numero_cnj, e);
        }
        
        return {
          numero_cnj: process.numero_cnj,
          tribunal_sigla: process.tribunal_sigla,
          titulo_polo_ativo: process.titulo_polo_ativo,
          titulo_polo_passivo: process.titulo_polo_passivo,
          data: process.data,
          assunto,
          details
        };
      });

      setProcesses(processedData);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    } finally {
      setIsLoadingProcesses(false);
    }
  };

  const openDetailsModal = (process: Process) => {
    setSelectedProcess(process);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProcess(null);
    // Limpar o campo de busca e ocultar resultados
    setSearchTerm('');
    setShowResults(false);
  };

  interface MovimentacaoRecord {
    id: number;
    numero_cnj: string;
    data: Record<string, unknown> | null;
    data_movimentacao: string;
    created_at: string;
  }

  type SupabaseResp = {
    data: MovimentacaoRecord[] | null;
    error: {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    } | null;
  };

  const fetchMovimentacoes = async (numeroCnj: string): Promise<Movimentacao[]> => {
    setIsLoadingMovimentacoes(true);
    console.log('🔍 Buscando movimentações para CNJ:', numeroCnj);
    
    try {
      // Verificar se o Supabase está configurado
      if (!supabase) {
        console.error('❌ Supabase client não está configurado');
        return [];
      }

      console.log('📡 Executando consulta no Supabase...');
      
      // Implementar timeout para evitar travamento
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: A consulta demorou mais que 10 segundos')), 10000);
      });
      
      const queryPromise = supabase
        .from('movimentacoes')
        .select('id, numero_cnj, data, data_movimentacao, created_at')
        .eq('numero_cnj', numeroCnj)
        .order('id', { ascending: true })
        .limit(5);
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as SupabaseResp;

      console.log('📊 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro ao buscar movimentações:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return [];
      }

      if (!data || data.length === 0) {
        console.log('⚠️ Nenhuma movimentação encontrada para o CNJ:', numeroCnj);
        return [];
      }

      console.log(`✅ Encontradas ${data.length} movimentações`);
      console.log('📊 Dados brutos ordenados pelo Supabase:');
      data.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id} | Data: ${item.data_movimentacao} | CNJ: ${item.numero_cnj}`);
      });
      
      // Verificar se a ordenação está correta
      const isCorrectOrder = data.every((item, index) => {
        if (index === 0) return true;
        const currentDate = new Date(item.data_movimentacao);
        const previousDate = new Date(data[index - 1].data_movimentacao);
        return currentDate <= previousDate;
      });
      
      console.log('🔍 Ordenação está correta?', isCorrectOrder ? '✅ SIM' : '❌ NÃO');
      
      if (!isCorrectOrder) {
        console.log('⚠️ PROBLEMA: Dados não estão ordenados corretamente!');
        console.log('🔧 Aplicando ordenação manual...');
        data.sort((a, b) => {
          const dateA = new Date(a.data_movimentacao);
          const dateB = new Date(b.data_movimentacao);
          if (dateB.getTime() !== dateA.getTime()) {
            return dateB.getTime() - dateA.getTime(); // Data mais recente primeiro
          }
          return b.id - a.id; // Se datas iguais, ID maior primeiro
        });
        console.log('✅ Ordenação manual aplicada');
      }

      // Processar os dados JSONB da coluna 'data' para extrair informações
      const processedData = (data || []).map((item, index) => {
        console.log(`📝 Processando item ${index + 1}:`, item);
        const jsonData = item.data || {};
        console.log('📋 Dados JSONB:', jsonData);
        
        // Extrair descrição dos dados JSONB com múltiplas tentativas
        let descricao = 'Movimentação sem descrição';
        
        if (jsonData.descricao) {
          descricao = jsonData.descricao;
        } else if (jsonData.movimento) {
          descricao = jsonData.movimento;
        } else if (jsonData.movimentacao) {
          descricao = jsonData.movimentacao;
        } else if (jsonData.texto) {
          descricao = jsonData.texto;
        } else if (jsonData.conteudo) {
          descricao = jsonData.conteudo;
        } else if (jsonData.message) {
          descricao = jsonData.message;
        } else if (jsonData.titulo) {
          descricao = jsonData.titulo;
        } else if (typeof jsonData === 'string') {
          descricao = jsonData;
        } else if (Object.keys(jsonData).length > 0) {
          // Se há dados JSONB mas não encontramos campos conhecidos, mostrar o primeiro valor string encontrado
          const firstStringValue = Object.values(jsonData).find(value => 
            typeof value === 'string' && value.trim().length > 0
          );
          if (firstStringValue) {
            descricao = firstStringValue as string;
          } else {
            // Como último recurso, mostrar uma representação dos dados disponíveis
            descricao = `Dados: ${JSON.stringify(jsonData).substring(0, 100)}${Object.keys(jsonData).length > 3 ? '...' : ''}`;
          }
        }
        
        const processed = {
          id: item.id || `mov_${index}`,
          numero_cnj: item.numero_cnj,
          data: item.data_movimentacao,
          descricao: descricao,
          tipo: jsonData.tipo || jsonData.tipoMovimento || jsonData.tipo_movimento || jsonData.category || jsonData.categoria || 'Não informado',
          complemento: jsonData.complemento || jsonData.observacao || jsonData.detalhes || jsonData.observacoes || jsonData.adicional || null,
          created_at: item.created_at
        };
        
        console.log('✨ Item processado:', processed);
        return processed;
      });

      console.log('🎉 Dados processados com sucesso:', processedData);
      return processedData;
    } catch (error) {
      console.error('💥 Erro inesperado ao buscar movimentações:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      
      // Se for erro de timeout, retornar dados mock para não deixar o usuário sem resposta
      if (error instanceof Error && error.message.includes('Timeout')) {
        console.log('⏰ Timeout detectado, retornando dados de exemplo...');
        return [
          {
            id: 'timeout_1',
            numero_cnj: numeroCnj,
            data: new Date().toISOString().split('T')[0],
            descricao: 'Erro de timeout - Não foi possível carregar as movimentações reais',
            tipo: 'Sistema',
            complemento: 'Tente novamente em alguns instantes',
            created_at: new Date().toISOString()
          }
        ];
      }
      
      return [];
    } finally {
      setIsLoadingMovimentacoes(false);
      console.log('🏁 Finalizando busca de movimentações');
    }
  };

  const openMovimentacoesModal = async (process: Process) => {
    setSelectedProcessMovimentacoes(process);
    setShowMovimentacoesModal(true);
    const movimentacoesData = await fetchMovimentacoes(process.numero_cnj);
    setMovimentacoes(movimentacoesData);
  };

  const closeMovimentacoesModal = () => {
    setShowMovimentacoesModal(false);
    setSelectedProcessMovimentacoes(null);
    setMovimentacoes([]);
  };

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProcesses = filteredProcesses.slice(startIndex, endIndex);

  // Reset página quando filtro muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleSearch = async () => undefined;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof ProcessFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };



  const getTribunalColor = (tribunal: string) => {
    switch (tribunal) {
      case 'TJRJ':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'TRF2':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  

  return (
    <div className="space-y-6">
      <PageHeader 
        icon={Filter}
        title="Filtro de Processos"
        subtitle="Gerencie e filtre todos os processos do escritório"
      />

      {/* Search Bar */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              {!isSearchFocused && (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
              )}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Buscar por número CNJ, polo ativo, polo passivo ou assunto..."
                className="input-primary input-search transition-all duration-200"
                style={{ paddingLeft: isSearchFocused ? '20px' : '34px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-lg mr-4">
            <Filter className="h-5 w-5 text-slate-600 dark:text-gray-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filtros Avançados</h3>
            <p className="text-sm text-gray-500 mt-1">Refine sua busca com filtros específicos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-slate-600 dark:text-gray-300" />
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wide">Tribunal</label>
            </div>
            <select
              value={filters.tribunal}
              onChange={(e) => handleFilterChange('tribunal', e.target.value)}
              className="input-primary input-search h-12 text-base"
            >
              {tribunalOptions.map(tribunal => (
                <option key={tribunal} value={tribunal}>{tribunal}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-600 dark:text-gray-300" />
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wide">Ordenação por Data</label>
            </div>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="input-primary input-search h-12 text-base"
            >
              <option value="mais_recentes">Mais Recentes</option>
              <option value="mais_antigos">Mais Antigos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Processos Encontrados ({filteredProcesses.length})
          </h3>
          {searchTerm && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Busca por: "<span className="font-medium">{searchTerm}</span>"
            </p>
          )}
        </div>

        {filteredProcesses.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum processo encontrado</h4>
            <p className="text-gray-600 dark:text-gray-400">Tente ajustar os filtros ou termo de busca</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentProcesses.map((process, index) => (
              <div key={`${process.numero_cnj}-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-md p-6 hover:shadow-sm transition-all duration-150 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white mr-3">
                        {process.numero_cnj}
                      </h4>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTribunalColor(process.tribunal_sigla)}`}>
                        {process.tribunal_sigla}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-medium">Polo Ativo:</span>
                        <span className="ml-2">{process.titulo_polo_ativo || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                        <User className="h-4 w-4 mr-2 text-red-600" />
                        <span className="font-medium">Polo Passivo:</span>
                        <span className="ml-2">{process.titulo_polo_passivo || 'Não informado'}</span>
                      </div>

                      <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                        <Scale className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="font-medium">Assunto:</span>
                        <span className="ml-2">{process.assunto || 'Assunto não informado'}</span>
                      </div>
                      
                      {process.details?.data_inicio && (
                        <div className="flex items-center text-base text-gray-700 dark:text-gray-300">
                          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                          <span className="font-medium">Data de Início:</span>
                          <span className="ml-2">{new Date(process.details.data_inicio).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => openDetailsModal(process)}
                    className="btn-ghost border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 font-medium dark:text-white"
                  >
                    <FileText className="h-3 w-3 mr-2" />
                    Ver Detalhes
                  </button>
                  <button 
                    onClick={() => openMovimentacoesModal(process)}
                    className="btn-primary"
                    disabled={isLoadingMovimentacoes}
                  >
                    <Scale className="h-3 w-3 mr-2" />
                    {isLoadingMovimentacoes ? 'Carregando...' : 'Abrir Movimentações'}
                  </button>
                </div>
              </div>
            ))}
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-6 px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProcesses.length)} de {filteredProcesses.length} processos
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm border rounded-md ${
                            currentPage === page
                              ? 'bg-black text-white border-black dark:bg-gray-600 dark:border-gray-600'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
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

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Detalhes do Processo
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedProcess.details?.numero_cnj || selectedProcess.numero_cnj}
                </p>
              </div>
              <button
                onClick={closeDetailsModal}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 border border-gray-200 dark:border-gray-600"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="px-8 py-6 space-y-8">
                {/* Informações Básicas */}
                <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-black dark:bg-white rounded-full mr-4"></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informações Básicas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Número CNJ</label>
                      <p className="text-gray-900 dark:text-white font-medium text-lg">{selectedProcess.details?.numero_cnj || selectedProcess.numero_cnj || 'Não informado'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Ano de Início</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.ano_inicio || 'Não informado'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Data de Início</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.data_inicio || 'Não informado'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Estado de Origem</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.estado_origem?.sigla || 'Não informado'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Unidade de Origem</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.unidade_origem?.nome || 'Não informado'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Cidade</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.unidade_origem?.cidade || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {/* Informações das Fontes */}
                {selectedProcess.details?.fontes && selectedProcess.details.fontes.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-1 h-6 bg-black dark:bg-white rounded-full mr-4"></div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informações das Fontes</h3>
                    </div>
                    {selectedProcess.details.fontes.map((fonte, index) => (
                      <div key={index} className="mb-8 last:mb-0">
                        <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 mb-4">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Fonte {index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Nome da Fonte</label>
                              <p className="text-gray-900 dark:text-white font-medium">{fonte.nome || 'Não informado'}</p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Tipo</label>
                              <p className="text-gray-900 dark:text-white font-medium">{fonte.tipo || 'Não informado'}</p>
                            </div>
                            {fonte.capa && (
                              <>
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Classe</label>
                                  <p className="text-gray-900 dark:text-white font-medium">{fonte.capa.classe || 'Não informado'}</p>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Assunto</label>
                                  <p className="text-gray-900 dark:text-white font-medium">{fonte.capa.assunto || 'Não informado'}</p>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Órgão Julgador</label>
                                  <p className="text-gray-900 dark:text-white font-medium">{fonte.capa.orgao_julgador || 'Não informado'}</p>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Data de Distribuição</label>
                                  <p className="text-gray-900 dark:text-white font-medium">{fonte.capa.data_distribuicao || 'Não informado'}</p>
                                </div>
                                {fonte.capa.assunto_principal_normalizado && (
                                  <>
                                    <div className="space-y-2">
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Assunto Principal</label>
                                      <p className="text-gray-900 dark:text-white font-medium">{fonte.capa.assunto_principal_normalizado.nome || 'Não informado'}</p>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Classificação Completa</label>
                                      <p className="text-gray-900 dark:text-white font-medium text-sm bg-gray-100 dark:bg-gray-500 p-3 rounded-lg">{fonte.capa.assunto_principal_normalizado.path_completo || 'Não informado'}</p>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Envolvidos */}
                        {fonte.envolvidos && fonte.envolvidos.length > 0 && (
                          <div className="mt-6">
                            <h5 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Envolvidos</h5>
                            <div className="space-y-3">
                              {fonte.envolvidos.map((envolvido, envIndex) => (
                                <div key={envIndex} className="bg-white dark:bg-gray-500 border border-gray-200 dark:border-gray-500 rounded-lg p-4 shadow-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Nome</label>
                                      <p className="text-gray-900 dark:text-white font-medium">{envolvido.nome || 'Não informado'}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Tipo</label>
                                      <p className="text-gray-900 dark:text-white font-medium">{envolvido.tipo_normalizado || 'Não informado'}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">OAB</label>
                                      <p className="text-gray-900 dark:text-white font-medium">
                                        {envolvido.oabs && envolvido.oabs.length > 0 
                                          ? envolvido.oabs.map(oab => oab.numero).join(', ') 
                                          : 'Não informado'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}

                {/* Status do Processo */}
                <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-6 bg-black dark:bg-white rounded-full mr-4"></div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Status do Processo</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Status Predito</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.status_predito || 'Não informado'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Segredo de Justiça</label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedProcess.details?.segredo_justica !== undefined 
                          ? (selectedProcess.details.segredo_justica ? 'Sim' : 'Não') 
                          : 'Não informado'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Última Movimentação</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.data_ultima_movimentacao || 'Não informado'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Quantidade de Movimentações</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedProcess.details?.quantidade_movimentacoes || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Movimentações */}
      {showMovimentacoesModal && selectedProcessMovimentacoes && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Movimentações do Processo
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedProcessMovimentacoes.numero_cnj}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Últimas 5 movimentações</p>
              </div>
              <button
                onClick={closeMovimentacoesModal}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 border border-gray-200 dark:border-gray-600"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="px-8 py-6">
                {isLoadingMovimentacoes ? (
                <div className="flex flex-col items-center justify-center py-16">
                  {/* Loading elegante com pontos pulsantes */}
                   <div className="flex flex-col items-center mb-8">
                     {/* Pontos animados */}
                     <div className="flex space-x-2 mb-6">
                       <div className="w-3 h-3 bg-black dark:bg-white rounded-full animate-bounce" style={{animationDelay: '0ms', animationDuration: '1.4s'}}></div>
                       <div className="w-3 h-3 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '200ms', animationDuration: '1.4s'}}></div>
                       <div className="w-3 h-3 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '400ms', animationDuration: '1.4s'}}></div>
                     </div>
                     
                     {/* Barras de loading */}
                     <div className="flex space-x-1">
                       <div className="w-1 bg-black dark:bg-white rounded-full animate-pulse" style={{height: '24px', animationDelay: '0ms', animationDuration: '1.2s'}}></div>
                       <div className="w-1 bg-gray-700 dark:bg-gray-300 rounded-full animate-pulse" style={{height: '32px', animationDelay: '100ms', animationDuration: '1.2s'}}></div>
                       <div className="w-1 bg-gray-600 dark:bg-gray-400 rounded-full animate-pulse" style={{height: '20px', animationDelay: '200ms', animationDuration: '1.2s'}}></div>
                       <div className="w-1 bg-gray-500 dark:bg-gray-500 rounded-full animate-pulse" style={{height: '28px', animationDelay: '300ms', animationDuration: '1.2s'}}></div>
                       <div className="w-1 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse" style={{height: '16px', animationDelay: '400ms', animationDuration: '1.2s'}}></div>
                       <div className="w-1 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" style={{height: '24px', animationDelay: '500ms', animationDuration: '1.2s'}}></div>
                     </div>
                   </div>
                  
                  {/* Texto principal */}
                  <div className="text-center max-w-md">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
                      Carregando movimentações
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      Aguarde enquanto buscamos os dados no sistema
                    </p>
                    
                    {/* Barra de progresso animada */}
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mb-6 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gray-400 to-black dark:from-gray-300 dark:to-white rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Informação de timeout */}
                    <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400 dark:text-gray-300 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700 dark:text-white mb-1">
                            Tempo limite: 10 segundos
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
                            Se o carregamento exceder este tempo, será exibida uma mensagem informativa com orientações.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ) : movimentacoes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg p-6">
                      <Scale className="h-12 w-12 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">📋 Nenhuma movimentação encontrada</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Este processo ainda não possui movimentações registradas no sistema.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {movimentacoes.map((movimentacao, index) => {
                      const movimentacaoNumber = index + 1;
                      return (
                      <div key={`mov-${movimentacao.id || index}-${movimentacaoNumber}`} className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full mr-4"></div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Movimentação {movimentacaoNumber}
                              </h3>
                              {(movimentacao.data_movimentacao || movimentacao.data) && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  📅 {new Date(movimentacao.data_movimentacao || movimentacao.data).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                          {movimentacao.tipo && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              movimentacao.tipo === 'Sistema' 
                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            }`}>
                              {movimentacao.tipo}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          {movimentacao.descricao && (
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Descrição</label>
                              <p className="text-gray-900 dark:text-white font-medium leading-relaxed bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 p-3 rounded-lg">{movimentacao.descricao}</p>
                            </div>
                          )}
                          
                          {movimentacao.complemento && (
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">💬 Complemento</label>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-500">{movimentacao.complemento}</p>
                            </div>
                          )}
                          
                          {movimentacao.id === 'timeout_1' && (
                            <div className="mt-2 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                              <p className="text-xs text-yellow-700 dark:text-yellow-200">
                                ⚠️ <strong>Aviso:</strong> Houve um problema de timeout ao carregar os dados. 
                                Tente fechar e abrir novamente as movimentações.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      );
                    })}
                    
                    {movimentacoes.length > 0 && !movimentacoes.some(m => m.id === 'timeout_1') && (
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ✅ Dados carregados com sucesso • Mostrando as {movimentacoes.length} movimentações mais recentes
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
