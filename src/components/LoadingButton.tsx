import React from 'react';

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export default function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = 'Carregando...', 
  className = 'btn-primary',
  disabled = false,
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="spinner h-4 w-4 mr-2"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}