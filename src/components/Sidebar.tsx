import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  FileText, 
  FileSearch, 
  Search, 
  Filter,
  Clock, 
  MessageCircle, 
  Menu,
  Scale,
  X,
  Calculator,
  Shield
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Tooltip from './Tooltip';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Visão geral do sistema' },
  { id: 'clients', label: 'Clientes', icon: Users, tooltip: 'Qualificação inteligente de leads' },
  { id: 'leads', label: 'Leads', icon: UserPlus, tooltip: 'Gestão de leads e prospects' },
  { id: 'process-filter', label: 'Filtro de Processos', icon: Filter, tooltip: 'Filtro e gerenciamento de processos' },
  { id: 'process-research', label: 'Pesquisa de Processos', icon: Search, tooltip: 'Pesquisa de processos via CNJ' },
  { id: 'documents', label: 'Documentos IA', icon: FileText, tooltip: 'Geração automática de documentos' },
  { id: 'contracts', label: 'Análise de Contratos', icon: FileSearch, tooltip: 'Análise de riscos contratuais' },
  { id: 'cpf-validator', label: 'Validador de CPF', icon: Shield, tooltip: 'Verificação de validade de CPF' },
  { id: 'fee-calculator', label: 'Cálculo de Honorários', icon: Calculator, tooltip: 'Calculadora inteligente de honorários advocatícios' },
  { id: 'deadlines', label: 'Agenda Jurídica', icon: Clock, tooltip: 'Gestão de compromissos e prazos processuais' },
  { id: 'support', label: 'Atendimento IA', icon: MessageCircle, tooltip: 'Atendimento automatizado 24/7' },

];

export default function Sidebar() {
  const { currentPage, sidebarOpen, dispatch } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handlePageChange = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
    setIsMobileOpen(false); // Fechar drawer no mobile
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Mobile Header
  const MobileHeader = () => (
    <div className="md:hidden header-mobile bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={toggleMobile}
          className="btn-icon"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        
        <div className="flex items-center">
          <Scale className="h-6 w-6 text-slate-900 mr-2" strokeWidth={1.5} />
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">AgilizaDireito</h1>
        </div>
        
        <div className="w-11"></div> {/* Spacer for centering */}
      </div>
    </div>
  );

  // Mobile Drawer
  const MobileDrawer = () => (
    <>
      {isMobileOpen && (
        <div className="mobile-overlay md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      <div className={`mobile-drawer md:hidden ${isMobileOpen ? 'open' : ''}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Scale className="h-6 w-6 text-slate-900 dark:text-white mr-3" strokeWidth={1.5} />
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">AgilizaDireito</h1>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="btn-icon text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.id === 'process-filter' && currentPage === 'processes');
              
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-md text-sm font-medium transition-all duration-150 relative ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-700'
                      : 'text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" strokeWidth={1.5} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="badge-numeric ml-auto">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={`hidden md:block fixed left-0 top-0 h-full enterprise-sidebar transition-all duration-200 z-50 ${
      sidebarOpen ? 'w-60' : 'w-20'
    }`}>
      <div className="p-4 flex flex-col h-full">
        {/* Logo e botão de expandir/recolher na mesma linha (expandido) ou empilhados (minimizado) */}
        {sidebarOpen ? (
          <div className="flex items-center justify-between mb-8 mt-4">
            <div className="flex items-center">
              <Scale className="h-9 w-9 text-slate-900 dark:text-white mr-3" strokeWidth={1.5} />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AgilizaDireito</h1>
            </div>
            <Tooltip content={sidebarOpen ? 'Recolher menu' : 'Expandir menu'}>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                className="btn-icon ml-2"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 gap-2 mt-6">
            <Scale className="h-8 w-8 text-slate-900 dark:text-white" strokeWidth={1.5} />
            <Tooltip content="Expandir menu">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                className="btn-icon"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </Tooltip>
          </div>
        )}
        {/* Menu */}
        <nav className={`flex-1 ${sidebarOpen ? '' : 'flex flex-col items-center mt-2 gap-4'}`}> 
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'process-filter' && currentPage === 'processes');
            if (sidebarOpen) {
              // Menu expandido (igual à primeira imagem)
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-md text-base font-semibold transition-all duration-150 relative my-1 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-700'
                      : 'text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-left break-words leading-snug">{item.label}</span>
                  {item.badge && (
                    <span className="badge-numeric ml-auto">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            } else {
              // Menu minimizado (apenas ícones, centralizados)
              return (
                <Tooltip key={item.id} content={item.tooltip} position="right">
                  <div className="relative flex flex-col items-center">
                    <button
                      onClick={() => handlePageChange(item.id)}
                      className={`flex items-center justify-center w-11 h-11 rounded-md transition-all duration-150 ${
                        isActive ? 'bg-slate-900 text-white dark:bg-slate-700' : 'text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                    {item.badge && (
                      <span className="badge-numeric absolute -bottom-2 left-1/2 -translate-x-1/2">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Tooltip>
              );
            }
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <MobileHeader />
      <MobileDrawer />
      <DesktopSidebar />
    </>
  );
}