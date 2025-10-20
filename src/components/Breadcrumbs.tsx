import React from 'react';
import { Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const pageNames: Record<string, string> = {
  dashboard: 'Dashboard',
  clients: 'Clientes',
  leads: 'Leads',
  'processes': 'Filtro de Processos',
  'process-filter': 'Filtro de Processos',
  'process-research': 'Pesquisa de Processos',
  documents: 'Documentos IA',
  contracts: 'Análise de Contratos',
  'cpf-validator': 'Validador de CPF',
  'fee-calculator': 'Cálculo de Honorários',
  deadlines: 'Agenda Jurídica',
  support: 'Atendimento IA',
};

export default function Breadcrumbs() {
  const { currentPage, dispatch } = useApp();
  const currentPageName = pageNames[currentPage] || 'Página';

  const handleHomeClick = () => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' });
  };

  return (
    <nav className="breadcrumb mb-6">
      <button
        onClick={handleHomeClick}
        className="flex items-center hover:text-slate-900 dark:text-white dark:hover:text-gray-300 transition-colors duration-150"
      >
        <Home className="h-3 w-3 mr-1" strokeWidth={1.5} />
        Início
      </button>
      
      {currentPage !== 'dashboard' && (
        <>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentPageName}</span>
        </>
      )}
    </nav>
  );
}