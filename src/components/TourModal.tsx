import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Play } from 'lucide-react';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    title: 'Dashboard',
    description: 'Visão geral com indicadores, atividades recentes e atalhos principais.',
    image: '📊'
  },
  {
    title: 'Clientes',
    description: 'Filtre e qualifique clientes com score automático e ações rápidas.',
    image: '👥'
  },
  {
    title: 'Leads',
    description: 'Gerencie leads e prospects com tags, contato e conversão.',
    image: '👤➕'
  },
  {
    title: 'Filtro de Processos',
    description: 'Organize e filtre processos por partes, vara, status e datas.',
    image: '🗂️'
  },
  {
    title: 'Pesquisa de Processos',
    description: 'Pesquise processos via CNJ e importe resultados para o sistema.',
    image: '🔎'
  },
  {
    title: 'Documentos IA',
    description: 'Gere petições e contratos com IA a partir de templates.',
    image: '📄'
  },
  {
    title: 'Análise de Contratos',
    description: 'Detecte riscos e cláusulas críticas com recomendações automáticas.',
    image: '📑'
  },
  {
    title: 'Validador de CPF',
    description: 'Valide CPFs pelo algoritmo oficial e consulte dados externos.',
    image: '🛡️'
  },
  {
    title: 'Cálculo de Honorários',
    description: 'Calcule honorários por área, complexidade, tempo e risco.',
    image: '🧮'
  },
  {
    title: 'Agenda Jurídica',
    description: 'Controle compromissos e prazos com calendário e alertas.',
    image: '🗓️'
  },
  {
    title: 'Atendimento IA',
    description: 'Atenda clientes 24/7 com chat inteligente e histórico.',
    image: '💬'
  },
];

export default function TourModal({ isOpen, onClose }: TourModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="text-4xl mb-4">{currentTourStep.image}</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            {currentTourStep.title}
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {currentTourStep.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Passo {currentStep + 1} de {tourSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-slate-900 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-3 w-3 mr-2" />
              Anterior
            </button>

            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentStep ? 'bg-slate-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="btn-primary"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <Play className="h-3 w-3 mr-2" />
                  Começar
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="h-3 w-3 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}