import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ArrowLeft, ArrowRight, Download, Eye, FileText, X, Pencil } from 'lucide-react';
import StepIndicator from './StepIndicator';
import { supabase } from '../supabaseClient';

const steps = ['Dados do Documento', 'Revisão'];

const DocumentWizard = ({ documentType, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Estado inicial dos campos do formulário
  const initialFormData = {
    title: '',
    clientName: '',
    clientCpf: '',
    opposingParty: '',
    caseValue: '',
    description: '',
    urgency: 'Média',
    // Campos específicos por tipo
    courtName: '',
    processNumber: '',
    contractType: '',
    contractValue: '',
    procurationType: '',
    lawyerName: '',
    lawyerOab: '',
    additionalInfo: '',
    // Campos específicos do contrato
    partiesIdentification: '',
    partiesObligations: '',
    fulfillmentDeadline: '',
    paymentMethod: '',
    penalties: '',
    agreementEffect: '',
    judicialHomologation: '',
    signatures: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);
  const [contestacaoData, setContestacaoData] = useState(null);
  const [recursoData, setRecursoData] = useState(null);
  const [contratoData, setContratoData] = useState(null);
  const [procuracaoData, setProcuracaoData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // Limpar campos quando o tipo de documento muda
  useEffect(() => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setGeneratedDoc(null);
    setContestacaoData(null);
    setRecursoData(null);
    setContratoData(null);
    setProcuracaoData(null);
    setIsEditing(false);
    setEditedContent('');
  }, [documentType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para buscar dados da tabela contestacao_ia
  const fetchContestacaoData = async () => {
    try {
      console.log('Iniciando busca na tabela contestacao_ia...');
      const { data, error } = await supabase
        .from('contestacao_ia')
        .select('documento_gerado')
        .order('id', { ascending: false })
        .limit(1);

      console.log('Resposta do Supabase:', { data, error });

      if (error) {
        console.error('Erro ao buscar dados da contestacao_ia:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('Nenhum dado encontrado na tabela contestacao_ia');
        return null;
      }

      console.log('Dados encontrados:', data[0]);
      console.log('Conteúdo do documento_gerado:', data[0].documento_gerado);
      return data[0];
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
      return null;
    }
  };

  // Função para buscar dados da tabela procuracao_ia
  const fetchProcuracaoData = async () => {
    try {
      console.log('🔍 Iniciando busca na tabela procuracao_ia...');
      
      // Buscar o último registro com documento_gerado não nulo, ordenado por ID (auto-incrementado)
      const { data, error } = await supabase
        .from('procuracao_ia')
        .select('*')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .order('id', { ascending: false })
        .limit(1);

      console.log('📊 Resposta do Supabase para procuracao_ia:', { data, error });

      if (error) {
        console.error('❌ Erro ao buscar dados da procuracao_ia:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ Nenhum dado encontrado na tabela procuracao_ia');
        return null;
      }

      console.log('✅ Dados da procuração encontrados:', data[0]);
      console.log('📄 Conteúdo do documento_gerado:', data[0].documento_gerado ? 'Documento presente' : 'Documento vazio');
      return data[0];
    } catch (error) {
      console.error('💥 Erro ao conectar com Supabase para procuração:', error);
      return null;
    }
  };

  // Função para buscar dados da tabela recurso_ia
  const fetchRecursoData = async () => {
    try {
      console.log('🔍 Iniciando busca na tabela recurso_ia...');
      
      // Buscar o último registro com documento_gerado não nulo, ordenado por ID (auto-incrementado)
      const { data, error } = await supabase
        .from('recurso_ia')
        .select('*')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .order('id', { ascending: false })
        .limit(1);

      console.log('📊 Resposta do Supabase recurso_ia:', { data, error });

      if (error) {
        console.error('❌ Erro ao buscar dados da recurso_ia:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ Nenhum dado encontrado na tabela recurso_ia com documento_gerado');
        
        // Tentar buscar novamente após 5 segundos (retry)
        console.log('🔄 Tentando buscar novamente em 5 segundos...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const { data: retryData, error: retryError } = await supabase
          .from('recurso_ia')
          .select('*')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);

        console.log('🔄 Segunda tentativa - Resposta do Supabase:', { retryData, retryError });

        if (retryError) {
          console.error('❌ Erro na segunda tentativa:', retryError);
          return null;
        }

        if (!retryData || retryData.length === 0) {
          console.log('❌ Nenhum dado encontrado mesmo na segunda tentativa');
          return null;
        }

        console.log('✅ Dados do recurso encontrados na segunda tentativa:', retryData[0]);
        return retryData[0];
      }

      console.log('✅ Dados do recurso encontrados:', data[0]);
      console.log('📄 Conteúdo do documento_gerado:', data[0].documento_gerado ? 'Documento presente' : 'Documento vazio');
      return data[0];
    } catch (error) {
      console.error('💥 Erro ao conectar com Supabase para recurso:', error);
      return null;
    }
  };

  // Função para buscar dados da tabela contrato_ia
  const fetchContratoData = async () => {
    try {
      console.log('🔍 Iniciando busca na tabela contrato_ia...');
      console.log('🔍 Query: Buscando último registro com documento_gerado não nulo, ordenado por ID DESC');
      
      // Buscar o último registro com documento_gerado não nulo, ordenado por ID (auto-incrementado)
      const { data, error } = await supabase
        .from('contrato_ia')
        .select('*')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .order('id', { ascending: false })
        .limit(1);

      console.log('📊 Resposta do Supabase contrato_ia:', { data, error });
      console.log('📊 Número de registros encontrados:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📊 ID do registro encontrado:', data[0].id);
        console.log('📊 Documento gerado presente:', !!data[0].documento_gerado);
      }

      if (error) {
        console.error('❌ Erro ao buscar dados da contrato_ia:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ Nenhum dado encontrado na tabela contrato_ia com documento_gerado');
        
        // Tentar buscar novamente após 5 segundos (retry)
        console.log('🔄 Tentando buscar novamente em 5 segundos...');
        console.log('🔄 Query retry: Buscando último registro com documento_gerado não nulo, ordenado por ID DESC');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const { data: retryData, error: retryError } = await supabase
          .from('contrato_ia')
          .select('*')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);

        console.log('🔄 Segunda tentativa - Resposta do Supabase:', { retryData, retryError });
        console.log('🔄 Número de registros encontrados na retry:', retryData?.length || 0);
        if (retryData && retryData.length > 0) {
          console.log('🔄 ID do registro encontrado na retry:', retryData[0].id);
          console.log('🔄 Documento gerado presente na retry:', !!retryData[0].documento_gerado);
        }

        if (retryError) {
          console.error('❌ Erro na segunda tentativa:', retryError);
          return null;
        }

        if (!retryData || retryData.length === 0) {
          console.log('❌ Nenhum dado encontrado mesmo na segunda tentativa');
          return null;
        }

        console.log('✅ Dados do contrato encontrados na segunda tentativa:', retryData[0]);
        return retryData[0];
      }

      console.log('✅ Dados do contrato encontrados:', data[0]);
      console.log('📄 Conteúdo do documento_gerado:', data[0].documento_gerado ? 'Documento presente' : 'Documento vazio');
      return data[0];
    } catch (error) {
      console.error('💥 Erro ao conectar com Supabase para contrato:', error);
      return null;
    }
  };

  const sendToWebhook = async (data, webhookType = 'contestacao') => {
    try {
      const webhookUrls = {
        'contestacao': 'https://n8n-n8n.04qisd.easypanel.host/webhook/contestacao-judicial',
        'recurso': 'https://n8n-n8n.04qisd.easypanel.host/webhook/recurso-judicial',
        'contrato': 'https://n8n-n8n.04qisd.easypanel.host/webhook/contrato-judicial'
      };
      
      const webhookUrl = webhookUrls[webhookType] || webhookUrls['contestacao'];
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Dados enviados com sucesso para o webhook ${webhookType}:`, result);
      return result;
    } catch (error) {
      console.error(`Erro ao enviar dados para o webhook ${webhookType}:`, error);
      throw error;
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      // Se for contrato e estiver no primeiro step, enviar dados para o webhook
      if (documentType === 'contrato' && currentStep === 0) {
        setIsLoadingNextStep(true);
        
        try {
          // Preparar dados específicos do contrato
          const contratoDataToSend = {
            ...formData,
            documentType: 'contrato'
          };
          
          // Enviar dados para o webhook de contrato
          await sendToWebhook(contratoDataToSend, 'contrato');
          
          console.log('Dados do contrato enviados:', contratoDataToSend);
          
          // Aguardar 60 segundos
          console.log('⏳ Aguardando 60 segundos para buscar dados do contrato...');
          await new Promise(resolve => setTimeout(resolve, 60000));
          
          // Buscar dados da tabela contrato_ia
          const data = await fetchContratoData();
          if (data) {
            setContratoData(data);
            console.log('✅ Dados do contrato carregados com sucesso:', data);
          } else {
            console.log('⚠️ Nenhum dado encontrado na tabela contrato_ia');
          }
          
        } catch (error) {
          console.error('Erro ao enviar dados do contrato:', error);
          alert('Erro ao processar dados do contrato. Tente novamente.');
          setIsLoadingNextStep(false);
          return;
        } finally {
          setIsLoadingNextStep(false);
        }
      }
      
      // Se for contestação e estiver no primeiro step, enviar dados para o webhook
      if (documentType === 'contestacao' && currentStep === 0) {
        setIsLoadingNextStep(true);
        
        try {
          // Enviar dados para o webhook de contestação
          await sendToWebhook(formData, 'contestacao');
          
          // Aguardar 30 segundos
          await new Promise(resolve => setTimeout(resolve, 30000));
          
          // Buscar dados da tabela contestacao_ia
          const data = await fetchContestacaoData();
          if (data) {
            setContestacaoData(data);
          }
          
        } catch (error) {
          alert('Erro ao processar dados. Tente novamente.');
          setIsLoadingNextStep(false);
          return;
        } finally {
          setIsLoadingNextStep(false);
        }
      }
      
      // Se for recurso e estiver no primeiro step, enviar dados para o webhook
      if (documentType === 'recurso' && currentStep === 0) {
        setIsLoadingNextStep(true);
        
        try {
          // Preparar dados específicos do recurso incluindo o campo decisaoImpugnada
          const recursoData = {
            ...formData,
            documentType: 'recurso',
            decisaoImpugnada: formData.decisaoImpugnada || ''
          };
          
          // Enviar dados para o webhook de recurso
          await sendToWebhook(recursoData, 'recurso');
          
          console.log('Dados do recurso enviados:', recursoData);
          
          // Aguardar 60 segundos
          await new Promise(resolve => setTimeout(resolve, 60000));
          
          // Buscar dados da tabela recurso_ia
          console.log('Iniciando busca dos dados do recurso após 60 segundos...');
          const data = await fetchRecursoData();
          console.log('Resultado da busca do recurso:', data);
          if (data) {
            console.log('Definindo recursoData com:', data);
            setRecursoData(data);
          } else {
            console.log('Nenhum dado encontrado para o recurso');
            // Tentar buscar novamente após mais alguns segundos
            console.log('Tentando buscar novamente em 10 segundos...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            const retryData = await fetchRecursoData();
            if (retryData) {
              console.log('Dados encontrados na segunda tentativa:', retryData);
              setRecursoData(retryData);
            }
          }
          
        } catch (error) {
          alert('Erro ao processar dados do recurso. Tente novamente.');
          setIsLoadingNextStep(false);
          return;
        } finally {
          setIsLoadingNextStep(false);
        }
      }
      
      // Se for procuração e estiver no primeiro step, enviar dados para o webhook
      if (documentType === 'procuracao' && currentStep === 0) {
        setIsLoadingNextStep(true);
        
        try {
          // Preparar apenas os dados essenciais da procuração
          const procuracaoData = {
            title: formData.title,
            clientName: formData.clientName,
            lawyerName: formData.lawyerName,
            lawyerOab: formData.lawyerOab,
            description: formData.description, // Endereço do cliente
            documentType: 'procuracao'
          };
          
          // Enviar dados para o webhook de procuração judicial
          const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/procuracao-judicial', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(procuracaoData)
          });
          
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          
          console.log('Dados da procuração enviados com sucesso:', procuracaoData);
          
          // Aguardar 30 segundos
          console.log('⏳ Aguardando 30 segundos para buscar dados da procuração...');
          await new Promise(resolve => setTimeout(resolve, 30000));
          
          // Buscar dados da tabela procuracao_ia
          console.log('Iniciando busca dos dados da procuração após 30 segundos...');
          const data = await fetchProcuracaoData();
          console.log('Resultado da busca da procuração:', data);
          if (data) {
            console.log('Definindo procuracaoData com:', data);
            setProcuracaoData(data);
          } else {
            console.log('Nenhum dado encontrado para a procuração');
            // Tentar buscar novamente após mais alguns segundos
            console.log('Tentando buscar novamente em 10 segundos...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            const retryData = await fetchProcuracaoData();
            if (retryData) {
              console.log('Dados encontrados na segunda tentativa:', retryData);
              setProcuracaoData(retryData);
            }
          }
          
        } catch (error) {
          console.error('Erro ao enviar dados da procuração:', error);
          alert('Erro ao processar dados da procuração. Tente novamente.');
          setIsLoadingNextStep(false);
          return;
        } finally {
          setIsLoadingNextStep(false);
        }
      }
      
      setCurrentStep(currentStep + 1);
      if (currentStep === 0) {
        generateDocument();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateDocument = () => {
    // Para contestação, não gerar documento padrão - apenas aguardar dados do Supabase
    if (documentType === 'contestacao') {
      return;
    }
    
    setIsGenerating(true);
    
    // Simular geração com IA para outros tipos de documento
    setTimeout(() => {
      let content = '';
      
      switch (documentType) {
        case 'recurso':
          content = generateRecursoContent();
          break;
        case 'contrato':
          content = generateContratoContent();
          break;
        case 'procuracao':
          content = generateProcuracaoContent();
          break;
        default:
          content = 'Documento gerado com sucesso.';
      }
      
      setGeneratedDoc({
        id: Date.now(),
        type: documentType,
        title: formData.title,
        content: content,
        createdAt: new Date().toISOString(),
        status: 'Concluído'
      });
      
      setIsGenerating(false);
    }, 2000);
  };

  const generateContestacaoContent = () => {
    return `CONTESTAÇÃO

Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito da ${formData.courtName || 'Vara Competente'}

Processo nº: ${formData.processNumber || 'XXXXXXX-XX.XXXX.X.XX.XXXX'}

REQUERIDO: ${formData.clientName}, já qualificado nos autos da ação em epígrafe, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, tempestivamente, apresentar CONTESTAÇÃO à ação movida por ${formData.opposingParty}, pelas razões de fato e de direito a seguir expostas:

DOS FATOS

${formData.description || 'Os fatos narrados na inicial não correspondem à realidade...'}

DO DIREITO

${formData.additionalInfo || 'A pretensão do autor não merece prosperar...'}

DOS PEDIDOS

Diante do exposto, requer-se:

a) O acolhimento da presente contestação;
b) A improcedência total dos pedidos formulados na inicial;
c) A condenação do autor ao pagamento das custas processuais e honorários advocatícios.

Dá-se à causa o valor de R$ ${formData.caseValue || '0,00'}.

Termos em que pede deferimento.

Local, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
${formData.lawyerName || 'Advogado(a)'}
OAB/${formData.lawyerOab || 'XX nº XXXXX'}`;
  };

  const generateRecursoContent = () => {
    return `RECURSO DE APELAÇÃO

Excelentíssimo(a) Senhor(a) Desembargador(a) Relator(a)

Processo nº: ${formData.processNumber || 'XXXXXXX-XX.XXXX.X.XX.XXXX'}

APELANTE: ${formData.clientName}, já qualificado nos autos
APELADO: ${formData.opposingParty}

${formData.clientName}, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, interpor RECURSO DE APELAÇÃO da r. sentença proferida nos autos em epígrafe, pelas razões a seguir expostas:

DA DECISÃO IMPUGNADA

${formData.decisaoImpugnada || 'A r. sentença objeto do presente recurso...'}

DOS FATOS

${formData.description || 'A r. sentença merece reforma...'}

DO DIREITO

${formData.additionalInfo || 'A decisão de primeiro grau não observou...'}

DOS PEDIDOS

Diante do exposto, requer-se:

a) O conhecimento e provimento do presente recurso;
b) A reforma da r. sentença recorrida;
c) O julgamento procedente dos pedidos iniciais.

