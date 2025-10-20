import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, Tag, FileText, Scale, TrendingUp, MessageCircle, UserPlus } from 'lucide-react';
import EmptyState from './EmptyState';
import SwipeableListItem from './SwipeableListItem';
import ActionMenu from './ActionMenu';
import PageHeader from './PageHeader';
import { supabase } from '../supabaseClient';

interface Lead {
  whatsapp: string;
  nome: string;
  assunto: string;
  created_at: string;
  pausar_ia: boolean;
  classificacao: string;
  area_direito: string;
  probabilidade_conversao: string;
  tipo_cliente: string;
}

// Função para formatar data
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para extrair telefone do WhatsApp
const formatWhatsApp = (whatsapp: string) => {
  // Remove @s.whatsapp.net e formata o número
  const number = whatsapp.replace('@s.whatsapp.net', '');
  // Formata como (XX) XXXXX-XXXX
  if (number.length >= 13) {
    return `(${number.slice(2, 4)}) ${number.slice(4, 9)}-${number.slice(9)}`;
  }
  return number;
};

const getStatusColor = (classificacao: string) => {
  switch (classificacao) {
    case 'QUENTE': return 'bg-red-100 text-red-800';
    case 'MORNO': return 'bg-yellow-100 text-yellow-800';
    case 'FRIO': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function LeadFilter() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const itemsPerPage = 10;

  // Carregar dados reais do Supabase
  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erro ao carregar leads:', error);
          setLeads([]);
        } else {
          setLeads(data || []);
        }
      } catch (error) {
        console.error('Erro ao conectar com Supabase:', error);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formatWhatsApp(lead.whatsapp).includes(searchTerm) ||
                         lead.classificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.area_direito.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.probabilidade_conversao.toString().includes(searchTerm);
    return matchesSearch;
  });

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  // Reset página quando filtro muda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center py-12">
          <div className="spinner h-8 w-8"></div>
          <span className="ml-3 text-gray-600">Carregando leads...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        icon={UserPlus}
        title="Leads Cadastrados"
        subtitle="Lista de leads do sistema"
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
                placeholder="Buscar por nome, telefone, status, assunto, área ou probabilidade..."
                className="input-primary input-search transition-all duration-200"
                style={{ paddingLeft: isSearchFocused ? '20px' : '34px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Leads */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Leads Cadastrados ({filteredLeads.length})
          </h3>
        </div>
        
        {currentLeads.length === 0 && filteredLeads.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum lead encontrado"
            description="Nenhum lead encontrado com os filtros aplicados. Tente ajustar os critérios de busca."
            action={{
              label: 'Limpar Filtros',
              onClick: () => {
                setSearchTerm('');
              }
            }}
          />
        ) : filteredLeads.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum lead encontrado"
            description="Nenhum lead encontrado com os filtros aplicados. Tente ajustar os critérios de busca."
            action={{
              label: 'Limpar Filtros',
              onClick: () => {
                setSearchTerm('');
              }
            }}
          />
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {currentLeads.map((lead, index) => (
              <SwipeableListItem
                key={lead.whatsapp}
                onEdit={() => console.log('Edit lead', lead.whatsapp)}
                onDelete={() => console.log('Delete lead', lead.whatsapp)}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-black dark:text-white tracking-tight mb-4">{lead.nome}</h4>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-24 flex flex-col">
                          <div className="flex items-center mb-2">
                            <Tag className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Classificação</span>
                          </div>
                          <span className={`inline-block px-3 py-1 text-sm font-medium ${
                            getStatusColor(lead.classificacao)
                           }`}>
                            {lead.classificacao}
                           </span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-24 flex flex-col">
                          <div className="flex items-center mb-2">
                            <Phone className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Telefone</span>
                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{formatWhatsApp(lead.whatsapp)}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-24 flex flex-col">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Cadastrado em</span>
                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{formatDate(lead.created_at)}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center mb-2">
                            <FileText className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Assunto</span>
                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{lead.assunto}</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-24 flex flex-col">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Probabilidade de Conversão</span>
                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{lead.probabilidade_conversao}%</span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-24 flex flex-col">
                          <div className="flex items-center mb-2">
                            <Scale className="h-5 w-5 mr-3 text-black dark:text-white" strokeWidth={2} />
                            <span className="font-semibold text-black dark:text-white text-sm uppercase tracking-wide">Área</span>
                          </div>
                          <span className="text-lg font-mono text-gray-800 dark:text-gray-200 block">{lead.area_direito}</span>
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
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredLeads.length)} de {filteredLeads.length} leads
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