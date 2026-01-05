import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  oab?: number;
  uf?: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  currentPage: string;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  navigationParams: NavigationParams | null;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'NAVIGATE_TO_PAGE'; payload: { page: string; params?: NavigationParams } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

const initialState: AppState = {
  user: null,
  currentPage: 'dashboard',
  isAuthenticated: false,
  sidebarOpen: true,
  navigationParams: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
        navigationParams: null,
      };
    case 'NAVIGATE_TO_PAGE':
      return {
        ...state,
        currentPage: action.payload.page,
        navigationParams: action.payload.params,
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  const { state, dispatch } = context;
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    currentPage: state.currentPage,
    sidebarOpen: state.sidebarOpen,
    navigationParams: state.navigationParams,
    dispatch,
    logout,
  };
}
type Primitive = string | number | boolean | null | undefined;
type NavigationParams = Record<string, Primitive>;
