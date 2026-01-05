import React from 'react';
import { 
  LayoutDashboard,
  Users, 
  FileText, 
  Target, 
  AlertTriangle, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  PieChart as PieChartIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHeader from './PageHeader';
import ClientsEvolutionChart from './ClientsEvolutionChart';
import SimpleAgenda from './SimpleAgenda';
 
import { useDashboardData } from '../hooks/useDashboardData';
import { PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Label } from 'recharts';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  trend?: number;
  trendDirection?: 'up' | 'down';
}

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendDirection }: MetricCardProps) => (
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

 

export default function Dashboard() {
  const { metrics, loading, error, refetch } = useDashboardData();

  const totalContracts = metrics.totalContratos;
  const contractPieData = [
    { name: 'Seguro', value: metrics.contractsStatus.seguro, color: '#10B981' },
    { name: 'Atenção Necessária', value: metrics.contractsStatus.atencaoNecessaria, color: '#F59E0B' },
    { name: 'Alto Risco', value: metrics.contractsStatus.altoRisco, color: '#EF4444' },
    { name: 'Outros', value: metrics.contractsStatus.outros, color: '#6B7280' },
  ].filter(d => d.value > 0);

  const ContractsPieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number } }> }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload as { name: string; value: number };
      const pct = totalContracts > 0 ? Math.round((d.value / totalContracts) * 100) : 0;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm p-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{d.name}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{`${d.value} (${pct}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, value }: { cx: number; cy: number; midAngle: number; outerRadius: number; percent: number; index: number; value: number }) => {
    const RADIAN = Math.PI / 180;
    
    // Pontos para a linha de conexão
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 0) * cos;
    const sy = cy + (outerRadius + 0) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 40; // Linha horizontal maior
    const ey = my;

    // Ajuste do texto para começar na "quina" (mx) e ir para fora
    const textAnchor = cos >= 0 ? 'start' : 'end';
    const xText = mx + (cos >= 0 ? 1 : -1) * 5; // Leve recuo da quina

    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={contractPieData[index].color} fill="none" />
        <text x={xText} y={ey} dy={-6} textAnchor={textAnchor} fill="#6b7280" fontSize={12} className="dark:fill-gray-400">
          {`${value} peças`}
        </text>
        <text x={xText} y={ey} dy={16} textAnchor={textAnchor} fill="#111827" fontSize={16} fontWeight="bold" className="dark:fill-white">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
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
              <PieChartIcon className="h-7 w-7 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
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
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                      <Pie
                        data={contractPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        label={renderCustomizedLabel}
                        labelLine={false} // Usamos nossa própria linha no renderCustomizedLabel
                      >
                        {contractPieData.map((entry, index) => (
                          <Cell key={`slice-${index}`} fill={entry.color} />
                        ))}
                        <Label
                          value="Total"
                          position="center"
                          dy={-10}
                          className="text-sm fill-gray-500 dark:fill-gray-400 font-medium"
                          style={{ fontSize: '14px' }}
                        />
                        <Label
                          value={metrics.totalContratos}
                          position="center"
                          dy={20}
                          className="text-4xl font-bold fill-slate-900 dark:fill-white"
                          style={{ fontSize: '36px', fontWeight: 'bold' }}
                        />
                      </Pie>
                      <ReTooltip content={<ContractsPieTooltip />} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-4">
                  {contractPieData.map((entry) => (
                    <div key={entry.name} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{entry.name}</span>
                    </div>
                  ))}
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
