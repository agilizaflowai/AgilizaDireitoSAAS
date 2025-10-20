import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, Grid3X3, List, Eye, X, Save, Edit3, Trash2, User, MapPin, Bell } from 'lucide-react';
import PageHeader from './PageHeader';
import ConfirmModal from './ConfirmModal';
import { useApp } from '../contexts/AppContext';

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

type ViewMode = 'month' | 'week' | 'day';

interface CalendarDay {
  date: number;
  fullDate: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

interface TimeSlot {
  hour: number;
  time: string;
  events: Event[];
}

export default function DeadlineManagement() {
  const { user } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'appointment' as 'appointment' | 'deadline' | 'meeting' | 'court',
    priority: 'medium' as 'low' | 'medium' | 'high',
    client: '',
    responsible: user?.name || 'Usuário',
    location: '',
    color: '#3B82F6'
  });

  // Estados para controlar os valores formatados dos inputs
  const [displayDate, setDisplayDate] = useState('');
  const [displayStartTime, setDisplayStartTime] = useState('');
  const [displayEndTime, setDisplayEndTime] = useState('');

  // Função para formatação automática de data (DD/MM/YYYY)
  const formatDateInput = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara DD/MM/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  // Função para formatação automática de hora (HH:MM)
  const formatTimeInput = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara HH:MM
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
    }
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
  };

  // Função para converter data DD/MM/YYYY para YYYY-MM-DD
  const convertDateToISO = (dateStr: string) => {
    if (dateStr.length === 10 && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  };

  // Função para converter data YYYY-MM-DD para DD/MM/YYYY
  const convertDateFromISO = (dateStr: string) => {
    if (dateStr.length === 10 && dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  // Função para salvar eventos no localStorage
  const saveEventsToStorage = (eventsToSave: Event[]) => {
    try {
      localStorage.setItem('calendar-events', JSON.stringify(eventsToSave));
      console.log(`✅ ${eventsToSave.length} eventos salvos com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao salvar eventos:', error);
      alert('Erro ao salvar dados. Verifique o espaço disponível no navegador.');
    }
  };

  // Função para carregar eventos do localStorage
  const loadEventsFromStorage = (): Event[] => {
    try {
      const savedEvents = localStorage.getItem('calendar-events');
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        console.log(`✅ ${parsedEvents.length} eventos carregados com sucesso`);
        return parsedEvents;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar eventos:', error);
      alert('Erro ao carregar dados salvos. Os dados podem estar corrompidos.');
    }
    return [];
  };

  // Função para limpar todos os dados salvos
  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      try {
        localStorage.removeItem('calendar-events');
        setEvents([]);
        console.log('✅ Todos os dados foram limpos');
        alert('Dados limpos com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao limpar dados:', error);
        alert('Erro ao limpar dados.');
      }
    }
  };

  // Função para exportar dados (backup)
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(events, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agenda-juridica-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      console.log('✅ Backup exportado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      alert('Erro ao exportar dados.');
    }
  };



  // Carregar eventos na inicialização
  useEffect(() => {
    const savedEvents = loadEventsFromStorage();
    setEvents(savedEvents); // Carrega apenas eventos salvos, sem dados mockados
  }, []);

  // Salvar eventos automaticamente sempre que houver mudanças
  useEffect(() => {
    if (events.length > 0) {
      saveEventsToStorage(events);
    }
  }, [events]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  const eventColors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Vermelho', value: '#EF4444' },
    { name: 'Amarelo', value: '#F59E0B' },
    { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Laranja', value: '#F97316' },
    { name: 'Cinza', value: '#6B7280' }
  ];

  // Função para calcular a duração do evento em horas
  const calculateEventDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return (endTotalMinutes - startTotalMinutes) / 60;
  };

  // Função para calcular a posição do evento em minutos desde o início do slot
  const calculateEventPosition = (startTime: string, slotHour: number): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    if (startHour !== slotHour) return 0;
    return startMinute;
  };

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const dayEvents = getEventsForDate(selectedDateStr);
      const slotEvents = dayEvents.filter(event => {
        const eventStartHour = parseInt(event.startTime.split(':')[0]);
        const eventEndHour = parseInt(event.endTime.split(':')[0]);
        const eventEndMinute = parseInt(event.endTime.split(':')[1]);
        
        // Inclui eventos que começam neste slot ou que se estendem através dele
        return eventStartHour === hour || (eventStartHour < hour && (eventEndHour > hour || (eventEndHour === hour && eventEndMinute > 0)));
      });
      
      slots.push({
        hour,
        time: timeString,
        events: slotEvents
      });
    }
    return slots;
  };

  const generateCalendar = (): CalendarDay[] => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let i = 0; i < 42; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      
      calendar.push({
        date: currentDate.getDate(),
        fullDate: dateStr,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: dateStr === todayStr,
        events: dayEvents
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  };

  const generateWeekDays = (): CalendarDay[] => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const weekDays: CalendarDay[] = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      // Usar getEventsForDate para garantir filtragem consistente (exclui eventos cancelados)
      const dayEvents = getEventsForDate(dateStr);
      
      weekDays.push({
        date: currentDate.getDate(),
        fullDate: dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        events: dayEvents
      });
    }

    return weekDays;
  };

  const getEventsForDate = (date: string) => {
    return events
      .filter(event => event.date === date && event.status !== 'cancelled')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      } else if (viewMode === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  const openModal = (date?: string, timeSlot?: string, event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        type: event.type,
        priority: event.priority,
        client: event.client || '',
        responsible: event.responsible,
        location: event.location || '',
        color: event.color
      });
      // Inicializar valores formatados para edição
      setDisplayDate(convertDateFromISO(event.date));
      setDisplayStartTime(event.startTime);
      setDisplayEndTime(event.endTime);
    } else {
      setEditingEvent(null);
      const eventDate = date || `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      const startTime = timeSlot || '09:00';
      const endTimeHour = parseInt(startTime.split(':')[0]) + 1;
      const endTime = `${endTimeHour.toString().padStart(2, '0')}:00`;
      
      setFormData({
        title: '',
        description: '',
        date: eventDate,
        startTime,
        endTime,
        type: 'appointment',
        priority: 'medium',
        client: '',
        responsible: user?.name || 'Usuário',
        location: '',
        color: '#3B82F6'
      });
      // Inicializar valores formatados para novo evento
      setDisplayDate(convertDateFromISO(eventDate));
      setDisplayStartTime(startTime);
      setDisplayEndTime(endTime);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setSelectedTimeSlot('');
    // Limpar valores formatados
    setDisplayDate('');
    setDisplayStartTime('');
    setDisplayEndTime('');
  };

  // Função para criar um novo evento
  const createEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    setEvents(prev => {
      const updatedEvents = [...prev, newEvent];
      saveEventsToStorage(updatedEvents);
      return updatedEvents;
    });
    
    return newEvent;
  };

  // Função para atualizar um evento existente
  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => {
      const updatedEvents = prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      );
      saveEventsToStorage(updatedEvents);
      return updatedEvents;
    });
  };

  // Função para excluir um evento
  const removeEvent = (id: string) => {
    setEvents(prev => {
      const updatedEvents = prev.filter(event => event.id !== id);
      saveEventsToStorage(updatedEvents);
      return updatedEvents;
    });
  };

  // Função para obter um evento por ID
  const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const saveEvent = () => {
    // Converter data formatada para ISO antes de validar
    const isoDate = convertDateToISO(displayDate);
    
    if (!formData.title || !isoDate || !displayStartTime || !displayEndTime) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const eventData: Omit<Event, 'id'> = {
      title: formData.title,
      description: formData.description,
      date: isoDate,
      startTime: displayStartTime,
      endTime: displayEndTime,
      type: formData.type,
      priority: formData.priority,
      client: formData.client,
      responsible: user?.name || 'Usuário',
      location: formData.location,
      color: formData.color,
      status: editingEvent?.status || 'pending'
    };

    if (editingEvent) {
      // Atualizar evento existente
      updateEvent(editingEvent.id, eventData);
    } else {
      // Criar novo evento
      createEvent(eventData);
    }

    closeModal();
  };

  const deleteEvent = (id: string) => {
    console.log('🗑️ deleteEvent chamado com ID:', id);
    setEventToDelete(id);
    setShowConfirmModal(true);
    console.log('✅ Modal de confirmação deve aparecer');
  };

  const confirmDeleteEvent = () => {
    console.log('✅ confirmDeleteEvent chamado, eventToDelete:', eventToDelete);
    if (eventToDelete) {
      console.log('🗑️ Removendo evento:', eventToDelete);
      removeEvent(eventToDelete);
      setEventToDelete(null);
      setShowConfirmModal(false);
      closeModal(); // Fechar modal se estiver aberto
      console.log('✅ Evento removido com sucesso');
    }
  };

  const cancelDeleteEvent = () => {
    setEventToDelete(null);
    setShowConfirmModal(false);
  };

  const getDateRangeText = () => {
    if (viewMode === 'month') {
      return `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const weekDays = generateWeekDays();
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];
      return `${firstDay.date} - ${lastDay.date} de ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    } else {
      return `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
  };

  const renderMonthView = () => {
    const calendar = generateCalendar();
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center text-base font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0 bg-gray-50 dark:bg-gray-900">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {calendar.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 cursor-pointer transition-all duration-200 ${
                day.isCurrentMonth ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900'
              } ${day.isToday ? 'bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500 ring-inset' : ''} ${
                day.events.length > 0 && !day.isToday ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700' : ''
              }`}
              onClick={() => {
                const [year, month, dayNum] = day.fullDate.split('-').map(Number);
                setSelectedDate(new Date(year, month - 1, dayNum));
                setViewMode('day');
              }}
            >
              <div className={`text-sm font-semibold mb-1 flex items-center justify-between ${
                day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
              } ${day.isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                <span className={`${day.isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : ''}`}>
                  {day.date}
                </span>
                {day.events.length > 0 && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                    {day.events.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-0.5">
                {day.events.slice(0, 3).map((event, idx) => (
                  <div
                    key={idx}
                    className="text-xs px-1.5 py-1 rounded text-white font-medium cursor-pointer truncate"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(undefined, undefined, event);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{event.startTime}</span>
                      <span className="truncate">{event.title}</span>
                    </div>
                  </div>
                ))}
                {day.events.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
                    +{day.events.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = generateWeekDays();
    
    // Gerar slots de tempo para a visualização semanal
    const timeSlots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      timeSlots.push({
        hour,
        time: `${hour.toString().padStart(2, '0')}:00`,
        events: [] // Não precisamos dos eventos aqui, eles vêm dos weekDays
      });
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {/* Header da semana - responsivo */}
        <div className="grid border-b border-gray-200 dark:border-gray-700" style={{ gridTemplateColumns: 'minmax(80px, 120px) repeat(7, minmax(0, 1fr))' }}>
          <div className="p-2 sm:p-3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 min-h-[60px] sm:min-h-[80px] flex items-center justify-end">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:block">Horário</span>
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className={`p-2 sm:p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[60px] sm:min-h-[80px] flex flex-col justify-center ${
              day.isToday ? 'bg-blue-50 dark:bg-blue-900 ring-1 ring-blue-200 dark:ring-blue-700' : ''
            }`}
            onClick={() => {
              const [year, month, dayNum] = day.fullDate.split('-').map(Number);
              setSelectedDate(new Date(year, month - 1, dayNum));
              setViewMode('day');
            }}>
              <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1 sm:mb-2 font-medium">
                <span className="hidden sm:inline">{weekDaysShort[index]}</span>
                <span className="sm:hidden">{weekDaysShort[index].substring(0, 1)}</span>
              </div>
              <div className={`text-base sm:text-lg font-semibold flex items-center justify-center ${
                day.isToday ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {day.isToday ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                    {day.date}
                  </div>
                ) : (
                  <span>{day.date}</span>
                )}
              </div>
              {/* Indicador de eventos */}
              {day.events.length > 0 && (
                <div className="mt-1 flex justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Área dos slots de tempo - responsiva */}
        <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto">
          {timeSlots.map((slot, slotIndex) => (
            <div key={slotIndex} className="grid border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" style={{ gridTemplateColumns: 'minmax(80px, 120px) repeat(7, minmax(0, 1fr))' }}>
              <div className="p-2 sm:p-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 text-right bg-gray-50 dark:bg-gray-900 flex items-center justify-end min-h-[50px] sm:min-h-[60px] font-medium">
                <span className="hidden sm:inline">{slot.time}</span>
                <span className="sm:hidden">{slot.hour.toString().padStart(2, '0')}</span>
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = day.events.filter(event => {
                  const eventStartHour = parseInt(event.startTime.split(':')[0]);
                  const eventEndHour = parseInt(event.endTime.split(':')[0]);
                  const eventEndMinute = parseInt(event.endTime.split(':')[1]);
                  
                  // Inclui eventos que começam neste slot ou que se estendem através dele
                  return eventStartHour === slot.hour || 
                         (eventStartHour < slot.hour && 
                          (eventEndHour > slot.hour || (eventEndHour === slot.hour && eventEndMinute > 0)));
                });
                
                return (
                  <div
                    key={dayIndex}
                    className="px-1 sm:px-3 py-1 sm:py-2 min-h-[50px] sm:min-h-[60px] border-r border-gray-200 dark:border-gray-700 last:border-r-0 cursor-pointer flex flex-col justify-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => openModal(day.fullDate, slot.time)}
                  >
                    {dayEvents.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="text-xs p-1.5 sm:p-2 rounded mb-1 text-white cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 border border-white border-opacity-20"
                        style={{ backgroundColor: event.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(undefined, undefined, event);
                        }}
                      >
                        <div className="font-medium truncate text-xs sm:text-sm">{event.title}</div>
                        <div className="opacity-90 text-xs hidden sm:block">{event.startTime} - {event.endTime}</div>
                        <div className="opacity-90 text-xs sm:hidden">{event.startTime}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = generateTimeSlots();
    const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const dayEvents = getEventsForDate(selectedDateStr);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
          selectedDateStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` ? 'bg-blue-50 dark:bg-blue-900' : ''
        }`}>
          <div className="flex items-center gap-3">
            {selectedDateStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` && (
              <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-full animate-pulse"></div>
            )}
            <h3 className={`text-lg font-semibold ${
              selectedDateStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
            }`}>
              {selectedDate.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {selectedDateStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` && (
                <span className="ml-2 text-sm font-normal text-blue-500 dark:text-blue-400">(Hoje)</span>
              )}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''} agendado{dayEvents.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="max-h-[700px] overflow-y-auto relative">
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer relative"
              onClick={() => openModal(selectedDateStr, slot.time)}
              style={{ height: '80px' }}
            >
              <div className="w-24 py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-right bg-gray-50 dark:bg-gray-800">
                {slot.time}
              </div>
              <div className="flex-1 relative">
                {slot.events.map((event, eventIndex) => {
                  const eventStartHour = parseInt(event.startTime.split(':')[0]);
                  const eventStartMinute = parseInt(event.startTime.split(':')[1]);
                  const duration = calculateEventDuration(event.startTime, event.endTime);
                  const position = calculateEventPosition(event.startTime, slot.hour);
                  
                  // Só renderiza o evento no slot onde ele começa
                  if (eventStartHour !== slot.hour) return null;
                  
                  const heightInPixels = duration * 80; // 80px por hora
                  const topPosition = (position / 60) * 80; // posição baseada nos minutos
                  
                  // Altura mínima padronizada para consistência visual
                  const minHeight = 64; // altura mínima profissional
                  const finalHeight = Math.max(heightInPixels, minHeight);
                  
                  // Usar a cor escolhida pelo usuário
                  const baseStyles = "absolute left-2 right-2 rounded-lg cursor-pointer transition-all duration-300 text-white shadow-sm border border-white border-opacity-20";
                  
                  return (
                    <div
                      key={eventIndex}
                      className={baseStyles}
                      style={{ 
                        backgroundColor: event.color,
                        height: `${finalHeight}px`,
                        top: `${topPosition + 2}px`, // offset reduzido para melhor alinhamento
                        zIndex: 10
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(undefined, undefined, event);
                      }}
                    >
                      <div className="h-full flex flex-col justify-between p-3">
                        {/* Header do evento */}
                        <div className="flex-shrink-0">
                          <div className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{event.title}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs opacity-90 font-medium tracking-wide">
                              {event.startTime} - {event.endTime}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              event.priority === 'high' ? 'bg-white bg-opacity-25 text-white' :
                              event.priority === 'medium' ? 'bg-white bg-opacity-20 text-white' :
                              'bg-white bg-opacity-15 text-white opacity-75'
                            }`}>
                              {event.priority === 'high' ? 'Alta' : event.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Detalhes do evento - só mostra se há espaço suficiente */}
                        {finalHeight >= 80 && (
                          <div className="flex-grow flex flex-col justify-end space-y-1 mt-2">
                            {event.client && (
                              <div className="text-xs opacity-85 flex items-center">
                                <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="truncate font-medium">{event.client}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="text-xs opacity-85 flex items-center">
                                <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Função para obter eventos do dia atual
  const getTodayEvents = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return getEventsForDate(todayStr);
  };

  // Função para obter eventos da semana atual
  const getWeekEvents = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weekEvents: Event[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      weekEvents.push(...getEventsForDate(dateStr));
    }
    
    return weekEvents.sort((a, b) => {
      if (a.date === b.date) {
        return a.startTime.localeCompare(b.startTime);
      }
      return a.date.localeCompare(b.date);
    });
  };

  // Função para formatar data em português
  const formatDatePT = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    
    if (dateStr === todayStr) return 'Hoje';
    if (dateStr === tomorrowStr) return 'Amanhã';
    
    return `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  // Função para obter cor de prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Função para obter ícone do tipo de evento
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'court': return '⚖️';
      case 'meeting': return '👥';
      case 'deadline': return '⏰';
      case 'appointment': return '📅';
      default: return '📅';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        icon={Calendar}
        title="Agenda Jurídica"
        subtitle="Gerencie compromissos e prazos com visualização profissional"
      >
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors border border-gray-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </button>
      </PageHeader>

      {/* Navigation and View Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors dark:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[300px]">
              {getDateRangeText()}
            </h2>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors dark:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors dark:text-white"
            >
              Hoje
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                viewMode === 'month' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
              }`}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Mês
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                viewMode === 'week' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              Semana
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                viewMode === 'day' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
              }`}
            >
              <Eye className="h-4 w-4 mr-2" />
              Dia
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="min-h-[600px]">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Seções de Compromissos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Compromissos do Dia */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">Compromissos de Hoje</h3>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded-full flex-shrink-0">
                {getTodayEvents().length} {getTodayEvents().length === 1 ? 'evento' : 'eventos'}
              </span>
            </div>
          </div>
          
          <div className="p-3 sm:p-4">
            {getTodayEvents().length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Nenhum compromisso para hoje</p>
                <button
                  onClick={() => openModal()}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900 px-3 py-1 rounded-lg transition-colors"
                >
                  Adicionar evento
                </button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {getTodayEvents().map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer group"
                    onClick={() => openModal(undefined, undefined, event)}
                  >
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
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {event.startTime} - {event.endTime}
                      </p>
                      {event.client && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                          <User className="h-3 w-3 inline mr-1 flex-shrink-0" />
                          <span className="truncate">{event.client}</span>
                        </p>
                      )}
                      {event.location && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 inline mr-1 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compromissos da Semana */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">Compromissos da Semana</h3>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900 px-2 py-1 rounded-full flex-shrink-0">
                {getWeekEvents().length} {getWeekEvents().length === 1 ? 'evento' : 'eventos'}
              </span>
            </div>
          </div>
          
          <div className="p-3 sm:p-4">
            {getWeekEvents().length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Nenhum compromisso para esta semana</p>
                <button
                  onClick={() => openModal()}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900 px-3 py-1 rounded-lg transition-colors"
                >
                  Adicionar evento
                </button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {getWeekEvents().map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer group"
                    onClick={() => openModal(undefined, undefined, event)}
                  >
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
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900 px-2 py-0.5 rounded">
                          {formatDatePT(event.date)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      {event.client && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center">
                          <User className="h-3 w-3 inline mr-1 flex-shrink-0" />
                          <span className="truncate">{event.client}</span>
                        </p>
                      )}
                      {event.location && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 inline mr-1 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 dark:text-white" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6">
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                    placeholder="Ex: Reunião com cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                    rows={3}
                    placeholder="Detalhes do evento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data *</label>
                  <input
                    type="text"
                    value={displayDate}
                    onChange={(e) => {
                      const formatted = formatDateInput(e.target.value);
                      setDisplayDate(formatted);
                    }}
                    className="input-primary w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Início *</label>
                    <input
                      type="text"
                      value={displayStartTime}
                      onChange={(e) => {
                        const formatted = formatTimeInput(e.target.value);
                        setDisplayStartTime(formatted);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="HH:MM"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fim *</label>
                    <input
                      type="text"
                      value={displayEndTime}
                      onChange={(e) => {
                        const formatted = formatTimeInput(e.target.value);
                        setDisplayEndTime(formatted);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="HH:MM"
                      maxLength={5}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="appointment">Compromisso</option>
                      <option value="meeting">Reunião</option>
                      <option value="court">Audiência</option>
                      <option value="deadline">Prazo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridade</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Local</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                    placeholder="Local do evento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsável</label>
                  <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white">
                    Dra. Júlia Rabello
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor</label>
                  <div className="flex flex-wrap gap-2">
                    {eventColors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color.value ? 'border-gray-400 dark:border-gray-500 scale-110' : 'border-gray-200 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {editingEvent && (
                    <button
                      onClick={() => deleteEvent(editingEvent.id)}
                      className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </button>
                  )}
                  <div className="flex items-center space-x-3 ml-auto">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveEvent}
                      className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmDeleteEvent}
        onClose={cancelDeleteEvent}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmText="OK"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}