import React, { useState } from 'react';
import { LogOut, Bell, Search, Command, Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeProvider';

export default function Header() {
  const { user, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <header className="enterprise-header hidden md:block">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center flex-1">
          {/* Search Bar */}
          <div className="relative max-w-lg w-full">
            <div className="relative">
              {!showSearch && (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
              )}
              <input
                type="text"
                placeholder="Buscar..."
                className="input-primary pr-24 h-12 text-base"
                style={{ paddingLeft: isSearchFocused ? '20px' : '34px' }}
                onFocus={() => {
                  setShowSearch(true);
                  setIsSearchFocused(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSearch(false), 200);
                  setIsSearchFocused(false);
                }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <kbd className="keyboard-shortcut text-sm px-2 py-1">⌘K</kbd>
              </div>
            </div>
            
            {/* Search Dropdown */}
            {showSearch && (
              <div className="dropdown absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="p-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2 px-2">Sugestões</div>
                  <div className="dropdown-item">
                    <Search className="h-4 w-4 mr-3 text-gray-400" strokeWidth={1.5} />
                    <span>Buscar clientes</span>
                  </div>
                  <div className="dropdown-item">
                    <Search className="h-4 w-4 mr-3 text-gray-400" strokeWidth={1.5} />
                    <span>Buscar processos</span>
                  </div>
                  <div className="dropdown-item">
                    <Search className="h-4 w-4 mr-3 text-gray-400" strokeWidth={1.5} />
                    <span>Buscar documentos</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* User Info */}
          <div className="text-right hidden lg:block">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {user?.oab && user?.uf ? `OAB ${user.oab}/${user.uf}` : 'Advogado'}
            </div>
          </div>
          
          {/* Avatar */}
          <div className="avatar avatar-lg">
            <span className="text-lg">{user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="btn-icon relative p-3">
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 badge-numeric text-sm px-2 py-1">
                3
              </span>
            </button>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon p-3"
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn-ghost px-4 py-2 text-base"
          >
            <LogOut className="h-5 w-5 mr-2" strokeWidth={1.5} />
            <span className="hidden lg:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}