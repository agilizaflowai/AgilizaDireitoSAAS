import React, { useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Step1DadosAcao({ data, updateForm, nextStep, onCancel }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!data.fatosCaso?.trim()) newErrors.fatosCaso = 'Quais são os fatos do caso é obrigatório';
    if (!data.parteRepresentada?.trim()) newErrors.parteRepresentada = 'Nome da parte que você está representando é obrigatório';
    if (!data.parteContraria?.trim()) newErrors.parteContraria = 'Nome da parte contrária é obrigatório';
    if (!data.tipoAcao?.trim()) newErrors.tipoAcao = 'Tipo de ação desejada é obrigatório';
    if (!data.jurisdicao?.trim()) newErrors.jurisdicao = 'Jurisdição aplicável é obrigatória';
    if (!data.objetivosCliente?.trim()) newErrors.objetivosCliente = 'Objetivos principais do cliente são obrigatórios';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const currentFiles = data.uploadedFiles || [];
    
    if (currentFiles.length + files.length > 3) {
      alert('Máximo de 3 documentos permitidos');
      return;
    }
    
    const newFiles = [...currentFiles, ...files];
    updateForm({ uploadedFiles: newFiles });
  };

  const removeFile = (index) => {
    const currentFiles = data.uploadedFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    updateForm({ uploadedFiles: newFiles });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const sendDataToWebhook = async (formData) => {
    try {
      // Converter arquivos PDF para base64
      const processedFiles = [];
      if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
        for (const file of formData.uploadedFiles) {
          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type
          };

          // Se for PDF, adiciona o base64
          if (file.type === 'application/pdf') {
            try {
              const base64 = await convertFileToBase64(file);
              fileData.base64 = base64;
            } catch (error) {
              console.error('Erro ao converter PDF para base64:', error);
              // Continua sem o base64 se houver erro
            }
          }

          processedFiles.push(fileData);
        }
      }

      const webhookData = {
        fatosCaso: formData.fatosCaso,
        parteRepresentada: formData.parteRepresentada,
        parteContraria: formData.parteContraria,
        tipoAcao: formData.tipoAcao,
        jurisdicao: formData.jurisdicao,
        objetivosCliente: formData.objetivosCliente,
        uploadedFiles: processedFiles
      };

      const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/peticao-inicial/gerar-perguntas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Dados enviados com sucesso para o webhook:', result);
      return result;
    } catch (error) {
      console.error('Erro ao enviar dados para o webhook:', error);
      // Não bloqueia o fluxo, apenas registra o erro
      return null;
    }
  };

  const fetchPerguntasIA = async () => {
    try {
      // Busca a linha mais recente da tabela documentos_ia
      const { data: documentosIA, error } = await supabase
        .from('documentos_ia')
        .select('perguntas_peticao')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erro ao buscar perguntas IA:', error);
        return null;
      }

      if (documentosIA && documentosIA.length > 0 && documentosIA[0].perguntas_peticao) {
        return documentosIA[0].perguntas_peticao;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar perguntas IA:', error);
      return null;
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      
      try {
        // Envia os dados para o webhook
        await sendDataToWebhook(data);
        
        // Aguarda 10 segundos
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // Busca as perguntas IA da tabela
        const perguntasIA = await fetchPerguntasIA();
        
        // Adiciona as perguntas ao contexto do formulário
        if (perguntasIA) {
          updateForm({ perguntasIA });
        }
        
        // Continua para o próximo step
        nextStep();
      } catch (error) {
        console.error('Erro no processo:', error);
        // Mesmo com erro, continua para o próximo step
        nextStep();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
            Quais são os fatos do caso? *
          </label>
          <textarea
            name="fatosCaso"
            rows={10}
            className={`input-primary ${errors.fatosCaso ? 'border-red-600 focus:ring-red-600' : ''}`}
            value={data.fatosCaso || ''}
            onChange={handleChange}
            maxLength={6000}
            placeholder="Descreva os fatos do caso de forma detalhada..."
          />
          {errors.fatosCaso && <p className="text-red-700 text-xs mt-1">{errors.fatosCaso}</p>}
          <p className="text-xs text-gray-500 mt-1">{(data.fatosCaso || '').length} de 6000 caracteres permitidos.</p>
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
            Escreva o nome da parte que você está representando: *
          </label>
          <input
            type="text"
            name="parteRepresentada"
            className={`input-primary h-11 ${errors.parteRepresentada ? 'border-red-600 focus:ring-red-600' : ''}`}
            value={data.parteRepresentada || ''}
            onChange={handleChange}
            placeholder="Nome da parte que você está representando"
          />
          {errors.parteRepresentada && <p className="text-red-700 text-xs mt-1">{errors.parteRepresentada}</p>}
        </div>
        
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
            Escreva o nome da parte contrária: *
          </label>
          <input
            type="text"
            name="parteContraria"
            className={`input-primary h-11 ${errors.parteContraria ? 'border-red-600 focus:ring-red-600' : ''}`}
            value={data.parteContraria || ''}
            onChange={handleChange}
            placeholder="Nome da parte contrária"
          />
          {errors.parteContraria && <p className="text-red-700 text-xs mt-1">{errors.parteContraria}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
            Tipo de ação desejada *
          </label>
          <div className="text-xs text-slate-700 dark:text-gray-300 mb-2">
            Selecione o tipo de ação judicial que será proposta
          </div>
          <select
            name="tipoAcao"
            className={`input-primary h-12 ${errors.tipoAcao ? 'border-red-600 focus:ring-red-600' : ''}`}
            value={data.tipoAcao || ''}
            onChange={handleChange}
          >
            <option value="">Selecione o tipo de ação</option>
            <option value="Ação de Alimentos">Ação de Alimentos</option>
            <option value="Ação de Cobrança">Ação de Cobrança</option>
            <option value="Ação de Indenização">Ação de Indenização</option>
            <option value="Ação Trabalhista">Ação Trabalhista</option>
            <option value="Ação de Despejo">Ação de Despejo</option>
            <option value="Ação de Divórcio">Ação de Divórcio</option>
            <option value="Ação de Guarda">Ação de Guarda</option>
            <option value="Ação de Usucapião">Ação de Usucapião</option>
            <option value="Ação Declaratória">Ação Declaratória</option>
            <option value="Ação Cautelar">Ação Cautelar</option>
            <option value="Mandado de Segurança">Mandado de Segurança</option>
            <option value="Habeas Corpus">Habeas Corpus</option>
            <option value="Outra">Outra</option>
          </select>
          {errors.tipoAcao && <p className="text-red-700 text-xs mt-1">{errors.tipoAcao}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
            Jurisdição aplicável *
          </label>
          <div className="text-xs text-slate-700 dark:text-gray-300 mb-2">
            Informe o Estado e a Comarca onde a ação será proposta
          </div>
          <input
            type="text"
            name="jurisdicao"
            className={`input-primary h-12 ${errors.jurisdicao ? 'border-red-600 focus:ring-red-600' : ''}`}
            value={data.jurisdicao || ''}
            onChange={handleChange}
            placeholder="Ex: São Paulo/SP - Comarca de São Paulo"
          />
          {errors.jurisdicao && <p className="text-red-700 text-xs mt-1">{errors.jurisdicao}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
            Objetivos principais do cliente com a ação *
          </label>
          <textarea
            name="objetivosCliente"
            rows={4}
            className={`input-primary ${errors.objetivosCliente ? 'border-red-600 focus:ring-red-600' : ''}`}
            value={data.objetivosCliente || ''}
            onChange={handleChange}
            maxLength={1500}
            placeholder="Descreva os principais objetivos que o cliente deseja alcançar com esta ação judicial..."
          />
          {errors.objetivosCliente && <p className="text-red-700 text-xs mt-1">{errors.objetivosCliente}</p>}
          <p className="text-xs text-gray-500 mt-1">{(data.objetivosCliente || '').length} de 1500 caracteres permitidos.</p>
        </div>

        {/* Seção de Upload de Documentos */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
            Documentos (Opcional - Máximo 3 arquivos)
          </label>
          
          {/* Área de Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Clique para selecionar arquivos ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">
                PDF (máx. 10MB cada)
              </p>
            </label>
          </div>

          {/* Lista de Arquivos Enviados */}
          {data.uploadedFiles && data.uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
              {data.uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button type="button" onClick={onCancel} className="btn-secondary px-6 py-3" disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary px-6 py-3" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processando...
            </>
          ) : (
            'Avançar →'
          )}
        </button>
      </div>
    </form>
  );
}