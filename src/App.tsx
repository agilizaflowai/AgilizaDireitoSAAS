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
import { supabase } from './supabaseClient';

import TourModal from './components/TourModal';

function AppContent() {
  const { isAuthenticated, currentPage, dispatch } = useApp();
  const [showTour, setShowTour] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Restaurar sessão e última página ao carregar
  useEffect(() => {
    let isMounted = true;

    const hydrateAuthAndPage = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Hidratar usuário a partir da sessão imediatamente (sem bloquear pelo banco)
          const baseUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || 'Usuário',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          } as any;

          if (isMounted) {
            dispatch({ type: 'LOGIN', payload: baseUser });
          }

          // Enriquecer dados do advogado de forma não-bloqueante
          supabase
            .from('advogados')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                const enrichedUser = {
                  ...baseUser,
                  name: data.nome || baseUser.name,
                  oab: data.oab,
                  uf: data.uf,
                } as any;
                dispatch({ type: 'LOGIN', payload: enrichedUser });
                try { localStorage.setItem('agiliza-user', JSON.stringify(enrichedUser)); } catch {}
              }
            })
            .catch((e) => console.warn('Falha ao enriquecer dados do advogado:', e));
        }

        // Restaurar última página navegada
        const storedPage = localStorage.getItem('agiliza-last-page');
        if (storedPage) {
          dispatch({ type: 'SET_CURRENT_PAGE', payload: storedPage });
        }
      } catch (e) {
        console.error('Falha ao hidratar sessão/página:', e);
      } finally {
        if (isMounted) setAuthChecked(true);
      }
    };

    hydrateAuthAndPage();

    const { data: authSub } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const baseUser = {
              id: session.user.id,
              name: session.user.user_metadata?.name || 'Usuário',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            } as any;
            dispatch({ type: 'LOGIN', payload: baseUser });

            supabase
              .from('advogados')
              .select('*')
              .eq('user_id', session.user.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  const enrichedUser = {
                    ...baseUser,
                    name: data.nome || baseUser.name,
                    oab: data.oab,
                    uf: data.uf,
                  } as any;
                  dispatch({ type: 'LOGIN', payload: enrichedUser });
                  try { localStorage.setItem('agiliza-user', JSON.stringify(enrichedUser)); } catch {}
                }
              })
              .catch((e) => console.warn('Falha ao enriquecer dados do advogado:', e));
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (e) {
        console.error('Erro ao atualizar estado de auth:', e);
      }
    });

    return () => {
      isMounted = false;
      authSub?.subscription?.unsubscribe?.();
    };
  }, [dispatch]);

  // Persistir página atual
  useEffect(() => {
    if (currentPage) {
      try { localStorage.setItem('agiliza-last-page', currentPage); } catch {}
    }
  }, [currentPage]);

  // Mostrar tour na primeira vez
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('agiliza-tour-seen');
    if (!hasSeenTour && isAuthenticated) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, [isAuthenticated]);

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem('agiliza-tour-seen', 'true');
  };

  // Evitar flash do Login enquanto verifica sessão
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Verificando sessão…</div>
      </div>
    );
  }

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