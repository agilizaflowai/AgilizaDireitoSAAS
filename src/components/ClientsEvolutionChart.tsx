import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClientsEvolutionData {
  month: string;
  clients: number;
  date: Date;
}

interface ClientsEvolutionChartProps {
  data: ClientsEvolutionData[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{`${label}`}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          {`Clientes: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const LoadingSkeleton = () => (
  <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-gray-500 dark:text-gray-400">Carregando dados...</div>
  </div>
);

const EmptyState = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="text-center">
      <div className="text-gray-400 dark:text-gray-500 mb-2">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Nenhum dado de evolução disponível
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
        Cadastre clientes para ver a evolução
      </p>
    </div>
  </div>
);

export default function ClientsEvolutionChart({ data, loading = false }: ClientsEvolutionChartProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Calcular crescimento
  const currentMonth = data[data.length - 1]?.clients || 0;
  const previousMonth = data[data.length - 2]?.clients || 0;
  const growth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;
  const isPositiveGrowth = growth > 0;

  return (
    <div className="space-y-4">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg className="w-7 h-7 mr-2 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Evolução de Clientes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Crescimento mensal nos últimos 6 meses
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentMonth}
          </div>
          <div className={`text-sm flex items-center ${
            isPositiveGrowth 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : growth < 0 
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
          }`}>
            {growth !== 0 && (
              <svg 
                className={`w-3 h-3 mr-1 ${isPositiveGrowth ? 'rotate-0' : 'rotate-180'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            )}
            {growth === 0 ? 'Sem alteração' : `${Math.abs(growth).toFixed(1)}% este mês`}
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              className="dark:stroke-gray-600"
            />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="clients" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}