Termos em que pede deferimento.

Local, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
${formData.lawyerName || 'Advogado(a)'}
OAB/${formData.lawyerOab || 'XX nº XXXXX'}`;
  };

  const generateContratoContent = () => {
    return `CONTRATO DE ${formData.contractType?.toUpperCase() || 'PRESTAÇÃO DE SERVIÇOS'}

${formData.partiesIdentification ? `IDENTIFICAÇÃO DAS PARTES:
${formData.partiesIdentification}

` : `Pelo presente instrumento particular, de um lado ${formData.clientName}, doravante denominado CONTRATANTE, e de outro lado ${formData.opposingParty}, doravante denominado CONTRATADO, têm entre si justo e acordado o seguinte:

`}CLÁUSULA 1ª - DO OBJETO
${formData.description || 'O presente contrato tem por objeto...'}

CLÁUSULA 2ª - DO VALOR E FORMA DE PAGAMENTO
O valor total do presente contrato é de R$ ${formData.contractValue || formData.caseValue || '0,00'}.${formData.paymentMethod ? `
Forma de pagamento: ${formData.paymentMethod}` : ''}

CLÁUSULA 3ª - DAS OBRIGAÇÕES DAS PARTES
${formData.partiesObligations || formData.additionalInfo || 'As partes se comprometem a...'}

