import React, { useState } from 'react';
import { LogOut, Search, Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeProvider';

// Menu items do sidebar para busca
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', keywords: ['dashboard', 'painel', 'visão geral', 'inicio'] },
  { id: 'clients', label: 'Clientes', keywords: ['clientes', 'cliente', 'pessoas', 'contatos'] },
  { id: 'leads', label: 'Leads', keywords: ['leads', 'lead', 'prospects', 'prospectos', 'oportunidades'] },
  { id: 'process-filter', label: 'Filtro de Processos', keywords: ['filtro', 'processos', 'processo', 'filtrar', 'gerenciar'] },
  { id: 'process-research', label: 'Pesquisa de Processos', keywords: ['pesquisa', 'processos', 'processo', 'cnj', 'buscar'] },
  { id: 'documents', label: 'Documentos IA', keywords: ['documentos', 'documento', 'ia', 'inteligencia artificial', 'gerar'] },
  { id: 'contracts', label: 'Análise de Contratos', keywords: ['contratos', 'contrato', 'análise', 'analise', 'riscos'] },
  { id: 'cpf-validator', label: 'Validador de CPF', keywords: ['cpf', 'validador', 'validar', 'verificar', 'documento'] },
  { id: 'fee-calculator', label: 'Cálculo de Honorários', keywords: ['honorários', 'honorarios', 'cálculo', 'calculo', 'calculadora', 'valores'] },
  { id: 'deadlines', label: 'Agenda Jurídica', keywords: ['agenda', 'prazos', 'compromissos', 'calendario', 'datas'] },
  { id: 'support', label: 'Atendimento IA', keywords: ['atendimento', 'suporte', 'ajuda', 'ia', 'chat', 'assistente'] },
];

export default function Header() {
  const { user, logout, dispatch } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
  };

  

  // Filtrar páginas baseado no termo de busca
  const filteredPages = menuItems.filter(item => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  // Navegar para uma página
  const navigateToPage = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
    setSearchTerm('');
    setShowSearch(false);
    setIsSearchFocused(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearch(value.length > 0 || isSearchFocused);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredPages.length > 0) {
      navigateToPage(filteredPages[0].id);
    }
    if (e.key === 'Escape') {
      setSearchTerm('');
      setShowSearch(false);
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="enterprise-header hidden md:block">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center flex-1">
          {/* Search Bar */}
          <div className="relative max-w-lg w-full">
            <div className="relative">
              {!showSearch && (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
              )}
              <input
                type="text"
                placeholder="Buscar páginas..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="input-primary pr-24 h-12 text-base"
                style={{ paddingLeft: isSearchFocused ? '20px' : '34px' }}
                onFocus={() => {
                  setShowSearch(true);
                  setIsSearchFocused(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchTerm.trim()) {
                      setShowSearch(false);
                    }
                  }, 200);
                  setIsSearchFocused(false);
                }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <kbd className="keyboard-shortcut text-sm px-2 py-1">⌘K</kbd>
              </div>
            </div>
            
            {/* Search Dropdown */}
            {showSearch && (
              <div className="dropdown absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                <div className="p-2">
                  {searchTerm.trim() ? (
                    <>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-2 px-2">
                        Páginas encontradas ({filteredPages.length})
                      </div>
                      {filteredPages.length > 0 ? (
                        filteredPages.map((page) => (
                          <div
                            key={page.id}
                            onClick={() => navigateToPage(page.id)}
                            className="dropdown-item cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <Search className="h-4 w-4 mr-3 text-gray-400" strokeWidth={1.5} />
                            <span className="text-gray-900 dark:text-white">{page.label}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          Nenhuma página encontrada para "{searchTerm}"
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-2 px-2">Páginas disponíveis</div>
                       {menuItems.slice(0, 3).map((page) => (
                         <div
                           key={page.id}
                           onClick={() => navigateToPage(page.id)}
                           className="dropdown-item cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                         >
                           <Search className="h-4 w-4 mr-3 text-gray-400" strokeWidth={1.5} />
                           <span className="text-gray-900 dark:text-white">{page.label}</span>
                         </div>
                       ))}
                       {menuItems.length > 3 && (
                         <div className="px-2 py-1 text-xs text-gray-400 dark:text-gray-500 text-center border-t border-gray-100 dark:border-gray-600 mt-2 pt-2">
                           Digite para buscar entre todas as {menuItems.length} páginas
                         </div>
                       )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* User Info */}
          <div className="text-right hidden lg:block">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {user?.oab && user?.uf ? `OAB ${user.oab}/${user.uf}` : 'Advogado'}
            </div>
          </div>
          
          {/* Avatar */}
          <div className="avatar avatar-lg">
            <span className="text-lg">{user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon p-3"
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn-ghost px-4 py-2 text-base"
          >
            <LogOut className="h-5 w-5 mr-2" strokeWidth={1.5} />
            <span className="hidden lg:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
