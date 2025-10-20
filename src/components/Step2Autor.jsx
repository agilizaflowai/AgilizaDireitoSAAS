import React, { useState } from 'react';

const estadosCivis = [
  'Solteiro',
  'Casado',
  'Divorciado',
  'Viúvo',
  'União estável'
];

export default function Step2Autor({ data, updateForm, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [displayNascimento, setDisplayNascimento] = useState('');
  const autor = data.autor;

  // Funções de formatação
  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const convertDateToISO = (dateStr) => {
    if (dateStr.length !== 10) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const convertDateFromISO = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Inicializar valor formatado se já existe data
  React.useEffect(() => {
    if (autor.nascimento && !displayNascimento) {
      setDisplayNascimento(convertDateFromISO(autor.nascimento));
    }
  }, [autor.nascimento, displayNascimento]);

  const validate = () => {
    const newErrors = {};
    if (!autor.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!autor.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!autor.rg.trim()) newErrors.rg = 'RG é obrigatório';
    if (!autor.nascimento) newErrors.nascimento = 'Data de nascimento é obrigatória';
    if (!autor.estadoCivil) newErrors.estadoCivil = 'Estado civil é obrigatório';
    if (!autor.profissao.trim()) newErrors.profissao = 'Profissão é obrigatória';
    if (!autor.endereco.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!autor.endereco.rua.trim()) newErrors.rua = 'Rua é obrigatória';
    if (!autor.endereco.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!autor.endereco.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!autor.endereco.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!autor.endereco.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!autor.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!autor.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    updateForm({ autor: { ...autor, [name]: value } });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEnderecoChange = e => {
    const { name, value } = e.target;
    updateForm({ autor: { ...autor, endereco: { ...autor.endereco, [name]: value } } });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNext = e => {
    e.preventDefault();
    if (validate()) nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Dados do Autor (Cliente)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Nome completo *
          </label>
          <input 
            type="text" 
            name="nome" 
            className={`input-primary h-11 ${errors.nome ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={autor.nome} 
            onChange={handleChange}
            placeholder="Nome completo do cliente"
          />
          {errors.nome && <p className="text-red-700 text-xs mt-1">{errors.nome}</p>}
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            CPF *
          </label>
          <input 
            type="text" 
            name="cpf" 
            className={`input-primary h-11 ${errors.cpf ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={autor.cpf} 
            onChange={handleChange} 
            placeholder="000.000.000-00" 
          />
          {errors.cpf && <p className="text-red-700 text-xs mt-1">{errors.cpf}</p>}
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            RG *
          </label>
          <input 
            type="text" 
            name="rg" 
            className={`input-primary h-11 ${errors.rg ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={autor.rg} 
            onChange={handleChange}
            placeholder="00.000.000-0"
          />
          {errors.rg && <p className="text-red-700 text-xs mt-1">{errors.rg}</p>}
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Data de nascimento *
          </label>
          <input 
            type="text" 
            name="nascimento" 
            className={`input-primary h-11 ${errors.nascimento ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={displayNascimento} 
            onChange={(e) => {
              const formatted = formatDateInput(e.target.value);
              setDisplayNascimento(formatted);
              const isoDate = convertDateToISO(formatted);
              updateForm({ autor: { ...autor, nascimento: isoDate } });
              setErrors(prev => ({ ...prev, nascimento: '' }));
            }}
            placeholder="DD/MM/YYYY"
            maxLength={10}
          />
          {errors.nascimento && <p className="text-red-700 text-xs mt-1">{errors.nascimento}</p>}
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Estado civil *
          </label>
          <select 
            name="estadoCivil" 
            className={`input-primary h-11 ${errors.estadoCivil ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={autor.estadoCivil} 
            onChange={handleChange}
          >
            <option value="">Selecione o estado civil</option>
            {estadosCivis.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          {errors.estadoCivil && <p className="text-red-700 text-xs mt-1">{errors.estadoCivil}</p>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Profissão *
          </label>
          <input 
            type="text" 
            name="profissao" 
            className={`input-primary h-11 ${errors.profissao ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={autor.profissao} 
            onChange={handleChange}
            placeholder="Ex: Advogado, Engenheiro, Professor"
          />
          {errors.profissao && <p className="text-red-700 text-xs mt-1">{errors.profissao}</p>}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Endereço Completo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              CEP *
            </label>
            {/* Substituir por componente de busca ViaCEP futuramente */}
            <input 
              type="text" 
              name="cep" 
              className={`input-primary h-11 ${errors.cep ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={autor.endereco.cep} 
              onChange={handleEnderecoChange} 
              placeholder="00000-000" 
            />
            {errors.cep && <p className="text-red-700 text-xs mt-1">{errors.cep}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Rua *
            </label>
            <input 
              type="text" 
              name="rua" 
              className={`input-primary h-11 ${errors.rua ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={autor.endereco.rua} 
              onChange={handleEnderecoChange}
              placeholder="Nome da rua"
            />
            {errors.rua && <p className="text-red-700 text-xs mt-1">{errors.rua}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Número *
            </label>
            <input 
              type="text" 
              name="numero" 
              className={`input-primary h-11 ${errors.numero ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={autor.endereco.numero} 
              onChange={handleEnderecoChange}
              placeholder="123"
            />
            {errors.numero && <p className="text-red-700 text-xs mt-1">{errors.numero}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Complemento
            </label>
            <input 
              type="text" 
              name="complemento" 
              className="input-primary h-11" 
              value={autor.endereco.complemento} 
              onChange={handleEnderecoChange}
              placeholder="Apto, sala, etc."
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Bairro *
            </label>
            <input 
              type="text" 
              name="bairro" 
              className={`input-primary h-11 ${errors.bairro ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={autor.endereco.bairro} 
              onChange={handleEnderecoChange}
              placeholder="Nome do bairro"
            />
            {errors.bairro && <p className="text-red-700 text-xs mt-1">{errors.bairro}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Cidade *
            </label>
            <input 
              type="text" 
              name="cidade" 
              className={`input-primary h-11 ${errors.cidade ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={autor.endereco.cidade} 
              onChange={handleEnderecoChange}
              placeholder="Nome da cidade"
            />
            {errors.cidade && <p className="text-red-700 text-xs mt-1">{errors.cidade}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Estado *
            </label>
            <input 
              type="text" 
              name="estado" 
              className={`input-primary h-11 ${errors.estado ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={autor.endereco.estado} 
              onChange={handleEnderecoChange}
              placeholder="Ex: SP, RJ, MG"
            />
            {errors.estado && <p className="text-red-700 text-xs mt-1">{errors.estado}</p>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Email *
          </label>
          <input 
            type="email" 
            name="email" 
            className={`input-primary h-11 ${errors.email ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={autor.email} 
            onChange={handleChange}
            placeholder="exemplo@email.com"
          />
          {errors.email && <p className="text-red-700 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Telefone *
          </label>
          {/* Substituir por input com máscara futuramente */}
          <input 
            type="text" 
            name="telefone" 
            className={`input-primary h-11 ${errors.telefone ? 'border-red-600 focus:ring-red-600' : ''}`} 
            value={autor.telefone} 
            onChange={handleChange} 
            placeholder="(00) 00000-0000" 
          />
          {errors.telefone && <p className="text-red-700 text-xs mt-1">{errors.telefone}</p>}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="button" 
          className="btn-secondary px-6 py-3 text-sm font-medium" 
          onClick={prevStep}
        >
          ← Voltar
        </button>
        <button 
          type="submit" 
          className="btn-primary px-6 py-3 text-sm font-medium"
        >
          Próximo →
        </button>
      </div>
    </form>
  );
}