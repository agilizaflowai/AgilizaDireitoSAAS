import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClientFilter from './components/ClientFilter';
import LeadFilter from './components/LeadFilter';
import ProcessFilter from './components/ProcessFilter';
import ProcessResearch from './components/ProcessResearch';
import DocumentGenerator from './components/DocumentGenerator';
import ContractAnalysis from './components/ContractAnalysis';
import CPFValidator from './components/CPFValidator';
import FeeCalculator from './components/FeeCalculator';
import DeadlineManagement from './components/DeadlineManagement';
import AISupport from './components/AISupport';


import TourModal from './components/TourModal';


function AppContent() {
  const { isAuthenticated, currentPage } = useApp();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Mostrar tour na primeira vez (simular com localStorage)
    const hasSeenTour = localStorage.getItem('agiliza-tour-seen');
    if (!hasSeenTour && isAuthenticated) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, [isAuthenticated]);

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem('agiliza-tour-seen', 'true');
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientFilter />;
      case 'leads':
        return <LeadFilter />;
      case 'processes':
      case 'process-filter':
        return <ProcessFilter />;
      case 'process-research':
        return <ProcessResearch />;
      case 'documents':
        return <DocumentGenerator />;
      case 'contracts':
        return <ContractAnalysis />;
      case 'cpf-validator':
        return <CPFValidator />;
      case 'fee-calculator':
        return <FeeCalculator />;
      case 'deadlines':
        return <DeadlineManagement />;
      case 'support':
        return <AISupport />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="animate-fade-in">
          {renderCurrentPage()}
        </div>
      </Layout>
      <TourModal isOpen={showTour} onClose={handleCloseTour} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;