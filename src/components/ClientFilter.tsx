import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, Users, FileText, Plus, Edit2, Save, X, Trash2, MessageCircle, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useApp } from '../contexts/AppContext';
import EmptyState from './EmptyState';
import SwipeableListItem from './SwipeableListItem';
import ActionMenu from './ActionMenu';
import PageHeader from './PageHeader';

interface Client {
  cpfcnpj: string;
  nome: string;
  whatsapp: string | null;
  created_at: string;
  numero_cnj?: string | null;
}

interface DisplayClient {
  id: string;
  name: string;
  cpfcnpj: string;
  whatsapp: string;
  createdAt: string;
  numeroCnj: string;
}

export default function ClientFilter() {
  const { dispatch } = useApp();
  const [clients, setClients] = useState<DisplayClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // const [showAddModal, setShowAddModal] = useState(false); // Removido temporariamente
  const [editingWhatsApp, setEditingWhatsApp] = useState<string | null>(null);
  const [whatsappValue, setWhatsappValue] = useState('');
  const itemsPerPage = 10;

  // Função para formatar CPF/CNPJ
  const formatCpfCnpj = (value: string) => {
    if (!value) return value;
    
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Se tem 11 dígitos, é CPF
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    // Se tem 14 dígitos, é CNPJ
    else if (numbers.length === 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    // Se não tem 11 nem 14 dígitos, retorna como está
    return value;
  };

  // Buscar clientes do Supabase
  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select(`
          cpfcnpj, 
          nome, 
          whatsapp, 
          created_at,
          clientes_processos(numero_cnj)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return;
      }

      // Transformar dados para o formato de exibição
      const displayClients: DisplayClient[] = data.map((client: any) => ({
        id: client.cpfcnpj,
        name: client.nome || 'Nome não informado',
        cpfcnpj: client.cpfcnpj,
        whatsapp: client.whatsapp || 'Não informado',
        createdAt: new Date(client.created_at).toLocaleDateString('pt-BR'),
        numeroCnj: client.clientes_processos?.[0]?.numero_cnj || 'Não informado'
      }));

      setClients(displayClients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar WhatsApp no Supabase
  const updateWhatsApp = async (cpfcnpj: string, newWhatsApp: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .update({ whatsapp: newWhatsApp || null })
        .eq('cpfcnpj', cpfcnpj);

      if (error) {
        console.error('Erro ao atualizar WhatsApp:', error);
        return false;
      }

      // Atualizar estado local
      setClients(prev => prev.map(client => 
        client.cpfcnpj === cpfcnpj 
          ? { ...client, whatsapp: newWhatsApp || 'Não informado' }
          : client
      ));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar WhatsApp:', error);
      return false;
    }
  };

  // Função para excluir WhatsApp
  const deleteWhatsApp = async (cpfcnpj: string) => {
    return await updateWhatsApp(cpfcnpj, '');
  };

  // Função para iniciar edição
  const startEditingWhatsApp = (clientId: string, currentWhatsApp: string) => {
    setEditingWhatsApp(clientId);
    setWhatsappValue(currentWhatsApp === 'Não informado' ? '' : currentWhatsApp);
  };

  // Função para salvar WhatsApp
  const saveWhatsApp = async (cpfcnpj: string) => {
    const success = await updateWhatsApp(cpfcnpj, whatsappValue.trim());
    if (success) {
      setEditingWhatsApp(null);
      setWhatsappValue('');
    }
  };

  // Função para cancelar edição
  const cancelEditingWhatsApp = () => {
    setEditingWhatsApp(null);
    setWhatsappValue('');
  };

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.cpfcnpj.includes(searchTerm) ||
                         client.whatsapp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.numeroCnj.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  // Reset página quando filtro muda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Função para recarregar clientes após cadastro - removida temporariamente
  // const handleClientAdded = () => {
  //   fetchClients();
  // };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center py-12">
          <div className="spinner h-8 w-8"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando clientes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
          icon={Users}
          title="Clientes Cadastrados"
          subtitle="Lista de clientes do sistema"
        />

      {/* Filtros e Busca */}
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
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Buscar por nome, CPF/CNPJ, WhatsApp ou número CNJ..."
                className="input-primary input-search transition-all duration-200"
                style={{ paddingLeft: isSearchFocused ? '20px' : '34px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Clientes Cadastrados ({filteredClients.length})
          </h3>
        </div>
        
        {currentClients.length === 0 && filteredClients.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum cliente encontrado"
            description="Nenhum cliente encontrado com os filtros aplicados. Tente ajustar os critérios de busca."
            action={{
              label: 'Limpar Filtros',
              onClick: () => {
                setSearchTerm('');
              }
            }}
          />
        ) : filteredClients.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum cliente encontrado"
            description="Nenhum cliente encontrado com os filtros aplicados. Tente ajustar os critérios de busca."
            action={{
              label: 'Limpar Filtros',
              onClick: () => {
                setSearchTerm('');
              }
            }}
          />
        ) : (
          <>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentClients.map((client) => (
              <SwipeableListItem
                key={client.id}
                onEdit={() => console.log('Edit client', client.id)}
                onDelete={() => console.log('Delete client', client.id)}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-black dark:text-white tracking-tight mb-6">{client.name}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center mb-2">
                            <User className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">CPF/CNPJ</span>
                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{formatCpfCnpj(client.cpfcnpj)}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Phone className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                              <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">WhatsApp</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {editingWhatsApp === client.cpfcnpj ? (
                                <>
                                  <button
                                    onClick={() => saveWhatsApp(client.cpfcnpj)}
                                    className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                                    title="Salvar"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={cancelEditingWhatsApp}
                                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                    title="Cancelar"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditingWhatsApp(client.cpfcnpj, client.whatsapp)}
                                    className="bg-black dark:bg-gray-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors duration-200 flex items-center gap-1"
                                    title="Editar WhatsApp"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  {client.whatsapp !== 'Não informado' && (
                                    <button
                                      onClick={() => deleteWhatsApp(client.cpfcnpj)}
                                      className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                      title="Excluir WhatsApp"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          {editingWhatsApp === client.cpfcnpj ? (
                            <input
                              type="text"
                              value={whatsappValue}
                              onChange={(e) => setWhatsappValue(e.target.value)}
                              placeholder="Digite o WhatsApp"
                              className="w-full text-lg font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  saveWhatsApp(client.cpfcnpj);
                                } else if (e.key === 'Escape') {
                                  cancelEditingWhatsApp();
                                }
                              }}
                            />
                          ) : (
                            <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{client.whatsapp}</span>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                              <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Processo CNJ</span>
                            </div>

                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{client.numeroCnj}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Cadastrado em</span>
                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{client.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex items-start">
                      <ActionMenu />
                    </div>
                  </div>
                </div>
              </SwipeableListItem>
              ))}
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-6 px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClients.length)} de {filteredClients.length} clientes
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
    </div>
  );
}