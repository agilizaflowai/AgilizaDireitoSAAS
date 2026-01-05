import React, { useState } from 'react';
import { CheckCircle, XCircle, Copy, Info, Shield, Search } from 'lucide-react';
import PageHeader from './PageHeader';

const CPFValidator = () => {
  const [cpf, setCpf] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Função para formatar CPF com máscara
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  // Função para validar CPF completa
  const validateCPF = (cpf: string) => {
    // Remove caracteres não numéricos
    const numbers = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) {
      return {
        isValid: false,
        message: 'CPF deve conter exatamente 11 dígitos',
        details: 'Formato esperado: XXX.XXX.XXX-XX'
      };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) {
      return {
        isValid: false,
        message: 'CPF inválido - todos os dígitos são iguais',
        details: 'CPFs com todos os dígitos iguais não são válidos'
      };
    }

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(numbers[9]) !== digit1) {
      return {
        isValid: false,
        message: 'CPF inválido - primeiro dígito verificador incorreto',
        details: `Esperado: ${digit1}, Encontrado: ${numbers[9]}`
      };
    }

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(numbers[10]) !== digit2) {
      return {
        isValid: false,
        message: 'CPF inválido - segundo dígito verificador incorreto',
        details: `Esperado: ${digit2}, Encontrado: ${numbers[10]}`
      };
    }

    return {
      isValid: true,
      message: 'CPF válido!',
      details: 'Todos os dígitos verificadores estão corretos'
    };
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    
    // Limpa resultado anterior se o usuário está digitando
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const handleValidate = async () => {
    if (!cpf.trim()) {
      setValidationResult({
        isValid: false,
        message: 'Por favor, digite um CPF para validar',
        details: 'Campo obrigatório'
      });
      return;
    }

    setIsValidating(true);
    
    // Simula um pequeno delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = validateCPF(cpf);
    setValidationResult(result);
    setIsValidating(false);
  };

  const handleClear = () => {
    setCpf('');
    setValidationResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cpf);
  };

  const handleSearchCPF = () => {
    // Remove formatação do CPF para enviar apenas números
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length === 11) {
      // Abre o site em uma nova aba
      window.open('https://www.descobreaqui.com/search/cpf', '_blank');
    }
  };



  return (
    <div className="space-y-6">
      <PageHeader
        icon={Shield}
        title="Validador de CPF"
        subtitle="Verificação de validade através do algoritmo oficial"
      />

      <div className="max-w-5xl mx-auto">
        {/* Card Principal */}
        <div className="card p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Digite um CPF para verificar sua autenticidade
            </h3>
          </div>

          {/* Input de CPF */}
          <div className="space-y-4">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número do CPF
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="input-primary text-center text-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {cpf && (
                  <button
                    onClick={handleCopy}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Copiar CPF"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleValidate}
                disabled={isValidating}
                className="flex-[2] flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isValidating ? (
                  'Verificando...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Verificar
                  </>
                )}
              </button>
              
              <button
                onClick={handleClear}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <XCircle className="h-4 w-4" />
                Limpar
              </button>
            </div>
          </div>

          {/* Resultado da Validação */}
          {validationResult && (
            <div className={`mt-6 p-4 rounded-lg border ${
              validationResult.isValid
                ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
            }`}>
              <div className="flex items-start gap-3">
                {validationResult.isValid ? (
                  <CheckCircle className="h-5 w-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {validationResult.message}
                  </h3>
                  {validationResult.details && (
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      {validationResult.details}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Botão de Consulta Externa - Dentro do resultado da validação */}
              {validationResult.isValid && (
                <>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-center">
                    <button
                      onClick={handleSearchCPF}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm max-w-xs"
                    >
                      <Search className="h-4 w-4" />
                      Consultar Informações do CPF
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Descubra informações adicionais sobre este CPF em site externo
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Card de Informações */}
        <div className="card p-6 mt-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Como funciona
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>• <strong>Formato:</strong> Deve ter exatamente 11 dígitos numéricos</p>
                <p>• <strong>Dígitos verificadores:</strong> Calculados com base nos 9 primeiros</p>
                <p>• <strong>Algoritmo oficial:</strong> Utiliza o padrão da Receita Federal</p>
                <p>• <strong>Verificação completa:</strong> Formato, sequências e dígitos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPFValidator;
