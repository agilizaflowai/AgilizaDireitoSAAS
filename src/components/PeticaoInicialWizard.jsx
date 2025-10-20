import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import StepIndicator from './StepIndicator';
import Step1DadosAcao from './Step1DadosAcao';
import Step2PerguntasIA from './Step2PerguntasIA';
import Step3DosFatos from './Step3DosFatos';
import Step4FundamentosJuridicos from './Step4FundamentosJuridicos';
import Step5Pedidos from './Step5Pedidos';
import Step6Revisao from './Step6Revisao';

const steps = [
  'Dados da Ação',
  'Perguntas da IA',
  'Dos Fatos',
  'Fundamentos Jurídicos',
  'Pedidos',
  'Revisão'
];

const initialFormData = {
  // Novos campos do Step1
  fatosCaso: '',
  parteRepresentada: '',
  parteContraria: '',
  tipoAcao: '', // Novo campo: Tipo de ação desejada
  jurisdicao: '', // Novo campo: Jurisdição aplicável (Estado/Comarca)
  objetivosCliente: '', // Novo campo: Objetivos principais do cliente com a ação
  uploadedFiles: [], // Arquivos enviados no Step1
  
  // Campos das perguntas da IA
  pergunta1: '',
  pergunta2: '',
  pergunta3: '',
  pergunta4: '',
  pergunta5: '',
  
  // Campos antigos mantidos para compatibilidade
  titulo: '',
  vara: '',
  valorCausa: '',
  justicaGratuita: false,
  prioridade: [],
  autor: {
    nome: '', cpf: '', rg: '', nascimento: '', estadoCivil: '', profissao: '',
    endereco: { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' },
    email: '', telefone: ''
  },
  reu: {
    tipo: 'fisica', nome: '', cpf: '', razaoSocial: '', cnpj: '',
    endereco: { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' },
    email: '', telefone: ''
  },
  dosFatos: '',
  fundamentosJuridicos: '',
  pedidos: '',
  documentos: [],
  outrosDocumentos: '',
  danosMateriais: '',
  danosMorais: '',
  tutelaUrgencia: '',
  justificativaUrgencia: '',
  outrosPedidos: '',
  audienciaConciliacao: '', // sim/não
  honorariosPercentual: '', // percentual desejado
  interesseProvas: [] // array de opções
};

export default function PeticaoInicialWizard({ onCancel }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('peticaoWizard', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const handler = (e) => {
      if (typeof e.detail === 'number') setStep(e.detail);
    };
    window.addEventListener('wizardGoToStep', handler);
    return () => window.removeEventListener('wizardGoToStep', handler);
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const updateForm = (data) => setFormData(prev => ({ ...prev, ...data }));

  const handleGerarPeticao = async () => {
    setIsGenerating(true);
    try {
      // Simula um pequeno delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Avança para o próximo step sem fazer chamadas externas
      nextStep();
    } catch (err) {
      console.error(err);
      // Opcional: Adicionar feedback de erro para o usuário
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para gerar documento .docx
  const generateDocxDocument = (formData) => {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Título
          new Paragraph({
            children: [
              new TextRun({
                text: "PETIÇÃO INICIAL",
                bold: true,
                size: 28,
              }),
            ],
            alignment: "center",
            spacing: {
              after: 400,
            },
          }),
          
          // Cabeçalho do juiz
          new Paragraph({
            children: [
              new TextRun({
                text: `Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito da ${formData.vara || 'Vara Cível'}`,
                bold: true,
              }),
            ],
            alignment: "center",
            spacing: {
              after: 400,
            },
          }),
          
          new Paragraph({ text: "" }),
          
          // Dados das partes
          new Paragraph({
            children: [
              new TextRun({
                text: "AUTOR: ",
                bold: true,
              }),
              new TextRun({
                text: `${formData.autor?.nome || ''}, ${formData.autor?.estadoCivil || ''}, ${formData.autor?.profissao || ''}, portador do CPF nº ${formData.autor?.cpf || ''}, residente e domiciliado na ${formData.autor?.endereco?.rua || ''}, ${formData.autor?.endereco?.numero || ''}, ${formData.autor?.endereco?.bairro || ''}, ${formData.autor?.endereco?.cidade || ''}/${formData.autor?.endereco?.estado || ''}, CEP ${formData.autor?.endereco?.cep || ''}`,
              }),
            ],
            spacing: {
              after: 200,
            },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "RÉU: ",
                bold: true,
              }),
              new TextRun({
                text: formData.reu?.tipo === 'fisica' 
                  ? `${formData.reu?.nome || ''}, portador do CPF nº ${formData.reu?.cpf || ''}`
                  : `${formData.reu?.razaoSocial || ''}, pessoa jurídica de direito privado, inscrita no CNPJ sob nº ${formData.reu?.cnpj || ''}`,
              }),
            ],
            spacing: {
              after: 400,
            },
          }),
          
          // Dos Fatos
          new Paragraph({
            children: [
              new TextRun({
                text: "DOS FATOS",
                bold: true,
                size: 24,
              }),
            ],
            alignment: "center",
            spacing: {
              before: 200,
              after: 200,
            },
          }),
          new Paragraph({
            text: formData.dosFatos || "Fatos a serem preenchidos...",
            spacing: {
              after: 400,
            },
          }),
          
          // Dos Fundamentos Jurídicos
          new Paragraph({
            children: [
              new TextRun({
                text: "DOS FUNDAMENTOS JURÍDICOS",
                bold: true,
                size: 24,
              }),
            ],
            alignment: "center",
            spacing: {
              before: 200,
              after: 200,
            },
          }),
          new Paragraph({
            text: formData.fundamentosJuridicos || "Fundamentos jurídicos a serem preenchidos...",
            spacing: {
              after: 400,
            },
          }),
          
          // Dos Pedidos
          new Paragraph({
            children: [
              new TextRun({
                text: "DOS PEDIDOS",
                bold: true,
                size: 24,
              }),
            ],
            alignment: "center",
            spacing: {
              before: 200,
              after: 200,
            },
          }),
          new Paragraph({
            text: formData.pedidos || "Pedidos a serem preenchidos...",
            spacing: {
              after: 400,
            },
          }),
          
          // Valor da causa
          new Paragraph({
            children: [
              new TextRun({
                text: "Dá-se à causa o valor de R$ ",
              }),
              new TextRun({
                text: formData.valorCausa || "0,00",
                bold: true,
              }),
              new TextRun({
                text: ".",
              }),
            ],
            spacing: {
              after: 400,
            },
          }),
          
          new Paragraph({
            text: "Termos em que pede deferimento.",
            spacing: {
              after: 400,
            },
          }),
          
          // Data e local
          new Paragraph({
            text: `${formData.autor?.endereco?.cidade || 'Cidade'}/${formData.autor?.endereco?.estado || 'Estado'}, ${new Date().toLocaleDateString('pt-BR')}.`,
            alignment: "right",
            spacing: {
              after: 600,
            },
          }),
          
          // Assinatura
          new Paragraph({
            text: "_________________________________",
            alignment: "center",
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            text: "Advogado(a)",
            alignment: "center",
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            text: "OAB/XX nº XXXXX",
            alignment: "center",
          }),
        ],
      }],
    });
    
    return doc;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    
    try {
      // Gerar documento .docx
      const doc = generateDocxDocument(formData);
      const docBlob = await Packer.toBlob(doc);
      
      // Criar nome único para o arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const authorName = formData.autor.nome ? formData.autor.nome.replace(/\s+/g, '_') : 'autor';
      const fileName = `peticao_inicial_${authorName}_${timestamp}.docx`;
      
      // Fazer download local
      saveAs(docBlob, fileName);
      
      setSubmitSuccess('Documento gerado e baixado com sucesso!');
      setStep(0);
      setFormData(initialFormData);
      localStorage.removeItem('peticaoWizard');
      
    } catch (err) {
      console.error('Erro ao gerar documento:', err);
      
      let errorMessage = 'Falha ao gerar documento. Tente novamente.';
      
      if (err.message.includes('Packer')) {
        errorMessage = 'Erro ao gerar documento DOCX. Verifique os dados do formulário.';
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        Petição Inicial
      </h2>
      <StepIndicator steps={steps} currentStep={step} />
      <div className="mt-6">
        {step === 0 && <Step1DadosAcao data={formData} updateForm={updateForm} nextStep={nextStep} onCancel={onCancel} />}
        {step === 1 && <Step2PerguntasIA data={formData} updateForm={updateForm} nextStep={handleGerarPeticao} prevStep={prevStep} isGenerating={isGenerating} />}
        {step === 2 && <Step3DosFatos data={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Step4FundamentosJuridicos data={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <Step5Pedidos data={formData} updateForm={updateForm} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && (
          <>
            <Step6Revisao data={formData} updateForm={updateForm} prevStep={prevStep} onSubmit={handleSubmit} />
            <div className="mt-6 flex flex-col items-center">
              {isSubmitting && <span className="text-black">Enviando petição...</span>}
              {submitSuccess && <span className="text-green-600">{submitSuccess}</span>}
              {submitError && <span className="text-red-600">{submitError}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};