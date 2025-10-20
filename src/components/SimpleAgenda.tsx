import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'appointment' | 'deadline' | 'meeting' | 'court';
  priority: 'low' | 'medium' | 'high';
  client?: string;
  responsible: string;
  location?: string;
  color: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const SimpleAgenda: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Carregar eventos do localStorage
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Calcular início e fim da semana
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // Filtrar eventos de hoje
  const todayEvents = events.filter(event => 
    event.date === todayStr && event.status !== 'cancelled'
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Filtrar eventos da semana
  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfWeek && 
           eventDate <= endOfWeek && 
           event.status !== 'cancelled' &&
           event.date !== todayStr; // Excluir eventos de hoje para não duplicar
  }).sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.startTime.localeCompare(b.startTime);
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'court':
        return '⚖️';
      case 'meeting':
        return '👥';
      case 'deadline':
        return '⏰';
      case 'appointment':
        return '📅';
      default:
        return '📅';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'court':
        return 'Tribunal';
      case 'meeting':
        return 'Reunião';
      case 'deadline':
        return 'Prazo';
      case 'appointment':
        return 'Compromisso';
      default:
        return 'Evento';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const EventCard = ({ event, showDate = false }: { event: Event; showDate?: boolean }) => (
    <div className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer group">
      <div className="flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full mt-1 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: event.color }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center">
            <span className="mr-1">{getEventTypeIcon(event.type)}</span>
            <span className="truncate">{event.title}</span>
          </p>
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getPriorityColor(event.priority)}`}>
            {event.priority === 'high' ? 'Alta' : event.priority === 'medium' ? 'Média' : 'Baixa'}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-1 flex-wrap">
          {showDate && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900 px-2 py-0.5 rounded">
              {formatDate(event.date)}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {event.startTime} - {event.endTime}
          </span>
        </div>
        {event.client && (
          <p className="text-xs text-gray-600 mt-1 flex items-center">
            <User className="h-4 w-4 inline mr-1 flex-shrink-0" />
            <span className="truncate">{event.client}</span>
          </p>
        )}
        {event.location && (
          <p className="text-xs text-gray-600 mt-1 flex items-center">
            <MapPin className="h-4 w-4 inline mr-1 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Compromissos de Hoje */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-7 w-7 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Compromissos de Hoje
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {todayEvents.length}
          </span>
        </div>
        
        {todayEvents.length > 0 ? (
          <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
            {todayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Nenhum compromisso para hoje
            </p>
          </div>
        )}
      </div>

      {/* Compromissos da Semana */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-7 w-7 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Próximos da Semana
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {weekEvents.length}
          </span>
        </div>
        
        {weekEvents.length > 0 ? (
          <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
            {weekEvents.slice(0, 5).map((event) => (
              <EventCard key={event.id} event={event} showDate={true} />
            ))}
            {weekEvents.length > 5 && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  +{weekEvents.length - 5} compromissos adicionais
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
            <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Nenhum compromisso para esta semana
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAgenda;