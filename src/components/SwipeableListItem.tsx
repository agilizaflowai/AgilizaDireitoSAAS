import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';

interface SwipeableListItemProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SwipeableListItem({ children, onEdit, onDelete }: SwipeableListItemProps) {
  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;
    
    if (diffX > 0 && diffX < 100) {
      setCurrentX(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (currentX > 50) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
      setCurrentX(0);
    }
    setStartX(0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setIsSwiped(false);
        setCurrentX(0);
      }
    };

    if (isSwiped) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSwiped]);

  return (
    <div className="relative overflow-hidden" ref={itemRef}>
      {/* Actions Background */}
      <div className="absolute right-0 top-0 h-full flex items-center bg-gray-50 dark:bg-gray-700 px-4 space-x-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 bg-blue-600 text-white rounded-md"
          >
            <Edit className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 bg-red-600 text-white rounded-md"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`swipe-item ${isSwiped ? 'swiped' : ''}`}
        style={{ transform: `translateX(-${currentX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}