import React, { useState, useEffect, Suspense } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import Login from './components/Login';
import Layout from './components/Layout';
import { supabase } from './supabaseClient';

import TourModal from './components/TourModal';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ClientFilter = React.lazy(() => import('./components/ClientFilter'));
const LeadFilter = React.lazy(() => import('./components/LeadFilter'));
const ProcessFilter = React.lazy(() => import('./components/ProcessFilter'));
const ProcessResearch = React.lazy(() => import('./components/ProcessResearch'));
const DocumentGenerator = React.lazy(() => import('./components/DocumentGenerator'));
const ContractAnalysis = React.lazy(() => import('./components/ContractAnalysis'));
const CPFValidator = React.lazy(() => import('./components/CPFValidator'));
const FeeCalculator = React.lazy(() => import('./components/FeeCalculator'));
const DeadlineManagement = React.lazy(() => import('./components/DeadlineManagement'));
const AISupport = React.lazy(() => import('./components/AISupport'));

function AppContent() {
  const { isAuthenticated, currentPage, dispatch } = useApp();
  const [showTour, setShowTour] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pageToPath = (p: string) => {
    switch (p) {
      case 'dashboard': return '/dashboard';
      case 'clients': return '/clientes';
      case 'leads': return '/leads';
      case 'process-filter':
      case 'processes': return '/filtro-processos';
      case 'process-research': return '/pesquisa-processos';
      case 'documents': return '/documentos';
      case 'contracts': return '/contratos';
      case 'cpf-validator': return '/cpf';
      case 'fee-calculator': return '/honorarios';
      case 'deadlines': return '/agenda';
      case 'support': return '/suporte';
      default: return '/dashboard';
    }
  };
  const pathToPage = (path: string) => {
    const clean = (path || '/').trim().toLowerCase();
    switch (clean) {
      case '/dashboard': return 'dashboard';
      case '/clientes': return 'clients';
      case '/leads': return 'leads';
      case '/filtro-processos': return 'process-filter';
      case '/pesquisa-processos': return 'process-research';
      case '/documentos': return 'documents';
      case '/contratos': return 'contracts';
      case '/cpf': return 'cpf-validator';
      case '/honorarios': return 'fee-calculator';
      case '/agenda': return 'deadlines';
      case '/suporte': return 'support';
      case '/': return 'dashboard';
      default: return undefined;
    }
  };

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
          };

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
                };
                dispatch({ type: 'LOGIN', payload: enrichedUser });
                try { localStorage.setItem('agiliza-user', JSON.stringify(enrichedUser)); } catch (e) { console.warn('Falha ao salvar usuário no localStorage', e); }
              }
            })
            .catch((e) => console.warn('Falha ao enriquecer dados do advogado:', e));
        }

        const initialPathPage = pathToPage(window.location.pathname);
        if (initialPathPage) {
          dispatch({ type: 'SET_CURRENT_PAGE', payload: initialPathPage });
        } else {
          const storedPage = localStorage.getItem('agiliza-last-page');
          if (storedPage) {
            dispatch({ type: 'SET_CURRENT_PAGE', payload: storedPage });
          } else {
            dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' });
            history.replaceState({ page: 'dashboard' }, '', '/dashboard');
          }
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
            };
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
                  };
                  dispatch({ type: 'LOGIN', payload: enrichedUser });
                  try { localStorage.setItem('agiliza-user', JSON.stringify(enrichedUser)); } catch (e) { console.warn('Falha ao salvar usuário no localStorage', e); }
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

  useEffect(() => {
    const handler = () => {
      const p = pathToPage(window.location.pathname);
      if (p) {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: p });
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [dispatch]);

  useEffect(() => {
    if (!authChecked || !currentPage) return;
    const desired = pageToPath(currentPage);
    if (window.location.pathname !== desired) {
      history.pushState({ page: currentPage }, '', desired);
    }
  }, [currentPage, authChecked]);

  // Persistir página atual
  useEffect(() => {
    if (currentPage) {
      try { localStorage.setItem('agiliza-last-page', currentPage); } catch (e) { console.warn('Falha ao salvar página no localStorage', e); }
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
        <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center">Carregando…</div>}>
          <div className="animate-fade-in">
            {renderCurrentPage()}
          </div>
        </Suspense>
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
