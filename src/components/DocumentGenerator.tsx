import React, { useState } from 'react';
import { FileText, Wand2, Eye, Download, Clock, CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import { documentTypes, mockDocuments } from '../data/mockData';
import PeticaoInicialWizard from './PeticaoInicialWizard';
import DocumentWizard from './DocumentWizard';
import PageHeader from './PageHeader';

interface DocumentFormData {
  type: string;
  title: string;
  clientName: string;
  clientCpf: string;
  opposingParty: string;
  caseValue: string;
  description: string;
  urgency: string;
  // Campos específicos por tipo
  courtName?: string;
  processNumber?: string;
  contractType?: string;
  contractValue?: string;
  procurationType?: string;
}

interface GeneratedDocument {
  id: number;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  status: string;
}

export default function DocumentGenerator() {
  const [selectedType, setSelectedType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<DocumentFormData>({
    type: '',
    title: '',
    clientName: '',
    clientCpf: '',
    opposingParty: '',
    caseValue: '',
    description: '',
    urgency: 'Média'
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.clientName.trim()) newErrors.clientName = 'Nome do cliente é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, type }));
  };

  const handleCancelSelection = () => {
    setSelectedType('');
    setFormData(prev => ({ ...prev, type: '' }));
    setUploadedFiles([]);
    setErrors({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (uploadedFiles.length + files.length > 3) {
      alert('Máximo de 3 documentos permitidos');
      return;
    }
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateDocument = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);

    try {
      // Envia os dados do formulário para o webhook do N8N
      const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/criardocumento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar documento com IA.');
      }

      const result = await response.json();
      // Supondo que o N8N retorna o documento gerado em result.content
      setGeneratedDoc({
        id: Date.now(),
        type: formData.type,
        title: formData.title,
        content: result.content,
        createdAt: new Date().toISOString(),
        status: 'Gerado'
      });
    } catch (error) {
      alert('Falha ao gerar documento com IA. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Cálculos de paginação
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case 'peticao':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Nome da Vara/Tribunal
              </label>
              <input
                type="text"
                name="courtName"
                value={formData.courtName || ''}
                onChange={handleInputChange}
                className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Ex: 1ª Vara Cível de São Paulo"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Parte Contrária
              </label>
              <input
                type="text"
                name="opposingParty"
                value={formData.opposingParty}
                onChange={handleInputChange}
                className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Nome da parte requerida"
              />
            </div>
          </div>
        );
      
      case 'contestacao':
      case 'recurso':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Número do Processo
              </label>
              <input
                type="text"
                name="processNumber"
                value={formData.processNumber || ''}
                onChange={handleInputChange}
                className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0000000-00.0000.0.00.0000"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Parte Contrária
              </label>
              <input
                type="text"
                name="opposingParty"
                value={formData.opposingParty}
                onChange={handleInputChange}
                className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Nome da parte adversa"
              />
            </div>
          </div>
        );
      
      case 'contrato':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Tipo de Contrato
              </label>
              <select
                name="contractType"
                value={formData.contractType || ''}
                onChange={handleInputChange}
                className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Selecione o tipo</option>
                <option value="prestação de serviços">Prestação de Serviços</option>
                <option value="compra e venda">Compra e Venda</option>
                <option value="locação">Locação</option>
                <option value="sociedade">Sociedade</option>
                <option value="trabalho">Trabalho</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Segunda Parte
              </label>
              <input
                type="text"
                name="opposingParty"
                value={formData.opposingParty}
                onChange={handleInputChange}
                className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Nome da segunda parte contratante"
              />
            </div>
          </div>
        );
      
      case 'procuracao':
        return (
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
              Nome do Advogado
            </label>
            <input
              type="text"
              name="opposingParty"
              value={formData.opposingParty}
              onChange={handleInputChange}
              className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Nome completo do advogado constituído"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        icon={FileText}
        title="Gerador de Documentos Jurídicos"
        subtitle="Crie documentos jurídicos profissionais com IA"
      />

      {/* Seletor de Tipo */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Selecione o Tipo de Documento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`p-4 rounded-md border-2 transition-all duration-150 ${
                selectedType === type.id
                  ? 'border-slate-900 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-slate-900 dark:text-white'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="h-6 w-6 mx-auto mb-2 dark:text-gray-300" />
              <p className="text-sm font-medium text-center dark:text-gray-300">{type.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Formulário */}
      {selectedType === 'peticao' ? (
        <PeticaoInicialWizard onCancel={handleCancelSelection} />
      ) : selectedType && ['contestacao', 'recurso', 'contrato', 'procuracao'].includes(selectedType) ? (
        <DocumentWizard documentType={selectedType} onCancel={handleCancelSelection} />
      ) : selectedType ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Dados para {documentTypes.find(t => t.id === selectedType)?.name}
          </h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Título do Documento *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.title ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="Ex: Ação Trabalhista - João Silva"
                />
                {errors.title && <p className="text-red-700 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.clientName ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="Nome completo do cliente"
                />
                {errors.clientName && <p className="text-red-700 text-xs mt-1">{errors.clientName}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  CPF do Cliente
                </label>
                <input
                  type="text"
                  name="clientCpf"
                  value={formData.clientCpf}
                  onChange={handleInputChange}
                  className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Valor da Causa (R$)
                </label>
                <input
                  type="text"
                  name="caseValue"
                  value={formData.caseValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,]/g, '');
                    handleInputChange({ ...e, target: { ...e.target, value } });
                  }}
                  className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0,00"
                />
              </div>
            </div>

            {/* Campos específicos por tipo */}
            {renderTypeSpecificFields()}

            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Descrição/Fundamentação *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                maxLength={3000}
                className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.description ? 'border-red-600 focus:ring-red-600' : ''}`}
                placeholder="Descreva os fatos, fundamentos jurídicos ou cláusulas principais..."
              />
              {errors.description && <p className="text-red-700 text-xs mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{(formData.description || '').length} de 3000 caracteres permitidos.</p>
            </div>

            {/* Seção de Upload de Documentos */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                Documentos (Opcional - Máximo 3 arquivos)
              </label>
              
              {/* Área de Upload */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Clique para selecionar arquivos ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)
                  </p>
                </label>
              </div>

              {/* Lista de Arquivos Enviados */}
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
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

            <div className="flex justify-between space-x-3">
              <button
                type="button"
                onClick={handleCancelSelection}
                className="btn-secondary px-6 py-3"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={generateDocument}
                disabled={isGenerating || !formData.title || !formData.clientName || !formData.description}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="spinner h-4 w-4 mr-2"></div>
                    Gerando com IA...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Gerar com IA
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Documento Gerado */}
      {generatedDoc && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Documento Gerado</h2>
            <div className="flex space-x-2">
              <button className="btn-ghost">
                <Eye className="h-4 w-4 mr-2" />
                Revisar
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                📄 Gerar Documento
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 max-h-96 overflow-y-auto custom-scrollbar">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
              {generatedDoc.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}