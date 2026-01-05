import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ArrowLeft, ArrowRight, Download, Eye, FileText, X, Pencil, Upload, Wand2 } from 'lucide-react';
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
    resumoDefesa: '',
    pontosRefutacao: '',
    preliminaresProcessuais: '',
    replicaAttachments: [],
    contestacaoAttachments: [],
    recursoAttachments: [],
    contratoAttachments: [],
    procuracaoAttachments: [],
    recursoInssAttachments: [],
    // Campos específicos do contrato
    partiesIdentification: '',
    partiesObligations: '',
    fulfillmentDeadline: '',
    paymentMethod: '',
    penalties: '',
    agreementEffect: '',
    judicialHomologation: '',
    signatures: '',
    beneficioPleiteado: '',
    situacaoBeneficio: '',
    autorNacionalidade: '',
    autorEstadoCivil: '',
    autorNascimento: '',
    autorIdade: '',
    autorProfissao: '',
    autorOcupacao: '',
    autorRg: '',
    autorNitPis: '',
    autorEndereco: '',
    autorEmail: '',
    autorTelefone: '',
    fezRequerimentoAdm: '',
    dataDER: '',
    nbNumero: '',
    especie: '',
    resultadoRequerimento: '',
    dataDecisaoCessacao: '',
    motivoNegativa: '',
    possuiProcessoAdministrativo: '',
    cid10Diagnostico: '',
    doencaDescricao: '',
    dataInicioIncapacidade: '',
    tipoIncapacidade: '',
    doencaOcupacional: '',
    ultimaAtividade: '',
    estaEmTratamento: '',
    qualTratamento: '',
    medicoNome: '',
    medicoCRM: '',
    medicoEspecialidade: '',
    peritoEspecialidadeDesejada: '',
    falecidoNome: '',
    falecidoDataObito: '',
    falecidoCpf: '',
    falecidoNit: '',
    falecidoEraSegurado: '',
    vinculoFalecido: '',
    duracaoUniao: '',
    numeroDependentes: '',
    bpcIdade: '',
    bpcPcD: '',
    bpcTipoDeficiencia: '',
    bpcDescricaoDeficiencia: '',
    bpcRendaFamiliarMensal: '',
    bpcComposicaoFamiliar: '',
    bpcNumeroMembros: '',
    bpcRendaPerCapita: '',
    categoriaSegurado: '',
    tempoTotalContribuicao: '',
    periodosContribuicao: '',
    periodosNaoRegistradosCnis: '',
    periodosNaoRegistradosDetalhes: '',
    dataUltimaContribuicao: '',
    tutelaUrgencia: '',
    motivoUrgencia: '',
    justicaGratuita: '',
    lawyerEndereco: '',
    lawyerEmail: '',
    lawyerTelefone: '',
    tipoPeticao: '',
    recBeneficio: '',
    recDataDecisao: '',
    recAgenciaInss: '',
    recNumeroProcessoAdm: '',
    recMotivoNegativa: '',
    recFundamentacaoInss: '',
    recDataCienciaDecisao: '',
    recPrazo30Dias: '',
    recRazoesRecurso: '',
    recFatosIgnorados: '',
    recDocsNaoAnalisados: '',
    recErrosAnalise: '',
    recMotivoNegativaPericia: '',
    recPossuiLaudosParticulares: '',
    recEspecialidadeLaudos: '',
    recMotivoNegativaPensao: '',
    recMotivoNegativaBpc: '',
    recDocumentosDisponiveis: '',
    parte1TipoPessoa: '',
    parte1NomeRazao: '',
    parte1Nacionalidade: '',
    parte1EstadoCivil: '',
    parte1Profissao: '',
    parte1RG: '',
    parte1CPF: '',
    parte1CNPJ: '',
    parte1Endereco: '',
    parte1Cidade: '',
    parte1Estado: '',
    parte1Email: '',
    parte1Telefone: '',
    parte1RepresentanteNome: '',
    parte1RepresentanteCargo: '',
    parte1RepresentanteRG: '',
    parte1RepresentanteCPF: '',
    parte2TipoPessoa: '',
    parte2NomeRazao: '',
    parte2Nacionalidade: '',
    parte2EstadoCivil: '',
    parte2Profissao: '',
    parte2RG: '',
    parte2CPF: '',
    parte2CNPJ: '',
    parte2Endereco: '',
    parte2Cidade: '',
    parte2Estado: '',
    parte2Email: '',
    parte2Telefone: '',
    parte2RepresentanteNome: '',
    parte2RepresentanteCargo: '',
    parte2RepresentanteRG: '',
    parte2RepresentanteCPF: '',
    valorContrato: '',
    formaPagamento: '',
    numeroParcelas: '',
    valorParcelas: '',
    diaVencimento: '',
    dadosBancarios: '',
    objetoContrato: '',
    obrigacoesPartes: '',
    prazoCumprimento: '',
    dataInicio: '',
    dataTermino: '',
    prorrogacaoPossivel: '',
    condicoesProrrogacao: '',
    penalidadesDescumprimento: '',
    multaAtraso: '',
    jurosMora: '',
    multaRescisoria: '',
    efeitoAcordo: '',
    foroCompetente: '',
    mediacaoArbitragem: '',
    numeroTestemunhas: '',
    tipoProcuracao: '',
    finalidadeProcuracao: '',
    outorgante1TipoPessoa: '',
    outorgante1NomeRazao: '',
    outorgante1Nacionalidade: '',
    outorgante1EstadoCivil: '',
    outorgante1Profissao: '',
    outorgante1RG: '',
    outorgante1CPF: '',
    outorgante1CNPJ: '',
    outorgante1Endereco: '',
    outorgante1Cidade: '',
    outorgante1Estado: '',
    outorgante1Email: '',
    outorgante1Telefone: '',
    outorgante1RepresentanteNome: '',
    outorgante1RepresentanteCargo: '',
    outorgante1RepresentanteRG: '',
    outorgante1RepresentanteCPF: '',
    hasOutorgante2: false,
    outorgante2TipoPessoa: '',
    outorgante2NomeRazao: '',
    outorgante2Nacionalidade: '',
    outorgante2EstadoCivil: '',
    outorgante2Profissao: '',
    outorgante2RG: '',
    outorgante2CPF: '',
    outorgante2CNPJ: '',
    outorgante2Endereco: '',
    outorgante2Cidade: '',
    outorgante2Estado: '',
    outorgante2Email: '',
    outorgante2Telefone: '',
    outorgante2RepresentanteNome: '',
    outorgante2RepresentanteCargo: '',
    outorgante2RepresentanteRG: '',
    outorgante2RepresentanteCPF: '',
    hasOutorgado2: false,
    lawyer2Name: '',
    lawyer2Oab: '',
    lawyer2Endereco: '',
    lawyer2Email: '',
    lawyer2Telefone: '',
    procuracaoPoderes: [],
    procuracaoPoderesOutros: '',
    procuracaoPoderesTexto: '',
    procuracaoProcessoNumero: '',
    clausulasAdicionais: '',
    // Réplica - novos campos
    comarca: '',
    estadoUF: '',
    tipoAcao: '',
    reuCpfCnpj: '',
    preliminaresArguidasTexto: '',
    preliminaresDescricao: '',
    preliminaresArgumentos: '',
    alegacao1: '',
    refutacao1: '',
    fundamento1: '',
    alegacao2: '',
    refutacao2: '',
    fundamento2: '',
    alegacao3: '',
    refutacao3: '',
    fundamento3: '',
    alegacao4: '',
    refutacao4: '',
    fundamento4: '',
    alegacao5: '',
    refutacao5: '',
    fundamento5: '',
    haDocumentosNovos: '',
    descricaoDocumentosNovos: '',
    requerProducaoProvas: '',
    quaisProvas: [],
    especificacaoProvas: '',
    audienciaConciliacao: '',
    resumoInicial: '',
    resumoContestacao: '',
    principalControversia: '',
    pedidosInicial: '',
    reiteraIntegralmente: '',
    modificacaoPedidos: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);
  const [contestacaoData, setContestacaoData] = useState(null);
  const [recursoData, setRecursoData] = useState(null);
  const [contratoData, setContratoData] = useState(null);
  const [procuracaoData, setProcuracaoData] = useState(null);
  const [replicaData, setReplicaData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const autorIdadeCalculada = (() => {
    const d = (formData.autorNascimento || '').trim();
    if (!d) return '';
    const parts = d.split('/');
    if (parts.length !== 3) return '';
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (!year || !month || !day) return '';
    const birth = new Date(year, month - 1, day);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    if (age < 0 || isNaN(age)) return '';
    return String(age);
  })();

  const bpcRendaPerCapitaCalculada = (() => {
    const renda = parseFloat(String(formData.bpcRendaFamiliarMensal || '').replace(/[^0-9,\.]/g, '').replace('.', '').replace(',', '.'));
    const membros = parseInt(formData.bpcNumeroMembros || '0', 10);
    if (!renda || !membros || membros <= 0) return '';
    const valor = renda / membros;
    return `R$ ${valor.toFixed(2)}`;
  })();

  const isConcessaoBeneficioValid = () => {
    if (!formData.title || !formData.clientName) return false;
    if (!formData.beneficioPleiteado || !formData.situacaoBeneficio) return false;
    return true;
  };

  const [errors, setErrors] = useState({});

  const getMissingRequiredFields = () => {
    const missing = [];
    if (!formData.title) missing.push('Título do Documento');
    if (!formData.clientName) missing.push('Nome do Cliente');
    if (documentType === 'replica') {
      if (!formData.resumoDefesa) missing.push('Argumentos da defesa (resumo)');
      if (!formData.pontosRefutacao) missing.push('Pontos de refutação');
    } else {
      if (documentType !== 'procuracao' && !formData.description) {
        const descLabel = documentType === 'contrato' ? 'Objeto do Contrato' : 'Descrição dos Fatos';
        missing.push(descLabel);
      }
    }
    if (documentType === 'recurso' && !formData.decisaoImpugnada) missing.push('Decisão impugnada');
    if (documentType === 'procuracao') {
      if (!formData.tipoProcuracao) missing.push('Tipo de Procuração');
      if (!formData.outorgante1NomeRazao) missing.push('Nome do Outorgante');
      if (!formData.outorgante1Endereco) missing.push('Endereço do Outorgante');
      if (formData.outorgante1TipoPessoa === 'Pessoa Física') {
        if (!formData.outorgante1CPF) missing.push('CPF do Outorgante');
        if (!formData.outorgante1RG) missing.push('RG do Outorgante');
      } else if (formData.outorgante1TipoPessoa === 'Pessoa Jurídica') {
        if (!formData.outorgante1CNPJ) missing.push('CNPJ do Outorgante');
      }
      if (!formData.lawyerName) missing.push('Nome do Advogado');
      if (!formData.lawyerOab) missing.push('OAB');
    }
    return missing;
  };

  const validateConcessaoBeneficioForm = () => {
    const fieldErrors = {};
    if (!formData.title) missing.push('Título do Documento');
    if (!formData.clientName) missing.push('Nome Completo');
    if (!formData.beneficioPleiteado) missing.push('Benefício Pleiteado');
    if (!formData.situacaoBeneficio) missing.push('Situação');
    if (!formData.autorNacionalidade) missing.push('Nacionalidade');
    if (!formData.autorEstadoCivil) missing.push('Estado Civil');
    if (!formData.autorNascimento) missing.push('Data de Nascimento');
    if (!formData.autorProfissao) missing.push('Profissão');
    if (!formData.autorOcupacao) missing.push('Ocupação');
    if (!formData.autorRg) missing.push('RG');
    if (!formData.clientCpf) missing.push('CPF');
    if (!formData.autorNitPis) missing.push('NIT/PIS');
    if (!formData.autorEndereco) missing.push('Endereço');
    if (!formData.autorEmail) missing.push('E-mail');
    if (!formData.autorTelefone) missing.push('Telefone');
    if (!formData.fezRequerimentoAdm) missing.push('Fez requerimento administrativo');
    if (formData.fezRequerimentoAdm === 'sim') {
      if (!formData.dataDER) missing.push('Data do Requerimento (DER)');
      if (!formData.nbNumero) missing.push('Número do Benefício (NB)');
      if (!formData.especie) missing.push('Espécie');
      if (!formData.resultadoRequerimento) missing.push('Resultado do Requerimento');
      if (formData.resultadoRequerimento === 'cessado' || formData.resultadoRequerimento === 'valor_incorreto') {
        if (!formData.dataDecisaoCessacao) missing.push('Data da decisão/cessação');
      }
      if (formData.resultadoRequerimento === 'indeferido') {
        if (!formData.motivoNegativa) missing.push('Motivo da negativa');
      }
    }
    if (formData.beneficioPleiteado === 'auxilio_doenca' || formData.beneficioPleiteado === 'aposentadoria_invalidez') {
      if (!formData.cid10Diagnostico) missing.push('Diagnóstico/CID-10');
      if (!formData.doencaDescricao) missing.push('Descrição da doença');
      if (!formData.dataInicioIncapacidade) missing.push('Data início incapacidade');
      if (!formData.tipoIncapacidade) missing.push('Tipo de incapacidade');
    }
    if (formData.beneficioPleiteado === 'pensao_morte') {
      if (!formData.falecidoNome) missing.push('Nome do falecido');
      if (!formData.falecidoDataObito) missing.push('Data do óbito');
      if (!formData.falecidoCpf) missing.push('CPF do falecido');
      if (!formData.vinculoFalecido) missing.push('Vínculo com o falecido');
    }
    if (formData.beneficioPleiteado === 'bpc_loas') {
      if (!formData.bpcRendaFamiliarMensal) missing.push('Renda familiar mensal');
      if (!formData.bpcComposicaoFamiliar) missing.push('Composição familiar');
      if (!formData.bpcNumeroMembros) missing.push('Número de membros');
      if (!bpcRendaPerCapitaCalculada) missing.push('Renda per capita');
    }
    if (!formData.categoriaSegurado) fieldErrors.categoriaSegurado = 'Campo obrigatório';
    if (!formData.tempoTotalContribuicao) fieldErrors.tempoTotalContribuicao = 'Campo obrigatório';
    if (formData.periodosNaoRegistradosCnis === 'sim' && !formData.periodosNaoRegistradosDetalhes) {
      fieldErrors.periodosNaoRegistradosDetalhes = 'Campo obrigatório';
    }
    if (!formData.tutelaUrgencia) fieldErrors.tutelaUrgencia = 'Campo obrigatório';
    if (formData.tutelaUrgencia === 'sim' && !formData.motivoUrgencia) {
      fieldErrors.motivoUrgencia = 'Campo obrigatório';
    }
    if (!formData.justicaGratuita) fieldErrors.justicaGratuita = 'Campo obrigatório';
    if (!formData.lawyerName) fieldErrors.lawyerName = 'Campo obrigatório';
    if (!formData.lawyerOab) fieldErrors.lawyerOab = 'Campo obrigatório';
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const validateRecursoInssForm = () => {
    const fieldErrors = {};
    if (!formData.title) fieldErrors.title = 'Campo obrigatório';
    if (!formData.tipoPeticao) fieldErrors.tipoPeticao = 'Campo obrigatório';
    if (!formData.recBeneficio) fieldErrors.recBeneficio = 'Campo obrigatório';
    if (!formData.clientName) fieldErrors.clientName = 'Campo obrigatório';
    if (!formData.autorNacionalidade) fieldErrors.autorNacionalidade = 'Campo obrigatório';
    if (!formData.autorEstadoCivil) fieldErrors.autorEstadoCivil = 'Campo obrigatório';
    if (!formData.autorNascimento) fieldErrors.autorNascimento = 'Campo obrigatório';
    if (!formData.autorProfissao) fieldErrors.autorProfissao = 'Campo obrigatório';
    if (!formData.autorOcupacao) fieldErrors.autorOcupacao = 'Campo obrigatório';
    if (!formData.autorRg) fieldErrors.autorRg = 'Campo obrigatório';
    if (!formData.clientCpf) fieldErrors.clientCpf = 'Campo obrigatório';
    if (!formData.autorNitPis) fieldErrors.autorNitPis = 'Campo obrigatório';
    if (!formData.autorEndereco) fieldErrors.autorEndereco = 'Campo obrigatório';
    if (!formData.autorEmail) fieldErrors.autorEmail = 'Campo obrigatório';
    if (!formData.autorTelefone) fieldErrors.autorTelefone = 'Campo obrigatório';
    if (!formData.dataDER) fieldErrors.dataDER = 'Campo obrigatório';
    const isRecurso = formData.tipoPeticao === 'recurso_junta' || formData.tipoPeticao === 'recurso_camara';
    if (isRecurso) {
      if (!formData.recDataDecisao) fieldErrors.recDataDecisao = 'Campo obrigatório';
      if (!formData.recMotivoNegativa) fieldErrors.recMotivoNegativa = 'Campo obrigatório';
      if (!formData.recDataCienciaDecisao) fieldErrors.recDataCienciaDecisao = 'Campo obrigatório';
      if (!formData.recPrazo30Dias) fieldErrors.recPrazo30Dias = 'Campo obrigatório';
      if (!formData.recRazoesRecurso) fieldErrors.recRazoesRecurso = 'Campo obrigatório';
    }
    if (!(String(formData.recDocumentosDisponiveis || '').trim())) {
      fieldErrors.recDocumentosDisponiveis = 'Campo obrigatório';
    }
    if (!formData.lawyerName) fieldErrors.lawyerName = 'Campo obrigatório';
    if (!formData.lawyerOab) fieldErrors.lawyerOab = 'Campo obrigatório';
    if (!formData.lawyerEndereco) fieldErrors.lawyerEndereco = 'Campo obrigatório';
    if (!formData.lawyerEmail) fieldErrors.lawyerEmail = 'Campo obrigatório';
    if (!formData.lawyerTelefone) fieldErrors.lawyerTelefone = 'Campo obrigatório';
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  // Limpar campos quando o tipo de documento muda
  useEffect(() => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setGeneratedDoc(null);
    setContestacaoData(null);
    setRecursoData(null);
    setContratoData(null);
    setProcuracaoData(null);
    setReplicaData(null);
    setIsEditing(false);
    setEditedContent('');
  }, [documentType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleCheckboxArray = (field, value) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[field]) ? prev[field] : [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [field]: next };
    });
  };

  const toggleBooleanField = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getRequiredFieldsForStep1 = () => {
    const fields = ['title', 'clientName'];
    if (documentType === 'replica') {
      fields.push(
        'processNumber',
        'courtName',
        'comarca',
        'estadoUF',
        'tipoAcao',
        'opposingParty',
        'alegacao1',
        'refutacao1',
        'resumoInicial',
        'resumoContestacao',
        'principalControversia',
        'lawyerName',
        'lawyerOab'
      );
    } else if (documentType !== 'contrato' && documentType !== 'procuracao') {
      fields.push('description');
    }
    if (documentType === 'recurso') fields.push('decisaoImpugnada');
    if (documentType === 'procuracao') {
      fields.push('tipoProcuracao', 'outorgante1TipoPessoa', 'outorgante1NomeRazao', 'outorgante1Endereco', 'lawyerName', 'lawyerOab', 'procuracaoPoderesTexto', 'description');
      if (formData.outorgante1TipoPessoa === 'Pessoa Física') {
        fields.push('outorgante1CPF', 'outorgante1RG');
      } else if (formData.outorgante1TipoPessoa === 'Pessoa Jurídica') {
        fields.push('outorgante1CNPJ');
      }
    }
    if (documentType === 'contrato') {
      fields.push(
        'contractType',
        'parte1NomeRazao',
        'parte2NomeRazao',
        'valorContrato',
        'formaPagamento',
        'objetoContrato',
        'obrigacoesPartes',
        'prazoCumprimento',
        'efeitoAcordo',
        'foroCompetente'
      );
    }
    return fields;
  };

  const handleGenerateWithIAClick = async () => {
    if (isLoadingNextStep) return;
    const required = getRequiredFieldsForStep1();
    const missing = required.filter((k) => !String(formData[k] || '').trim());
    if (missing.length) {
      const fieldErrors = {};
      missing.forEach((k) => { fieldErrors[k] = 'Campo obrigatório'; });
      setErrors(fieldErrors);
      const first = missing[0];
      const el = typeof document !== 'undefined' ? document.querySelector(`[name="${first}"]`) : null;
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }
    nextStep();
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

  // Função para buscar dados da tabela replica_ia
  const fetchReplicaData = async () => {
    try {
      console.log('🔍 Iniciando busca na tabela replica_ia...');
      const { data, error } = await supabase
        .from('replica_ia')
        .select('*')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .order('id', { ascending: false })
        .limit(1);

      console.log('📊 Resposta do Supabase replica_ia:', { data, error });

      if (error) {
        console.error('❌ Erro ao buscar dados da replica_ia:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ Nenhum dado encontrado na tabela replica_ia');
        return null;
      }

      console.log('✅ Dados da réplica encontrados:', data[0]);
      console.log('📄 Conteúdo do documento_gerado:', data[0].documento_gerado ? 'Documento presente' : 'Documento vazio');
      return data[0];
    } catch (error) {
      console.error('💥 Erro ao conectar com Supabase para réplica:', error);
      return null;
    }
  };

  const getReplicaBaselineId = async () => {
    try {
      const { data, error } = await supabase
        .from('replica_ia')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      if (error) {
        console.error('❌ Erro ao obter baseline de réplica:', error);
        return 0;
      }
      return data?.[0]?.id || 0;
    } catch (err) {
      console.error('💥 Falha ao obter baseline de réplica:', err);
      return 0;
    }
  };

  const fetchReplicaLatestAfterId = async (afterId = 0) => {
    try {
      const { data, error } = await supabase
        .from('replica_ia')
        .select('id, documento_gerado')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .gt('id', afterId)
        .order('id', { ascending: false })
        .limit(1);
      if (error) {
        console.error('❌ Erro ao buscar réplica após baseline:', error);
        return null;
      }
      if (!data || data.length === 0) return null;
      return data[0];
    } catch (err) {
      console.error('💥 Falha na consulta de réplica após baseline:', err);
      return null;
    }
  };

  const pollReplicaLatestDocument = async (baselineId, windowMs = 60000, intervalMs = 3000) => {
    const end = Date.now() + windowMs;
    let latest = await fetchReplicaLatestAfterId(baselineId);
    while (!latest && Date.now() < end) {
      await new Promise((r) => setTimeout(r, intervalMs));
      latest = await fetchReplicaLatestAfterId(baselineId);
    }
    return latest;
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

  const fetchRecursoInssData = async () => {
    try {
      const { data, error } = await supabase
        .from('recurso_administrativo_inss_ia')
        .select('*')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .order('id', { ascending: false })
        .limit(1);
      if (error) {
        return null;
      }
      if (!data || data.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const { data: retryData, error: retryError } = await supabase
          .from('recurso_administrativo_inss_ia')
          .select('*')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        if (retryError) {
          return null;
        }
        if (!retryData || retryData.length === 0) {
          return null;
        }
        return retryData[0];
      }
      return data[0];
    } catch (error) {
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

  const getContratoBaselineId = async () => {
    try {
      const { data, error } = await supabase
        .from('contrato_ia')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      if (error) {
        console.error('❌ Erro ao obter baseline de contrato:', error);
        return 0;
      }
      return data?.[0]?.id || 0;
    } catch (err) {
      console.error('💥 Falha ao obter baseline de contrato:', err);
      return 0;
    }
  };

  const fetchContratoLatestAfterId = async (afterId = 0) => {
    try {
      const { data, error } = await supabase
        .from('contrato_ia')
        .select('id, documento_gerado')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .gt('id', afterId)
        .order('id', { ascending: false })
        .limit(1);
      if (error) {
        console.error('❌ Erro ao buscar contrato após baseline:', error);
        return null;
      }
      if (!data || data.length === 0) return null;
      return data[0];
    } catch (err) {
      console.error('💥 Falha na consulta de contrato após baseline:', err);
      return null;
    }
  };

  const pollContratoLatestDocument = async (baselineId, windowMs = 60000, intervalMs = 3000) => {
    const end = Date.now() + windowMs;
    let latest = await fetchContratoLatestAfterId(baselineId);
    while (!latest && Date.now() < end) {
      await new Promise((r) => setTimeout(r, intervalMs));
      latest = await fetchContratoLatestAfterId(baselineId);
    }
    return latest;
  };

  const sendToWebhook = async (data, webhookType = 'contestacao') => {
    try {
      const webhookUrls = {
        'contestacao': 'https://n8n-n8n.04qisd.easypanel.host/webhook/contestacao-judicial',
        'recurso': 'https://n8n-n8n.04qisd.easypanel.host/webhook/recurso-judicial',
        'contrato': 'https://n8n-n8n.04qisd.easypanel.host/webhook/contrato-judicial',
        'replica': 'https://n8n-n8n.04qisd.easypanel.host/webhook/replica-judicial',
        'procuracao': 'https://n8n-n8n.04qisd.easypanel.host/webhook/procuracao-judicial',
        'recurso_inss': 'https://n8n-n8n.04qisd.easypanel.host/webhook/recurso-administrativo-inss'
      };
      
      let webhookUrl = webhookUrls[webhookType] || webhookUrls['contestacao'];
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (webhookType === 'recurso' && isLocalhost) {
        webhookUrl = '/api/recurso';
      }
      
      let response;
      try {
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } catch (err) {
        // Fallback para enviar direto ao endpoint de produção, evitando travar o fluxo local
        if (webhookType === 'recurso') {
          await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/recurso-judicial', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
          });
          return { success: true };
        }
        throw err;
      }

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

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      if (documentType === 'concessao_beneficio' && currentStep === 0) {
        const ok = validateConcessaoBeneficioForm();
        if (!ok) {
          return;
        }
      }
      if (documentType === 'recurso_inss' && currentStep === 0) {
        const ok = validateRecursoInssForm();
        if (!ok) {
          return;
        }
        setIsLoadingNextStep(true);
        try {
          const attachmentsPayload = await Promise.all((formData.recursoInssAttachments || []).map(async (f) => {
            const base64 = await fileToBase64(f).catch(() => null);
            return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
          }));
          const recursoInssPayload = {
            tipo: 'recurso_inss',
            etapa: 'dados_iniciais',
            timestamp: new Date().toISOString(),
            dados: { ...formData },
            uploadedFiles: attachmentsPayload
          };
          await sendToWebhook(recursoInssPayload, 'recurso_inss');
          await new Promise(resolve => setTimeout(resolve, 60000));
          setCurrentStep(currentStep + 1);
          await generateDocument();
        } catch (error) {
          setIsLoadingNextStep(false);
          return;
        }
        setIsLoadingNextStep(false);
        return;
      }
      // Se for contrato e estiver no primeiro step, enviar dados para o webhook
      if (documentType === 'contrato' && currentStep === 0) {
        setIsLoadingNextStep(true);
        
        try {
      const attachmentsPayload = await Promise.all((formData.contratoAttachments || []).map(async (f) => {
        const base64 = await fileToBase64(f).catch(() => null);
        return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
      }));
      const contratoPayload = {
        tipo: 'contrato',
        etapa: 'dados_iniciais',
        timestamp: new Date().toISOString(),
        dados: {
          identificacao: {
            tituloDocumento: formData.title || '',
            nomeCliente: formData.clientName || '',
            tipoContrato: formData.contractType || ''
          },
          primeiraParte: {
            tipoPessoa: formData.parte1TipoPessoa || '',
            nomeRazao: formData.parte1NomeRazao || '',
            nacionalidade: formData.parte1Nacionalidade || '',
            estadoCivil: formData.parte1EstadoCivil || '',
            profissao: formData.parte1Profissao || '',
            rg: formData.parte1RG || '',
            cpf: formData.parte1CPF || '',
            cnpj: formData.parte1CNPJ || '',
            endereco: formData.parte1Endereco || '',
            cidade: formData.parte1Cidade || '',
            estado: formData.parte1Estado || '',
            email: formData.parte1Email || '',
            telefone: formData.parte1Telefone || '',
            representante: {
              nome: formData.parte1RepresentanteNome || '',
              cargo: formData.parte1RepresentanteCargo || '',
              rg: formData.parte1RepresentanteRG || '',
              cpf: formData.parte1RepresentanteCPF || ''
            }
          },
          segundaParte: {
            tipoPessoa: formData.parte2TipoPessoa || '',
            nomeRazao: formData.parte2NomeRazao || '',
            nacionalidade: formData.parte2Nacionalidade || '',
            estadoCivil: formData.parte2EstadoCivil || '',
            profissao: formData.parte2Profissao || '',
            rg: formData.parte2RG || '',
            cpf: formData.parte2CPF || '',
            cnpj: formData.parte2CNPJ || '',
            endereco: formData.parte2Endereco || '',
            cidade: formData.parte2Cidade || '',
            estado: formData.parte2Estado || '',
            email: formData.parte2Email || '',
            telefone: formData.parte2Telefone || '',
            representante: {
              nome: formData.parte2RepresentanteNome || '',
              cargo: formData.parte2RepresentanteCargo || '',
              rg: formData.parte2RepresentanteRG || '',
              cpf: formData.parte2RepresentanteCPF || ''
            }
          },
          dadosFinanceiros: {
            valorContrato: formData.valorContrato || '',
            formaPagamento: formData.formaPagamento || '',
            numeroParcelas: formData.numeroParcelas || '',
            valorParcelas: formData.valorParcelas || '',
            diaVencimento: formData.diaVencimento || '',
            dadosBancarios: formData.dadosBancarios || ''
          },
          objetoObrigacoes: {
            objetoContrato: formData.objetoContrato || '',
            obrigacoesPartes: formData.obrigacoesPartes || ''
          },
          prazo: {
            prazoCumprimento: formData.prazoCumprimento || '',
            dataInicio: formData.dataInicio || '',
            dataTermino: formData.dataTermino || '',
            prorrogacaoPossivel: formData.prorrogacaoPossivel || '',
            condicoesProrrogacao: formData.condicoesProrrogacao || ''
          },
          penalidades: {
            penalidadesDescumprimento: formData.penalidadesDescumprimento || '',
            multaAtraso: formData.multaAtraso || '',
            jurosMora: formData.jurosMora || '',
            multaRescisoria: formData.multaRescisoria || ''
          },
          resolucaoConflitos: {
            efeitoAcordo: formData.efeitoAcordo || '',
            foroCompetente: formData.foroCompetente || '',
            mediacaoArbitragem: formData.mediacaoArbitragem || '',
            numeroTestemunhas: formData.numeroTestemunhas || ''
          },
          clausulasAdicionais: formData.clausulasAdicionais || ''
        },
        uploadedFiles: attachmentsPayload
      };
      const baselineId = await getContratoBaselineId();
      await sendToWebhook(contratoPayload, 'contrato');
      console.log('Dados do contrato enviados:', contratoPayload);

          // Aguardar 60 segundos (tempo de processamento)
          console.log('⏳ Aguardando 60 segundos para buscar dados do contrato...');
          await new Promise(resolve => setTimeout(resolve, 60000));

          // Polling por nova linha após baseline
          const latestContrato = await pollContratoLatestDocument(baselineId, 40000, 3000);
          if (latestContrato && latestContrato.documento_gerado) {
            setContratoData(latestContrato);
            console.log('✅ Último contrato carregado com sucesso (após baseline):', latestContrato);
          } else {
            // Fallback para busca padrão
            const data = await fetchContratoData();
            if (data) {
              setContratoData(data);
              console.log('✅ Dados do contrato carregados via fallback:', data);
            } else {
              console.log('⚠️ Nenhum dado encontrado na tabela contrato_ia');
            }
          }
          
        } catch (error) {
          console.error('Erro ao enviar dados do contrato:', error);
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
          const attachmentsPayload = await Promise.all((formData.contestacaoAttachments || []).map(async (f) => {
            const base64 = await fileToBase64(f).catch(() => null);
            return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
          }));

          const contestacaoDataToSend = {
            ...formData,
            documentType: 'contestacao',
            uploadedFiles: attachmentsPayload
          };

          await sendToWebhook(contestacaoDataToSend, 'contestacao');
          
          await new Promise(resolve => setTimeout(resolve, 30000));
          
          const data = await fetchContestacaoData();
          if (data) {
            setContestacaoData(data);
          }
          
        } catch (error) {
          console.error('Erro ao processar dados de contestação:', error);
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
      const attachmentsPayload = await Promise.all((formData.recursoAttachments || []).map(async (f) => {
        const base64 = await fileToBase64(f).catch(() => null);
        return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
      }));
      const recursoPayload = {
        tipo: 'recurso',
        etapa: 'dados_iniciais',
        timestamp: new Date().toISOString(),
        dados: {
          title: formData.title || '',
          clientName: formData.clientName || '',
          clientCpf: formData.clientCpf || '',
          opposingParty: formData.opposingParty || '',
          caseValue: formData.caseValue || '',
          description: formData.description || '',
          courtName: formData.courtName || '',
          processNumber: formData.processNumber || '',
          decisaoImpugnada: formData.decisaoImpugnada || ''
        },
        uploadedFiles: attachmentsPayload
      };
      await sendToWebhook(recursoPayload, 'recurso');
      console.log('Dados do recurso enviados:', recursoPayload);
          
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
          console.error('Erro ao processar dados do recurso:', error);
          setIsLoadingNextStep(false);
          return;
        } finally {
          setIsLoadingNextStep(false);
        }
      }

      // Se for réplica e estiver no primeiro step, enviar dados para o webhook
      if (documentType === 'replica' && currentStep === 0) {
        setIsLoadingNextStep(true);
        try {
          const attachmentsPayload = await Promise.all((formData.replicaAttachments || []).map(async (f) => {
            const base64 = await fileToBase64(f).catch(() => null);
            return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
          }));
          const merito = [1,2,3,4,5].map(i => ({
            alegacao: formData[`alegacao${i}`] || '',
            refutacao: formData[`refutacao${i}`] || '',
            fundamentoProva: formData[`fundamento${i}`] || ''
          }));

          const preliminaresArguidasLista = String(formData.preliminaresArguidasTexto || '')
            .split(/[;,]/)
            .map(s => s.trim())
            .filter(Boolean);

          const replicaPayload = {
            tipo: 'replica',
            etapa: 'dados_iniciais',
            timestamp: new Date().toISOString(),
            dados: {
              processo: {
                numero: formData.processNumber || '',
                varaJuizo: formData.courtName || '',
                comarca: formData.comarca || '',
                estadoUF: formData.estadoUF || '',
                tipoAcao: formData.tipoAcao || ''
              },
              autor: {
                nome: formData.clientName || '',
                cpfCnpj: formData.clientCpf || ''
              },
              reu: {
                nome: formData.opposingParty || '',
                cpfCnpj: formData.reuCpfCnpj || ''
              },
              preliminares: {
                arguidasTexto: formData.preliminaresArguidasTexto || '',
                arguidasLista: preliminaresArguidasLista,
                descricao: formData.preliminaresDescricao || '',
                argumentosRefutacao: formData.preliminaresArgumentos || '',
                processuais: formData.preliminaresProcessuais || ''
              },
              merito,
              documentosNovos: {
                haNovos: formData.haDocumentosNovos || '',
                descricao: formData.descricaoDocumentosNovos || ''
              },
              provas: {
                requer: formData.requerProducaoProvas || '',
                tipos: Array.isArray(formData.quaisProvas) ? formData.quaisProvas : [],
                especificacao: formData.especificacaoProvas || ''
              },
              audiencia: {
                conciliacao: formData.audienciaConciliacao || ''
              },
              sinteseCaso: {
                resumoInicial: formData.resumoInicial || '',
                resumoContestacao: formData.resumoContestacao || '',
                controversiaPrincipal: formData.principalControversia || '',
                argumentosDefesaResumo: formData.resumoDefesa || '',
                pontosRefutacao: formData.pontosRefutacao || ''
              },
              pedidos: {
                pedidosInicial: formData.pedidosInicial || '',
                reiteraIntegralmente: formData.reiteraIntegralmente || '',
                modificacaoPedidos: formData.modificacaoPedidos || ''
              },
              valores: {
                valorCausa: formData.caseValue || ''
              },
              advogado: {
                nome: formData.lawyerName || '',
                oab: formData.lawyerOab || '',
                email: formData.lawyerEmail || '',
                telefone: formData.lawyerTelefone || ''
              }
            },
            uploadedFiles: attachmentsPayload
          };
          const baselineId = await getReplicaBaselineId();
          await sendToWebhook(replicaPayload, 'replica');

          await new Promise(resolve => setTimeout(resolve, 20000));
          const latest = await pollReplicaLatestDocument(baselineId, 40000, 3000);
          if (latest && latest.documento_gerado) {
            setReplicaData(latest);
          } else {
            const fallback = await fetchReplicaData();
            if (fallback) setReplicaData(fallback);
          }
        } catch (error) {
          console.error('Erro ao processar dados da réplica:', error);
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
          const attachmentsPayload = await Promise.all((formData.procuracaoAttachments || []).map(async (f) => {
            const base64 = await fileToBase64(f).catch(() => null);
            return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
          }));

          const outorgante1 = {
            tipoPessoa: formData.outorgante1TipoPessoa || '',
            nomeRazao: formData.outorgante1NomeRazao || '',
            nacionalidade: formData.outorgante1Nacionalidade || '',
            estadoCivil: formData.outorgante1EstadoCivil || '',
            profissao: formData.outorgante1Profissao || '',
            rg: formData.outorgante1RG || '',
            cpf: formData.outorgante1CPF || '',
            cnpj: formData.outorgante1CNPJ || '',
            endereco: formData.outorgante1Endereco || '',
            cidade: formData.outorgante1Cidade || '',
            estado: formData.outorgante1Estado || '',
            email: formData.outorgante1Email || '',
            telefone: formData.outorgante1Telefone || '',
            representante: {
              nome: formData.outorgante1RepresentanteNome || '',
              cargo: formData.outorgante1RepresentanteCargo || '',
              rg: formData.outorgante1RepresentanteRG || '',
              cpf: formData.outorgante1RepresentanteCPF || ''
            }
          };

          const outorgantes = [outorgante1];
          if (formData.hasOutorgante2) {
            outorgantes.push({
              tipoPessoa: formData.outorgante2TipoPessoa || '',
              nomeRazao: formData.outorgante2NomeRazao || '',
              nacionalidade: formData.outorgante2Nacionalidade || '',
              estadoCivil: formData.outorgante2EstadoCivil || '',
              profissao: formData.outorgante2Profissao || '',
              rg: formData.outorgante2RG || '',
              cpf: formData.outorgante2CPF || '',
              cnpj: formData.outorgante2CNPJ || '',
              endereco: formData.outorgante2Endereco || '',
              cidade: formData.outorgante2Cidade || '',
              estado: formData.outorgante2Estado || '',
              email: formData.outorgante2Email || '',
              telefone: formData.outorgante2Telefone || '',
              representante: {
                nome: formData.outorgante2RepresentanteNome || '',
                cargo: formData.outorgante2RepresentanteCargo || '',
                rg: formData.outorgante2RepresentanteRG || '',
                cpf: formData.outorgante2RepresentanteCPF || ''
              }
            });
          }

          const outorgado1 = {
            nome: formData.lawyerName || '',
            oab: formData.lawyerOab || '',
            endereco: formData.lawyerEndereco || '',
            email: formData.lawyerEmail || '',
            telefone: formData.lawyerTelefone || ''
          };
          const outorgados = [outorgado1];
          if (formData.hasOutorgado2) {
            outorgados.push({
              nome: formData.lawyer2Name || '',
              oab: formData.lawyer2Oab || '',
              endereco: formData.lawyer2Endereco || '',
              email: formData.lawyer2Email || '',
              telefone: formData.lawyer2Telefone || ''
            });
          }

          const procuracaoPayload = {
            tipo: 'procuracao',
            etapa: 'dados_iniciais',
            timestamp: new Date().toISOString(),
            dados: {
              identificacao: {
                tituloDocumento: formData.title || '',
                nomeCliente: formData.clientName || '',
                tipoProcuracao: formData.tipoProcuracao || '',
                finalidade: formData.finalidadeProcuracao || '',
                enderecoCliente: formData.description || ''
              },
              outorgantes,
              outorgados,
              flags: {
                hasOutorgante2: !!formData.hasOutorgante2,
                hasOutorgado2: !!formData.hasOutorgado2
              },
              poderes: {
                selecionados: Array.isArray(formData.procuracaoPoderes) ? formData.procuracaoPoderes : [],
                outros: formData.procuracaoPoderesOutros || '',
                texto: formData.procuracaoPoderesTexto || ''
              },
              processo: {
                numero: formData.procuracaoProcessoNumero || ''
              }
            },
            uploadedFiles: attachmentsPayload
          };

          await sendToWebhook(procuracaoPayload, 'procuracao');

          await new Promise(resolve => setTimeout(resolve, 30000));
          const data = await fetchProcuracaoData();
          if (data) {
            setProcuracaoData(data);
          } else {
            await new Promise(resolve => setTimeout(resolve, 10000));
            const retryData = await fetchProcuracaoData();
            if (retryData) setProcuracaoData(retryData);
          }
        } catch (error) {
          console.error('Erro ao enviar dados da procuração:', error);
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

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    setContestacaoData(null);
    setRecursoData(null);
    setContratoData(null);
    setProcuracaoData(null);
    setReplicaData(null);
    setGeneratedDoc(null);
    setEditedContent('');
    setIsEditing(false);
    setIsLoadingNextStep(false);
    setIsGenerating(false);
    setCurrentStep(0);
    if (typeof onCancel === 'function') onCancel();
  };

  const generateDocument = async () => {
    // Para contestação, não gerar documento padrão - apenas aguardar dados do Supabase
    if (documentType === 'contestacao') {
      return;
    }
    if (documentType === 'recurso_inss') {
      setIsGenerating(true);
      const { data, error } = await supabase
        .from('recurso_administrativo_inss_ia')
        .select('documento_gerado')
        .not('documento_gerado', 'is', null)
        .neq('documento_gerado', '')
        .order('id', { ascending: false })
        .limit(1);
      let finalContent = '';
      if (!error && data && data.length > 0) {
        finalContent = data[0].documento_gerado || '';
      }
      setGeneratedDoc({
        id: Date.now(),
        type: documentType,
        title: formData.title,
        content: finalContent,
        createdAt: new Date().toISOString(),
        status: 'Concluído'
      });
      setEditedContent(finalContent);
      setIsGenerating(false);
      return;
    }
    if (documentType === 'concessao_beneficio') {
      setIsGenerating(true);
      setTimeout(async () => {
        const { data, error } = await supabase
          .from('concessao_de_beneficio_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: documentType,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Concluído'
        });
        setEditedContent(finalContent);
        setIsGenerating(false);
      }, 60000);
      return;
    }
    
    setIsGenerating(true);
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
        case 'replica':
          content = generateReplicaContent();
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

  const generateReplicaContent = () => {
    return `RÉPLICA

Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito da ${formData.courtName || 'Vara Competente'}
Processo nº: ${formData.processNumber || 'XXXXXXX-XX.XXXX.X.XX.XXXX'}

REQUERENTE: ${formData.clientName}, já qualificado nos autos, por seu advogado que esta subscreve, vem, respeitosamente, apresentar RÉPLICA à contestação movida por ${formData.opposingParty}, pelas razões a seguir:

ARGUMENTOS DA DEFESA (RESUMO)
${formData.resumoDefesa || 'Resumo objetivo das alegações do réu...'}

PONTOS DE REFUTAÇÃO
${formData.pontosRefutacao || 'Pontos específicos a serem refutados, com direcionamento estratégico...'}

${formData.preliminaresProcessuais ? `PRELIMINARES PROCESSUAIS
${formData.preliminaresProcessuais}

` : ''}DOS PEDIDOS
Diante do exposto, requer-se:
a) O acolhimento da presente réplica;
b) A improcedência total dos pedidos formulados na contestação;
c) A condenação do requerido ao pagamento das custas processuais e honorários advocatícios.

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
    const p1PF = formData.parte1TipoPessoa === 'Pessoa Física';
    const p2PF = formData.parte2TipoPessoa === 'Pessoa Física';
    const parte1 = p1PF
      ? `${formData.parte1NomeRazao || ''}, ${formData.parte1Nacionalidade || ''}${formData.parte1EstadoCivil ? `, ${formData.parte1EstadoCivil}` : ''}${formData.parte1Profissao ? `, ${formData.parte1Profissao}` : ''}, RG ${formData.parte1RG || ''}, CPF ${formData.parte1CPF || ''}, residente em ${formData.parte1Endereco || ''}, ${formData.parte1Cidade || ''}/${formData.parte1Estado || ''}`
      : `${formData.parte1NomeRazao || ''}, CNPJ ${formData.parte1CNPJ || ''}, com sede em ${formData.parte1Endereco || ''}, ${formData.parte1Cidade || ''}/${formData.parte1Estado || ''}${formData.parte1RepresentanteNome ? `. Representante: ${formData.parte1RepresentanteNome}, ${formData.parte1RepresentanteCargo || ''}, RG ${formData.parte1RepresentanteRG || ''}, CPF ${formData.parte1RepresentanteCPF || ''}` : ''}`;
    const parte2 = p2PF
      ? `${formData.parte2NomeRazao || ''}, ${formData.parte2Nacionalidade || ''}${formData.parte2EstadoCivil ? `, ${formData.parte2EstadoCivil}` : ''}${formData.parte2Profissao ? `, ${formData.parte2Profissao}` : ''}, RG ${formData.parte2RG || ''}, CPF ${formData.parte2CPF || ''}, residente em ${formData.parte2Endereco || ''}, ${formData.parte2Cidade || ''}/${formData.parte2Estado || ''}`
      : `${formData.parte2NomeRazao || ''}, CNPJ ${formData.parte2CNPJ || ''}, com sede em ${formData.parte2Endereco || ''}, ${formData.parte2Cidade || ''}/${formData.parte2Estado || ''}${formData.parte2RepresentanteNome ? `. Representante: ${formData.parte2RepresentanteNome}, ${formData.parte2RepresentanteCargo || ''}, RG ${formData.parte2RepresentanteRG || ''}, CPF ${formData.parte2RepresentanteCPF || ''}` : ''}`;
    const pagamentoParcelado = formData.formaPagamento === 'Parcelado' && formData.numeroParcelas && formData.valorParcelas;
    return `CONTRATO DE ${formData.contractType?.toUpperCase() || 'PRESTAÇÃO DE SERVIÇOS'}

CONTRATANTE: ${parte1}
CONTRATADO: ${parte2}

CLÁUSULA 1ª - DO OBJETO
${formData.objetoContrato || 'O presente contrato tem por objeto...'}

CLÁUSULA 2ª - DO VALOR E FORMA DE PAGAMENTO
O valor total do presente contrato é de ${formData.valorContrato || 'R$ 0.000,00'}.
Forma de pagamento: ${formData.formaPagamento || ''}${pagamentoParcelado ? `, em ${formData.numeroParcelas} parcelas de ${formData.valorParcelas}${formData.diaVencimento ? `, com vencimento no dia ${formData.diaVencimento}` : ''}` : ''}${formData.dadosBancarios ? `.
Dados bancários: ${formData.dadosBancarios}` : ''}

CLÁUSULA 3ª - DAS OBRIGAÇÕES DAS PARTES
${formData.obrigacoesPartes || 'As partes se comprometem a...'}

CLÁUSULA 4ª - DO PRAZO
${formData.prazoCumprimento ? `Prazo para cumprimento: ${formData.prazoCumprimento}` : ''}${formData.dataInicio ? `
Data de início: ${formData.dataInicio}` : ''}${formData.dataTermino ? `
Data de término: ${formData.dataTermino}` : ''}${formData.prorrogacaoPossivel ? `
Possibilidade de prorrogação: ${formData.prorrogacaoPossivel}${formData.condicoesProrrogacao ? `, condições: ${formData.condicoesProrrogacao}` : ''}` : ''}

${formData.penalidadesDescumprimento || formData.multaAtraso || formData.jurosMora || formData.multaRescisoria ? `CLÁUSULA 5ª - DAS PENALIDADES
${formData.penalidadesDescumprimento || ''}
${formData.multaAtraso ? `Multa por atraso: ${formData.multaAtraso}` : ''}
${formData.jurosMora ? `Juros de mora: ${formData.jurosMora}` : ''}
${formData.multaRescisoria ? `Multa rescisória: ${formData.multaRescisoria}` : ''}

` : ''}CLÁUSULA ${formData.penalidadesDescumprimento || formData.multaAtraso || formData.jurosMora || formData.multaRescisoria ? '6ª' : '5ª'} - DA RESOLUÇÃO DE CONFLITOS
${formData.efeitoAcordo ? `Efeito do acordo: ${formData.efeitoAcordo}
` : ''}${formData.mediacaoArbitragem ? `Cláusula de mediação/arbitragem: ${formData.mediacaoArbitragem}
` : ''}Foro competente: ${formData.foroCompetente || ''}
${formData.numeroTestemunhas ? `
Número de testemunhas: ${formData.numeroTestemunhas}` : ''}

${formData.clausulasAdicionais ? `CLÁUSULA ${formData.penalidadesDescumprimento || formData.multaAtraso || formData.jurosMora || formData.multaRescisoria ? '7ª' : '6ª'} - CLÁUSULAS ADICIONAIS
${formData.clausulasAdicionais}

` : ''}E por estarem assim justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.

Local, ${new Date().toLocaleDateString('pt-BR')}.
`;
  };

  const generateProcuracaoContent = () => {
    const tipo = formData.tipoProcuracao || 'Ad Judicia';
    const outorgantes = [];
    const o1pf = formData.outorgante1TipoPessoa === 'Pessoa Física';
    const o1 = o1pf
      ? `${formData.outorgante1NomeRazao || ''}, ${formData.outorgante1Nacionalidade || ''}${formData.outorgante1EstadoCivil ? ", " + formData.outorgante1EstadoCivil : ''}${formData.outorgante1Profissao ? ", " + formData.outorgante1Profissao : ''}, RG ${formData.outorgante1RG || ''}, CPF ${formData.outorgante1CPF || ''}, residente na ${formData.outorgante1Endereco || ''}${formData.outorgante1Cidade ? ", " + formData.outorgante1Cidade : ''}${formData.outorgante1Estado ? "/" + formData.outorgante1Estado : ''}`
      : `${formData.outorgante1NomeRazao || ''}, inscrita no CNPJ ${formData.outorgante1CNPJ || ''}, com sede na ${formData.outorgante1Endereco || ''}, representada por ${formData.outorgante1RepresentanteNome || ''}${formData.outorgante1RepresentanteCargo ? ", " + formData.outorgante1RepresentanteCargo : ''}${formData.outorgante1RepresentanteRG ? ", RG " + formData.outorgante1RepresentanteRG : ''}${formData.outorgante1RepresentanteCPF ? ", CPF " + formData.outorgante1RepresentanteCPF : ''}`;
    if ((formData.outorgante1NomeRazao || '').trim()) outorgantes.push(o1);
    if (formData.hasOutorgante2) {
      const o2pf = formData.outorgante2TipoPessoa === 'Pessoa Física';
      const o2 = o2pf
        ? `${formData.outorgante2NomeRazao || ''}${formData.outorgante2RG ? ", RG " + formData.outorgante2RG : ''}${formData.outorgante2CPF ? ", CPF " + formData.outorgante2CPF : ''}, residente na ${formData.outorgante2Endereco || ''}`
        : `${formData.outorgante2NomeRazao || ''}${formData.outorgante2CNPJ ? ", CNPJ " + formData.outorgante2CNPJ : ''}, com sede na ${formData.outorgante2Endereco || ''}`;
      if ((formData.outorgante2NomeRazao || '').trim()) outorgantes.push(o2);
    }

    const outorgadosArr = [];
    const out1 = `${formData.lawyerName || ''}, OAB/${formData.lawyerOab || ''}`;
    if ((formData.lawyerName || '').trim()) outorgadosArr.push(out1);
    if (formData.hasOutorgado2 && (formData.lawyer2Name || '').trim()) {
      outorgadosArr.push(`${formData.lawyer2Name || ''}, OAB/${formData.lawyer2Oab || ''}`);
    }

    const poderesTextoLivre = (formData.procuracaoPoderesTexto || '').trim();
    const poderesSelecionados = Array.isArray(formData.procuracaoPoderes) ? formData.procuracaoPoderes : [];
    const poderesText = poderesTextoLivre
      ? poderesTextoLivre
      : (poderesSelecionados.length
        ? poderesSelecionados.map((p, i) => `${String.fromCharCode(97 + i)}) ${p}`).join('\n')
        : [
            'a) Propor e contestar ações',
            'b) Transigir',
            'c) Desistir',
            'd) Renunciar ao direito',
            'e) Receber e dar quitação',
            'f) Substabelecer',
            'g) Atos extrajudiciais'
          ].join('\n'));
    const outrosPoderes = '';

    const processo = (formData.procuracaoProcessoNumero || '').trim() ? `\n\nProcesso específico: ${formData.procuracaoProcessoNumero}` : '';

    const assinaturaOutorgantes = outorgantes.map((o) => `\n\n_________________________________\n${o.split(',')[0]}`).join('');

    return `PROCURAÇÃO ${tipo.toUpperCase()}

OUTORGANTE${outorgantes.length > 1 ? 'S' : ''}: ${outorgantes.join('; ')}.

OUTORGADO${outorgadosArr.length > 1 ? 'S' : ''}: ${outorgadosArr.join('; ')}.

PODERES: Pelo presente instrumento de mandato, o(s) OUTORGANTE(S) nomeia(m) e constitui(em) seu(sua) bastante procurador(es) o(s) OUTORGADO(S), a quem confere(m) poderes para representá-lo(s) ativa e passivamente, judicial e extrajudicialmente, podendo:

${poderesText}${outrosPoderes}${processo}

Local, ${new Date().toLocaleDateString('pt-BR')}.
${assinaturaOutorgantes}`;
  };

  const generateConcessaoBeneficioContent = () => {
    const beneficio = formData.beneficioPleiteado || '';
    const situacao = formData.situacaoBeneficio || '';
    const idade = autorIdadeCalculada || formData.autorIdade || '';
    const rendaPerCapita = bpcRendaPerCapitaCalculada || formData.bpcRendaPerCapita || '';
    const beneficioLabels = {
      aposentadoria_idade: 'Aposentadoria por idade',
      aposentadoria_tempo: 'Aposentadoria por tempo',
      aposentadoria_especial: 'Aposentadoria especial',
      aposentadoria_invalidez: 'Aposentadoria por invalidez',
      auxilio_doenca: 'Auxílio-doença',
      auxilio_acidente: 'Auxílio-acidente',
      pensao_morte: 'Pensão por morte',
      salario_maternidade: 'Salário-maternidade',
      bpc_loas: 'BPC-LOAS',
    };
    const situacaoLabels = {
      concessao_negado: 'Concessão (negado)',
      restabelecimento_cessado: 'Restabelecimento (cessado)',
      revisao_valor_incorreto: 'Revisão (valor incorreto)',
    };
    const incapacidadeLabels = {
      total_permanente: 'Total permanente',
      total_temporaria: 'Total temporária',
      parcial: 'Parcial',
    };
    const beneficioText = beneficioLabels[beneficio] || beneficio;
    const situacaoText = situacaoLabels[situacao] || situacao;
    const incapacidadeBlock = beneficio === 'auxilio_doenca' || beneficio === 'aposentadoria_invalidez'
      ? `DADOS DE INCAPACIDADE

Diagnóstico/CID-10: ${formData.cid10Diagnostico || ''}
Descrição da doença: ${formData.doencaDescricao || ''}
Data início incapacidade: ${formData.dataInicioIncapacidade || ''}
Tipo de incapacidade: ${incapacidadeLabels[formData.tipoIncapacidade] || formData.tipoIncapacidade || ''}
Doença ocupacional: ${formData.doencaOcupacional || ''}
Última atividade: ${formData.ultimaAtividade || ''}
Está em tratamento: ${formData.estaEmTratamento || ''}
Qual tratamento: ${formData.qualTratamento || ''}
Médico: ${formData.medicoNome || ''} | CRM: ${formData.medicoCRM || ''} | Especialidade: ${formData.medicoEspecialidade || ''}
Especialidade do perito desejada: ${formData.peritoEspecialidadeDesejada || ''}

` : '';
    const pensaoBlock = beneficio === 'pensao_morte'
      ? `DADOS DE PENSÃO POR MORTE

Nome do falecido: ${formData.falecidoNome || ''}
Data do óbito: ${formData.falecidoDataObito || ''}
CPF do falecido: ${formData.falecidoCpf || ''}
NIT do falecido: ${formData.falecidoNit || ''}
Falecido era segurado: ${formData.falecidoEraSegurado || ''}
Vínculo com falecido: ${formData.vinculoFalecido || ''}
Duração casamento/união: ${formData.duracaoUniao || ''}
Número de dependentes: ${formData.numeroDependentes || ''}

` : '';
    const bpcBlock = beneficio === 'bpc_loas'
      ? `DADOS DE BPC/LOAS

Idade (se idoso): ${formData.bpcIdade || ''}
É pessoa com deficiência: ${formData.bpcPcD || ''}
Tipo de deficiência: ${formData.bpcTipoDeficiencia || ''}
Descrição deficiência: ${formData.bpcDescricaoDeficiencia || ''}
Renda familiar mensal: ${formData.bpcRendaFamiliarMensal || ''}
Composição familiar: ${formData.bpcComposicaoFamiliar || ''}
Número de membros: ${formData.bpcNumeroMembros || ''}
Renda per capita: ${rendaPerCapita}

` : '';
    const reqAdmBlock = formData.fezRequerimentoAdm
      ? `REQUERIMENTO ADMINISTRATIVO

Fez requerimento administrativo: ${formData.fezRequerimentoAdm}
DER: ${formData.dataDER || ''}
Número do Benefício (NB): ${formData.nbNumero || ''}
Espécie: ${formData.especie || ''}
Resultado: ${formData.resultadoRequerimento || ''}
Data da decisão/cessação: ${formData.dataDecisaoCessacao || ''}
Motivo da negativa: ${formData.motivoNegativa || ''}
Possui processo administrativo: ${formData.possuiProcessoAdministrativo || ''}

` : '';
    const historicoBlock = `HISTÓRICO CONTRIBUTIVO

Categoria do segurado: ${formData.categoriaSegurado || ''}
Tempo total de contribuição: ${formData.tempoTotalContribuicao || ''}
Períodos de contribuição: ${formData.periodosContribuicao || ''}
Períodos não registrados CNIS: ${formData.periodosNaoRegistradosCnis || ''}
Quais períodos: ${formData.periodosNaoRegistradosDetalhes || ''}
Data da última contribuição: ${formData.dataUltimaContribuicao || ''}

`;
    const tutelaBlock = formData.tutelaUrgencia
      ? `TUTELA DE URGÊNCIA

Requer tutela de urgência: ${formData.tutelaUrgencia}
Motivo da urgência: ${formData.motivoUrgencia || ''}

` : '';
    const outrosDadosBlock = `OUTROS DADOS

Requer Justiça Gratuita: ${formData.justicaGratuita || ''}

`;
    const advogadoBlock = `DADOS DO ADVOGADO

Nome: ${formData.lawyerName || ''}
OAB: ${formData.lawyerOab || ''}
Endereço: ${formData.lawyerEndereco || ''}
E-mail: ${formData.lawyerEmail || ''}
Telefone: ${formData.lawyerTelefone || ''}`;

    return `CONCESSÃO DE BENEFÍCIO PREVIDENCIÁRIO

BENEFÍCIO PLEITEADO: ${beneficioText}
SITUAÇÃO: ${situacaoText}

DADOS DO AUTOR

Nome completo: ${formData.clientName || ''}
Nacionalidade: ${formData.autorNacionalidade || ''}
Estado Civil: ${formData.autorEstadoCivil || ''}
Data de Nascimento: ${formData.autorNascimento || ''}
Idade: ${idade}
Profissão: ${formData.autorProfissao || ''}
Ocupação: ${formData.autorOcupacao || ''}
RG: ${formData.autorRg || ''}
CPF: ${formData.clientCpf || ''}
NIT/PIS: ${formData.autorNitPis || ''}
Endereço: ${formData.autorEndereco || ''}
E-mail: ${formData.autorEmail || ''}
Telefone: ${formData.autorTelefone || ''}

${reqAdmBlock}${incapacidadeBlock}${pensaoBlock}${bpcBlock}${historicoBlock}${tutelaBlock}${outrosDadosBlock}${advogadoBlock}`;
  };

  const generateRecursoInssContent = () => {
    const tipoLabels = {
      requerimento_inicial: 'Requerimento inicial',
      recurso_junta: 'Recurso (Junta de Recursos)',
      recurso_camara: 'Recurso (Câmara - CRPS)',
      pedido_revisao: 'Pedido de revisão',
      pedido_restabelecimento: 'Pedido de restabelecimento',
      pedido_prorrogacao: 'Pedido de prorrogação',
      justificacao_administrativa: 'Justificação administrativa',
      retificacao_dados: 'Retificação de dados',
      outro: 'Outro'
    };
    const beneficioLabels = {
      aposentadoria_idade: 'Aposentadoria por idade',
      aposentadoria_tempo: 'Aposentadoria por tempo',
      aposentadoria_especial: 'Aposentadoria especial',
      aposentadoria_invalidez: 'Aposentadoria por invalidez',
      auxilio_doenca: 'Auxílio-doença',
      auxilio_acidente: 'Auxílio-acidente',
      pensao_morte: 'Pensão por morte',
      salario_maternidade: 'Salário-maternidade',
      bpc_loas: 'BPC-LOAS',
      auxilio_reclusao: 'Auxílio-reclusão'
    };
    const tipo = tipoLabels[formData.tipoPeticao] || (formData.tipoPeticao || '');
    const beneficio = beneficioLabels[formData.recBeneficio] || (formData.recBeneficio || '');
    const isRecurso = formData.tipoPeticao === 'recurso_junta' || formData.tipoPeticao === 'recurso_camara';
    const dadosProcessoBlock = `DADOS DO PROCESSO/BENEFÍCIO

Número do Benefício (NB): ${formData.nbNumero || ''}
Espécie: ${formData.especie || ''}
DER: ${formData.dataDER || ''}
Data da decisão: ${formData.recDataDecisao || ''}
Agência do INSS: ${formData.recAgenciaInss || ''}
Nº do Processo Administrativo: ${formData.recNumeroProcessoAdm || ''}

`;
    const negativaBlock = isRecurso ? `DADOS DA NEGATIVA

Motivo da negativa: ${formData.recMotivoNegativa || ''}
Fundamentação do INSS: ${formData.recFundamentacaoInss || ''}
Data da ciência da decisão: ${formData.recDataCienciaDecisao || ''}
Está no prazo (30 dias)?: ${formData.recPrazo30Dias || ''}

` : '';
    const razoesBlock = isRecurso ? `RAZÕES DO RECURSO

Razões do recurso: ${formData.recRazoesRecurso || ''}
Fatos ignorados pelo INSS: ${formData.recFatosIgnorados || ''}
Documentos não analisados: ${formData.recDocsNaoAnalisados || ''}
Erros na análise: ${formData.recErrosAnalise || ''}

` : '';
    const incapacidadeBlock = (formData.recBeneficio === 'auxilio_doenca' || formData.recBeneficio === 'aposentadoria_invalidez') ? `DADOS DE INCAPACIDADE

Diagnóstico/CID-10: ${formData.cid10Diagnostico || ''}
Descrição da incapacidade: ${formData.doencaDescricao || ''}
Data início incapacidade: ${formData.dataInicioIncapacidade || ''}
Motivo negativa pela perícia: ${formData.recMotivoNegativaPericia || ''}
Possui laudos particulares?: ${formData.recPossuiLaudosParticulares || ''}
Especialidade dos laudos: ${formData.recEspecialidadeLaudos || ''}

` : '';
    const pensaoBlock = formData.recBeneficio === 'pensao_morte' ? `DADOS DE PENSÃO POR MORTE

Nome do falecido: ${formData.falecidoNome || ''}
Data do óbito: ${formData.falecidoDataObito || ''}
Vínculo com falecido: ${formData.vinculoFalecido || ''}
Motivo da negativa: ${formData.recMotivoNegativaPensao || ''}

` : '';
    const bpcBlock = formData.recBeneficio === 'bpc_loas' ? `DADOS DE BPC/LOAS

Idade (se idoso): ${formData.bpcIdade || ''}
Tipo de deficiência: ${formData.bpcTipoDeficiencia || ''}
Renda familiar: ${formData.bpcRendaFamiliarMensal || ''}
Número de membros: ${formData.bpcNumeroMembros || ''}
Renda per capita: ${bpcRendaPerCapitaCalculada || ''}
Motivo da negativa: ${formData.recMotivoNegativaBpc || ''}

` : '';
    const documentosBlock = `DOCUMENTOS A ANEXAR

${String(formData.recDocumentosDisponiveis || '')}

`;
    const advogadoBlock = `DADOS DO ADVOGADO

Nome: ${formData.lawyerName || ''}
OAB: ${formData.lawyerOab || ''}
Endereço: ${formData.lawyerEndereco || ''}
E-mail: ${formData.lawyerEmail || ''}
Telefone: ${formData.lawyerTelefone || ''}`;

    return `RECURSO ADMINISTRATIVO INSS

TIPO DE PETIÇÃO: ${tipo}
BENEFÍCIO: ${beneficio}

DADOS DO REQUERENTE/RECORRENTE

Nome completo: ${formData.clientName || ''}
Nacionalidade: ${formData.autorNacionalidade || ''}
Estado Civil: ${formData.autorEstadoCivil || ''}
Data de Nascimento: ${formData.autorNascimento || ''}
Idade: ${autorIdadeCalculada || ''}
Profissão: ${formData.autorProfissao || ''}
Ocupação: ${formData.autorOcupacao || ''}
RG: ${formData.autorRg || ''}
CPF: ${formData.clientCpf || ''}
NIT/PIS: ${formData.autorNitPis || ''}
Endereço: ${formData.autorEndereco || ''}
E-mail: ${formData.autorEmail || ''}
Telefone: ${formData.autorTelefone || ''}

${dadosProcessoBlock}${negativaBlock}${razoesBlock}${incapacidadeBlock}${pensaoBlock}${bpcBlock}${documentosBlock}${advogadoBlock}`;
  };

  const generateDocxDocument = () => {
    // Para contestação, usar o conteúdo editado ou os dados do Supabase
    let content = '';
    if (documentType === 'contestacao') {
      content = editedContent || contestacaoData?.documento_gerado || 'Conteúdo não disponível';
    } else if (documentType === 'recurso') {
      content = editedContent || recursoData?.documento_gerado || 'Conteúdo não disponível';
    } else if (documentType === 'procuracao') {
      content = editedContent || procuracaoData?.documento_gerado || 'Conteúdo não disponível';
    } else if (documentType === 'replica') {
      content = editedContent || replicaData?.documento_gerado || 'Conteúdo não disponível';
    } else if (documentType === 'contrato') {
      content = editedContent || contratoData?.documento_gerado || generatedDoc?.content || 'Conteúdo não disponível';
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
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      // Iniciar edição - definir conteúdo atual
      const currentContent = documentType === 'contestacao'
        ? contestacaoData?.documento_gerado || ''
        : documentType === 'recurso'
          ? recursoData?.documento_gerado || ''
          : documentType === 'procuracao'
            ? procuracaoData?.documento_gerado || ''
            : documentType === 'replica'
              ? replicaData?.documento_gerado || ''
              : documentType === 'contrato'
                ? contratoData?.documento_gerado || ''
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
        {`Dados ${['contestacao','replica','procuracao'].includes(documentType) ? 'da' : 'do'} ${documentType === 'contestacao' ? 'Contestação' : 
                  documentType === 'recurso' ? 'Recurso' : 
                  documentType === 'recurso_inss' ? 'Recurso Administrativo INSS' : 
                  documentType === 'replica' ? 'Réplica' : 
                  documentType === 'contrato' ? 'Contrato' : 'Procuração'}`}
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
                              documentType === 'recurso_inss' ? 'Recurso Administrativo INSS' : 
                              documentType === 'replica' ? 'Réplica - Processo 123456' : 
                              documentType === 'contrato' ? 'Contrato de Prestação de Serviços' : 
                              documentType === 'concessao_beneficio' ? 'Concessão de Benefício Previdenciário' : 'Procuração Ad Judicia'}`}
            />
            {errors.title && <p className="text-red-700 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
            {errors.clientName && <p className="text-red-700 text-xs mt-1">{errors.clientName}</p>}
          </div>

          {documentType === 'procuracao' && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
                Endereço do Cliente *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-primary"
                placeholder="Endereço completo do cliente..."
              />
              {errors.description && <p className="text-red-700 text-xs mt-1">{errors.description}</p>}
            </div>
          )}

          {documentType !== 'procuracao' && documentType !== 'contrato' && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
                {documentType === 'replica' ? 'Nome do Réu' : 'Parte Contrária'}
              </label>
              <input
                  type="text"
                  name="opposingParty"
                  value={formData.opposingParty}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder={documentType === 'replica' ? 'Nome completo' : 'Nome da parte adversa'}
                />
            </div>
          )}

          {(documentType === 'contestacao' || documentType === 'recurso' || documentType === 'replica') && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
          {documentType === 'recurso_inss' && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Petição *</label>
                <select name="tipoPeticao" value={formData.tipoPeticao} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="requerimento_inicial">Requerimento inicial</option>
                  <option value="recurso_junta">Recurso (Junta de Recursos)</option>
                  <option value="recurso_camara">Recurso (Câmara - CRPS)</option>
                  <option value="pedido_revisao">Pedido de revisão</option>
                  <option value="pedido_restabelecimento">Pedido de restabelecimento</option>
                  <option value="pedido_prorrogacao">Pedido de prorrogação</option>
                  <option value="justificacao_administrativa">Justificação administrativa</option>
                  <option value="retificacao_dados">Retificação de dados</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Benefício *</label>
                <select name="recBeneficio" value={formData.recBeneficio} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="aposentadoria_idade">Aposentadoria por idade</option>
                  <option value="aposentadoria_tempo">Aposentadoria por tempo</option>
                  <option value="aposentadoria_especial">Aposentadoria especial</option>
                  <option value="aposentadoria_invalidez">Aposentadoria por invalidez</option>
                  <option value="auxilio_doenca">Auxílio-doença</option>
                  <option value="auxilio_acidente">Auxílio-acidente</option>
                  <option value="pensao_morte">Pensão por morte</option>
                  <option value="salario_maternidade">Salário-maternidade</option>
                  <option value="bpc_loas">BPC-LOAS</option>
                  <option value="auxilio_reclusao">Auxílio-reclusão</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Requerente/Recorrente</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo *</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade *</label>
                <input type="text" name="autorNacionalidade" value={formData.autorNacionalidade} onChange={handleInputChange} className="input-primary" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil *</label>
                <input type="text" name="autorEstadoCivil" value={formData.autorEstadoCivil} onChange={handleInputChange} className="input-primary" placeholder="Solteiro, Casado, etc." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Nascimento *</label>
                <input type="text" name="autorNascimento" value={formData.autorNascimento} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Idade *</label>
                <input type="text" name="autorIdade" value={autorIdadeCalculada} readOnly className="input-primary" placeholder="Calculado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão *</label>
                <input type="text" name="autorProfissao" value={formData.autorProfissao} onChange={handleInputChange} className="input-primary" placeholder="Profissão" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Ocupação *</label>
                <input type="text" name="autorOcupacao" value={formData.autorOcupacao} onChange={handleInputChange} className="input-primary" placeholder="Ocupação" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="autorRg" value={formData.autorRg} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="clientCpf" value={formData.clientCpf} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">NIT/PIS *</label>
                <input type="text" name="autorNitPis" value={formData.autorNitPis} onChange={handleInputChange} className="input-primary" placeholder="000.00000.00-0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="autorEndereco" value={formData.autorEndereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="text" name="autorEmail" value={formData.autorEmail} onChange={handleInputChange} className="input-primary" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="autorTelefone" value={formData.autorTelefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Processo/Benefício</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Benefício (NB)</label>
                <input type="text" name="nbNumero" value={formData.nbNumero} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Espécie</label>
                <input type="text" name="especie" value={formData.especie} onChange={handleInputChange} className="input-primary" placeholder="Ex: 31, 41, 87" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Requerimento (DER) *</label>
                <input type="text" name="dataDER" value={formData.dataDER} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da decisão</label>
                <input type="text" name="recDataDecisao" value={formData.recDataDecisao} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Agência do INSS</label>
                <input type="text" name="recAgenciaInss" value={formData.recAgenciaInss} onChange={handleInputChange} className="input-primary" placeholder="Nome e código" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nº do Processo Administrativo</label>
                <input type="text" name="recNumeroProcessoAdm" value={formData.recNumeroProcessoAdm} onChange={handleInputChange} className="input-primary" placeholder="Se houver" />
              </div>

              {(formData.tipoPeticao === 'recurso_junta' || formData.tipoPeticao === 'recurso_camara') && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados da Negativa</h3>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da negativa *</label>
                    <textarea name="recMotivoNegativa" value={formData.recMotivoNegativa} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Conforme carta do INSS" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fundamentação do INSS</label>
                    <textarea name="recFundamentacaoInss" value={formData.recFundamentacaoInss} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Se disponível" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da ciência da decisão *</label>
                    <input type="text" name="recDataCienciaDecisao" value={formData.recDataCienciaDecisao} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Está no prazo (30 dias)? *</label>
                    <select name="recPrazo30Dias" value={formData.recPrazo30Dias} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Razões do Recurso</h3>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razões do recurso *</label>
                    <textarea name="recRazoesRecurso" value={formData.recRazoesRecurso} onChange={handleInputChange} rows={4} className="input-primary" placeholder="Por que a negativa está errada?" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fatos ignorados pelo INSS</label>
                    <textarea name="recFatosIgnorados" value={formData.recFatosIgnorados} onChange={handleInputChange} rows={3} className="input-primary" placeholder="O que o INSS não considerou?" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos não analisados</label>
                    <textarea name="recDocsNaoAnalisados" value={formData.recDocsNaoAnalisados} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Quais documentos?" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Erros na análise</label>
                    <textarea name="recErrosAnalise" value={formData.recErrosAnalise} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Quais erros?" />
                  </div>
                </>
              )}

              {(formData.recBeneficio === 'auxilio_doenca' || formData.recBeneficio === 'aposentadoria_invalidez') && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de Incapacidade</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Diagnóstico/CID-10</label>
                    <input type="text" name="cid10Diagnostico" value={formData.cid10Diagnostico} onChange={handleInputChange} className="input-primary" placeholder="Ex: M54.5" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição da incapacidade</label>
                    <textarea name="doencaDescricao" value={formData.doencaDescricao} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Descreva" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data início incapacidade</label>
                    <input type="text" name="dataInicioIncapacidade" value={formData.dataInicioIncapacidade} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo negativa pela perícia</label>
                    <input type="text" name="recMotivoNegativaPericia" value={formData.recMotivoNegativaPericia} onChange={handleInputChange} className="input-primary" placeholder="Apto / Não incapaz" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Possui laudos particulares?</label>
                    <select name="recPossuiLaudosParticulares" value={formData.recPossuiLaudosParticulares} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Especialidade dos laudos</label>
                    <input type="text" name="recEspecialidadeLaudos" value={formData.recEspecialidadeLaudos} onChange={handleInputChange} className="input-primary" placeholder="Se sim" />
                  </div>
                </>
              )}

              {formData.recBeneficio === 'pensao_morte' && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de Pensão por Morte</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do falecido</label>
                    <input type="text" name="falecidoNome" value={formData.falecidoNome} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do óbito</label>
                    <input type="text" name="falecidoDataObito" value={formData.falecidoDataObito} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vínculo com falecido</label>
                    <select name="vinculoFalecido" value={formData.vinculoFalecido} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="conjuge">Cônjuge</option>
                      <option value="companheiro">Companheiro</option>
                      <option value="filho_menor">Filho menor</option>
                      <option value="filho_invalido">Filho inválido</option>
                      <option value="pais">Pais</option>
                      <option value="irmao">Irmão</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da negativa</label>
                    <input type="text" name="recMotivoNegativaPensao" value={formData.recMotivoNegativaPensao} onChange={handleInputChange} className="input-primary" placeholder="Qualidade / Dependência" />
                  </div>
                </>
              )}

              {formData.recBeneficio === 'bpc_loas' && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de BPC/LOAS</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Idade (se idoso)</label>
                    <input type="text" name="bpcIdade" value={formData.bpcIdade} onChange={handleInputChange} className="input-primary" placeholder="65+ anos" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de deficiência</label>
                    <select name="bpcTipoDeficiencia" value={formData.bpcTipoDeficiencia} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="fisica">Física</option>
                      <option value="mental">Mental</option>
                      <option value="intelectual">Intelectual</option>
                      <option value="sensorial">Sensorial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda familiar</label>
                    <input type="text" name="bpcRendaFamiliarMensal" value={formData.bpcRendaFamiliarMensal} onChange={handleInputChange} className="input-primary" placeholder="R$ 0.000,00" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número de membros</label>
                    <input type="text" name="bpcNumeroMembros" value={formData.bpcNumeroMembros} onChange={handleInputChange} className="input-primary" placeholder="Número" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda per capita</label>
                    <input type="text" name="bpcRendaPerCapita" value={bpcRendaPerCapitaCalculada} readOnly className="input-primary" placeholder="Calculada" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da negativa</label>
                    <input type="text" name="recMotivoNegativaBpc" value={formData.recMotivoNegativaBpc} onChange={handleInputChange} className="input-primary" placeholder="Renda / Deficiência" />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Documentos a Anexar</h3>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Liste os documentos disponíveis *</label>
                <textarea
                  name="recDocumentosDisponiveis"
                  value={formData.recDocumentosDisponiveis}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-primary"
                  placeholder="Ex.: RG/CPF, CNIS, CTPS, PPP, LTCAT, Laudos, Exames, Certidão óbito, Certidão casamento, Carta de indeferimento, Procuração, etc."
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                <input type="text" name="lawyerName" value={formData.lawyerName} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="lawyerOab" value={formData.lawyerOab} onChange={handleInputChange} className="input-primary" placeholder="OAB/UF 123456" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="lawyerEndereco" value={formData.lawyerEndereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço do escritório" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="text" name="lawyerEmail" value={formData.lawyerEmail} onChange={handleInputChange} className="input-primary" placeholder="advogado@email.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="lawyerTelefone" value={formData.lawyerTelefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>
            </>
          )}

          {documentType === 'contrato' && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Contrato *</label>
                <select name="contractType" value={formData.contractType} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione o tipo</option>
                  <option value="Prestação de Serviços">Prestação de Serviços</option>
                  <option value="Compra e Venda">Compra e Venda</option>
                  <option value="Locação">Locação</option>
                  <option value="Sociedade">Sociedade</option>
                  <option value="Parceria">Parceria</option>
                  <option value="Empreitada">Empreitada</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor do Contrato *</label>
                <input type="text" name="valorContrato" value={formData.valorContrato} onChange={handleInputChange} className="input-primary" placeholder="R$ 0.000,00" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Primeira Parte</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Pessoa *</label>
                <select name="parte1TipoPessoa" value={formData.parte1TipoPessoa} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo / Razão Social *</label>
                <input type="text" name="parte1NomeRazao" value={formData.parte1NomeRazao} onChange={handleInputChange} className="input-primary" placeholder="Nome ou razão social" />
              </div>
              {formData.parte1TipoPessoa === 'Pessoa Física' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                    <input type="text" name="parte1Nacionalidade" value={formData.parte1Nacionalidade} onChange={handleInputChange} className="input-primary" placeholder="Brasileiro(a)" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                    <select name="parte1EstadoCivil" value={formData.parte1EstadoCivil} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                      <option value="Separado(a)">Separado(a)</option>
                      <option value="União Estável">União Estável</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                    <input type="text" name="parte1Profissao" value={formData.parte1Profissao} onChange={handleInputChange} className="input-primary" placeholder="Profissão" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                    <input type="text" name="parte1RG" value={formData.parte1RG} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                    <input type="text" name="parte1CPF" value={formData.parte1CPF} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                  </div>
                </>
              )}
              {formData.parte1TipoPessoa === 'Pessoa Jurídica' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                    <input type="text" name="parte1CNPJ" value={formData.parte1CNPJ} onChange={handleInputChange} className="input-primary" placeholder="00.000.000/0000-00" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Representante</label>
                    <input type="text" name="parte1RepresentanteNome" value={formData.parte1RepresentanteNome} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cargo do Representante</label>
                    <input type="text" name="parte1RepresentanteCargo" value={formData.parte1RepresentanteCargo} onChange={handleInputChange} className="input-primary" placeholder="Sócio-administrador" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG do Representante</label>
                    <input type="text" name="parte1RepresentanteRG" value={formData.parte1RepresentanteRG} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do Representante</label>
                    <input type="text" name="parte1RepresentanteCPF" value={formData.parte1RepresentanteCPF} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="parte1Endereco" value={formData.parte1Endereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cidade *</label>
                <input type="text" name="parte1Cidade" value={formData.parte1Cidade} onChange={handleInputChange} className="input-primary" placeholder="Cidade" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado *</label>
                <select name="parte1Estado" value={formData.parte1Estado} onChange={handleInputChange} className="input-primary">
                  <option value="">UF</option>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="text" name="parte1Email" value={formData.parte1Email} onChange={handleInputChange} className="input-primary" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="parte1Telefone" value={formData.parte1Telefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Segunda Parte</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Pessoa *</label>
                <select name="parte2TipoPessoa" value={formData.parte2TipoPessoa} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo / Razão Social *</label>
                <input type="text" name="parte2NomeRazao" value={formData.parte2NomeRazao} onChange={handleInputChange} className="input-primary" placeholder="Nome ou razão social" />
              </div>
              {formData.parte2TipoPessoa === 'Pessoa Física' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                    <input type="text" name="parte2Nacionalidade" value={formData.parte2Nacionalidade} onChange={handleInputChange} className="input-primary" placeholder="Brasileiro(a)" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                    <select name="parte2EstadoCivil" value={formData.parte2EstadoCivil} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                      <option value="Separado(a)">Separado(a)</option>
                      <option value="União Estável">União Estável</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                    <input type="text" name="parte2Profissao" value={formData.parte2Profissao} onChange={handleInputChange} className="input-primary" placeholder="Profissão" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                    <input type="text" name="parte2RG" value={formData.parte2RG} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                    <input type="text" name="parte2CPF" value={formData.parte2CPF} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                  </div>
                </>
              )}
              {formData.parte2TipoPessoa === 'Pessoa Jurídica' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                    <input type="text" name="parte2CNPJ" value={formData.parte2CNPJ} onChange={handleInputChange} className="input-primary" placeholder="00.000.000/0000-00" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Representante</label>
                    <input type="text" name="parte2RepresentanteNome" value={formData.parte2RepresentanteNome} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cargo do Representante</label>
                    <input type="text" name="parte2RepresentanteCargo" value={formData.parte2RepresentanteCargo} onChange={handleInputChange} className="input-primary" placeholder="Sócio-administrador" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG do Representante</label>
                    <input type="text" name="parte2RepresentanteRG" value={formData.parte2RepresentanteRG} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do Representante</label>
                    <input type="text" name="parte2RepresentanteCPF" value={formData.parte2RepresentanteCPF} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="parte2Endereco" value={formData.parte2Endereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cidade *</label>
                <input type="text" name="parte2Cidade" value={formData.parte2Cidade} onChange={handleInputChange} className="input-primary" placeholder="Cidade" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado *</label>
                <select name="parte2Estado" value={formData.parte2Estado} onChange={handleInputChange} className="input-primary">
                  <option value="">UF</option>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="text" name="parte2Email" value={formData.parte2Email} onChange={handleInputChange} className="input-primary" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="parte2Telefone" value={formData.parte2Telefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados Financeiros</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Forma de Pagamento *</label>
                <select name="formaPagamento" value={formData.formaPagamento} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="À vista">À vista</option>
                  <option value="Parcelado">Parcelado</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Por etapa">Por etapa</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              {formData.formaPagamento === 'Parcelado' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número de Parcelas</label>
                    <input type="number" name="numeroParcelas" value={formData.numeroParcelas} onChange={handleInputChange} className="input-primary" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor das Parcelas</label>
                    <input type="text" name="valorParcelas" value={formData.valorParcelas} onChange={handleInputChange} className="input-primary" placeholder="R$ 0.000,00" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Dia do Vencimento</label>
                <input type="number" name="diaVencimento" value={formData.diaVencimento} onChange={handleInputChange} className="input-primary" placeholder="1-31" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Dados Bancários</label>
                <textarea name="dadosBancarios" value={formData.dadosBancarios} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Banco, agência, conta, PIX" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Obrigações das Partes *</label>
                <textarea name="obrigacoesPartes" value={formData.obrigacoesPartes || ''} onChange={handleInputChange} rows={6} className="input-primary" placeholder="Descrição detalhada do que cada parte deverá cumprir..." />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Prazo para Cumprimento *</label>
                <input type="text" name="prazoCumprimento" value={formData.prazoCumprimento || ''} onChange={handleInputChange} className="input-primary" placeholder="Ex: 30 dias, 6 meses, até 31/12/2024..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Início</label>
                <input type="date" name="dataInicio" value={formData.dataInicio || ''} onChange={handleInputChange} className="input-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Término</label>
                <input type="date" name="dataTermino" value={formData.dataTermino || ''} onChange={handleInputChange} className="input-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Possibilidade de Prorrogação</label>
                <select name="prorrogacaoPossivel" value={formData.prorrogacaoPossivel || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              {formData.prorrogacaoPossivel === 'Sim' && (
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Condições para Prorrogação</label>
                  <textarea name="condicoesProrrogacao" value={formData.condicoesProrrogacao || ''} onChange={handleInputChange} rows={4} className="input-primary" />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Penalidades pelo Descumprimento</label>
                <textarea name="penalidadesDescumprimento" value={formData.penalidadesDescumprimento || ''} onChange={handleInputChange} rows={4} className="input-primary" placeholder="Consequências em caso de não cumprimento das obrigações..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Multa por Atraso</label>
                <input type="text" name="multaAtraso" value={formData.multaAtraso || ''} onChange={handleInputChange} className="input-primary" placeholder="Ex: 2%" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Juros de Mora</label>
                <input type="text" name="jurosMora" value={formData.jurosMora || ''} onChange={handleInputChange} className="input-primary" placeholder="Ex: 1% ao mês" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Multa Rescisória</label>
                <input type="text" name="multaRescisoria" value={formData.multaRescisoria || ''} onChange={handleInputChange} className="input-primary" placeholder="Ex: 20%" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Resolução de Conflitos</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Efeito do Acordo *</label>
                <select name="efeitoAcordo" value={formData.efeitoAcordo || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="Não precisa homologação">Não precisa homologação</option>
                  <option value="Será homologado judicialmente">Será homologado judicialmente</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Foro Competente *</label>
                <input type="text" name="foroCompetente" value={formData.foroCompetente || ''} onChange={handleInputChange} className="input-primary" placeholder="Comarca de..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cláusula de Mediação/Arbitragem</label>
                <select name="mediacaoArbitragem" value={formData.mediacaoArbitragem || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número de Testemunhas</label>
                <select name="numeroTestemunhas" value={formData.numeroTestemunhas || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
            </>
          )}

          {documentType === 'procuracao' && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Procuração *</label>
                <select name="tipoProcuracao" value={formData.tipoProcuracao} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="Ad Judicia">Ad Judicia</option>
                  <option value="Ad Judicia et Extra">Ad Judicia et Extra</option>
                  <option value="Pública">Pública</option>
                  <option value="Específica">Específica</option>
                </select>
                {errors.tipoProcuracao && <p className="text-red-700 text-xs mt-1">{errors.tipoProcuracao}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Finalidade</label>
                <textarea name="finalidadeProcuracao" value={formData.finalidadeProcuracao} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Finalidade específica" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outorgante 1</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Pessoa *</label>
                <select name="outorgante1TipoPessoa" value={formData.outorgante1TipoPessoa} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                </select>
                {errors.outorgante1TipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.outorgante1TipoPessoa}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo / Razão Social *</label>
                <input type="text" name="outorgante1NomeRazao" value={formData.outorgante1NomeRazao} onChange={handleInputChange} className="input-primary" placeholder="Nome ou razão social" />
                {errors.outorgante1NomeRazao && <p className="text-red-700 text-xs mt-1">{errors.outorgante1NomeRazao}</p>}
              </div>
              {formData.outorgante1TipoPessoa === 'Pessoa Física' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                    <input type="text" name="outorgante1Nacionalidade" value={formData.outorgante1Nacionalidade} onChange={handleInputChange} className="input-primary" placeholder="Brasileiro(a)" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                    <select name="outorgante1EstadoCivil" value={formData.outorgante1EstadoCivil} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                      <option value="Separado(a)">Separado(a)</option>
                      <option value="União Estável">União Estável</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                    <input type="text" name="outorgante1Profissao" value={formData.outorgante1Profissao} onChange={handleInputChange} className="input-primary" placeholder="Profissão" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                    <input type="text" name="outorgante1RG" value={formData.outorgante1RG} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
                    {errors.outorgante1RG && <p className="text-red-700 text-xs mt-1">{errors.outorgante1RG}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                    <input type="text" name="outorgante1CPF" value={formData.outorgante1CPF} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                    {errors.outorgante1CPF && <p className="text-red-700 text-xs mt-1">{errors.outorgante1CPF}</p>}
                  </div>
                </>
              )}
              {formData.outorgante1TipoPessoa === 'Pessoa Jurídica' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                    <input type="text" name="outorgante1CNPJ" value={formData.outorgante1CNPJ} onChange={handleInputChange} className="input-primary" placeholder="00.000.000/0000-00" />
                    {errors.outorgante1CNPJ && <p className="text-red-700 text-xs mt-1">{errors.outorgante1CNPJ}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Representante</label>
                    <input type="text" name="outorgante1RepresentanteNome" value={formData.outorgante1RepresentanteNome} onChange={handleInputChange} className="input-primary" placeholder="Nome do representante" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cargo</label>
                    <input type="text" name="outorgante1RepresentanteCargo" value={formData.outorgante1RepresentanteCargo} onChange={handleInputChange} className="input-primary" placeholder="Cargo" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG</label>
                    <input type="text" name="outorgante1RepresentanteRG" value={formData.outorgante1RepresentanteRG} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF</label>
                    <input type="text" name="outorgante1RepresentanteCPF" value={formData.outorgante1RepresentanteCPF} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="outorgante1Endereco" value={formData.outorgante1Endereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço completo" />
                {errors.outorgante1Endereco && <p className="text-red-700 text-xs mt-1">{errors.outorgante1Endereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cidade</label>
                <input type="text" name="outorgante1Cidade" value={formData.outorgante1Cidade} onChange={handleInputChange} className="input-primary" placeholder="Cidade" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado</label>
                <input type="text" name="outorgante1Estado" value={formData.outorgante1Estado} onChange={handleInputChange} className="input-primary" placeholder="UF" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="text" name="outorgante1Email" value={formData.outorgante1Email} onChange={handleInputChange} className="input-primary" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="outorgante1Telefone" value={formData.outorgante1Telefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>

              <div className="md:col-span-2">
                <button type="button" onClick={() => toggleBooleanField('hasOutorgante2')} className="btn-secondary">
                  {formData.hasOutorgante2 ? 'Remover segundo outorgante' : 'Adicionar segundo outorgante'}
                </button>
              </div>

              {formData.hasOutorgante2 && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outorgante 2</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Pessoa</label>
                    <select name="outorgante2TipoPessoa" value={formData.outorgante2TipoPessoa} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="Pessoa Física">Pessoa Física</option>
                      <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo / Razão Social</label>
                    <input type="text" name="outorgante2NomeRazao" value={formData.outorgante2NomeRazao} onChange={handleInputChange} className="input-primary" placeholder="Nome ou razão social" />
                  </div>
                  {formData.outorgante2TipoPessoa === 'Pessoa Física' && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG</label>
                        <input type="text" name="outorgante2RG" value={formData.outorgante2RG} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF</label>
                        <input type="text" name="outorgante2CPF" value={formData.outorgante2CPF} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                      </div>
                    </>
                  )}
                  {formData.outorgante2TipoPessoa === 'Pessoa Jurídica' && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ</label>
                        <input type="text" name="outorgante2CNPJ" value={formData.outorgante2CNPJ} onChange={handleInputChange} className="input-primary" placeholder="00.000.000/0000-00" />
                      </div>
                    </>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço</label>
                    <input type="text" name="outorgante2Endereco" value={formData.outorgante2Endereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço completo" />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outorgados</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="lawyerName" value={formData.lawyerName} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
                {errors.lawyerName && <p className="text-red-700 text-xs mt-1">{errors.lawyerName}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="lawyerOab" value={formData.lawyerOab} onChange={handleInputChange} className="input-primary" placeholder="OAB/UF 123456" />
                {errors.lawyerOab && <p className="text-red-700 text-xs mt-1">{errors.lawyerOab}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço</label>
                <input type="text" name="lawyerEndereco" value={formData.lawyerEndereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço do escritório" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="text" name="lawyerEmail" value={formData.lawyerEmail} onChange={handleInputChange} className="input-primary" placeholder="advogado@email.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="lawyerTelefone" value={formData.lawyerTelefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>

              <div className="md:col-span-2">
                <button type="button" onClick={() => toggleBooleanField('hasOutorgado2')} className="btn-secondary">
                  {formData.hasOutorgado2 ? 'Remover segundo outorgado' : 'Adicionar segundo outorgado'}
                </button>
              </div>

              {formData.hasOutorgado2 && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Advogado 2</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome</label>
                    <input type="text" name="lawyer2Name" value={formData.lawyer2Name} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB</label>
                    <input type="text" name="lawyer2Oab" value={formData.lawyer2Oab} onChange={handleInputChange} className="input-primary" placeholder="OAB/UF 123456" />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Poderes</h3>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descreva os poderes concedidos</label>
                <textarea name="procuracaoPoderesTexto" value={formData.procuracaoPoderesTexto} onChange={handleInputChange} rows={4} className="input-primary" placeholder="Ex.: Propor e contestar ações; Transigir; Receber e dar quitação; Substabelecer; Atos extrajudiciais" />
                {errors.procuracaoPoderesTexto && <p className="text-red-700 text-xs mt-1">{errors.procuracaoPoderesTexto}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Processo específico (nº)</label>
                <input type="text" name="procuracaoProcessoNumero" value={formData.procuracaoProcessoNumero} onChange={handleInputChange} className="input-primary" placeholder="0000000-00.0000.0.00.0000" />
              </div>
            </>
          )}
          {documentType === 'replica' && (
            <>
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Processo</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Comarca *</label>
                <input type="text" name="comarca" value={formData.comarca} onChange={handleInputChange} className="input-primary" placeholder="Ex: São Paulo" />
                {errors.comarca && <p className="text-red-700 text-xs mt-1">{errors.comarca}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado (UF) *</label>
                <select name="estadoUF" value={formData.estadoUF} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option>
                  <option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option>
                  <option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                  <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option>
                  <option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option>
                  <option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                  <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                </select>
                {errors.estadoUF && <p className="text-red-700 text-xs mt-1">{errors.estadoUF}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Ação *</label>
                <input type="text" name="tipoAcao" value={formData.tipoAcao} onChange={handleInputChange} className="input-primary" placeholder="Ex: Ação de Cobrança" />
                {errors.tipoAcao && <p className="text-red-700 text-xs mt-1">{errors.tipoAcao}</p>}
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Autor</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF/CNPJ do Autor</label>
                <input type="text" name="clientCpf" value={formData.clientCpf || ''} onChange={handleInputChange} className="input-primary" placeholder="Documento" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Réu</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF/CNPJ do Réu</label>
                <input type="text" name="reuCpfCnpj" value={formData.reuCpfCnpj || ''} onChange={handleInputChange} className="input-primary" placeholder="Documento" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Preliminares Arguidas</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Preliminares Arguidas</label>
                <input type="text" name="preliminaresArguidasTexto" value={formData.preliminaresArguidasTexto || ''} onChange={handleInputChange} className="input-primary" placeholder="Ex.: Ilegitimidade ativa; Inépcia da inicial" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição das Preliminares</label>
                <textarea name="preliminaresDescricao" value={formData.preliminaresDescricao || ''} onChange={handleInputChange} rows={4} className="input-primary" placeholder="O que o réu alegou em cada preliminar" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Argumentos para Refutar</label>
                <textarea name="preliminaresArgumentos" value={formData.preliminaresArgumentos || ''} onChange={handleInputChange} rows={4} className="input-primary" placeholder="Como refutar cada preliminar" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Alegações de Mérito do Réu</h3>
              </div>
              {[1,2,3,4,5].map(i => (
                <React.Fragment key={i}>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">{`Alegação ${i} do Réu${i===1 ? ' *' : ''}`}</label>
                    <textarea name={`alegacao${i}`} value={formData[`alegacao${i}`] || ''} onChange={handleInputChange} rows={3} className="input-primary" placeholder="O que o réu alegou" />
                    {i===1 && errors.alegacao1 && <p className="text-red-700 text-xs mt-1">{errors.alegacao1}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">{`Refutação da Alegação ${i}${i===1 ? ' *' : ''}`}</label>
                    <textarea name={`refutacao${i}`} value={formData[`refutacao${i}`] || ''} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Como refutar" />
                    {i===1 && errors.refutacao1 && <p className="text-red-700 text-xs mt-1">{errors.refutacao1}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">{`Fundamento/Prova ${i}`}</label>
                    <textarea name={`fundamento${i}`} value={formData[`fundamento${i}`] || ''} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Documento, lei, jurisprudência" />
                  </div>
                </React.Fragment>
              ))}

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há documentos novos a juntar?</label>
                <select name="haDocumentosNovos" value={formData.haDocumentosNovos || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haDocumentosNovos === 'sim' && (
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição dos Documentos</label>
                  <textarea name="descricaoDocumentosNovos" value={formData.descricaoDocumentosNovos || ''} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Quais e por que são relevantes" />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer produção de provas?</label>
                <select name="requerProducaoProvas" value={formData.requerProducaoProvas || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.requerProducaoProvas === 'sim' && (
                <>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Documental','Testemunhal','Pericial','Depoimento pessoal','Inspeção judicial'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                        <input type="checkbox" checked={(Array.isArray(formData.quaisProvas) ? formData.quaisProvas : []).includes(opt)} onChange={() => toggleCheckboxArray('quaisProvas', opt)} />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Especificação das Provas</label>
                    <textarea name="especificacaoProvas" value={formData.especificacaoProvas || ''} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Detalhes sobre as provas requeridas" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Deseja audiência de conciliação?</label>
                <select name="audienciaConciliacao" value={formData.audienciaConciliacao || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                  <option value="ja_designada">Já foi designada</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Síntese do Caso</h3>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo da Petição Inicial *</label>
                <textarea name="resumoInicial" value={formData.resumoInicial || ''} onChange={handleInputChange} rows={4} className="input-primary" placeholder="O que o autor pediu na inicial" />
                {errors.resumoInicial && <p className="text-red-700 text-xs mt-1">{errors.resumoInicial}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo da Contestação *</label>
                <textarea name="resumoContestacao" value={formData.resumoContestacao || ''} onChange={handleInputChange} rows={4} className="input-primary" placeholder="O que o réu alegou em síntese" />
                {errors.resumoContestacao && <p className="text-red-700 text-xs mt-1">{errors.resumoContestacao}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Principal Controvérsia *</label>
                <textarea name="principalControversia" value={formData.principalControversia || ''} onChange={handleInputChange} rows={4} className="input-primary" placeholder="Qual o ponto central do conflito" />
                {errors.principalControversia && <p className="text-red-700 text-xs mt-1">{errors.principalControversia}</p>}
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Pedidos</h3>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Pedidos da Inicial</label>
                <textarea name="pedidosInicial" value={formData.pedidosInicial || ''} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Quais foram os pedidos originais" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Reitera integralmente os pedidos?</label>
                <select name="reiteraIntegralmente" value={formData.reiteraIntegralmente || ''} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Modificação dos Pedidos</label>
                <textarea name="modificacaoPedidos" value={formData.modificacaoPedidos || ''} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Se houver alteração" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="lawyerName" value={formData.lawyerName} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
                {errors.lawyerName && <p className="text-red-700 text-xs mt-1">{errors.lawyerName}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="lawyerOab" value={formData.lawyerOab} onChange={handleInputChange} className="input-primary" placeholder="OAB/UF 123456" />
                {errors.lawyerOab && <p className="text-red-700 text-xs mt-1">{errors.lawyerOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="text" name="lawyerEmail" value={formData.lawyerEmail || ''} onChange={handleInputChange} className="input-primary" placeholder="advogado@email.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="lawyerTelefone" value={formData.lawyerTelefone || ''} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
                  ARGUMENTOS DA DEFESA (RESUMO)
                </label>
                <textarea
                  name="resumoDefesa"
                  value={formData.resumoDefesa}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-primary"
                  placeholder="Descreva brevemente o que o réu alegou para se defender."
                  required
                />
                {errors.resumoDefesa && <p className="text-red-700 text-xs mt-1">{errors.resumoDefesa}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
                  PONTOS DE REFUTAÇÃO ESTRATÉGIA
                </label>
                <textarea
                  name="pontosRefutacao"
                  value={formData.pontosRefutacao}
                  onChange={handleInputChange}
                  rows={6}
                  className="input-primary"
                  placeholder="O que devemos responder especificamente sobre as alegações dele? Dê a munição para a IA."
                  required
                />
                {errors.pontosRefutacao && <p className="text-red-700 text-xs mt-1">{errors.pontosRefutacao}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
                  PRELIMINARES PROCESSUAIS (opcional)
                </label>
                <textarea
                  name="preliminaresProcessuais"
                  value={formData.preliminaresProcessuais}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-primary"
                  placeholder="O réu tentou extinguir o processo sem julgamento de mérito (inépcia, ilegitimidade, etc)?"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 arquivos)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="replica-file-upload"
                    multiple
                    accept=".pdf"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const pdfs = files.filter(f => f.type === 'application/pdf');
                      const existing = formData.replicaAttachments || [];
                      const combined = [...existing, ...pdfs].slice(0, 10);
                      setFormData(prev => ({ ...prev, replicaAttachments: combined }));
                    }}
                    className="hidden"
                  />
                  <label htmlFor="replica-file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                  </label>
                </div>
                {formData.replicaAttachments && formData.replicaAttachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                    {formData.replicaAttachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = (formData.replicaAttachments || []).filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, replicaAttachments: next }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {documentType === 'concessao_beneficio' && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Benefício Pleiteado *</label>
                <select name="beneficioPleiteado" value={formData.beneficioPleiteado} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="aposentadoria_idade">Aposentadoria por idade</option>
                  <option value="aposentadoria_tempo">Aposentadoria por tempo</option>
                  <option value="aposentadoria_especial">Aposentadoria especial</option>
                  <option value="aposentadoria_invalidez">Aposentadoria por invalidez</option>
                  <option value="auxilio_doenca">Auxílio-doença</option>
                  <option value="auxilio_acidente">Auxílio-acidente</option>
                  <option value="pensao_morte">Pensão por morte</option>
                  <option value="salario_maternidade">Salário-maternidade</option>
                  <option value="bpc_loas">BPC-LOAS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Situação *</label>
                <select name="situacaoBeneficio" value={formData.situacaoBeneficio} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="concessao_negado">Concessão (negado)</option>
                  <option value="restabelecimento_cessado">Restabelecimento (cessado)</option>
                  <option value="revisao_valor_incorreto">Revisão (valor incorreto)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Autor (Segurado)</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo *</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade *</label>
                <input type="text" name="autorNacionalidade" value={formData.autorNacionalidade} onChange={handleInputChange} className="input-primary" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil *</label>
                <input type="text" name="autorEstadoCivil" value={formData.autorEstadoCivil} onChange={handleInputChange} className="input-primary" placeholder="Solteiro, Casado, etc." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Nascimento *</label>
                <input type="text" name="autorNascimento" value={formData.autorNascimento} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Idade *</label>
                <input type="text" name="autorIdade" value={autorIdadeCalculada} readOnly className="input-primary" placeholder="Calculado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão *</label>
                <input type="text" name="autorProfissao" value={formData.autorProfissao} onChange={handleInputChange} className="input-primary" placeholder="Profissão" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Ocupação *</label>
                <input type="text" name="autorOcupacao" value={formData.autorOcupacao} onChange={handleInputChange} className="input-primary" placeholder="Ocupação" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="autorRg" value={formData.autorRg} onChange={handleInputChange} className="input-primary" placeholder="00.000.000-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="clientCpf" value={formData.clientCpf} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">NIT/PIS *</label>
                <input type="text" name="autorNitPis" value={formData.autorNitPis} onChange={handleInputChange} className="input-primary" placeholder="000.00000.00-0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="autorEndereco" value={formData.autorEndereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="text" name="autorEmail" value={formData.autorEmail} onChange={handleInputChange} className="input-primary" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="autorTelefone" value={formData.autorTelefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Requerimento Administrativo</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fez requerimento administrativo? *</label>
                <select name="fezRequerimentoAdm" value={formData.fezRequerimentoAdm} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Requerimento (DER) *</label>
                <input type="text" name="dataDER" value={formData.dataDER} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Benefício (NB) *</label>
                <input type="text" name="nbNumero" value={formData.nbNumero} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Espécie *</label>
                <input type="text" name="especie" value={formData.especie} onChange={handleInputChange} className="input-primary" placeholder="Ex: 31, 41, 87" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resultado *</label>
                <select name="resultadoRequerimento" value={formData.resultadoRequerimento} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="indeferido">Indeferido</option>
                  <option value="cessado">Cessado</option>
                  <option value="valor_incorreto">Valor incorreto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da decisão/cessação</label>
                <input type="text" name="dataDecisaoCessacao" value={formData.dataDecisaoCessacao} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da negativa</label>
                <textarea name="motivoNegativa" value={formData.motivoNegativa} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Conforme carta INSS" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Possui processo administrativo?</label>
                <select name="possuiProcessoAdministrativo" value={formData.possuiProcessoAdministrativo} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              {(formData.beneficioPleiteado === 'auxilio_doenca' || formData.beneficioPleiteado === 'aposentadoria_invalidez') && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de Incapacidade</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Diagnóstico/CID-10 *</label>
                    <input type="text" name="cid10Diagnostico" value={formData.cid10Diagnostico} onChange={handleInputChange} className="input-primary" placeholder="Ex: M54.5 - Dor lombar" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição da doença *</label>
                    <textarea name="doencaDescricao" value={formData.doencaDescricao} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Descreva a doença" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data início incapacidade *</label>
                    <input type="text" name="dataInicioIncapacidade" value={formData.dataInicioIncapacidade} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de incapacidade *</label>
                    <select name="tipoIncapacidade" value={formData.tipoIncapacidade} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="total_permanente">Total permanente</option>
                      <option value="total_temporaria">Total temporária</option>
                      <option value="parcial">Parcial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Doença ocupacional?</label>
                    <select name="doencaOcupacional" value={formData.doencaOcupacional} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Última atividade</label>
                    <input type="text" name="ultimaAtividade" value={formData.ultimaAtividade} onChange={handleInputChange} className="input-primary" placeholder="Função exercida" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Está em tratamento?</label>
                    <select name="estaEmTratamento" value={formData.estaEmTratamento} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Qual tratamento?</label>
                    <textarea name="qualTratamento" value={formData.qualTratamento} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Descreva o tratamento" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do médico</label>
                    <input type="text" name="medicoNome" value={formData.medicoNome} onChange={handleInputChange} className="input-primary" placeholder="Dr(a)." />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CRM</label>
                    <input type="text" name="medicoCRM" value={formData.medicoCRM} onChange={handleInputChange} className="input-primary" placeholder="CRM 00000" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Especialidade</label>
                    <input type="text" name="medicoEspecialidade" value={formData.medicoEspecialidade} onChange={handleInputChange} className="input-primary" placeholder="Especialidade" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Especialidade perito desejada</label>
                    <input type="text" name="peritoEspecialidadeDesejada" value={formData.peritoEspecialidadeDesejada} onChange={handleInputChange} className="input-primary" placeholder="Para perícia judicial" />
                  </div>
                </>
              )}

              {formData.beneficioPleiteado === 'pensao_morte' && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de Pensão por Morte</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do falecido *</label>
                    <input type="text" name="falecidoNome" value={formData.falecidoNome} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do óbito *</label>
                    <input type="text" name="falecidoDataObito" value={formData.falecidoDataObito} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do falecido *</label>
                    <input type="text" name="falecidoCpf" value={formData.falecidoCpf} onChange={handleInputChange} className="input-primary" placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">NIT do falecido</label>
                    <input type="text" name="falecidoNit" value={formData.falecidoNit} onChange={handleInputChange} className="input-primary" placeholder="000.00000.00-0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Falecido era segurado?</label>
                    <select name="falecidoEraSegurado" value={formData.falecidoEraSegurado} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="aposentado">Sim - aposentado</option>
                      <option value="contribuinte">Sim - contribuinte</option>
                      <option value="periodo_graca">Sim - período de graça</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vínculo com falecido *</label>
                    <select name="vinculoFalecido" value={formData.vinculoFalecido} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="conjuge">Cônjuge</option>
                      <option value="companheiro">Companheiro</option>
                      <option value="filho_menor">Filho menor</option>
                      <option value="filho_invalido">Filho inválido</option>
                      <option value="pais">Pais</option>
                      <option value="irmao">Irmão</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Duração casamento/união</label>
                    <input type="text" name="duracaoUniao" value={formData.duracaoUniao} onChange={handleInputChange} className="input-primary" placeholder="X anos" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número de dependentes</label>
                    <input type="text" name="numeroDependentes" value={formData.numeroDependentes} onChange={handleInputChange} className="input-primary" placeholder="Número" />
                  </div>
                </>
              )}

              {formData.beneficioPleiteado === 'bpc_loas' && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de BPC/LOAS</h3>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Idade (se idoso)</label>
                    <input type="text" name="bpcIdade" value={formData.bpcIdade} onChange={handleInputChange} className="input-primary" placeholder="65+ anos" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">É pessoa com deficiência?</label>
                    <select name="bpcPcD" value={formData.bpcPcD} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de deficiência</label>
                    <select name="bpcTipoDeficiencia" value={formData.bpcTipoDeficiencia} onChange={handleInputChange} className="input-primary">
                      <option value="">Selecione</option>
                      <option value="fisica">Física</option>
                      <option value="mental">Mental</option>
                      <option value="intelectual">Intelectual</option>
                      <option value="sensorial">Sensorial</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição deficiência</label>
                    <textarea name="bpcDescricaoDeficiencia" value={formData.bpcDescricaoDeficiencia} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Descreva" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda familiar mensal *</label>
                    <input type="text" name="bpcRendaFamiliarMensal" value={formData.bpcRendaFamiliarMensal} onChange={handleInputChange} className="input-primary" placeholder="R$ 0.000,00" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Composição familiar *</label>
                    <textarea name="bpcComposicaoFamiliar" value={formData.bpcComposicaoFamiliar} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Nome, parentesco, renda" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número de membros *</label>
                    <input type="text" name="bpcNumeroMembros" value={formData.bpcNumeroMembros} onChange={handleInputChange} className="input-primary" placeholder="Número" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda per capita *</label>
                    <input type="text" name="bpcRendaPerCapita" value={bpcRendaPerCapitaCalculada} readOnly className="input-primary" placeholder="Calculada" />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Histórico Contributivo</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Categoria segurado *</label>
                <select name="categoriaSegurado" value={formData.categoriaSegurado} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="empregado">Empregado</option>
                  <option value="contribuinte_individual">Contribuinte individual</option>
                  <option value="facultativo">Facultativo</option>
                  <option value="segurado_especial">Segurado especial</option>
                  <option value="domestico">Doméstico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tempo total contribuição *</label>
                <input type="text" name="tempoTotalContribuicao" value={formData.tempoTotalContribuicao} onChange={handleInputChange} className="input-primary" placeholder="X anos, X meses" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Períodos de contribuição</label>
                <textarea name="periodosContribuicao" value={formData.periodosContribuicao} onChange={handleInputChange} rows={3} className="input-primary" placeholder="De/até, empresa, função" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Períodos não registrados CNIS?</label>
                <select name="periodosNaoRegistradosCnis" value={formData.periodosNaoRegistradosCnis} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quais períodos?</label>
                <textarea name="periodosNaoRegistradosDetalhes" value={formData.periodosNaoRegistradosDetalhes} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Se sim" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data última contribuição</label>
                <input type="text" name="dataUltimaContribuicao" value={formData.dataUltimaContribuicao} onChange={handleInputChange} className="input-primary" placeholder="dd/mm/aaaa" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tutela de Urgência</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer tutela de urgência? *</label>
                <select name="tutelaUrgencia" value={formData.tutelaUrgencia} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da urgência</label>
                <textarea name="motivoUrgencia" value={formData.motivoUrgencia} onChange={handleInputChange} rows={3} className="input-primary" placeholder="Se sim" />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outros Dados</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Justiça Gratuita? *</label>
                <select name="justicaGratuita" value={formData.justicaGratuita} onChange={handleInputChange} className="input-primary">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                <input type="text" name="lawyerName" value={formData.lawyerName} onChange={handleInputChange} className="input-primary" placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="lawyerOab" value={formData.lawyerOab} onChange={handleInputChange} className="input-primary" placeholder="OAB/UF 123456" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço</label>
                <input type="text" name="lawyerEndereco" value={formData.lawyerEndereco} onChange={handleInputChange} className="input-primary" placeholder="Endereço do escritório" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="text" name="lawyerEmail" value={formData.lawyerEmail} onChange={handleInputChange} className="input-primary" placeholder="advogado@email.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="lawyerTelefone" value={formData.lawyerTelefone} onChange={handleInputChange} className="input-primary" placeholder="(00) 00000-0000" />
              </div>
            </>
          )}
        </div>

        <div>
          {documentType !== 'replica' && documentType !== 'procuracao' && (
            <>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
                {documentType === 'contrato' ? 'Objeto do Contrato' : 'Descrição dos Fatos'} *
              </label>
              <textarea
                name={documentType === 'contrato' ? 'objetoContrato' : 'description'}
                value={documentType === 'contrato' ? (formData.objetoContrato || '') : formData.description}
                onChange={handleInputChange}
                rows={5}
                className="input-primary"
                placeholder={documentType === 'contrato' ? 'Descreva o objeto do contrato...' : 'Descreva os fatos relevantes...'}
              />
              {errors.description && <p className="text-red-700 text-xs mt-1">{errors.description}</p>}
            </>
          )}
        </div>

        {documentType === 'recurso' && (
          <>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
              {errors.decisaoImpugnada && <p className="text-red-700 text-xs mt-1">{errors.decisaoImpugnada}</p>}
            </div>
            </>
        )}

        {documentType !== 'procuracao' && documentType !== 'replica' && (
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
              {documentType === 'contrato' ? 'Cláusulas Adicionais' : 'Argumentos Jurídicos'}
            </label>
            <textarea
              name={documentType === 'contrato' ? 'clausulasAdicionais' : 'additionalInfo'}
              value={documentType === 'contrato' ? (formData.clausulasAdicionais || '') : formData.additionalInfo}
              onChange={handleInputChange}
              rows={6}
              className="input-primary"
              placeholder={documentType === 'contrato' ? 'Cláusulas específicas...' : 'Fundamentos jurídicos...'}
            />
          </div>
        )}

        {(['contrato','recurso','procuracao','recurso_inss'].includes(documentType)) && (
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 arquivos)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id={documentType === 'contrato' ? 'contrato-file-upload' : documentType === 'recurso' ? 'recurso-file-upload' : documentType === 'procuracao' ? 'procuracao-file-upload' : 'recurso-inss-file-upload'}
                multiple
                accept=".pdf"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const pdfs = files.filter(f => (f.type === 'application/pdf' || (f.name || '').toLowerCase().endsWith('.pdf')) && f.size <= 10 * 1024 * 1024);
                  const existing = (documentType === 'contrato' ? formData.contratoAttachments : documentType === 'recurso' ? formData.recursoAttachments : documentType === 'procuracao' ? formData.procuracaoAttachments : formData.recursoInssAttachments) || [];
                  const combined = [...existing, ...pdfs].slice(0, 10);
                  setFormData(prev => (
                    documentType === 'contrato'
                      ? { ...prev, contratoAttachments: combined }
                      : documentType === 'recurso'
                        ? { ...prev, recursoAttachments: combined }
                        : documentType === 'procuracao'
                          ? { ...prev, procuracaoAttachments: combined }
                          : { ...prev, recursoInssAttachments: combined }
                  ));
                }}
                className="hidden"
              />
              <label htmlFor={documentType === 'contrato' ? 'contrato-file-upload' : documentType === 'recurso' ? 'recurso-file-upload' : documentType === 'procuracao' ? 'procuracao-file-upload' : 'recurso-inss-file-upload'} className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
              </label>
            </div>

            {documentType === 'contrato' && formData.contratoAttachments && formData.contratoAttachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                {formData.contratoAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = (formData.contratoAttachments || []).filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, contratoAttachments: next }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {documentType === 'recurso' && formData.recursoAttachments && formData.recursoAttachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                {formData.recursoAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = (formData.recursoAttachments || []).filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, recursoAttachments: next }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {documentType === 'procuracao' && formData.procuracaoAttachments && formData.procuracaoAttachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                {formData.procuracaoAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = (formData.procuracaoAttachments || []).filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, procuracaoAttachments: next }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {documentType === 'recurso_inss' && formData.recursoInssAttachments && formData.recursoInssAttachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                {formData.recursoInssAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = (formData.recursoInssAttachments || []).filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, recursoInssAttachments: next }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {documentType === 'contestacao' && (
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 arquivos)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="contestacao-file-upload"
                multiple
                accept=".pdf"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const pdfs = files.filter(f => f.type === 'application/pdf');
                  const existing = formData.contestacaoAttachments || [];
                  const combined = [...existing, ...pdfs].slice(0, 10);
                  setFormData(prev => ({ ...prev, contestacaoAttachments: combined }));
                }}
                className="hidden"
              />
              <label htmlFor="contestacao-file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
              </label>
            </div>
            {formData.contestacaoAttachments && formData.contestacaoAttachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                {formData.contestacaoAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = (formData.contestacaoAttachments || []).filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, contestacaoAttachments: next }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          (documentType === 'replica' && replicaData) ||
          (documentType !== 'contestacao' && documentType !== 'recurso' && documentType !== 'procuracao' && documentType !== 'replica' && generatedDoc)
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
           (documentType === 'replica' && replicaData) ||
           (documentType === 'contrato' && contratoData) ||
           (documentType !== 'contestacao' && documentType !== 'recurso' && documentType !== 'procuracao' && documentType !== 'replica' && documentType !== 'contrato' && generatedDoc) ? (
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
              {documentType === 'contestacao' ? (
                editedContent || contestacaoData?.documento_gerado || 'Aguardando dados do Supabase...'
              ) : documentType === 'recurso' ? (
                editedContent || recursoData?.documento_gerado || 'Aguardando dados do Supabase...'
              ) : documentType === 'procuracao' ? (
                editedContent || procuracaoData?.documento_gerado || 'Aguardando dados do Supabase...'
              ) : documentType === 'replica' ? (
                editedContent || replicaData?.documento_gerado || 'Aguardando dados do Supabase...'
              ) : documentType === 'contrato' ? (
                editedContent || contratoData?.documento_gerado || 'Aguardando dados do Supabase...'
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
        (documentType === 'replica' && replicaData) ||
        (documentType === 'contrato' && contratoData) ||
        (documentType !== 'contestacao' && documentType !== 'recurso' && documentType !== 'procuracao' && documentType !== 'replica' && documentType !== 'contrato' && generatedDoc)
      );
      return (
        <div className="flex justify-between mt-6">
          <button onClick={prevStep} className="btn-secondary px-6 py-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Dados
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

      <StepIndicator steps={steps} currentStep={currentStep} />

      {currentStep === 0 && renderStep1()}
      {currentStep === 1 && renderStep2()}

      {currentStep === 0 && (
        <div className="w-full flex items-center justify-between pt-6">
          <button
            onClick={handleCancel}
            className="btn-secondary px-6 py-3"
          >
            Cancelar
          </button>

          <button
            onClick={handleGenerateWithIAClick}
            disabled={isLoadingNextStep}
            className="btn-primary px-6 py-3 flex items-center justify-center"
          >
            {isLoadingNextStep ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Gerar com IA
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentWizard;
