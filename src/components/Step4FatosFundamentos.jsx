import React, { useState } from 'react';

const documentosComuns = [
  'Contrato',
  'Comprovantes de pagamento',
  'Conversas/emails',
  'Fotos'
];

export default function Step4FatosFundamentos({ data, updateForm, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [fatosCount, setFatosCount] = useState(data.fatos.length || 0);

  const validate = () => {
    const newErrors = {};
    if (!data.fatos.trim()) newErrors.fatos = 'Resumo dos fatos é obrigatório';
    if (!data.fundamentos.trim()) newErrors.fundamentos = 'Fundamentação jurídica é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
    if (name === 'fatos') setFatosCount(value.length);
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDocsChange = e => {
    const { value, checked } = e.target;
    let novaLista = data.documentos.includes(value)
      ? data.documentos.filter(d => d !== value)
      : [...data.documentos, value];
    updateForm({ documentos: novaLista });
  };

  const handleNext = e => {
    e.preventDefault();
    if (validate()) nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fatos e Fundamentos</h2>
        <p className="text-gray-600">Descreva os fatos relevantes e a fundamentação jurídica do caso</p>
      </div>
      
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
          Resumo dos fatos *
        </label>
        <textarea
          name="fatos"
          className={`input-primary resize-none ${errors.fatos ? 'border-red-600 focus:ring-red-600' : ''}`}
          style={{ minHeight: '120px' }}
          value={data.fatos}
          onChange={handleChange}
          maxLength={1000}
          placeholder="Descreva de forma clara e objetiva os fatos que deram origem ao caso..."
        />
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">{fatosCount}/1000 caracteres</span>
          {errors.fatos && <span className="text-red-700">{errors.fatos}</span>}
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
          Fundamentação jurídica *
        </label>
        <textarea
          name="fundamentos"
          className={`input-primary resize-none ${errors.fundamentos ? 'border-red-600 focus:ring-red-600' : ''}`}
          style={{ minHeight: '150px' }}
          value={data.fundamentos}
          onChange={handleChange}
          placeholder="Cite as leis, jurisprudências e doutrinas aplicáveis ao caso..."
        />
        {errors.fundamentos && <p className="text-red-700 text-xs mt-1">{errors.fundamentos}</p>}
      </div>
      
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-3">
          Documentos anexos
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documentosComuns.map(doc => (
            <label key={doc} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                value={doc}
                checked={data.documentos.includes(doc)}
                onChange={handleDocsChange}
                className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              {doc}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
            Outros documentos
          </label>
          <input
            type="text"
            name="outrosDocumentos"
            className="input-primary h-11"
            value={data.outrosDocumentos}
            onChange={handleChange}
            placeholder="Descreva outros documentos, se houver"
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