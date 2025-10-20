import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  isLoading: boolean;
  duration?: number;
}

export default function ProgressBar({ isLoading, duration = 2000 }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, duration / 10);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 200);
    }
  }, [isLoading, duration]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-200 z-50">
      <div 
        className="h-full bg-slate-900 transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}