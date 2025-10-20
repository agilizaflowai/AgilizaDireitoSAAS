import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Clock, Scale, FileText, TrendingUp, Info, Edit3, Check, X, RotateCcw, Plus, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Tooltip from './Tooltip';

// Componente SortableItem para drag and drop
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SortableItem({ id, children, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Ícone de drag em preto e branco */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-2 -right-2 p-2 bg-gray-800 hover:bg-black text-white rounded-full shadow-lg cursor-grab active:cursor-grabbing z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 dark:bg-gray-200 dark:hover:bg-white dark:text-gray-800"
          title="Arrastar para reordenar"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
      {children}
    </div>
  );
}

interface FeeCalculation {
  baseValue: number;
  complexityMultiplier: number;
  timeMultiplier: number;
  riskMultiplier: number;
  totalFee: number;
  suggestedRange: {
    min: number;
    max: number;
  };
}

const defaultCaseTypes = [
  { id: 'civil', name: 'Direito Civil', baseRate: 150, description: 'Contratos, responsabilidade civil, direitos reais' },
  { id: 'family', name: 'Direito de Família', baseRate: 200, description: 'Divórcio, guarda, pensão alimentícia' },
  { id: 'criminal', name: 'Direito Penal', baseRate: 300, description: 'Defesa criminal, habeas corpus' },
  { id: 'labor', name: 'Direito do Trabalho', baseRate: 180, description: 'Ações trabalhistas, rescisões' },
  { id: 'corporate', name: 'Direito Empresarial', baseRate: 250, description: 'Contratos empresariais, societário' },
  { id: 'tax', name: 'Direito Tributário', baseRate: 280, description: 'Planejamento tributário, defesas fiscais' },
  { id: 'real_estate', name: 'Direito Imobiliário', baseRate: 220, description: 'Compra e venda, usucapião' },
  { id: 'social_security', name: 'Direito Previdenciário', baseRate: 160, description: 'Aposentadorias, benefícios' }
];

const complexityLevels = [
  { id: 'low', name: 'Baixa', multiplier: 0.8, description: 'Caso simples, documentação clara' },
  { id: 'medium', name: 'Média', multiplier: 1.0, description: 'Caso padrão, complexidade moderada' },
  { id: 'high', name: 'Alta', multiplier: 1.5, description: 'Caso complexo, múltiplas questões' },
  { id: 'very_high', name: 'Muito Alta', multiplier: 2.0, description: 'Caso excepcional, alta especialização' }
];

const timeEstimates = [
  { id: 'quick', name: '1-3 meses', multiplier: 0.9, description: 'Resolução rápida' },
  { id: 'medium', name: '3-6 meses', multiplier: 1.0, description: 'Prazo padrão' },
  { id: 'long', name: '6-12 meses', multiplier: 1.3, description: 'Processo longo' },
  { id: 'very_long', name: '12+ meses', multiplier: 1.6, description: 'Processo muito longo' }
];

const riskLevels = [
  { id: 'low', name: 'Baixo', multiplier: 0.9, description: 'Alta probabilidade de êxito' },
  { id: 'medium', name: 'Médio', multiplier: 1.0, description: 'Probabilidade moderada' },
  { id: 'high', name: 'Alto', multiplier: 1.2, description: 'Caso incerto, maior risco' }
];