CLÁUSULA 4ª - DO PRAZO${formData.fulfillmentDeadline ? `
O prazo para cumprimento das obrigações é de: ${formData.fulfillmentDeadline}` : ''}
O presente contrato terá vigência a partir da data de sua assinatura.

${formData.penalties ? `CLÁUSULA 5ª - DAS PENALIDADES
${formData.penalties}

` : ''}${formData.agreementEffect ? `CLÁUSULA ${formData.penalties ? '6ª' : '5ª'} - DO EFEITO DO ACORDO
${formData.agreementEffect}

` : ''}${formData.judicialHomologation && formData.judicialHomologation !== 'nao' ? `CLÁUSULA ${formData.penalties && formData.agreementEffect ? '7ª' : formData.penalties || formData.agreementEffect ? '6ª' : '5ª'} - DA HOMOLOGAÇÃO JUDICIAL
${formData.judicialHomologation === 'sim' ? 'O presente contrato será submetido à homologação judicial.' : 'A homologação judicial será definida posteriormente.'}

` : ''}CLÁUSULA ${formData.penalties && formData.agreementEffect && formData.judicialHomologation && formData.judicialHomologation !== 'nao' ? '8ª' : 
                 (formData.penalties && formData.agreementEffect) || (formData.penalties && formData.judicialHomologation && formData.judicialHomologation !== 'nao') || (formData.agreementEffect && formData.judicialHomologation && formData.judicialHomologation !== 'nao') ? '7ª' :
                 formData.penalties || formData.agreementEffect || (formData.judicialHomologation && formData.judicialHomologation !== 'nao') ? '6ª' : '5ª'} - DO FORO
