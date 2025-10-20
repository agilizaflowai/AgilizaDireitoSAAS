import React from 'react';

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
  type?: 'text' | 'card' | 'avatar' | 'button';
}

export default function SkeletonLoader({ lines = 3, className = '', type = 'text' }: SkeletonLoaderProps) {
  if (type === 'card') {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="skeleton h-4 w-3/4 mb-4 rounded"></div>
        <div className="skeleton h-3 w-full mb-2 rounded"></div>
        <div className="skeleton h-3 w-5/6 mb-2 rounded"></div>
        <div className="skeleton h-3 w-2/3 rounded"></div>
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="flex-1">
          <div className="skeleton h-3 w-24 mb-2 rounded"></div>
          <div className="skeleton h-2 w-16 rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'button') {
    return <div className={`skeleton h-10 w-24 rounded-md ${className}`}></div>;
  }

  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton h-3 mb-2 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}