export default function FeeCalculator() {
  // Sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Estados para áreas jurídicas editáveis
  const [caseTypes, setCaseTypes] = useState(() => {
    // Primeiro, tenta carregar a ordem salva
    const savedOrder = localStorage.getItem('caseTypesOrder');
    if (savedOrder) {
      try {
        return JSON.parse(savedOrder);
      } catch (error) {
        console.error('Erro ao carregar ordem dos cards:', error);
      }
    }
    
    // Se não há ordem salva, tenta carregar os tipos salvos
    const savedCaseTypes = localStorage.getItem('feeCalculator_caseTypes');
    if (savedCaseTypes) {
      try {
        return JSON.parse(savedCaseTypes);
      } catch (error) {
        console.error('Erro ao carregar áreas jurídicas salvas:', error);
      }
    }
    return defaultCaseTypes;
  });
  
  const [selectedCaseType, setSelectedCaseType] = useState(() => {
    const savedCaseTypes = localStorage.getItem('feeCalculator_caseTypes');
    const types = savedCaseTypes ? JSON.parse(savedCaseTypes) : defaultCaseTypes;
    return types[0];
  });
  const [selectedComplexity, setSelectedComplexity] = useState(complexityLevels[1]);
  const [selectedTime, setSelectedTime] = useState(timeEstimates[1]);
  const [selectedRisk, setSelectedRisk] = useState(riskLevels[1]);
  const [caseValue, setCaseValue] = useState<number>(0);
  const [caseValueDisplay, setCaseValueDisplay] = useState<string>('');
  const [calculation, setCalculation] = useState<FeeCalculation | null>(null);
  
  // Estados para edição de áreas jurídicas
  const [editingCaseTypes, setEditingCaseTypes] = useState(false);
  const [editingCaseTypeId, setEditingCaseTypeId] = useState<string | null>(null);
  const [newCaseType, setNewCaseType] = useState({ name: '', description: '', baseRate: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Estados para valores editáveis individuais de cada área jurídica
  const [editableCaseTypeRates, setEditableCaseTypeRates] = useState<{[key: string]: number}>(() => {
    const savedRates = localStorage.getItem('feeCalculator_customRates');
    if (savedRates) {
      try {
        return JSON.parse(savedRates);
      } catch (error) {
        console.error('Erro ao carregar valores salvos:', error);
      }
    }
    return caseTypes.reduce((acc, type) => ({ ...acc, [type.id]: type.baseRate }), {});
  });
  const [editingRates, setEditingRates] = useState(false);
  const [editingCaseValue, setEditingCaseValue] = useState(false);
  const [editingComplexity, setEditingComplexity] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [editingRisk, setEditingRisk] = useState(false);
  
  // Estados para multiplicadores individuais editáveis
  const [editableComplexityMultipliers, setEditableComplexityMultipliers] = useState<{[key: string]: string}>(() => {
    const saved = localStorage.getItem('feeCalculator_complexityMultipliers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar multiplicadores de complexidade:', error);
      }
    }
    return {};
  });
  const [editableTimeMultipliers, setEditableTimeMultipliers] = useState<{[key: string]: string}>(() => {
    const saved = localStorage.getItem('feeCalculator_timeMultipliers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar multiplicadores de tempo:', error);
      }
    }
    return {};
  });
  const [editableRiskMultipliers, setEditableRiskMultipliers] = useState<{[key: string]: string}>(() => {
    const saved = localStorage.getItem('feeCalculator_riskMultipliers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar multiplicadores de risco:', error);
      }
    }
    return {};
  });
  
  const [editableComplexityMultiplier, setEditableComplexityMultiplier] = useState(selectedComplexity.multiplier);
  const [editableTimeMultiplier, setEditableTimeMultiplier] = useState(selectedTime.multiplier);
  const [editableRiskMultiplier, setEditableRiskMultiplier] = useState(selectedRisk.multiplier);
  const [editablePercentage, setEditablePercentage] = useState(10);

  const calculateFee = () => {
    const baseValue = editableCaseTypeRates[selectedCaseType.id];
    
    // Usar multiplicadores editados individuais se disponíveis, senão usar os padrões
    const complexityMultiplier = editableComplexityMultipliers[selectedComplexity.id] !== undefined ? 
      parseFloat(editableComplexityMultipliers[selectedComplexity.id].replace(',', '.')) || selectedComplexity.multiplier :
      editableComplexityMultiplier;
      
    const timeMultiplier = editableTimeMultipliers[selectedTime.id] !== undefined ? 
      parseFloat(editableTimeMultipliers[selectedTime.id].replace(',', '.')) || selectedTime.multiplier :
      editableTimeMultiplier;
      
    const riskMultiplier = editableRiskMultipliers[selectedRisk.id] !== undefined ? 
      parseFloat(editableRiskMultipliers[selectedRisk.id].replace(',', '.')) || selectedRisk.multiplier :
      editableRiskMultiplier;
    
    // Cálculo base considerando valor da causa (se informado)
    let adjustedBase = baseValue;
    if (caseValue > 0) {
      // Percentual sobre o valor da causa usando valor editável
      const percentageFee = caseValue * (editablePercentage / 100);
      adjustedBase = Math.max(baseValue, percentageFee);
    }
    
    const totalFee = adjustedBase * complexityMultiplier * timeMultiplier * riskMultiplier;
    
    const suggestedRange = {
      min: totalFee * 0.8,
      max: totalFee * 1.3
    };
    
    setCalculation({
      baseValue: adjustedBase,
      complexityMultiplier,
      timeMultiplier,
      riskMultiplier,
      totalFee,
      suggestedRange
    });
  };

  // Sincronizar valores editáveis quando as seleções mudarem
  useEffect(() => {
    setEditableComplexityMultiplier(selectedComplexity.multiplier);
  }, [selectedComplexity]);

  useEffect(() => {
    setEditableTimeMultiplier(selectedTime.multiplier);
  }, [selectedTime]);

  useEffect(() => {
    setEditableRiskMultiplier(selectedRisk.multiplier);
  }, [selectedRisk]);

  // Salvar valores personalizados no localStorage
  useEffect(() => {
    localStorage.setItem('feeCalculator_customRates', JSON.stringify(editableCaseTypeRates));
  }, [editableCaseTypeRates]);

  // Salvar áreas jurídicas no localStorage
  useEffect(() => {
    localStorage.setItem('feeCalculator_caseTypes', JSON.stringify(caseTypes));
  }, [caseTypes]);

  // Salvar multiplicadores editados no localStorage
  useEffect(() => {
    localStorage.setItem('feeCalculator_complexityMultipliers', JSON.stringify(editableComplexityMultipliers));
  }, [editableComplexityMultipliers]);

  useEffect(() => {
    localStorage.setItem('feeCalculator_timeMultipliers', JSON.stringify(editableTimeMultipliers));
  }, [editableTimeMultipliers]);

  useEffect(() => {
    localStorage.setItem('feeCalculator_riskMultipliers', JSON.stringify(editableRiskMultipliers));
  }, [editableRiskMultipliers]);

  useEffect(() => {
    calculateFee();
  }, [selectedCaseType, selectedComplexity, selectedTime, selectedRisk, caseValue, editableCaseTypeRates, editableComplexityMultiplier, editableTimeMultiplier, editableRiskMultiplier, editablePercentage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const resetToDefaultRates = () => {
    const defaultRates = caseTypes.reduce((acc, type) => ({ ...acc, [type.id]: type.baseRate }), {});
    setEditableCaseTypeRates(defaultRates);
    setEditingRates(false);
  };

  const handleRateChange = (typeId: string, value: string) => {
    // Remove caracteres não numéricos
    const numericOnly = value.replace(/[^0-9]/g, '');
    // Remove zeros à esquerda, mas mantém pelo menos um zero se vazio
    const cleanValue = numericOnly.replace(/^0+/, '') || '0';
    const numericValue = Number(cleanValue);
    setEditableCaseTypeRates(prev => ({
      ...prev,
      [typeId]: numericValue
    }));
  };

  // Funções para manipular multiplicadores individuais
  const handleComplexityMultiplierChange = (levelId: string, value: string) => {
    // Permite valores vazios ou apenas com números, pontos e vírgulas
    if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setEditableComplexityMultipliers(prev => ({
        ...prev,
        [levelId]: value
      }));
    }
  };

  const handleTimeMultiplierChange = (timeId: string, value: string) => {
    // Permite valores vazios ou apenas com números, pontos e vírgulas
    if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setEditableTimeMultipliers(prev => ({
        ...prev,
        [timeId]: value
      }));
    }
  };

  const handleRiskMultiplierChange = (riskId: string, value: string) => {
    // Permite valores vazios ou apenas com números, pontos e vírgulas
    if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setEditableRiskMultipliers(prev => ({
        ...prev,
        [riskId]: value
      }));
    }
  };

  // Funções para resetar multiplicadores
  const resetComplexityMultipliers = () => {
    setEditableComplexityMultipliers({});
    setEditingComplexity(false);
  };

  const resetTimeMultipliers = () => {
    setEditableTimeMultipliers({});
    setEditingTime(false);
  };

  const resetRiskMultipliers = () => {
    setEditableRiskMultipliers({});
    setEditingRisk(false);
  };

  // Funções para gerenciar áreas jurídicas
  const handleCaseTypeEdit = (typeId: string, field: string, value: string) => {
    setCaseTypes(prev => prev.map(type => 
      type.id === typeId 
        ? { ...type, [field]: field === 'baseRate' ? Number(value.replace(/[^0-9]/g, '')) || 0 : value }
        : type
    ));
  };

  const handleAddCaseType = () => {
    if (newCaseType.name && newCaseType.description) {
      const id = Date.now().toString();
      const newType = {
        id,
        name: newCaseType.name,
        description: newCaseType.description,
        baseRate: newCaseType.baseRate || 150
      };
      setCaseTypes(prev => [...prev, newType]);
      setEditableCaseTypeRates(prev => ({ ...prev, [id]: newType.baseRate }));
      setNewCaseType({ name: '', description: '', baseRate: 0 });
      setShowAddForm(false);
    }
  };

  const handleDeleteCaseType = (typeId: string) => {
    if (caseTypes.length > 1) {
      setCaseTypes(prev => prev.filter(type => type.id !== typeId));
      setEditableCaseTypeRates(prev => {
        const newRates = { ...prev };
        delete newRates[typeId];
        return newRates;
      });
      // Se o tipo selecionado foi deletado, selecionar o primeiro disponível
      if (selectedCaseType.id === typeId) {
        const remainingTypes = caseTypes.filter(type => type.id !== typeId);
        setSelectedCaseType(remainingTypes[0]);
      }
    }
  };

  const resetToDefaultCaseTypes = () => {
    setCaseTypes(defaultCaseTypes);
    const defaultRates = defaultCaseTypes.reduce((acc, type) => ({ ...acc, [type.id]: type.baseRate }), {});
    setEditableCaseTypeRates(defaultRates);
    setSelectedCaseType(defaultCaseTypes[0]);
    setEditingCaseTypes(false);
    setEditingCaseTypeId(null);
    setShowAddForm(false);
  };

  // Função para lidar com o drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCaseTypes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Salvar a nova ordem no localStorage
        localStorage.setItem('caseTypesOrder', JSON.stringify(newOrder));
        
        return newOrder;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Calculator className="h-8 w-8 text-slate-900 dark:text-white mr-3" strokeWidth={1.5} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cálculo de Honorários</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Calcule honorários advocatícios de forma inteligente e precisa</p>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Cálculo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tipo de Caso */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Scale className="h-5 w-5 text-slate-900 dark:text-white mr-2" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Área Jurídica</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefaultCaseTypes}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                  title="Restaurar áreas jurídicas padrão"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Resetar
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
                <button
                  onClick={() => setEditingCaseTypes(!editingCaseTypes)}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    editingCaseTypes 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {editingCaseTypes ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Salvar
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-1" />
                      Editar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Formulário para adicionar nova área jurídica */}
            {showAddForm && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">Nova Área Jurídica</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome da área (ex: Direito Ambiental)"
                    value={newCaseType.name}
                    onChange={(e) => setNewCaseType(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Descrição (ex: Licenciamento, infrações ambientais)"
                    value={newCaseType.description}
                    onChange={(e) => setNewCaseType(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Taxa base (R$/hora)"
                    value={newCaseType.baseRate || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setNewCaseType(prev => ({ ...prev, baseRate: value ? Number(value) : 0 }));
                    }}
                    className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCaseType}
                      className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewCaseType({ name: '', description: '', baseRate: 0 });
                      }}
                      className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={caseTypes.map(type => type.id)} strategy={rectSortingStrategy}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${editingCaseTypes ? 'gap-6' : 'gap-3'}`}>
                  {caseTypes.map((type) => (
                    <SortableItem key={type.id} id={type.id} disabled={!editingCaseTypes}>
                      <label className={`relative flex items-start border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${editingCaseTypes ? 'p-6 border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-900/20' : 'p-4'}`}>
                        <input
                          type="radio"
                          name="caseType"
                          value={type.id}
                          checked={selectedCaseType.id === type.id}
                          onChange={() => setSelectedCaseType(type)}
                          className="mt-1 mr-3 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          {/* Título editável */}
                          {editingCaseTypes ? (
                            <div className="mb-3">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nome da área jurídica
                              </label>
                              <input
                                type="text"
                                value={type.name}
                                onChange={(e) => handleCaseTypeEdit(type.id, 'name', e.target.value)}
                                className="w-full font-medium text-slate-900 dark:text-white bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nome da área jurídica"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          ) : (
                            <div className="font-medium text-slate-900 dark:text-white">
                              {type.name}
                            </div>
                          )}
                          
                          {/* Descrição editável */}
                          {editingCaseTypes ? (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descrição
                              </label>
                              <textarea
                                value={type.description}
                                onChange={(e) => handleCaseTypeEdit(type.id, 'description', e.target.value)}
                                className="w-full text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                                placeholder="Descrição da área jurídica"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                      ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {type.description}
                        </div>
                      )}
                      
                      {/* Preço editável */}
                      {editingCaseTypes ? (
                        <div className="mt-2 flex items-center">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400 mr-2">Base: R$</span>
                          <input
                            type="number"
                            value={editableCaseTypeRates[type.id]}
                            onChange={(e) => handleRateChange(type.id, e.target.value)}
                            className="w-20 text-sm font-medium text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 rounded px-2 py-1 focus:outline-none focus:border-green-500"
                            placeholder="150"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-1">/hora</span>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                          Base: {formatCurrency(editableCaseTypeRates[type.id])}/hora
                        </div>
                      )}
                      
                      {/* Botão de excluir - só aparece no modo de edição e se houver mais de um tipo */}
                      {editingCaseTypes && caseTypes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCaseType(type.id);
                          }}
                          className="mt-2 flex items-center px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </button>
                      )}
                    </div>
                  </label>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

          {/* Valor da Causa */}
          <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="h-5 w-5 text-white dark:text-black" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black dark:text-white mb-1">Valor da Causa</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Opcional. Usado para calcular percentual sobre o valor da causa</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Input Principal */}
              <div className="relative">
                <label className="block text-sm font-semibold text-black dark:text-white mb-3 uppercase tracking-wide">
                  Valor em Reais
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">R$</span>
                  </div>
                  <input
                    type="text"
                    value={caseValueDisplay}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Remove tudo exceto números, vírgulas e pontos
                      let cleanValue = inputValue.replace(/[^0-9.,]/g, '');
                      
                      // Separa a parte inteira da decimal (se houver vírgula)
                      const parts = cleanValue.split(',');
                      let integerPart = parts[0] || '';
                      const decimalPart = parts[1] || '';
                      
                      // Remove pontos existentes da parte inteira para reformatar
                      integerPart = integerPart.replace(/\./g, '');
                      
                      // Adiciona pontos a cada 3 dígitos na parte inteira
                      if (integerPart.length > 3) {
                        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                      }
                      
                      // Reconstrói o valor formatado
                      let formattedValue = integerPart;
                      if (parts.length > 1) {
                        // Limita a parte decimal a 2 dígitos
                        const limitedDecimal = decimalPart.substring(0, 2);
                        formattedValue += ',' + limitedDecimal;
                      }
                      
                      // Atualiza o valor de exibição (com formatação)
                      setCaseValueDisplay(formattedValue);
                      
                      // Converte para número para cálculos (remove pontos e troca vírgula por ponto)
                      const numericValue = cleanValue.replace(/\./g, '').replace(',', '.');
                      setCaseValue(numericValue ? Number(numericValue) : 0);
                    }}
                    placeholder="50.000,00"
                    className="w-full pl-12 pr-4 py-4 text-lg font-mono bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Input Percentual */}
              <div className="relative">
                <label className="block text-sm font-semibold text-black dark:text-white mb-3 uppercase tracking-wide">
                  Percentual sobre Valor da Causa
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editablePercentage}
                    onChange={(e) => {
                      // Permite números, vírgulas e pontos
                      const value = e.target.value.replace(/[^0-9.,]/g, '');
                      // Converte vírgula para ponto para o cálculo interno
                      const numericValue = value.replace(',', '.');
                      setEditablePercentage(numericValue ? Number(numericValue) : 0);
                    }}
                    placeholder="10,5"
                    className="w-full pr-12 pl-4 py-4 text-lg font-mono bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complexidade */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-slate-900 dark:text-white mr-2" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Complexidade do Caso</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetComplexityMultipliers}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                  title="Resetar valores"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Resetar
                </button>
                <button
                  onClick={() => setEditingComplexity(!editingComplexity)}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    editingComplexity 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {editingComplexity ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Salvar
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-1" />
                      Editar Valores
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {complexityLevels.map((level) => (
                <div key={level.id}>
                  <label className="flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="complexity"
                      value={level.id}
                      checked={selectedComplexity.id === level.id}
                      onChange={() => setSelectedComplexity(level)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">{level.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{level.description}</div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                        Multiplicador: {editableComplexityMultipliers[level.id] !== undefined ? 
                          `${editableComplexityMultipliers[level.id]}x` : 
                          `${String(level.multiplier).replace('.', ',')}x`}
                      </div>
                      {/* Campo editável individual - só aparece no modo de edição */}
                      {editingComplexity && (
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
                          <label className="block text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                            Multiplicador personalizado
                          </label>
                          <input
                            type="text"
                            value={editableComplexityMultipliers[level.id] !== undefined ? 
                              editableComplexityMultipliers[level.id] : 
                              String(level.multiplier).replace('.', ',')}
                            onChange={(e) => handleComplexityMultiplierChange(level.id, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-blue-300 dark:border-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder={`Ex: ${String(level.multiplier).replace('.', ',')}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tempo Estimado */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-slate-900 dark:text-white mr-2" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tempo Estimado</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetTimeMultipliers}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                  title="Resetar valores"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Resetar
                </button>
                <button
                  onClick={() => setEditingTime(!editingTime)}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    editingTime 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  {editingTime ? 'Salvar' : 'Editar Valores'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timeEstimates.map((time) => (
                <div key={time.id}>
                  <label className="flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="timeEstimate"
                      value={time.id}
                      checked={selectedTime.id === time.id}
                      onChange={() => setSelectedTime(time)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">{time.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{time.description}</div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-1">
                        Multiplicador: {editableTimeMultipliers[time.id] !== undefined ? 
                          `${editableTimeMultipliers[time.id]}x` : 
                          `${String(time.multiplier).replace('.', ',')}x`}
                      </div>
                      {/* Campo editável individual - só aparece no modo de edição */}
                      {editingTime && (
                        <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/30 rounded border border-purple-200 dark:border-purple-700">
                          <label className="block text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">
                            Multiplicador personalizado
                          </label>
                          <input
                            type="text"
                            value={editableTimeMultipliers[time.id] !== undefined ? 
                              editableTimeMultipliers[time.id] : 
                              String(time.multiplier).replace('.', ',')}
                            onChange={(e) => handleTimeMultiplierChange(time.id, e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-purple-300 dark:border-purple-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder={`Ex: ${String(time.multiplier).replace('.', ',')}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Nível de Risco */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-slate-900 dark:text-white mr-2" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Nível de Risco</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetRiskMultipliers}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                  title="Resetar valores"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Resetar
                </button>
                <button
                  onClick={() => setEditingRisk(!editingRisk)}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    editingRisk 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  {editingRisk ? 'Salvar' : 'Editar Valores'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {riskLevels.map((risk) => (
                <div key={risk.id}>
                  <label className="flex items-start p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="riskLevel"
                      value={risk.id}
                      checked={selectedRisk.id === risk.id}
                      onChange={() => setSelectedRisk(risk)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">{risk.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{risk.description}</div>
                      <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-1">
                        Multiplicador: {editableRiskMultipliers[risk.id] !== undefined ? 
                          `${editableRiskMultipliers[risk.id]}x` : 
                          `${String(risk.multiplier).replace('.', ',')}x`}
                      </div>
                      {/* Campo editável individual - só aparece no modo de edição */}
                      {editingRisk && (
                        <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/30 rounded border border-orange-200 dark:border-orange-700">
                          <label className="block text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">
                            Multiplicador personalizado
                          </label>
                          <input
                             type="text"
                             value={editableRiskMultipliers[risk.id] !== undefined ? 
                               editableRiskMultipliers[risk.id] : 
                               String(risk.multiplier).replace('.', ',')}
                             onChange={(e) => handleRiskMultiplierChange(risk.id, e.target.value)}
                             className="w-full px-2 py-1 text-sm border border-orange-300 dark:border-orange-600 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                             placeholder={`Ex: ${String(risk.multiplier).replace('.', ',')}`}
                             onClick={(e) => e.stopPropagation()}
                           />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resultado do Cálculo */}
        <div className="space-y-6">
          {calculation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Resultado do Cálculo</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor Base</div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(calculation.baseValue)}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Complexidade:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{calculation.complexityMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tempo:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{calculation.timeMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Risco:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{calculation.riskMultiplier}x</span>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-600" />
                
                <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-lg">
                  <div className="text-sm opacity-90 mb-1">Honorário Calculado</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(calculation.totalFee)}
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="text-sm text-green-800 dark:text-green-400 font-medium mb-2">Faixa Sugerida</div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <div>Mínimo: {formatCurrency(calculation.suggestedRange.min)}</div>
                    <div>Máximo: {formatCurrency(calculation.suggestedRange.max)}</div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Dica:</strong> Este cálculo é uma estimativa baseada em critérios objetivos. 
                    Considere também fatores como relacionamento com o cliente, urgência do caso e 
                    complexidade específica da situação.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}