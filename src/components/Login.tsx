import React, { useState } from 'react';
import { Scale, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const { dispatch } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Buscar credenciais e dados do advogado
      const { data, error: queryError } = await supabase
        .from('credenciais')
        .select(`
          *,
          advogados!advogado_id (
            nome,
            oab,
            uf
          )
        `)
        .eq('login', email)
        .eq('senha', password)
        .single();

      if (queryError || !data) {
        setError('Email ou senha incorretos');
        setIsLoading(false);
        return;
      }

      // Login bem-sucedido
      const advogado = data.advogados;
      const user = {
        id: data.id.toString(),
        name: advogado?.nome || 'Usuário',
        email: data.login,
        oab: advogado?.oab,
        uf: advogado?.uf,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      };

      dispatch({ type: 'LOGIN', payload: user });
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-slate-900 p-3 rounded-md">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2 login-title">AgilizaDireito</h1>
            <p className="text-gray-600 text-sm">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                Email
              </label>
              <div className="relative">
                {!(emailFocused || email) && (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-opacity duration-150" />
                )}
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="input-primary login-input"
                  style={{ paddingLeft: (emailFocused || email) ? '1rem' : '2rem' }}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                Senha
              </label>
              <div className="relative">
                {!(passwordFocused || password) && (
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-opacity duration-150" />
                )}
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="input-primary login-input pr-10"
                  style={{ paddingLeft: (passwordFocused || password) ? '1rem' : '2rem' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner h-4 w-4 mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Use suas credenciais cadastradas no sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}