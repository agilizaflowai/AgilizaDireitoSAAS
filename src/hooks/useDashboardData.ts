import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface DashboardMetrics {
  totalLeads: number;
  totalContratos: number;
  totalClientes: number;
  totalProcessos: number;
  conversionRate: number;
  upcomingDeadlines: number;
  todayAppointments: number;
  contractsStatus: {
    seguro: number;
    atencaoNecessaria: number;
    altoRisco: number;
    outros: number;
  };
  clientsEvolution: Array<{
    month: string;
    clients: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'warning' | 'info' | 'success';
    message: string;
  }>;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    totalContratos: 0,
    totalClientes: 0,
    totalProcessos: 0,
    conversionRate: 0,
    upcomingDeadlines: 0,
    todayAppointments: 0,
    contractsStatus: {
      seguro: 0,
      atencaoNecessaria: 0,
      altoRisco: 0,
      outros: 0,
    },
    clientsEvolution: [],
    recentActivity: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados em paralelo
      const [
        leadsResult,
        contratosResult,
        clientesResult,
        processosResult,
        chatResult
      ] = await Promise.allSettled([
        supabase.from('leads').select('*', { count: 'exact' }),
        supabase.from('contratos').select('*', { count: 'exact' }),
        supabase.from('clientes').select('*', { count: 'exact' }),
        supabase.from('processos').select('*', { count: 'exact' }),
        supabase.from('chat').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      // Processar resultados
      const totalLeads = leadsResult.status === 'fulfilled' ? (leadsResult.value.count || 0) : 0;
      const totalContratos = contratosResult.status === 'fulfilled' ? (contratosResult.value.count || 0) : 0;
      const totalClientes = clientesResult.status === 'fulfilled' ? (clientesResult.value.count || 0) : 0;
      const totalProcessos = processosResult.status === 'fulfilled' ? (processosResult.value.count || 0) : 0;

      // Calcular taxa de conversão (leads que se tornaram clientes)
      const conversionRate = totalLeads > 0 ? Math.round((totalClientes / totalLeads) * 100) : 0;

      // Buscar evolução de clientes (últimos 6 meses)
      const clientsEvolution = await fetchClientsEvolution();

      // Buscar atividade recente
      const recentActivity = await fetchRecentActivity();

      // Gerar alertas baseados nos dados
      const alerts = generateAlerts(totalLeads, totalContratos, totalClientes, totalProcessos);

      // Buscar contratos para análise de status
      const { data: contratos, error: contratosError } = await supabase
        .from('contratos')
        .select('classificacao');

      if (contratosError) {
        console.error('Erro ao buscar contratos:', contratosError);
      }

      // Processar status dos contratos com base na função getStatusColor do ContractAnalysis
      const contractsStatus = {
        seguro: 0,
        atencaoNecessaria: 0,
        altoRisco: 0,
        outros: 0,
      };

      if (contratos) {
        contratos.forEach(contrato => {
          const classificacao = contrato.classificacao?.toLowerCase() || '';
          
          // Lógica baseada na função getStatusColor do ContractAnalysis.tsx
          if (classificacao.includes('baixo') || classificacao.includes('verde') || classificacao.includes('seguro')) {
            contractsStatus.seguro++;
          } else if (classificacao.includes('médio') || classificacao.includes('medio') || classificacao.includes('amarelo') || classificacao.includes('atenção') || classificacao.includes('atencao')) {
            contractsStatus.atencaoNecessaria++;
          } else if (classificacao.includes('alto') || classificacao.includes('vermelho') || classificacao.includes('erro')) {
            contractsStatus.altoRisco++;
          } else {
            contractsStatus.outros++;
          }
        });
      }

      // Obter compromissos de hoje da agenda jurídica
      const todayAppointments = getTodayAppointmentsCount();

      setMetrics({
        totalLeads,
        totalContratos,
        totalClientes,
        totalProcessos,
        conversionRate,
        upcomingDeadlines: 3, // Valor fixo por enquanto
        todayAppointments,
        contractsStatus,
        clientsEvolution,
        recentActivity,
        alerts
      });

    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsEvolution = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (error || !data) return [];

      // Agrupar por mês
      const monthlyData = new Map<string, number>();
      const now = new Date();
      
      // Inicializar últimos 6 meses com 0
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toISOString().slice(0, 7); // YYYY-MM
        monthlyData.set(key, 0);
      }

      // Contar clientes por mês
      data.forEach(client => {
        const date = new Date(client.created_at);
        const key = date.toISOString().slice(0, 7);
        if (monthlyData.has(key)) {
          monthlyData.set(key, (monthlyData.get(key) || 0) + 1);
        }
      });

      // Converter para array
      return Array.from(monthlyData.entries()).map(([key, count]) => ({
        month: new Date(key + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
        clients: count,
        date: new Date(key + '-01')
      }));

    } catch (error) {
      console.error('Erro ao buscar evolução de clientes:', error);
      return [];
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const activities: DashboardMetrics['recentActivity'] = [];

      // Buscar leads recentes
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('nome, created_at, classificacao')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentLeads) {
        recentLeads.forEach(lead => {
          activities.push({
            id: `lead-${lead.nome}`,
            type: 'lead',
            description: `Novo lead: ${lead.nome}`,
            date: new Date(lead.created_at).toLocaleDateString('pt-BR'),
            status: lead.classificacao
          });
        });
      }

      // Buscar contratos recentes
      const { data: recentContracts } = await supabase
        .from('contratos')
        .select('nome_contrato, data_analise, classificacao')
        .order('data_analise', { ascending: false })
        .limit(2);

      if (recentContracts) {
        recentContracts.forEach(contract => {
          activities.push({
            id: `contract-${contract.nome_contrato}`,
            type: 'contract',
            description: `Contrato analisado: ${contract.nome_contrato}`,
            date: contract.data_analise ? new Date(contract.data_analise).toLocaleDateString('pt-BR') : 'N/A',
            status: contract.classificacao
          });
        });
      }

      return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    } catch (error) {
      console.error('Erro ao buscar atividade recente:', error);
      return [];
    }
  };

  const generateAlerts = (leads: number, contratos: number, clientes: number, processos: number) => {
    const alerts: DashboardMetrics['alerts'] = [];

    if (leads < 5) {
      alerts.push({
        id: 'low-leads',
        type: 'warning',
        title: 'Poucos Leads',
        description: 'Número de leads está baixo. Considere intensificar as estratégias de captação.',
        date: new Date().toLocaleDateString('pt-BR')
      });
    }

    if (contratos > 10) {
      alerts.push({
        id: 'many-contracts',
        type: 'info',
        title: 'Muitos Contratos',
        description: `${contratos} contratos analisados. Ótimo trabalho na análise documental!`,
        date: new Date().toLocaleDateString('pt-BR')
      });
    }

    if (clientes === 0) {
      alerts.push({
        id: 'no-clients',
        type: 'error',
        title: 'Sem Clientes',
        description: 'Nenhum cliente cadastrado. Foque na conversão de leads.',
        date: new Date().toLocaleDateString('pt-BR')
      });
    }

    return alerts;
  };

  // Função para obter compromissos de hoje da agenda jurídica
  const getTodayAppointmentsCount = (): number => {
    try {
      const savedEvents = localStorage.getItem('calendar-events');
      if (!savedEvents) return 0;

      const events = JSON.parse(savedEvents);
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      // Filtrar eventos de hoje que não estão cancelados
      const todayEvents = events.filter((event: any) => 
        event.date === todayStr && event.status !== 'cancelled'
      );

      return todayEvents.length;
    } catch (error) {
      console.error('Erro ao obter compromissos de hoje:', error);
      return 0;
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchDashboardData
  };
};