import React, { useState } from 'react';
import { MessageCircle, X, Phone, Mail, Calendar } from 'lucide-react';

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Modal de Contato */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-6 animate-slide-in-right">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Falar com Especialista</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm">
            Precisa de ajuda? Fale diretamente com nossos especialistas em direito digital.
          </p>
          
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
              <Phone className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium text-sm">Ligar Agora</p>
                <p className="text-xs opacity-90">(11) 3456-7890</p>
              </div>
            </button>
            
            <button className="w-full flex items-center px-4 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors">
              <Mail className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium text-sm">Enviar Email</p>
                <p className="text-xs opacity-90">contato@agilizadireito.com</p>
              </div>
            </button>
            
            <button className="w-full flex items-center px-4 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
              <Calendar className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium text-sm">Agendar Reunião</p>
                <p className="text-xs opacity-90">Demonstração gratuita</p>
              </div>
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Horário de atendimento: Segunda a Sexta, 8h às 18h
            </p>
          </div>
        </div>
      )}

      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-md shadow-sm transition-all duration-200 ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700 rotate-180' 
            : 'bg-slate-900 hover:bg-slate-800'
        } text-white flex items-center justify-center`}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}