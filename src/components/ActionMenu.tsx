import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Eye, Download, Share } from 'lucide-react';

interface ActionMenuProps {
  items?: Array<{
    label: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }>;
}

export default function ActionMenu({ items }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const defaultItems = [
    { label: 'Visualizar', icon: Eye, onClick: () => console.log('View'), variant: 'default' as const },
    { label: 'Editar', icon: Edit, onClick: () => console.log('Edit'), variant: 'default' as const },
    { label: 'Baixar', icon: Download, onClick: () => console.log('Download'), variant: 'default' as const },
    { label: 'Compartilhar', icon: Share, onClick: () => console.log('Share'), variant: 'default' as const },
    { label: 'Excluir', icon: Trash2, onClick: () => console.log('Delete'), variant: 'danger' as const },
  ];

  const menuItems = items || defaultItems;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="action-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Abrir menu de ações"
      >
        <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div className="action-menu" role="menu">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const dangerClass = item.variant === 'danger' ? ' dropdown-item-danger' : '';
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item.onClick)}
                className={`dropdown-item${dangerClass}`}
                role="menuitem"
              >
                <Icon className="h-4 w-4 mr-3" strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}