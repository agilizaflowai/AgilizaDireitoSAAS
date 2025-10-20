import React from 'react';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, idx) => (
        <div key={label} className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300
            ${idx === currentStep ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'}`}>{idx + 1}</div>
          <span className={`mt-2 text-xs text-center ${idx === currentStep ? 'text-black font-semibold dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{label}</span>
          {/* Adiciona barra de progresso para todos os steps, incluindo após o último */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 mt-2 mb-2">
            <div className={`h-1 transition-all duration-300 ${idx < currentStep ? 'bg-black dark:bg-white' : ''}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}