Fica eleito o foro da comarca de ${formData.courtName || 'São Paulo'} para dirimir quaisquer questões oriundas do presente contrato.

E por estarem assim justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.

Local, ${new Date().toLocaleDateString('pt-BR')}.

${formData.signatures === 'partes-testemunhas' || formData.signatures === 'partes-testemunhas-advogados' ? 
`_________________________________        _________________________________
${formData.clientName}                    ${formData.opposingParty}
CONTRATANTE                               CONTRATADO

TESTEMUNHAS:

_________________________________        _________________________________
Nome:                                     Nome:
CPF:                                      CPF:${formData.signatures === 'partes-testemunhas-advogados' ? `

ADVOGADOS:

_________________________________        _________________________________
Advogado(a) do Contratante               Advogado(a) do Contratado
OAB/XX nº XXXXX                         OAB/XX nº XXXXX` : ''}` :
`_________________________________        _________________________________
${formData.clientName}                    ${formData.opposingParty}
CONTRATANTE                               CONTRATADO`}`;
  };

  const generateProcuracaoContent = () => {
    return `PROCURAÇÃO AD JUDICIA

OUTORGANTE: ${formData.clientName}, ${formData.additionalInfo || 'brasileiro(a), maior, capaz'}, portador(a) do CPF nº ${formData.clientCpf || 'XXX.XXX.XXX-XX'}, residente e domiciliado(a) na ${formData.description || 'endereço completo'}.

