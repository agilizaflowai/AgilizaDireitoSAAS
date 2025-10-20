import React from 'react';
import { Eye, Info } from 'lucide-react';

export default function DemoHeader() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
      <div className="flex items-center justify-center space-x-2">
        <Eye className="h-3 w-3" />
        <span>Modo Demonstração</span>
        <Info className="h-3 w-3" />
        <span>•</span>
        <span>Dados fictícios para fins de demonstração</span>
      </div>
    </div>
  );
}