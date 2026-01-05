import React, { useState } from 'react';
import { Search, FileText, Calendar, Users, AlertCircle, Loader2, RefreshCw, Scale, Clock, Trash2, CheckCircle } from 'lucide-react';
import { useFiltroProcessos } from '../hooks/useFiltroProcessos';
import PageHeader from './PageHeader';

const ProcessFilter: React.FC = () => {
  const { processos, loading, error, refetch, searchProcessos, deleteProcesso } = useFiltroProcessos();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [processoToDelete, setProcessoToDelete] = useState<number | null>(null);
  const [showSearchNotification, setShowSearchNotification] = useState(false);
  const processosPerPage = 5;

  // Função para atualizar a lista
  const handleRefresh = () => {
    refetch();
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Função para validar formato CNJ
  const validateCNJFormat = (cnj: string): boolean => {
    // Remove espaços e caracteres especiais
    const cleanCNJ = cnj.replace(/[^\d]/g, '');
    
    // Verifica se tem 20 dígitos
    if (cleanCNJ.length !== 20) {
      return false;
    }
    
    // Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
    const cnjRegex = /^\d{7}-?\d{2}\.?\d{4}\.?\d{1}\.?\d{2}\.?\d{4}$/;
    return cnjRegex.test(cnj) || /^\d{20}$/.test(cleanCNJ);
  };

  // Função para formatar número CNJ
  const formatCNJ = (cnj: string): string => {
    const cleanCNJ = cnj.replace(/[^\d]/g, '');
    if (cleanCNJ.length === 20) {
      return `${cleanCNJ.slice(0, 7)}-${cleanCNJ.slice(7, 9)}.${cleanCNJ.slice(9, 13)}.${cleanCNJ.slice(13, 14)}.${cleanCNJ.slice(14, 16)}.${cleanCNJ.slice(16, 20)}`;
    }
    return cnj;
  };

  // Função para buscar processo via webhook CNJ
  const handleCNJSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchError('Por favor, digite um número CNJ válido');
      return;
    }

    if (!validateCNJFormat(searchTerm)) {
      setSearchError('Formato de número CNJ inválido. Use o formato: NNNNNNN-DD.AAAA.J.TR.OOOO');
      return;
    }

    setIsSearching(true);
    setShowSearchNotification(true);
    
    try {
      // Webhook para consulta CNJ
      const webhookUrl = 'https://n8n-n8n.04qisd.easypanel.host/webhook/juridico/analise-de-processos';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numero_cnj: formatCNJ(searchTerm),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na consulta: ${response.status}`);
      }

      const data = await response.json();
      
      // Log para debug - remover mensagens indesejadas do webhook
      console.log('Resposta do webhook:', data);
      
      if (data.success) {
        // Se encontrou o processo, atualiza a lista
        await searchProcessos(searchTerm);
        setCurrentPage(1);
        // Removido o alert - a notificação já mostra o sucesso
      } else {
        // Removido o alert - a notificação já mostra o status
        console.log(data.message || 'Processo não encontrado nos tribunais');
      }
    } catch (error) {
      console.error('Erro ao consultar CNJ:', error);
      // Removido o alert - a notificação já mostra o erro
    } finally {
      setIsSearching(false);
      // Manter a notificação por mais 2 segundos após a pesquisa
      setTimeout(() => setShowSearchNotification(false), 2000);
    }
  };

  

  // Função para obter cor do status
  const getStatusColor = (situacao: string) => {
    if (!situacao) return 'bg-gray-100 text-gray-700 border-gray-300';
    
    const status = situacao.toLowerCase();
    if (status.includes('ativo') || status.includes('andamento')) {
      return 'bg-black text-white border-black';
    }
    if (status.includes('suspenso') || status.includes('aguardando')) {
      return 'bg-gray-200 text-gray-800 border-gray-400';
    }
    if (status.includes('arquivado') || status.includes('finalizado')) {
      return 'bg-gray-100 text-gray-600 border-gray-300';
    }
    
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Funções para exclusão de processo
  const handleDeleteClick = (processoId: number) => {
    setProcessoToDelete(processoId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (processoToDelete) {
      const success = await deleteProcesso(processoToDelete);
      if (success) {
        setShowDeleteModal(false);
        setProcessoToDelete(null);
        // Se estamos na última página e não há mais processos, voltar uma página
        const remainingProcessos = processos.length - 1;
        const newTotalPages = Math.ceil(remainingProcessos / processosPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProcessoToDelete(null);
  };

  // Calcular processos da página atual
  const totalProcessos = processos.length;
  const totalPages = Math.ceil(totalProcessos / processosPerPage);
  const startIndex = (currentPage - 1) * processosPerPage;
  const endIndex = startIndex + processosPerPage;
  const currentProcessos = processos.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <PageHeader 
        icon={Search}
        title="Pesquisa de Processos"
        subtitle="Lista de processos do sistema"
      />

        {/* Barra de Busca CNJ */}
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
                  onChange={(e) => { setSearchTerm(e.target.value); setSearchError(''); }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Digite o número CNJ (ex: 1234567-89.2023.1.01.0001)"
                  className="input-primary input-search transition-all duration-200"
                  style={{ paddingLeft: isSearchFocused ? '20px' : '34px' }}
                />
                {searchError && (
                  <p className="text-red-700 text-xs mt-1">{searchError}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCNJSearch}
                disabled={loading || isSearching || !searchTerm.trim()}
                className="px-6 py-3 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white dark:text-black font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buscar CNJ
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Buscar CNJ
                  </>
                )}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading || isSearching}
                className="px-6 py-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 bg-white dark:bg-gray-800"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Estado de Loading */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Carregando processos...</span>
            </div>
          </div>
        )}

        {/* Estado de Erro */}
        {error && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-800 p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-400">Erro ao carregar processos</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estado Vazio */}
        {!loading && !error && totalProcessos === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum processo encontrado</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Os processos aparecerão aqui quando forem adicionados ao sistema
              </p>
            </div>
          </div>
        )}

        {/* Lista de Processos */}
        {!loading && !error && totalProcessos > 0 && (
          <div className="space-y-4">
            {currentProcessos.map((processo) => (
              <div key={processo.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    {/* Cabeçalho do Processo */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white dark:text-black" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {processo.numero_processo}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{processo.classe}</span>
                            <span>•</span>
                            <span>{processo.area_direito}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        {processo.assunto}
                      </p>
                    </div>

                    {/* Status e Badges */}
                    <div className="flex flex-col items-end gap-3 ml-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteClick(processo.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          title="Excluir processo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(processo.situacao)}`}>
                          {processo.situacao}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {processo.segredo === 'Sim' && (
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200 shadow-sm">
                            Em segredo de justiça
                          </span>
                        )}
                        {processo.arquivado === 'Sim' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            <Archive className="w-3 h-3 mr-1" />
                            Arquivado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grid de Informações */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Localização */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <Building className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Localização</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{processo.tribunal}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{processo.comarca}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{processo.estado}</p>
                      </div>
                    </div>

                    {/* Cronologia */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Cronologia</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm dark:text-gray-300"><span className="font-medium">Início:</span> {processo.data_inicio}</p>
                        <p className="text-sm dark:text-gray-300"><span className="font-medium">Última:</span> {processo.ultima_movimentacao}</p>
                        <p className="text-sm dark:text-gray-300"><span className="font-medium">Duração:</span> {processo.tempo_tramitacao}</p>
                      </div>
                    </div>

                    {/* Atividade */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Atividade</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-bold text-lg text-gray-900 dark:text-white">{processo.movimentacoes}</span>
                          <span className="text-gray-600 dark:text-gray-300 ml-1">movimentações</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total registrado</p>
                      </div>
                    </div>
                  </div>

                  {/* Partes e Advogados */}
                  {processo.partes && (
                    <div className="border-t border-gray-100 dark:border-gray-600 pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Partes e Advogados</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {processo.partes.polo_ativo && processo.partes.polo_ativo.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Polo Ativo
                            </p>
                            <div className="space-y-1">
                              {processo.partes.polo_ativo.map((parte, index) => (
                                <p key={index} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                  {parte}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        {processo.partes.polo_passivo && processo.partes.polo_passivo.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Polo Passivo
                            </p>
                            <div className="space-y-1">
                              {processo.partes.polo_passivo.map((parte, index) => (
                                <p key={index} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                  {parte}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        {processo.partes.advogados && processo.partes.advogados.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              <Gavel className="w-4 h-4" />
                              Advogados
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {processo.partes.advogados.map((advogado, index) => (
                                <p key={index} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                  {advogado}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Paginação */}
            <div className="mt-6 px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
              <div className="flex items-center justify-center space-x-6">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, totalProcessos)}</span> de <span className="font-medium">{totalProcessos}</span> processos
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
                    {Array.from({ length: totalPages }, (_, i) => {
                      const page = i + 1;
                      return (
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
                      );
                    })}
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
          </div>
        )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Tem certeza que deseja excluir este processo?
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificação Elegante de Pesquisa */}
      {showSearchNotification && (
        <div className="fixed top-6 right-6 z-50 bg-white text-gray-900 px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right max-w-sm border border-gray-200 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Scale className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-900">
                  {isSearching ? 'Pesquisando Processo' : 'Pesquisa Concluída'}
                </p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isSearching 
                  ? `Consultando CNJ ${formatCNJ(searchTerm)} nos tribunais...` 
                  : 'Processo analisado com sucesso!'
                }
              </p>
              {isSearching && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-gray-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessFilter;