OUTORGADO: ${formData.lawyerName || formData.opposingParty}, advogado(a), inscrito(a) na OAB/${formData.lawyerOab || 'XX sob nº XXXXX'}.

PODERES: Pelo presente instrumento de mandato, o(a) OUTORGANTE nomeia e constitui seu(sua) bastante procurador(a) o(a) OUTORGADO(A), a quem confere amplos poderes para representá-lo(a) ativa e passivamente, judicial e extrajudicialmente, podendo:

a) Propor e contestar ações de qualquer natureza;
b) Transigir, desistir, renunciar ao direito em que se funda a ação;
c) Receber e dar quitação;
d) Substabelecer esta procuração, no todo ou em parte;
e) Praticar todos os atos necessários ao bom e fiel desempenho do presente mandato.

${formData.processNumber ? `Processo específico: ${formData.processNumber}` : ''}

Local, ${new Date().toLocaleDateString('pt-BR')}.

_________________________________
${formData.clientName}
OUTORGANTE`;
  };

  const generateDocxDocument = () => {
    // Para contestação, usar o conteúdo editado ou os dados do Supabase
    let content = '';
    if (documentType === 'contestacao') {
      content = editedContent || contestacaoData?.documento_gerado || 'Conteúdo não disponível';
    } else {
      content = editedContent || generatedDoc?.content || 'Conteúdo não disponível';
    }

    // Função para processar o texto e criar parágrafos formatados
    const processTextToParagraphs = (text) => {
      const paragraphs = [];
      
      // Dividir o texto em linhas
      const lines = text.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Pular linhas vazias mas adicionar espaçamento
        if (line === '') {
          paragraphs.push(new Paragraph({ text: "" }));
          continue;
        }
        
        // Detectar títulos (linhas que terminam com dois pontos ou são curtas e em maiúscula)
        const isTitle = line.endsWith(':') || 
                       (line.length < 50 && line === line.toUpperCase() && line.length > 3) ||
                       line.includes('RELATÓRIO') || 
                       line.includes('PEDIDOS') ||
                       line.includes('DOS FATOS') ||
                       line.includes('FUNDAMENTOS');
        
        if (isTitle) {
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({
                text: line,
                bold: true,
                size: 24,
              })
            ],
            spacing: {
              before: 240,
              after: 120,
            }
          }));
        } else {
          // Processar texto normal com possível formatação
          const textRuns = [];
          
          // Dividir por palavras para detectar formatação
          const words = line.split(' ');
          let currentText = '';
          
          for (let j = 0; j < words.length; j++) {
            const word = words[j];
            
            // Detectar texto em maiúscula (possível destaque)
            if (word.length > 2 && word === word.toUpperCase() && 
                !word.includes('.') && !word.includes(',')) {
              // Adicionar texto acumulado
              if (currentText) {
                textRuns.push(new TextRun({ text: currentText }));
                currentText = '';
              }
              // Adicionar palavra em destaque
              textRuns.push(new TextRun({ 
                text: word + ' ',
                bold: true 
              }));
            } else {
              currentText += word + ' ';
            }
          }
          
          // Adicionar texto restante
          if (currentText) {
            textRuns.push(new TextRun({ text: currentText.trim() }));
          }
          
          paragraphs.push(new Paragraph({
            children: textRuns.length > 0 ? textRuns : [new TextRun({ text: line })],
            spacing: {
              after: 120,
            },
            alignment: AlignmentType.JUSTIFIED,
          }));
        }
      }
      
      return paragraphs;
    };

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Título do documento
          new Paragraph({
            children: [
              new TextRun({
                text: formData.title || `${documentType.toUpperCase()}`,
                bold: true,
                size: 28,
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 480,
            }
          }),
          
          // Espaçamento após título
          new Paragraph({ text: "" }),
          
          // Conteúdo processado em parágrafos
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
      const fileName = `${formData.title || documentType}_${new Date().toISOString().slice(0, 10)}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar documento. Tente novamente.');
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      // Iniciar edição - definir conteúdo atual
      const currentContent = documentType === 'contestacao' 
        ? contestacaoData?.documento_gerado || ''
        : generatedDoc?.content || '';
      setEditedContent(currentContent);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // O conteúdo editado já está salvo no estado editedContent
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(''); // Limpar edições
  };

  const renderStep1 = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Dados do {documentType === 'contestacao' ? 'Contestação' : 
                  documentType === 'recurso' ? 'Recurso' : 
                  documentType === 'contrato' ? 'Contrato' : 'Procuração'}
      </h2>
      
      <div className="space-y-6">
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
              className="input-primary"
              placeholder={`Ex: ${documentType === 'contestacao' ? 'Contestação - Processo 123456' : 
                              documentType === 'recurso' ? 'Recurso de Apelação' : 
                              documentType === 'contrato' ? 'Contrato de Prestação de Serviços' : 'Procuração Ad Judicia'}`}
            />
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
              className="input-primary"
              placeholder="Nome completo do cliente"
            />
          </div>

          {documentType !== 'procuracao' && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                {documentType === 'contrato' ? 'Segunda Parte' : 'Parte Contrária'}
              </label>
              <input
                  type="text"
                  name="opposingParty"
                  value={formData.opposingParty}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder={documentType === 'contrato' ? 'Nome da segunda parte' : 'Nome da parte adversa'}
                />
            </div>
          )}

          {(documentType === 'contestacao' || documentType === 'recurso') && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Número do Processo
                </label>
                <input
                  type="text"
                  name="processNumber"
                  value={formData.processNumber}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="0000000-00.0000.0.00.0000"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Vara/Tribunal
                </label>
                <input
                  type="text"
                  name="courtName"
                  value={formData.courtName}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="Ex: 1ª Vara Cível de São Paulo"
                />
              </div>
            </>
          )}

          {documentType === 'contrato' && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Tipo de Contrato
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="prestacao-servicos">Prestação de Serviços</option>
                  <option value="compra-venda">Compra e Venda</option>
                  <option value="locacao">Locação</option>
                  <option value="sociedade">Sociedade</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Valor do Contrato
                </label>
                <input
                  type="text"
                  name="contractValue"
                  value={formData.contractValue}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Qualificação Completa das Partes *
                </label>
                <textarea
                  name="partiesIdentification"
                  value={formData.partiesIdentification || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-primary"
                  placeholder="Ex: CONTRATANTE: João Silva, brasileiro, casado, empresário, CPF 123.456.789-00, residente na Rua A, 123, São Paulo/SP. CONTRATADO: Maria Santos, brasileira, solteira, advogada, CPF 987.654.321-00, residente na Rua B, 456, São Paulo/SP."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Obrigações das Partes *
                </label>
                <textarea
                  name="partiesObligations"
                  value={formData.partiesObligations || ''}
                  onChange={handleInputChange}
                  rows={6}
                  className="input-primary"
                  placeholder="Descrição detalhada do que cada parte deverá cumprir..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Prazo para Cumprimento
                </label>
                <input
                  type="text"
                  name="fulfillmentDeadline"
                  value={formData.fulfillmentDeadline || ''}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="Ex: 30 dias, 6 meses, até 31/12/2024..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Forma de Pagamento
                </label>
                <input
                  type="text"
                  name="paymentMethod"
                  value={formData.paymentMethod || ''}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="Ex: À vista, parcelado, PIX, transferência..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Penalidades pelo Descumprimento
                </label>
                <textarea
                  name="penalties"
                  value={formData.penalties || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-primary"
                  placeholder="Consequências em caso de não cumprimento das obrigações..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Efeito do Acordo
                </label>
                <textarea
                  name="agreementEffect"
                  value={formData.agreementEffect || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-primary"
                  placeholder="Se o contrato tem a finalidade de resolver questão judicial e ser homologado..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Homologação Judicial
                </label>
                <select
                  name="judicialHomologation"
                  value={formData.judicialHomologation || ''}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim, será homologado pelo juiz</option>
                  <option value="nao">Não se aplica</option>
                  <option value="pendente">A definir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Assinaturas das Partes e Testemunhas
                </label>
                <select
                  name="signatures"
                  value={formData.signatures || ''}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="">Selecione</option>
                  <option value="partes">Apenas as partes</option>
                  <option value="partes-testemunhas">Partes e testemunhas</option>
                  <option value="partes-testemunhas-advogados">Partes, testemunhas e advogados</option>
                </select>
              </div>
            </>
          )}

          {documentType === 'procuracao' && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Nome do Advogado
                </label>
                <input
                  type="text"
                  name="lawyerName"
                  value={formData.lawyerName}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="Nome completo do advogado"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
                  OAB
                </label>
                <input
                  type="text"
                  name="lawyerOab"
                  value={formData.lawyerOab}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="SP 123456"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
            {documentType === 'contrato' ? 'Objeto do Contrato' : 
             documentType === 'procuracao' ? 'Endereço do Cliente' : 'Descrição dos Fatos'} *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className="input-primary"
            placeholder={documentType === 'contrato' ? 'Descreva o objeto do contrato...' : 
                        documentType === 'procuracao' ? 'Endereço completo do cliente...' : 'Descreva os fatos relevantes...'}
          />
        </div>

        {documentType === 'recurso' && (
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
              Decisão Impugnada *
            </label>
            <textarea
              name="decisaoImpugnada"
              value={formData.decisaoImpugnada || ''}
              onChange={handleInputChange}
              rows={6}
              className="input-primary"
              placeholder="Descreva a decisão que está sendo impugnada..."
              required
            />
          </div>
        )}

        {documentType !== 'procuracao' && (
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-2">
              {documentType === 'contrato' ? 'Cláusulas Adicionais' : 'Argumentos Jurídicos'}
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={6}
              className="input-primary"
              placeholder={documentType === 'contrato' ? 'Cláusulas específicas...' : 'Fundamentos jurídicos...'}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow">
      {(() => {
        const hasContent = (
          (documentType === 'contestacao' && contestacaoData) ||
          (documentType === 'recurso' && recursoData) ||
          (documentType === 'procuracao' && procuracaoData) ||
          (documentType !== 'contestacao' && documentType !== 'recurso' && documentType !== 'procuracao' && generatedDoc)
        );
        return (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Revisão de Documentos</h2>
            {hasContent && (
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
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
        );
      })()}
      
      {isGenerating ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Gerando documento com IA...</p>
          </div>
        </div>
      ) : (documentType === 'contestacao' && contestacaoData) || 
           (documentType === 'recurso' && recursoData) || 
           (documentType === 'procuracao' && procuracaoData) ||
           (documentType !== 'contestacao' && documentType !== 'recurso' && documentType !== 'procuracao' && generatedDoc) ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-80 p-4 text-base text-slate-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Edite o conteúdo do documento aqui..."
            />
          ) : (
            <div className="whitespace-pre-wrap text-base text-slate-900 dark:text-white leading-relaxed">
              {/* Para contestação, recurso e procuração, mostrar conteúdo editado ou dados do Supabase */}
              {documentType === 'contestacao' ? (
                editedContent || contestacaoData?.documento_gerado || 'Aguardando dados do Supabase...'
              ) : documentType === 'recurso' ? (
                editedContent || recursoData?.documento_gerado || 'Aguardando dados do Supabase...'
              ) : documentType === 'procuracao' ? (
                editedContent || procuracaoData?.documento_gerado || 'Aguardando dados do Supabase...'
              ) : (
                editedContent || generatedDoc?.content
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Documento será gerado automaticamente</p>
        </div>
      )}

      {/* Ações dentro da card, seguindo o design de “Pedidos” */}
      {(() => {
        const hasContent = (
          (documentType === 'contestacao' && contestacaoData) ||
          (documentType === 'recurso' && recursoData) ||
          (documentType === 'procuracao' && procuracaoData) ||
          (documentType !== 'contestacao' && documentType !== 'recurso' && documentType !== 'procuracao' && generatedDoc)
        );
        return (
          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="btn-secondary px-6 py-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </button>
            <button
              onClick={downloadDocx}
              disabled={!hasContent}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📄 Gerar Documento
            </button>
          </div>
        );
      })()}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {documentType === 'contestacao' ? 'Contestação' : 
           documentType === 'recurso' ? 'Recurso' : 
           documentType === 'contrato' ? 'Contrato' : 'Procuração'}
        </h1>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {currentStep === 0 && renderStep1()}
      {currentStep === 1 && renderStep2()}

      {currentStep === 0 && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </button>

          <button
            onClick={nextStep}
            disabled={!formData.title || !formData.clientName || !formData.description || isLoadingNextStep}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingNextStep ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              'Avançar →'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentWizard;