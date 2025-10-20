import React from 'react';
import { 
  LayoutDashboard,
  Users, 
  FileText, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  RefreshCw,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  BarChart3,
  Shield
} from 'lucide-react';
import PageHeader from './PageHeader';
import ClientsEvolutionChart from './ClientsEvolutionChart';
import SimpleAgenda from './SimpleAgenda';
import ActionMenu from './ActionMenu';
import { useDashboardData } from '../hooks/useDashboardData';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendDirection }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
          <Icon className="h-7 w-7 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
          trendDirection === 'up' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {trendDirection === 'up' ? (
            <ArrowUp className="h-4 w-4 mr-1" strokeWidth={1.5} />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" strokeWidth={1.5} />
          )}
          {trend}%
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm p-3">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{`${label}`}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {`${payload[0].value} clientes`}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { metrics, loading, error, refetch } = useDashboardData();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENTE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'ATENÇÃO':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader 
          icon={LayoutDashboard}
          title="Dashboard"
          subtitle="Visão geral das métricas e atividades do escritório"
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Erro ao carregar dados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="btn-primary flex items-center mx-auto"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Visão geral das métricas e atividades do escritório"
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 grid-responsive">
        <MetricCard
          title="Total de Leads"
          value={loading ? '...' : metrics.totalLeads}
          subtitle="cadastrados"
          icon={Users}
          trend={null}
          trendDirection={null}
        />
        <MetricCard
          title="Compromissos Hoje"
          value={loading ? '...' : metrics.todayAppointments}
          subtitle="agendados para hoje"
          icon={Calendar}
          trend={null}
          trendDirection={null}
        />
        <MetricCard
          title="Total de Clientes"
          value={loading ? '...' : metrics.totalClientes}
          subtitle="cadastrados"
          icon={Target}
        />
        <MetricCard
          title="Processos Ativos"
          value={loading ? '...' : metrics.totalProcessos}
          subtitle="em andamento"
          icon={Clock}
          trend={null}
          trendDirection={null}
        />
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 grid-responsive">
        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <ClientsEvolutionChart 
            data={metrics.clientsEvolution} 
            loading={loading}
          />
        </div>

        {/* Contratos Analisados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
              <BarChart3 className="h-7 w-7 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contratos Analisados</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Análises realizadas com IA</p>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : metrics.totalContratos > 0 ? (
               <div className="space-y-6">
                 {/* Estatística Principal */}
                 <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                   <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                     {metrics.totalContratos}
                   </div>
                   <p className="text-gray-600 dark:text-gray-400 font-medium">Contratos processados</p>
                 </div>
                 
                 {/* Breakdown Detalhado */}
                 <div className="grid grid-cols-2 gap-4">
                   {/* Contratos Seguros */}
                   {metrics.contractsStatus.seguro > 0 && (
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Seguro</span>
                         <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                       </div>
                       <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.contractsStatus.seguro}</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         {metrics.totalContratos > 0 ? Math.round((metrics.contractsStatus.seguro / metrics.totalContratos) * 100) : 0}% do total
                       </div>
                     </div>
                   )}
                   
                   {/* Contratos com Atenção Necessária */}
                   {metrics.contractsStatus.atencaoNecessaria > 0 && (
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Atenção Necessária</span>
                         <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                       </div>
                       <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.contractsStatus.atencaoNecessaria}</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         {metrics.totalContratos > 0 ? Math.round((metrics.contractsStatus.atencaoNecessaria / metrics.totalContratos) * 100) : 0}% do total
                       </div>
                     </div>
                   )}
                   
                   {/* Contratos de Alto Risco */}
                   {metrics.contractsStatus.altoRisco > 0 && (
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Alto Risco</span>
                         <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                       </div>
                       <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.contractsStatus.altoRisco}</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         {metrics.totalContratos > 0 ? Math.round((metrics.contractsStatus.altoRisco / metrics.totalContratos) * 100) : 0}% do total
                       </div>
                     </div>
                   )}
                   
                   {/* Outros Status */}
                   {metrics.contractsStatus.outros > 0 && (
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Outros</span>
                         <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                       </div>
                       <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.contractsStatus.outros}</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         {metrics.totalContratos > 0 ? Math.round((metrics.contractsStatus.outros / metrics.totalContratos) * 100) : 0}% do total
                       </div>
                     </div>
                   )}
                 </div>
                 
                 {/* Status Bar com cores baseadas na classificação */}
                 <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden flex">
                   {/* Barra verde para contratos seguros */}
                   {metrics.contractsStatus.seguro > 0 && (
                     <div 
                       className="bg-emerald-500 h-full transition-all duration-300"
                       style={{ width: `${metrics.totalContratos > 0 ? (metrics.contractsStatus.seguro / metrics.totalContratos) * 100 : 0}%` }}
                     ></div>
                   )}
                   {/* Barra amarela para contratos com atenção necessária */}
                   {metrics.contractsStatus.atencaoNecessaria > 0 && (
                     <div 
                       className="bg-amber-500 h-full transition-all duration-300"
                       style={{ width: `${metrics.totalContratos > 0 ? (metrics.contractsStatus.atencaoNecessaria / metrics.totalContratos) * 100 : 0}%` }}
                     ></div>
                   )}
                   {/* Barra vermelha para contratos de alto risco */}
                   {metrics.contractsStatus.altoRisco > 0 && (
                     <div 
                       className="bg-red-500 h-full transition-all duration-300"
                       style={{ width: `${metrics.totalContratos > 0 ? (metrics.contractsStatus.altoRisco / metrics.totalContratos) * 100 : 0}%` }}
                     ></div>
                   )}
                   {/* Barra cinza para outros status */}
                   {metrics.contractsStatus.outros > 0 && (
                     <div 
                       className="bg-gray-500 h-full transition-all duration-300"
                       style={{ width: `${metrics.totalContratos > 0 ? (metrics.contractsStatus.outros / metrics.totalContratos) * 100 : 0}%` }}
                     ></div>
                   )}
                 </div>
               </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Nenhum contrato analisado</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Faça upload de contratos para começar a análise</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <SimpleAgenda />
      </div>

    </div>
  );
}