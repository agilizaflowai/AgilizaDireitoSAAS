import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 mt-8">
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Powered by</span>
        <div className="flex items-center space-x-1 text-slate-900 dark:text-white font-medium">
          <Zap className="h-3 w-3" />
          <span>AgilizaFlow IA</span>
        </div>
      </div>
    </footer>
  );
}