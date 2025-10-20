import React from 'react';
import { Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <Construction className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
    </div>
  );
}