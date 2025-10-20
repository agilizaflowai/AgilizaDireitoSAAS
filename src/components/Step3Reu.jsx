import React, { useState } from 'react';

export default function Step3Reu({ data, updateForm, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const reu = data.reu;

  const validate = () => {
    const newErrors = {};
    if (!reu.tipo) newErrors.tipo = 'Tipo de pessoa é obrigatório';
    if (reu.tipo === 'fisica') {
      if (!reu.nome.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!reu.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    } else {
      if (!reu.razaoSocial.trim()) newErrors.razaoSocial = 'Razão social é obrigatória';
      if (!reu.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    }
    if (!reu.endereco.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!reu.endereco.rua.trim()) newErrors.rua = 'Rua é obrigatória';
    if (!reu.endereco.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!reu.endereco.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!reu.endereco.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!reu.endereco.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type } = e.target;
    if (name === 'tipo') {
      updateForm({ reu: { ...reu, tipo: value, nome: '', cpf: '', razaoSocial: '', cnpj: '' } });
    } else {
      updateForm({ reu: { ...reu, [name]: value } });
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEnderecoChange = e => {
    const { name, value } = e.target;
    updateForm({ reu: { ...reu, endereco: { ...reu.endereco, [name]: value } } });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNext = e => {
    e.preventDefault();
    if (validate()) nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Dados do Réu</h2>
        <p className="text-sm text-gray-600 mt-1">Informe os dados da parte requerida</p>
      </div>
      
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-3">
          Tipo de pessoa *
        </label>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="tipo" 
              value="fisica" 
              checked={reu.tipo === 'fisica'} 
              onChange={handleChange}
              className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-gray-300 mr-3"
            />
            <span className="text-sm font-medium text-slate-900">Pessoa Física</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="tipo" 
              value="juridica" 
              checked={reu.tipo === 'juridica'} 
              onChange={handleChange}
              className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-gray-300 mr-3"
            />
            <span className="text-sm font-medium text-slate-900">Pessoa Jurídica</span>
          </label>
        </div>
        {errors.tipo && <p className="text-red-700 text-xs mt-1">{errors.tipo}</p>}
      </div>
      {reu.tipo === 'fisica' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Nome completo *
            </label>
            <input 
              type="text" 
              name="nome" 
              className={`input-primary h-11 ${errors.nome ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={reu.nome} 
              onChange={handleChange}
              placeholder="Nome completo do réu"
            />
            {errors.nome && <p className="text-red-700 text-xs mt-1">{errors.nome}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              CPF *
            </label>
            {/* Substituir por input com máscara futuramente */}
            <input 
              type="text" 
              name="cpf" 
              className={`input-primary h-11 ${errors.cpf ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={reu.cpf} 
              onChange={handleChange} 
              placeholder="000.000.000-00" 
            />
            {errors.cpf && <p className="text-red-700 text-xs mt-1">{errors.cpf}</p>}
          </div>
        </div>
      )}
      {reu.tipo === 'juridica' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              Razão social *
            </label>
            <input 
              type="text" 
              name="razaoSocial" 
              className={`input-primary h-11 ${errors.razaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={reu.razaoSocial} 
              onChange={handleChange}
              placeholder="Razão social da empresa"
            />
            {errors.razaoSocial && <p className="text-red-700 text-xs mt-1">{errors.razaoSocial}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
              CNPJ *
            </label>
            {/* Substituir por input com máscara futuramente */}
            <input 
              type="text" 
              name="cnpj" 
              className={`input-primary h-11 ${errors.cnpj ? 'border-red-600 focus:ring-red-600' : ''}`} 
              value={reu.cnpj} 
              onChange={handleChange} 
              placeholder="00.000.000/0000-00" 
            />
            {errors.cnpj && <p className="text-red-700 text-xs mt-1">{errors.cnpj}</p>}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Endereço Completo para Citação</h3>
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
              value={reu.endereco.cep} 
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
              value={reu.endereco.rua} 
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
              value={reu.endereco.numero} 
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
              value={reu.endereco.complemento} 
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
              value={reu.endereco.bairro} 
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
              value={reu.endereco.cidade} 
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
              value={reu.endereco.estado} 
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
            Email (opcional)
          </label>
          <input 
            type="email" 
            name="email" 
            className="input-primary h-11" 
            value={reu.email} 
            onChange={handleChange}
            placeholder="exemplo@email.com"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Telefone (opcional)
          </label>
          <input 
            type="text" 
            name="telefone" 
            className="input-primary h-11" 
            value={reu.telefone} 
            onChange={handleChange} 
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
        <button 
          type="button" 
          className="btn-secondary px-6 py-3 text-sm font-medium" 
          onClick={prevStep}
        >
          Voltar
        </button>
        <button 
          type="submit" 
          className="btn-primary px-6 py-3 text-sm font-medium"
        >
          Próximo
        </button>
      </div>
    </form>
  );
}