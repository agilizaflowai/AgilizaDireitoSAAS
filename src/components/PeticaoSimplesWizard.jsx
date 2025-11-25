import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ArrowLeft, ArrowRight, Download, Eye, FileText, X, Upload, Loader2, Pencil } from 'lucide-react';
import StepIndicator from './StepIndicator';
import { supabase } from '../supabaseClient';

const steps = ['Dados da Petição', 'Revisão'];
const WEBHOOK_URL = 'https://n8n-n8n.04qisd.easypanel.host/webhook/peticao-simples';

export default function PeticaoSimplesWizard({ onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);

  const initialFormData = {
    tipoPeticao: '', // Tipo de Petição Simples
    processNumber: '', // Número do Processo
    courtName: '', // Vara/Juízo
    petitionerName: '', // Nome da Parte Peticionante
    motiveFundament: '', // Motivo/Fundamento
    specificRequest: '', // Pedido Específico
    lawyerName: '', // Nome do Advogado
    lawyerOab: '', // OAB
    // Opcionais
    opposingPartyName: '',
    urgency: '',
    legalBasis: '',
    local: '',
    attachments: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload de documentos semelhante ao campo da Petição Inicial
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = formData.attachments || [];

    if (currentFiles.length + files.length > 3) {
      alert('Máximo de 3 documentos permitidos');
      return;
    }

    // Aceita apenas PDF e até 10MB cada, alinhado ao Step1DadosAcao
    const validNewFiles = files.filter((f) => {
      const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
      const sizeOk = f.size <= 10 * 1024 * 1024;
      return isPdf && sizeOk;
    });

    setFormData((prev) => ({
      ...prev,
      attachments: [...currentFiles, ...validNewFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index)
    }));
  };

  // Converte arquivo para base64 (data URL), usado para envio ao webhook
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      } catch (err) {
        reject(err);
      }
    });
  };

  // Monta payload e envia ao webhook com anexos em base64
  const sendWebhook = async (content) => {
    try {
      const attachmentsPayload = await Promise.all((formData.attachments || []).map(async (f) => {
        const base64 = await fileToBase64(f).catch(() => null);
        return {
          name: f.name,
          size: f.size,
          type: f.type || 'application/pdf',
          base64,
        };
      }));

      const payload = {
        tipo: 'peticao_simples',
        etapa: 'dados_iniciais',
        timestamp: new Date().toISOString(),
        dados: {
          tipoPeticao: formData.tipoPeticao,
          processNumber: formData.processNumber,
          courtName: formData.courtName,
          petitionerName: formData.petitionerName,
          opposingPartyName: formData.opposingPartyName,
          motiveFundament: formData.motiveFundament,
          specificRequest: formData.specificRequest,
          urgency: formData.urgency,
          legalBasis: formData.legalBasis,
          local: formData.local,
          lawyerName: formData.lawyerName,
          lawyerOab: formData.lawyerOab,
        },
        uploadedFiles: attachmentsPayload,
        conteudoGerado: content,
      };

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.error('Falha ao enviar webhook:', err));
    } catch (err) {
      console.error('Erro ao preparar envio para webhook:', err);
    }
  };

  const fetchBaselineId = async () => {
    try {
      const { data, error } = await supabase
        .from('peticao_simples_ia')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      if (error) {
        console.error('Erro ao obter baseline ID:', error);
        return 0;
      }
      return data?.[0]?.id || 0;
    } catch (err) {
      console.error('Falha ao obter baseline ID:', err);
      return 0;
    }
  };

  const fetchLatestAfterId = async (afterId = 0) => {
    try {
      const { data, error } = await supabase
        .from('peticao_simples_ia')
        .select('id, documento_gerado')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .gt('id', afterId)
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erro ao buscar última linha após baseline:', error);
        return null;
      }
      if (!data || data.length === 0) return null;
      return data[0]?.documento_gerado || null;
    } catch (err) {
      console.error('Falha na consulta ao Supabase (após baseline):', err);
      return null;
    }
  };

  const pollLatestDocument = async (baselineId, windowMs = 10000, intervalMs = 2000) => {
    const end = Date.now() + windowMs;
    let latest = await fetchLatestAfterId(baselineId);
    while (!latest && Date.now() < end) {
      await new Promise((r) => setTimeout(r, intervalMs));
      latest = await fetchLatestAfterId(baselineId);
    }
    return latest;
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      const required = [
        'tipoPeticao',
        'processNumber',
        'courtName',
        'petitionerName',
        'motiveFundament',
        'specificRequest',
        'lawyerName',
        'lawyerOab',
      ];
      const missing = required.filter((k) => !formData[k] || formData[k].trim() === '');
      if (missing.length) {
        alert('Preencha todos os campos obrigatórios antes de avançar.');
        return;
      }

      setIsLoadingNextStep(true);
      try {
        const baselineId = await fetchBaselineId();
        await new Promise((resolve) => setTimeout(resolve, 20000));
        const supabaseContent = await pollLatestDocument(baselineId);
        const finalContent = supabaseContent || generateDocument();
        setGeneratedDoc({
          id: Date.now(),
          type: 'peticao_simples',
          title: `${formData.tipoPeticao}`,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Concluído',
        });
        setEditedContent(finalContent);

        sendWebhook(finalContent);
      } catch (err) {
        console.error('Erro ao preparar conteúdo da petição simples:', err);
      } finally {
        setIsLoadingNextStep(false);
      }
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const generateDocument = () => {
    const attachmentsList = (formData.attachments || []).map((f) => f.name).filter(Boolean);
    const todayStr = new Date().toLocaleDateString('pt-BR');
    const localDataStr = `${formData.local ? formData.local + ', ' : ''}${todayStr}`;

    // Processar pedidos como itens numerados, caso haja múltiplos separados por \n ou ;
    const pedidosRaw = formData.specificRequest.trim();
    const pedidosItems = pedidosRaw
      .split(/\n|;+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const pedidosFormatados = pedidosItems.length > 1
      ? pedidosItems.map((p, i) => `${i + 1}) ${p}`).join('\n')
      : pedidosRaw;

    const header = `EXMO. SR. DR. JUIZ PRESIDENTE DA ${formData.courtName}.`;
    const processo = `Processo nº ${formData.processNumber}`;
    const qualificacao = `${formData.petitionerName}, nos autos do processo em epígrafe${formData.opposingPartyName ? `, em que contende com ${formData.opposingPartyName}` : ''}, vem, mui respeitosamente, à presença de V. Exª, por intermédio de seu advogado in fine, expor e requerer o que segue:`;

    const motivos = `Exposição dos Motivos:\n${formData.motiveFundament}`;
    const fundamentosLegais = formData.legalBasis ? `\nFundamentação Legal: ${formData.legalBasis}` : '';
    const urgencia = formData.urgency ? `\nPrazo/Urgência: ${formData.urgency}` : '';

    const pedidos = `Diante do exposto, requer:\n${pedidosFormatados}`;
    const encerramento = `\nNestes termos,\npede deferimento.`;

    const rodape = `\n\n${localDataStr}\n\n${formData.lawyerName}\nOAB ${formData.lawyerOab}`;
    const anexos = attachmentsList.length ? `\n\nDocumentos Anexos: ${attachmentsList.join(', ')}` : '';
    const titulo = `PETIÇÃO SIMPLES – ${formData.tipoPeticao}`;

    const content = `${titulo}\n\n${header}\n\n${processo}\n\n${qualificacao}\n\n${motivos}${fundamentosLegais}${urgencia}\n\n${pedidos}${encerramento}${rodape}${anexos}`;

    setGeneratedDoc({
      id: Date.now(),
      type: 'peticao_simples',
      title: `${formData.tipoPeticao}`,
      content,
      createdAt: new Date().toISOString(),
      status: 'Concluído',
    });
    setEditedContent(content);
    return content;
  };

  const processTextToParagraphs = (text) => {
    const paragraphs = [];
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        paragraphs.push(new Paragraph({ text: '' }));
        continue;
      }
      const isTitle = line.endsWith(':') ||
        (line.length < 50 && line === line.toUpperCase() && line.length > 3) ||
        line.includes('Diante do exposto') || line.includes('Exposição dos Motivos');
      if (isTitle) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line, bold: true, size: 24 })],
          spacing: { before: 240, after: 120 },
        }));
      } else {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line })],
          spacing: { after: 120 },
          alignment: AlignmentType.JUSTIFIED,
        }));
      }
    }
    return paragraphs;
  };

  const generateDocxDocument = () => {
    const content = editedContent || (generatedDoc?.content || '');
    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          new Paragraph({
            children: [new TextRun({ text: formData.tipoPeticao ? `PETIÇÃO SIMPLES – ${formData.tipoPeticao}` : 'PETIÇÃO SIMPLES', bold: true, size: 28 })],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 480 },
          }),
          new Paragraph({ text: '' }),
          ...processTextToParagraphs(content),
        ],
      }],
    });
    return doc;
  };

  const downloadDocx = async () => {
    try {
      const doc = generateDocxDocument();
      const blob = await Packer.toBlob(doc);
      const fileName = `peticao_simples_${(formData.tipoPeticao || 'documento').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.docx`;
      saveAs(blob, fileName);
    } catch (err) {
      console.error('Erro ao gerar documento DOCX:', err);
      alert('Erro ao gerar documento DOCX. Verifique os dados e tente novamente.');
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // mantém editedContent como fonte principal para geração
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(generatedDoc?.content || editedContent || '');
  };

  const renderStep1 = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Dados da Petição Simples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Tipo de Petição Simples *</label>
          <input type="text" name="tipoPeticao" value={formData.tipoPeticao} onChange={handleInputChange} className="input-primary" placeholder="Ex: Juntada de Documentos" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Número do Processo *</label>
          <input type="text" name="processNumber" value={formData.processNumber} onChange={handleInputChange} className="input-primary" placeholder="0000000-00.0000.0.00.0000" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Vara/Juízo *</label>
          <input type="text" name="courtName" value={formData.courtName} onChange={handleInputChange} className="input-primary" placeholder="Ex: 2ª Vara do Trabalho de Petrópolis/RJ" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Nome da Parte Peticionante *</label>
          <input type="text" name="petitionerName" value={formData.petitionerName} onChange={handleInputChange} className="input-primary" placeholder="Ex: João da Silva (Autor/Reclamante)" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Motivo/Fundamento *</label>
          <textarea name="motiveFundament" value={formData.motiveFundament} onChange={handleInputChange} className="input-primary" rows={4} placeholder="Descreva de maneira clara e objetiva o fundamento do pedido" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Pedido Específico *</label>
          <textarea name="specificRequest" value={formData.specificRequest} onChange={handleInputChange} className="input-primary" rows={4} placeholder="O que se requer. Separe múltiplos pedidos por linha ou ponto e vírgula" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Nome do Advogado *</label>
          <input type="text" name="lawyerName" value={formData.lawyerName} onChange={handleInputChange} className="input-primary" placeholder="Nome completo do advogado" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">OAB *</label>
          <input type="text" name="lawyerOab" value={formData.lawyerOab} onChange={handleInputChange} className="input-primary" placeholder="Ex: OAB/UF 123456" />
        </div>

        {/* Opcionais */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Nome da Parte Adversa (opcional)</label>
          <input type="text" name="opposingPartyName" value={formData.opposingPartyName} onChange={handleInputChange} className="input-primary" placeholder="Ex: Empresa XYZ Ltda." />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Prazo/Urgência (opcional)</label>
          <input type="text" name="urgency" value={formData.urgency} onChange={handleInputChange} className="input-primary" placeholder="Ex: apreciação urgente em 48 horas" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Local (opcional)</label>
          <input type="text" name="local" value={formData.local} onChange={handleInputChange} className="input-primary" placeholder="Ex: Petrópolis/RJ" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Fundamentação Legal (opcional)</label>
          <textarea name="legalBasis" value={formData.legalBasis} onChange={handleInputChange} className="input-primary" rows={3} placeholder="Artigos de lei e referências, quando aplicável" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">Documentos (Opcional - Máximo 3 arquivos)</label>

          {/* Área de Upload no mesmo estilo da Petição Inicial */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id="ps-file-upload"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="ps-file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Clique para selecionar arquivos ou arraste e solte
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
            </label>
          </div>

          {/* Lista de Arquivos Selecionados */}
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
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
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onCancel} className="btn-secondary px-6 py-3" disabled={isLoadingNextStep}>Cancelar</button>
        <button onClick={nextStep} className="btn-primary px-6 py-3 flex items-center justify-center" disabled={isLoadingNextStep}>
          {isLoadingNextStep ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processando (20s)...
            </>
          ) : (
            'Avançar →'
          )}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Revisão de Documentos</h2>
        {generatedDoc && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button onClick={handleSaveEdit} className="btn-primary text-sm px-4 py-2">Salvar</button>
                <button onClick={handleCancelEdit} className="btn-secondary text-sm px-4 py-2">Cancelar</button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-xs dark:border-gray-200 dark:text-gray-200 dark:hover:bg-white dark:hover:text-black"
                aria-label="Editar seção"
                title="Editar"
              >
                <Pencil className="h-3 w-3" />
                Editar
              </button>
            )}
          </div>
        )}
      </div>

      {generatedDoc ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-80 p-4 text-base text-slate-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="whitespace-pre-wrap text-base text-slate-900 dark:text-white leading-relaxed">{editedContent}</div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Preencha os dados e avance para gerar a petição</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="btn-secondary px-6 py-3"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</button>
        <button
          onClick={downloadDocx}
          disabled={!generatedDoc}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Gerar Documento
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Petição Simples</h1>
      </div>
      <StepIndicator steps={steps} currentStep={currentStep} />

      {currentStep === 0 && renderStep1()}
      {currentStep === 1 && renderStep2()}
    </div>
  );
}