import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Wand2, Eye, Download, Upload, X, Search, Pencil } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { documentTypes } from '../data/mockData';
import { trtOptions, tribunalCompetenteOptions, estadoRegiaoOptions } from '../data/legalOptions';
import PeticaoInicialWizard from './PeticaoInicialWizard';
import PeticaoSimplesWizard from './PeticaoSimplesWizard';
import DocumentWizard from './DocumentWizard';
import PageHeader from './PageHeader';
import StepIndicator from './StepIndicator';
import { supabase } from '../supabaseClient';

interface DocumentFormData {
  type: string;
  title: string;
  clientName: string;
  clientCpf: string;
  opposingParty: string;
  caseValue: string;
  description: string;
  urgency: string;
  courtName?: string;
  processNumber?: string;
  contractType?: string;
  contractValue?: string;
  procurationType?: string;
  notificanteTipo?: 'fisica' | 'juridica';
  notificanteNomeRazao?: string;
  notificanteCpfCnpj?: string;
  notificanteEndereco?: string;
  notificadoTipo?: 'fisica' | 'juridica';
  notificadoNomeRazao?: string;
  notificadoCpfCnpj?: string;
  notificadoEndereco?: string;
  finalidade?: 'cobranca' | 'rescisao' | 'cessacao' | 'interpelacao' | 'outro' | '';
  descricaoFatos?: string;
  tipoDano?: 'danos_morais' | 'danos_materiais' | 'danos_morais_materiais' | '';
  tipoProblema?: string;
  dataFato?: string;
  providenciaExigida?: string;
  prazoCumprimento?: string;
  advogadoNome?: string;
  advogadoOab?: string;
  qualificacaoAdicional?: string;
  valorEnvolvido?: string;
  consequencias?: string;
  telefoneContato?: string;
  emailContato?: string;
  observacoes?: string;
  clienteTipo?: 'fisica' | 'juridica';
  clienteNomeRazao?: string;
  clienteCpfCnpj?: string;
  clienteRg?: string;
  clienteEndereco?: string;
  clienteEmail?: string;
  clienteTelefone?: string;
  contratadoTipo?: 'adv_pf' | 'sociedade';
  contratadoNomeRazao?: string;
  contratadoOab?: string;
  contratadoCpfCnpj?: string;
  escritorioEndereco?: string;
  objetoContrato?: string;
  areaDireito?: string;
  tipoHonorarios?: 'fixo' | 'exito' | 'misto' | 'hora' | '';
  valorHonorarios?: string;
  formaPagamento?: 'avista' | 'parcelado' | 'exito' | '';
  nacionalidade?: string;
  estadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel' | '';
  profissao?: string;
  representanteLegal?: string;
  quantidadeParcelas?: string;
  primeiroVencimento?: string;
  percentualExito?: string;
  valorHora?: string;
  parteContraria?: string;
  numeroProcesso?: string;
  incluiRecursos?: 'sim' | 'nao' | '';
  despesasPorContaDe?: 'cliente' | 'advogado' | 'inclusas' | '';
  banco?: string;
  agencia?: string;
  conta?: string;
  pix?: string;
  observacoesAdicionais?: string;
  modalidade?: 'com_reserva' | 'sem_reserva';
  substabelecenteNome?: string;
  substabelecenteOab?: string;
  substabelecenteEndereco?: string;
  substabelecidoNome?: string;
  substabelecidoOab?: string;
  substabelecidoEndereco?: string;
  outorganteNome?: string;
  cidadeUf?: string;
  poderesSubstabelecidos?: 'gerais' | 'especificos' | '';
  especificacaoPoderes?: string;
  reclamanteNome?: string;
  reclamanteCpf?: string;
  reclamanteRg?: string;
  reclamanteOrgaoExpedidor?: string;
  reclamanteEndereco?: string;
  reclamanteEmail?: string;
  reclamanteTelefone?: string;
  reclamadoTipo?: 'fisica' | 'juridica';
  reclamadoNomeRazao?: string;
  reclamadoCpfCnpj?: string;
  reclamadoEndereco?: string;
  dataAdmissao?: string;
  dataDemissao?: string;
  funcaoCargo?: string;
  ultimoSalario?: string;
  jornadaTrabalho?: string;
  registroCtps?: 'sim' | 'nao' | '';
  tipoDispensa?: 'sem_justa_causa' | 'com_justa_causa' | 'pedido_demissao' | 'rescisao_indireta' | '';
  narrativaFatos?: string;
  verbasPleiteadas?: string;
  detalhesHorasExtras?: string;
  detalhesDanoMoral?: string;
  valorDanoMoral?: string;
  agenteInsalubre?: string;
  agentePerigoso?: string;
  paradigmaEquiparacao?: string;
  formaPagamentoSalario?: 'deposito' | 'especie' | 'pix' | '';
  ctps?: string;
  pisPasep?: string;
  cidadeUfVara?: string;
  enderecoEscritorio?: string;
  emailAdvogado?: string;
  varaTrabalho?: string;
  resumoAlegacoesReclamante?: string;
  resumoPedidosReclamante?: string;
  versaoFatosReclamado?: string;
  tesesDefesa?: string;
  alegaInexistenciaVinculo?: 'sim' | 'nao' | '';
  dataAdmissaoContestacao?: string;
  dataDemissaoContestacao?: string;
  funcaoCargoContestacao?: string;
  salarioContestacao?: string;
  jornadaContratada?: string;
  tipoRescisaoContestacao?: 'pedido_demissao' | 'sem_justa_causa' | 'com_justa_causa' | '';
  verbasRescisoriasPagas?: 'sim' | 'nao' | 'parcialmente' | '';
  preliminaresArguidas?: string;
  fundamentosPreliminares?: string;
  emailReclamado?: string;
  empregadorTipo?: 'fisica' | 'juridica';
  empregadorNomeRazao?: string;
  empregadorCpfCnpj?: string;
  empregadorEndereco?: string;
  representanteCpf?: string;
  empregadoNome?: string;
  empregadoCpf?: string;
  empregadoRg?: string;
  empregadoCtps?: string;
  empregadoEndereco?: string;
  empregadoNacionalidade?: string;
  empregadoEstadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel' | '';
  empregadoProfissao?: string;
  valorAcordoTotal?: string;
  tipoQuitacao?: 'geral' | 'parcial' | 'com_reserva' | '';
  advogadoEmpregadorNome?: string;
  advogadoEmpregadorOab?: string;
  advogadoEmpregadoNome?: string;
  advogadoEmpregadoOab?: string;
  multaPorAtraso?: string;
  testemunhas?: string;
  verbasAcordo?: string;
  // Recurso Ordinário
  trtDestino?: string;
  tipoRecorrente?: 'reclamante' | 'reclamado' | '';
  recorrenteNome?: string;
  recorrenteCpfCnpj?: string;
  recorridoNome?: string;
  dataPublicacaoSentenca?: string;
  resumoSentenca?: string;
  pedidosDeferidos?: string;
  pedidosIndeferidos?: string;
  materiasRecorridas?: string;
  razoesReforma?: string;
  dataProtocoloRecurso?: string;
  valorCondenacao?: string;
  custasProcessuais?: string;
  depositoRecursal?: string;
  beneficioJusticaGratuita?: 'sim' | 'nao' | '';
  ehMPEEPP?: 'sim' | 'nao' | '';
  tesesRecursais?: string;
  jurisprudenciaCitar?: string;
  trechosDepoimentos?: string;
  houveCondenacao?: 'sim' | 'nao' | '';
  pacienteNome?: string;
  pacienteCpf?: string;
  pacienteRg?: string;
  pacienteEndereco?: string;
  estaPreso?: 'sim' | 'nao' | '';
  tipoPrisao?: 'flagrante' | 'preventiva' | 'temporaria' | 'condenacao' | '';
  dataPrisao?: string;
  crimeImputado?: string;
  autoridadeCoatora?: string;
  orgaoOrigem?: string;
  tribunalCompetente?: 'tj' | 'trf' | 'stj' | 'stf' | '';
  estadoRegiao?: string;
  tipoConstrangimento?: string;
  argumentosDefesa?: string;
  localPrisao?: string;
  haProcesso?: 'sim' | 'nao' | '';
  haDecisao?: 'sim' | 'nao' | '';
  dataDecisaoAtacada?: string;
  filhosMenores?: 'sim' | 'nao' | '';
  filhosMenoresQtdIdades?: string;
  temProblemasSaude?: 'sim' | 'nao' | '';
  problemasSaudeDetalhes?: string;
  varaCriminal?: string;
  tipoAcao?: 'publica' | 'privada' | '';
  autorNome?: string;
  acusadoNome?: string;
  acusadoCpf?: string;
  acusadoRg?: string;
  acusadoEndereco?: string;
  dataFatos?: string;
  resumoDenuncia?: string;
  versaoFatosDefesa?: string;
  tesesDefensivas?: string;
  dataCitacao?: string;
  dataProtocolo?: string;
  acusadoEmail?: string;
  requerAbsolvicaoSumaria?: 'sim' | 'nao' | '';
  fundamentoAbsolvicaoSumaria?: string;
  argumentosEspecificos?: string;
  provasAcusacao?: string;
  tipoPrisaoAtual?: 'flagrante_convertida_preventiva' | 'preventiva' | 'temporaria' | '';
  requerenteNome?: string;
  requerenteCpf?: string;
  requerenteRg?: string;
  requerenteEndereco?: string;
  tesesLiberdade?: string;
  circunstanciasPrisao?: string;
  fundamentosDecisao?: string;
  aceitaMedidasCautelares?: 'sim' | 'nao' | '';
  medidasSugeridas?: string;
  requerFianca?: 'sim' | 'nao' | '';
  valorFiancaSugerido?: string;
  condicoesPessoais?: string;
  provasDefesa?: string;
  resumoInterrogatorio?: string;
  tesesPrincipais?: string;
  pontosFavoraveisDefesa?: string;
  pontosDesfavoraveisDefesa?: string;
  desenvolvimentoTeses?: string;
  requerAnaliseDosimetria?: 'sim' | 'nao' | '';
  circunstanciasFavoraveis?: string;
  conjuge1Nome?: string;
  conjuge1Nacionalidade?: string;
  conjuge1Profissao?: string;
  conjuge1Rg?: string;
  conjuge1OrgaoExpedidor?: string;
  conjuge1Cpf?: string;
  conjuge1Endereco?: string;
  conjuge1Email?: string;
  conjuge2Nome?: string;
  conjuge2Nacionalidade?: string;
  conjuge2Profissao?: string;
  conjuge2Rg?: string;
  conjuge2OrgaoExpedidor?: string;
  conjuge2Cpf?: string;
  conjuge2Endereco?: string;
  conjuge2Email?: string;
  dataCasamento?: string;
  localCasamento?: string;
  regimeBens?: 'comunhao_parcial' | 'comunhao_universal' | 'separacao_total' | 'participacao_final' | '';
  varaFamilia?: string;
  tipoGuarda?: 'compartilhada' | 'unilateral' | '';
  guardiao?: 'conjuge1' | 'conjuge2' | '';
  residenciaFilhos?: string;
  regimeConvivencia?: string;
  quemPagaAlimentos?: 'autor' | 'reu' | 'conjuge1' | 'conjuge2' | 'ambos' | '';
  tipoValorAlimentos?: 'fixo' | 'percentual' | 'salarios_minimos' | '';
  valorAlimentos?: string;
  diaPagamento?: string;
  contaDeposito?: string;
  filhosLista?: string;
  haBensPartilha?: 'sim' | 'nao' | '';
  imoveisLista?: string;
  veiculosLista?: string;
  contasInvestimentosLista?: string;
  dividasLista?: string;
  outrosBens?: string;
  conjuge1AlterouNome?: 'sim' | 'nao' | '';
  conjuge1VoltarNome?: 'sim' | 'nao' | '';
  conjuge1NomeSolteiro?: string;
  conjuge2AlterouNome?: 'sim' | 'nao' | '';
  conjuge2VoltarNome?: 'sim' | 'nao' | '';
  conjuge2NomeSolteiro?: string;
  advogadoTelefone?: string;
  tipoAutor?: 'menor_representado' | 'maior_capaz' | 'incapaz_representado' | '';
  autorNome?: string;
  autorNascimento?: string;
  autorNacionalidade?: string;
  autorEndereco?: string;
  autorEmail?: string;
  autorTelefone?: string;
  repNome?: string;
  repParentesco?: 'mae' | 'pai' | 'tutor' | 'curador' | '';
  repNacionalidade?: string;
  repEstadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel' | '';
  repProfissao?: string;
  repRg?: string;
  repCpf?: string;
  repEndereco?: string;
  repEmail?: string;
  repTelefone?: string;
  reuNome?: string;
  parentescoComAutor?: 'pai' | 'mae' | 'avo' | 'avoa' | 'filho' | 'ex_conjuge' | '';
  reuNacionalidade?: string;
  reuEstadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel' | '';
  reuProfissao?: string;
  reuRg?: string;
  reuCpf?: string;
  reuEndereco?: string;
  reuEmail?: string;
  reuTelefone?: string;
  documentoParentesco?: 'certidao_nascimento' | 'certidao_casamento' | 'dna' | '';
  houveSeparacaoPais?: 'sim' | 'nao' | '';
  dataSeparacao?: string;
  reuPagaAtualmente?: 'nao' | 'sim' | 'irregularmente' | '';
  valorAtual?: string;
  despesasAlimentacao?: string;
  despesasMoradia?: string;
  despesasEducacao?: string;
  despesasSaude?: string;
  despesasVestuario?: string;
  despesasLazer?: string;
  outrasDespesas?: string;
  necessidadesDetalhamento?: string;
  situacaoProfissional?: 'empregado_clt' | 'autonomo' | 'empresario' | 'servidor' | 'desempregado' | '';
  localTrabalho?: string;
  cargoFuncao?: string;
  rendaEstimada?: string;
  outrosBensRendas?: string;
  temOutrosFilhos?: 'nao' | 'sim' | '';
  qtdOutrosFilhos?: string;
  informacoesAdicionais?: string;
  sitProfissionalRep?: 'empregado' | 'autonomo' | 'desempregado' | 'do_lar' | '';
  rendaMensalRep?: string;
  outrosFilhosRep?: 'nao' | 'sim' | '';
  qtdOutrosFilhosRep?: string;
  tipoValorPretendido?: 'percentual' | 'valor_fixo' | 'salarios_minimos' | '';
  alimentosProvisorios?: string;
  alimentosDefinitivos?: string;
  valorSubsidiario?: string;
  formaPagamentoAlimentos?: 'deposito_conta' | 'desconto_folha' | '';
  dadosBancarios?: string;
  requerJusticaGratuita?: 'sim' | 'nao' | '';
  deCujusNome?: string;
  deCujusNacionalidade?: string;
  deCujusEstadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel' | '';
  deCujusProfissao?: string;
  deCujusRg?: string;
  deCujusCpf?: string;
  deCujusDomicilio?: string;
  deCujusDataFalecimento?: string;
  deCujusLocalFalecimento?: string;
  deCujusCausaMorte?: string;
  deCujusMatriculaObito?: string;
  deCujusCartorio?: string;
  deCujusDeixouTestamento?: 'sim' | 'nao' | '';
  temConjuge?: 'sim' | 'nao' | '';
  conjugeNome?: string;
  tipoUniao?: 'casamento' | 'uniao_estavel' | '';
  regimeBensInventario?: 'comunhao_parcial' | 'comunhao_universal' | 'separacao_total' | 'participacao_final' | '';
  dataUniao?: string;
  qtdHerdeiros?: string;
  herdeirosLista?: string;
  inventarianteNome?: string;
  temImoveis?: 'sim' | 'nao' | '';
  imoveisDetalhes?: string;
  temVeiculos?: 'sim' | 'nao' | '';
  veiculosDetalhes?: string;
  temContas?: 'sim' | 'nao' | '';
  contasDetalhes?: string;
  temOutrosBens?: 'sim' | 'nao' | '';
  outrosBensDetalhes?: string;
  temDividas?: 'sim' | 'nao' | 'desconhecidas' | '';
  dividasDetalhes?: string;
  propostaPartilha?: string;
  renunciaHeranca?: 'sim' | 'nao' | '';
  cessaoDireitos?: 'sim' | 'nao' | '';
  varaCompetente?: string;
  comarca?: string;
  itensNegados?: string;
  motivosNegativa?: string;
  negativaData?: string;
  negativaProtocolo?: string;
  autorCpf?: string;
  autorRg?: string;
  planoSaudeNome?: string;
  planoSaudeCnpj?: string;
  planoSaudeRegistroAns?: string;
  planoSaudeCarteirinha?: string;
  planoSaudeTipoContratacao?: 'individual' | 'coletivo_empresarial' | 'coletivo_adesao' | '';
  medicoNome?: string;
  medicoCrm?: string;
  cid?: string;
  medicoPrescricao?: string;
  hospitalClinica?: string;
  urgencia?: 'sim' | 'nao' | '';
  varaCivel?: string;
  autorTipoPessoa?: 'fisica' | 'juridica' | '';
  reuTipoPessoa?: 'fisica' | 'juridica' | '';
  autorEstadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel' | '';
  autorProfissao?: string;
  autorRazaoSocial?: string;
  autorCnpj?: string;
  autorEnderecoSede?: string;
  autorRepresentanteLegal?: string;
  reuNome?: string;
  reuNacionalidade?: string;
  reuEstadoCivil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel' | '';
  reuProfissao?: string;
  reuRg?: string;
  reuCpf?: string;
  reuEndereco?: string;
  reuEmail?: string;
  reuTelefone?: string;
  reuRazaoSocial?: string;
  reuCnpj?: string;
  tipoRelacaoCobranca?: string;
  descricaoOrigemDivida?: string;
  dataContratacao?: string;
  objetoContrato?: string;
  valorOriginal?: string;
  dataVencimento?: string;
  formaPagamentoDivida?: string;
  houvePagamentoParcial?: 'sim' | 'nao' | '';
  valorPago?: string;
  saldoDevedorOriginal?: string;
  haContratoEscrito?: 'sim' | 'nao' | '';
  haNotaFiscalRecibo?: 'sim' | 'nao' | '';
  haNotaPromissoria?: 'sim' | 'nao' | '';
  haCheque?: 'sim' | 'nao' | '';
  haEmailsMensagens?: 'sim' | 'nao' | '';
  haConfissaoDivida?: 'sim' | 'nao' | '';
  outrasProvas?: string;
  houveTentativaAmigavel?: 'sim' | 'nao' | '';
  comoTentativa?: string;
  dataUltimaTentativa?: string;
  foiEnviadaNotificacao?: 'sim' | 'nao' | '';
  dataNotificacao?: string;
  houveRespostaDevedor?: 'sim' | 'nao' | '';
  respostaDevedor?: string;
  valorPrincipal?: string;
  dataInicialCalculo?: string;
  indiceCorrecao?: 'inpc' | 'igpm' | 'ipca' | 'tabela_tj' | 'conforme_contrato' | 'outro' | '';
  taxaJuros?: string;
  haMultaContratual?: 'sim' | 'nao' | '';
  percentualMulta?: string;
  haClausulaPenal?: 'sim' | 'nao' | '';
  valorPercentualClausulaPenal?: string;
  valorTotalAtualizado?: string;
  dataCalculo?: string;
  requerAudienciaConciliacao?: 'sim' | 'nao' | '';
  requerProvaTestemunhal?: 'sim' | 'nao' | '';
  tipoLocacao?: 'residencial' | 'nao_residencial' | 'temporada' | '';
  tipoContratoLocacao?: 'prazo_determinado' | 'prazo_indeterminado' | '';
  dataInicioLocacao?: string;
  dataTerminoLocacao?: string;
  prazoContratual?: string;
  motivoDespejo?: 'falta_pagamento' | 'infracao_contratual' | 'termino_prazo' | 'denuncia_vazia' | 'uso_proprio' | 'uso_ascendente_descendente' | 'demolicao_reforma' | 'sublocacao_nao_autorizada' | 'outro' | '';
  imovelEnderecoCompleto?: string;
  imovelTipo?: 'casa' | 'apartamento' | 'sala' | 'loja' | 'galpao' | 'outro' | '';
  imovelInscricaoIptu?: string;
  imovelMatricula?: string;
  valorAluguel?: string;
  diaVencimento?: string;
  indiceReajuste?: 'igpm' | 'ipca' | 'outro' | '';
  valorAtualAluguel?: string;
  tipoGarantia?: 'caucao' | 'fianca' | 'seguro_fianca' | 'nenhuma' | '';
  valorCaucao?: string;
  fiadorNome?: string;
  fiadorCpf?: string;
  fiadorEndereco?: string;
  haCondominio?: 'sim' | 'nao' | '';
  valorCondominio?: string;
  haIptu?: 'sim' | 'nao' | '';
  valorIptu?: string;
  outrosEncargos?: string;
  mesesEmAtraso?: string;
  valorTotalAlugueis?: string;
  condominiosEmAtraso?: string;
  iptuEmAtraso?: string;
  outrosEncargosEmAtraso?: string;
  multaMoratoriaPercentual?: string;
  jurosMoratoriosPercentualMes?: string;
  valorTotalDebito?: string;
  dataCalculoDebito?: string;
  qualInfracao?: string;
  clausulaViolada?: string;
  dataInfracao?: string;
  foiNotificado?: 'sim' | 'nao' | '';
  dataNotificacaoInfracao?: string;
  enviouNotificacaoPrevia?: 'sim' | 'nao' | '';
  tipoNotificacaoPrevia?: 'cartorio' | 'carta_ar' | 'email' | '';
  dataNotificacaoPrevia?: string;
  prazoConcedidoNotificacao?: string;
  houveRespostaNotificacao?: 'sim' | 'nao' | '';
  respostaNotificacaoDetalhe?: string;
  requerLiminarDespejo?: 'sim' | 'nao' | '';
  fundamentoArt59Inciso?: 'i' | 'ii' | 'iii' | 'iv' | 'v' | 'vi' | 'vii' | 'viii' | 'ix' | '';
  ofereceCaucao?: 'sim' | 'nao' | '';
  valorCaucaoLiminar?: string;
  requerCobranca?: 'sim' | 'nao' | '';
  requerMultaContratual?: 'sim' | 'nao' | '';
  valorMultaContratual?: string;
  requerDanosMorais?: 'sim' | 'nao' | '';
  valorDanosMorais?: string;
  descricaoDanosMorais?: string;
  incluirFiadorPoloPassivo?: 'sim' | 'nao' | '';
  requerAudienciaConciliacaoDespejo?: 'sim' | 'nao' | '';
  tipoTitulo?: 'cheque' | 'nota_promissoria' | 'duplicata' | 'contrato_duas_testemunhas' | 'confissao_divida' | 'cedula_credito_bancario' | 'contrato_locacao' | 'escritura_publica' | 'outro' | '';
  numeroTitulo?: string;
  dataEmissaoTitulo?: string;
  dataVencimentoTitulo?: string;
  valorNominalTitulo?: string;
  localEmissao?: string;
  localPagamento?: string;
  bancoSacado?: string;
  agenciaConta?: string;
  foiProtestado?: 'sim' | 'nao' | '';
  dataProtesto?: string;
  cartorioProtesto?: string;
  haAvalistaCoobrigado?: 'sim' | 'nao' | '';
  avalistaNome?: string;
  avalistaCpfCnpj?: string;
  avalistaEndereco?: string;
  incluirAvalistaPoloPassivo?: 'sim' | 'nao' | '';
  constituicaoMora?: 'protesto' | 'notificacao_extrajudicial' | 'vencimento' | '';
  dataConstituicao?: string;
  haHonorariosContratuais?: 'sim' | 'nao' | '';
  percentualHonorarios?: string;
  outrasDespesas?: string;
  conheceBensExecutado?: 'sim' | 'nao' | '';
  bensConhecidosTipos?: string;
  descricaoBens?: string;
  requerSisbaJud?: 'sim' | 'nao' | '';
  requerRenajud?: 'sim' | 'nao' | '';
  requerInfojud?: 'sim' | 'nao' | '';
  requerAverbacaoPremonitoria?: 'sim' | 'nao' | '';
  requerInclusaoCadastros?: 'sim' | 'nao' | '';
  beneficioPleiteado?: 'aposentadoria_idade' | 'aposentadoria_tempo' | 'aposentadoria_especial' | 'aposentadoria_invalidez' | 'auxilio_doenca' | 'auxilio_acidente' | 'pensao_morte' | 'salario_maternidade' | 'bpc_loas' | '';
  situacaoBeneficio?: 'concessao_negado' | 'restabelecimento_cessado' | 'revisao_valor_incorreto' | '';
  fezRequerimentoAdm?: 'sim' | 'nao' | '';
  dataDER?: string;
  nbNumero?: string;
  especie?: string;
  resultadoRequerimento?: 'indeferido' | 'cessado' | 'valor_incorreto' | '';
  dataDecisaoCessacao?: string;
  motivoNegativa?: string;
  possuiProcessoAdministrativo?: 'sim' | 'nao' | '';
  cid10Diagnostico?: string;
  doencaDescricao?: string;
  dataInicioIncapacidade?: string;
  tipoIncapacidade?: 'total_permanente' | 'total_temporaria' | 'parcial' | '';
  doencaOcupacional?: 'sim' | 'nao' | '';
  ultimaAtividade?: string;
  estaEmTratamento?: 'sim' | 'nao' | '';
  qualTratamento?: string;
  medicoCRM?: string;
  medicoEspecialidade?: string;
  peritoEspecialidadeDesejada?: string;
  falecidoNome?: string;
  falecidoDataObito?: string;
  falecidoCpf?: string;
  falecidoNit?: string;
  falecidoEraSegurado?: 'aposentado' | 'contribuinte' | 'periodo_graca' | '';
  vinculoFalecido?: 'conjuge' | 'companheiro' | 'filho_menor' | 'filho_invalido' | 'pais' | 'irmao' | '';
  duracaoUniao?: string;
  numeroDependentes?: string;
  bpcIdade?: string;
  bpcPcD?: 'sim' | 'nao' | '';
  bpcTipoDeficiencia?: 'fisica' | 'mental' | 'intelectual' | 'sensorial' | '';
  bpcDescricaoDeficiencia?: string;
  bpcRendaFamiliarMensal?: string;
  bpcComposicaoFamiliar?: string;
  bpcNumeroMembros?: string;
  bpcRendaPerCapita?: string;
  categoriaSegurado?: 'empregado' | 'contribuinte_individual' | 'facultativo' | 'segurado_especial' | 'domestico' | '';
  tempoTotalContribuicao?: string;
  periodosContribuicao?: string;
  periodosNaoRegistradosCnis?: 'sim' | 'nao' | '';
  periodosNaoRegistradosDetalhes?: string;
  dataUltimaContribuicao?: string;
  tutelaUrgencia?: 'sim' | 'nao' | '';
  motivoUrgencia?: string;
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
  const [selectedLabel, setSelectedLabel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Geral');
  const [isDocSearchFocused, setIsDocSearchFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [uploadError, setUploadError] = useState<string>('');
  const [generateError, setGenerateError] = useState<string>('');
  const [docxError, setDocxError] = useState<string>('');
  const [witnesses, setWitnesses] = useState<Array<{ nome: string; nacionalidade: string; estadoCivil: string; profissao: string; cpf: string; rg: string; endereco: string }>>([]);
  const [filhos, setFilhos] = useState<Array<{ nome: string; nascimento: string }>>([]);
  const [herdeiros, setHerdeiros] = useState<Array<{ nome: string; parentesco: string; nacionalidade: string; estadoCivil: string; profissao: string; rg: string; cpf: string; endereco: string; email: string; telefone: string; maiorCapaz: string }>>([]);
  const [imoveis, setImoveis] = useState<Array<{ descricao: string; matricula: string; destinacao: string }>>([]);
  const [veiculos, setVeiculos] = useState<Array<{ descricao: string; placa: string; destinacao: string }>>([]);
  const [contasInvestimentos, setContasInvestimentos] = useState<Array<{ descricao: string; divisao: string }>>([]);
  const [dividas, setDividas] = useState<Array<{ descricao: string; responsavel: string }>>([]);
  const docSteps = ['Dados do Documento', 'Revisão'];
  const [docCurrentStep, setDocCurrentStep] = useState(0);
  const wizardTypes = new Set(['peticao_simples','peticao','recurso_adm_inss','contestacao','recurso','contrato','procuracao','replica']);
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

  const initialFormData: DocumentFormData = {
    type: '',
    title: '',
    clientName: '',
    clientCpf: '',
    opposingParty: '',
    caseValue: '',
    description: '',
    urgency: 'Média'
  };

  const resetDocumentForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setUploadedFiles([]);
    setGeneratedDoc(null);
    setIsEditing(false);
    setEditedContent('');
    setIsGenerating(false);
    setUploadError('');
    setGenerateError('');
    setDocxError('');
    setVeiculos([]);
    setContasInvestimentos([]);
    setDividas([]);
    setDocCurrentStep(0);
  };

  useEffect(() => {
    resetDocumentForm();
  }, []);

  const idadeCalculada = useMemo(() => {
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
  }, [formData.autorNascimento]);

  const rendaPerCapitaCalculada = useMemo(() => {
    const rendaStr = formData.bpcRendaFamiliarMensal || '';
    const membrosStr = formData.bpcNumeroMembros || '';
    const n = parseInt(membrosStr, 10);
    if (!n || n <= 0) return '';
    const numeric = parseFloat(rendaStr.replace(/[^0-9,.]/g, '').replace(/\./g, '').replace(',', '.'));
    if (isNaN(numeric)) return '';
    const perCapita = numeric / n;
    return 'R$ ' + perCapita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [formData.bpcRendaFamiliarMensal, formData.bpcNumeroMembros]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.clientName.trim()) newErrors.clientName = 'Nome do cliente é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNotificacaoForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.notificanteTipo) newErrors.notificanteTipo = 'Tipo do notificante é obrigatório';
    if (!(formData.notificanteNomeRazao || '').trim()) newErrors.notificanteNomeRazao = 'Nome/Razão Social do notificante é obrigatório';
    if (!(formData.notificanteCpfCnpj || '').trim()) newErrors.notificanteCpfCnpj = 'CPF/CNPJ do notificante é obrigatório';
    if (!(formData.notificanteEndereco || '').trim()) newErrors.notificanteEndereco = 'Endereço do notificante é obrigatório';
    if (!formData.notificadoTipo) newErrors.notificadoTipo = 'Tipo do notificado é obrigatório';
    if (!(formData.notificadoNomeRazao || '').trim()) newErrors.notificadoNomeRazao = 'Nome/Razão Social do notificado é obrigatório';
    if (!(formData.notificadoCpfCnpj || '').trim()) newErrors.notificadoCpfCnpj = 'CPF/CNPJ do notificado é obrigatório';
    if (!(formData.notificadoEndereco || '').trim()) newErrors.notificadoEndereco = 'Endereço do notificado é obrigatório';
    if (!formData.finalidade || formData.finalidade === '') newErrors.finalidade = 'Finalidade é obrigatória';
    if (!(formData.descricaoFatos || '').trim()) newErrors.descricaoFatos = 'Descrição dos fatos é obrigatória';
    if (!(formData.providenciaExigida || '').trim()) newErrors.providenciaExigida = 'Providência exigida é obrigatória';
    if (!(formData.prazoCumprimento || '').trim()) newErrors.prazoCumprimento = 'Prazo para cumprimento é obrigatório';
    if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';
    if (formData.finalidade === 'cobranca' && !(formData.valorEnvolvido || '').trim()) newErrors.valorEnvolvido = 'Informe o valor envolvido para cobrança';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContratoHonorariosForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clienteTipo) newErrors.clienteTipo = 'Tipo de cliente é obrigatório';
    if (!(formData.clienteNomeRazao || '').trim()) newErrors.clienteNomeRazao = 'Nome/Razão Social do cliente é obrigatório';
    if (!(formData.clienteCpfCnpj || '').trim()) newErrors.clienteCpfCnpj = 'CPF/CNPJ do cliente é obrigatório';
    if (!(formData.clienteEndereco || '').trim()) newErrors.clienteEndereco = 'Endereço do cliente é obrigatório';
    if (!(formData.clienteEmail || '').trim()) newErrors.clienteEmail = 'E-mail do cliente é obrigatório';
    if (!(formData.clienteTelefone || '').trim()) newErrors.clienteTelefone = 'Telefone do cliente é obrigatório';
    if (!formData.contratadoTipo) newErrors.contratadoTipo = 'Tipo de contratado é obrigatório';
    if (!(formData.contratadoNomeRazao || '').trim()) newErrors.contratadoNomeRazao = 'Nome do advogado/escritório é obrigatório';
    if (!(formData.contratadoOab || '').trim()) newErrors.contratadoOab = 'OAB é obrigatória';
    if (!(formData.contratadoCpfCnpj || '').trim()) newErrors.contratadoCpfCnpj = 'CPF/CNPJ do advogado/escritório é obrigatório';
    if (!(formData.escritorioEndereco || '').trim()) newErrors.escritorioEndereco = 'Endereço do escritório é obrigatório';
    if (!(formData.objetoContrato || '').trim()) newErrors.objetoContrato = 'Objeto do contrato é obrigatório';
    if (!formData.areaDireito) newErrors.areaDireito = 'Área do direito é obrigatória';
    if (!formData.tipoHonorarios) newErrors.tipoHonorarios = 'Tipo de honorários é obrigatório';
    if (!(formData.valorHonorarios || '').trim()) newErrors.valorHonorarios = 'Valor dos honorários é obrigatório';
    if (!formData.formaPagamento) newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
    if (formData.formaPagamento === 'parcelado') {
      if (!(formData.quantidadeParcelas || '').trim()) newErrors.quantidadeParcelas = 'Quantidade de parcelas é obrigatória';
      if (!(formData.primeiroVencimento || '').trim()) newErrors.primeiroVencimento = 'Data do primeiro vencimento é obrigatória';
    }
    if (formData.tipoHonorarios === 'exito' || formData.tipoHonorarios === 'misto') {
      if (!(formData.percentualExito || '').trim()) newErrors.percentualExito = 'Percentual de êxito é obrigatório';
    }
    if (formData.tipoHonorarios === 'hora') {
      if (!(formData.valorHora || '').trim()) newErrors.valorHora = 'Valor por hora é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSubstabelecimentoForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.modalidade) newErrors.modalidade = 'Modalidade é obrigatória';
    if (!(formData.substabelecenteNome || '').trim()) newErrors.substabelecenteNome = 'Nome do substabelecente é obrigatório';
    if (!(formData.substabelecenteOab || '').trim()) newErrors.substabelecenteOab = 'OAB do substabelecente é obrigatória';
    if (!(formData.substabelecenteEndereco || '').trim()) newErrors.substabelecenteEndereco = 'Endereço do substabelecente é obrigatório';
    if (!(formData.substabelecidoNome || '').trim()) newErrors.substabelecidoNome = 'Nome do substabelecido é obrigatório';
    if (!(formData.substabelecidoOab || '').trim()) newErrors.substabelecidoOab = 'OAB do substabelecido é obrigatória';
    if (!(formData.substabelecidoEndereco || '').trim()) newErrors.substabelecidoEndereco = 'Endereço do substabelecido é obrigatório';
    if (!(formData.outorganteNome || '').trim()) newErrors.outorganteNome = 'Nome do outorgante é obrigatório';
    if (!(formData.cidadeUf || '').trim()) newErrors.cidadeUf = 'Cidade/UF é obrigatória';
    if (!formData.poderesSubstabelecidos) newErrors.poderesSubstabelecidos = 'Selecione os poderes';
    if (formData.poderesSubstabelecidos === 'especificos' && !(formData.especificacaoPoderes || '').trim()) newErrors.especificacaoPoderes = 'Descreva os poderes específicos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReclamacaoTrabalhistaForm = () => {
    const newErrors: Record<string, string> = {};
    if (!(formData.reclamanteNome || '').trim()) newErrors.reclamanteNome = 'Nome do reclamante é obrigatório';
    if (!(formData.reclamanteCpf || '').trim()) newErrors.reclamanteCpf = 'CPF do reclamante é obrigatório';
    if (!(formData.reclamanteRg || '').trim()) newErrors.reclamanteRg = 'RG do reclamante é obrigatório';
    if (!(formData.reclamanteOrgaoExpedidor || '').trim()) newErrors.reclamanteOrgaoExpedidor = 'Órgão expedidor é obrigatório';
    if (!(formData.reclamanteEndereco || '').trim()) newErrors.reclamanteEndereco = 'Endereço do reclamante é obrigatório';
    if (!(formData.reclamanteEmail || '').trim()) newErrors.reclamanteEmail = 'E-mail do reclamante é obrigatório';
    if (!(formData.reclamanteTelefone || '').trim()) newErrors.reclamanteTelefone = 'Telefone do reclamante é obrigatório';
    if (!formData.reclamadoTipo) newErrors.reclamadoTipo = 'Tipo de reclamado é obrigatório';
    if (!(formData.reclamadoNomeRazao || '').trim()) newErrors.reclamadoNomeRazao = 'Nome/Razão do reclamado é obrigatório';
    if (!(formData.reclamadoCpfCnpj || '').trim()) newErrors.reclamadoCpfCnpj = 'CPF/CNPJ do reclamado é obrigatório';
    if (!(formData.reclamadoEndereco || '').trim()) newErrors.reclamadoEndereco = 'Endereço do reclamado é obrigatório';
    if (!(formData.dataAdmissao || '').trim()) newErrors.dataAdmissao = 'Data de admissão é obrigatória';
    if (!(formData.dataDemissao || '').trim()) newErrors.dataDemissao = 'Data de demissão é obrigatória';
    if (!(formData.funcaoCargo || '').trim()) newErrors.funcaoCargo = 'Função/Cargo é obrigatório';
    if (!(formData.ultimoSalario || '').trim()) newErrors.ultimoSalario = 'Último salário é obrigatório';
    if (!(formData.jornadaTrabalho || '').trim()) newErrors.jornadaTrabalho = 'Jornada de trabalho é obrigatória';
    if (!formData.registroCtps) newErrors.registroCtps = 'Informe se há registro em CTPS';
  if (!formData.tipoDispensa) newErrors.tipoDispensa = 'Tipo de dispensa é obrigatório';
  if (!(formData.narrativaFatos || '').trim()) newErrors.narrativaFatos = 'Narrativa dos fatos é obrigatória';
  if (!((formData.verbasPleiteadas || '').trim())) newErrors.verbasPleiteadas = 'Descreva as verbas pleiteadas';
  if (!(formData.caseValue || '').trim()) newErrors.caseValue = 'Valor da causa é obrigatório';
  if (!(formData.cidadeUfVara || '').trim()) newErrors.cidadeUfVara = 'Cidade/UF da vara é obrigatória';
  if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
  if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';

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


  useEffect(() => {
    if (formData.formaPagamento !== 'parcelado') {
      setErrors(prev => {
        const rest: Record<string, string> = { ...prev };
        delete rest.quantidadeParcelas;
        delete rest.primeiroVencimento;
        return rest;
      });
    }
  }, [formData.formaPagamento]);

  useEffect(() => {
    const fetchIndenizatoriaReviewContent = async () => {
      try {
        const hasContent = (editedContent && editedContent.trim().length > 0) || (generatedDoc?.content && generatedDoc.content.trim().length > 0);
        if (hasContent) return;
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_indenizadora_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        if (!finalContent) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryData, error: retryError } = await supabase
            .from('acao_indenizadora_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryError && retryData && retryData.length > 0) {
            finalContent = retryData[0].documento_gerado || '';
          }
        }
        if (finalContent) {
          setGeneratedDoc(prev => ({
            id: prev?.id || Date.now(),
            type: formData.type,
            title: formData.title,
            content: finalContent,
            createdAt: prev?.createdAt || new Date().toISOString(),
            status: prev?.status || 'Gerado'
          }));
          setEditedContent(finalContent);
        }
      } catch {
        // silencioso na revisão
      }
    };
    if (selectedType === 'acao_indenizatoria' && docCurrentStep === 1) {
      fetchIndenizatoriaReviewContent();
    }
  }, [selectedType, docCurrentStep]);
  
  // Removido efeito anterior de busca para Concessão de Benefício; agora a busca ocorre dentro do generateDocument com delay de 60s.
  
  useEffect(() => {
    const fetchExecucaoTituloReviewContent = async () => {
      try {
        const hasContent = (editedContent && editedContent.trim().length > 0) || (generatedDoc?.content && generatedDoc.content.trim().length > 0);
        if (hasContent) return;
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('execucao_de_titulo_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        if (!finalContent) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryData, error: retryError } = await supabase
            .from('execucao_de_titulo_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryError && retryData && retryData.length > 0) {
            finalContent = retryData[0].documento_gerado || '';
          }
        }
        if (finalContent) {
          setGeneratedDoc(prev => ({
            id: prev?.id || Date.now(),
            type: formData.type,
            title: formData.title,
            content: finalContent,
            createdAt: prev?.createdAt || new Date().toISOString(),
            status: prev?.status || 'Gerado'
          }));
          setEditedContent(finalContent);
        }
      } catch {
        void 0;
      }
    };
    if (selectedType === 'execucao_titulo' && docCurrentStep === 1) {
      fetchExecucaoTituloReviewContent();
    }
  }, [selectedType, docCurrentStep]);
  
  useEffect(() => {
    const fetchPlanoSaudeReviewContent = async () => {
      try {
        const hasContent = (editedContent && editedContent.trim().length > 0) || (generatedDoc?.content && generatedDoc.content.trim().length > 0);
        if (hasContent) return;
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_contra_plano_de_saude_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        if (!finalContent) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryData, error: retryError } = await supabase
            .from('acao_contra_plano_de_saude_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryError && retryData && retryData.length > 0) {
            finalContent = retryData[0].documento_gerado || '';
          }
        }
        if (finalContent) {
          setGeneratedDoc(prev => ({
            id: prev?.id || Date.now(),
            type: formData.type,
            title: formData.title,
            content: finalContent,
            createdAt: prev?.createdAt || new Date().toISOString(),
            status: prev?.status || 'Gerado'
          }));
          setEditedContent(finalContent);
        }
      } catch {
        void 0;
      }
    };
    if (selectedType === 'acao_plano_saude' && docCurrentStep === 1) {
      fetchPlanoSaudeReviewContent();
    }
  }, [selectedType, docCurrentStep]);
  
  useEffect(() => {
    const fetchCobrancaReviewContent = async () => {
      try {
        const hasContent = (editedContent && editedContent.trim().length > 0) || (generatedDoc?.content && generatedDoc.content.trim().length > 0);
        if (hasContent) return;
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_de_cobranca_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        if (!finalContent) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryData, error: retryError } = await supabase
            .from('acao_de_cobranca_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryError && retryData && retryData.length > 0) {
            finalContent = retryData[0].documento_gerado || '';
          }
        }
        if (finalContent) {
          setGeneratedDoc(prev => ({
            id: prev?.id || Date.now(),
            type: formData.type,
            title: formData.title,
            content: finalContent,
            createdAt: prev?.createdAt || new Date().toISOString(),
            status: prev?.status || 'Gerado'
          }));
          setEditedContent(finalContent);
        }
      } catch {
        void 0;
      }
    };
    if (selectedType === 'acao_cobranca' && docCurrentStep === 1) {
      fetchCobrancaReviewContent();
    }
  }, [selectedType, docCurrentStep]);
  
  useEffect(() => {
    const fetchDespejoReviewContent = async () => {
      try {
        const hasContent = (editedContent && editedContent.trim().length > 0) || (generatedDoc?.content && generatedDoc.content.trim().length > 0);
        if (hasContent) return;
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_de_despejo_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        if (!finalContent) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryData, error: retryError } = await supabase
            .from('acao_de_despejo_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryError && retryData && retryData.length > 0) {
            finalContent = retryData[0].documento_gerado || '';
          }
        }
        if (finalContent) {
          setGeneratedDoc(prev => ({
            id: prev?.id || Date.now(),
            type: formData.type,
            title: formData.title,
            content: finalContent,
            createdAt: prev?.createdAt || new Date().toISOString(),
            status: prev?.status || 'Gerado'
          }));
          setEditedContent(finalContent);
        }
      } catch {
        void 0;
      }
    };
    if (selectedType === 'acao_despejo' && docCurrentStep === 1) {
      fetchDespejoReviewContent();
    }
  }, [selectedType, docCurrentStep]);
  

  const newTypeIds = new Set([
    // GERAL
    'notificacao_extrajudicial', 'contrato_honorarios', 'substabelecimento',
    // TRABALHISTA
    'reclamacao_trabalhista', 'contestacao_trabalhista', 'acordo_extrajudicial_trabalhista', 'recurso_ordinario_trabalhista',
    // CRIMINAL
    'habeas_corpus', 'resposta_acusacao', 'liberdade_provisoria', 'alegacoes_finais',
    // FAMILIA
    'divorcio_consensual', 'acao_alimentos', 'acao_guarda',
    // CONSUMIDOR
    'acao_indenizatoria', 'acao_plano_saude',
    // CIVEL
    'acao_cobranca', 'acao_despejo', 'execucao_titulo',
    // PREVIDENCIARIO
    'concessao_beneficio', 'recurso_adm_inss',
  ]);

  const handleTypeChange = (type: string, label?: string) => {
    setSelectedType(type);
    setSelectedLabel(label || documentTypes.find(t => t.id === type)?.name || type);
    setFormData(prev => ({ ...prev, type }));
    setDocCurrentStep(0);
    setGeneratedDoc(null);
    setEditedContent('');
  };

  
  

  
  
  
  
  

  const validateContestacaoTrabalhistaForm = () => {
    const newErrors: Record<string, string> = {};
    if (!(formData.numeroProcesso || '').trim()) newErrors.numeroProcesso = 'Número do processo é obrigatório';
    if (!(formData.varaTrabalho || '').trim()) newErrors.varaTrabalho = 'Vara do trabalho é obrigatória';
    if (!(formData.reclamanteNome || '').trim()) newErrors.reclamanteNome = 'Nome do reclamante é obrigatório';
    if (!formData.reclamadoTipo) newErrors.reclamadoTipo = 'Tipo de reclamado é obrigatório';
    if (!(formData.reclamadoNomeRazao || '').trim()) newErrors.reclamadoNomeRazao = 'Nome/Razão do reclamado é obrigatório';
    if (!(formData.reclamadoCpfCnpj || '').trim()) newErrors.reclamadoCpfCnpj = 'CPF/CNPJ é obrigatório';
    if (!(formData.reclamadoEndereco || '').trim()) newErrors.reclamadoEndereco = 'Endereço do reclamado é obrigatório';
    if (!(formData.resumoAlegacoesReclamante || '').trim()) newErrors.resumoAlegacoesReclamante = 'Resumo das alegações é obrigatório';
    if (!(formData.resumoPedidosReclamante || '').trim()) newErrors.resumoPedidosReclamante = 'Resumo dos pedidos é obrigatório';
    if (!(formData.versaoFatosReclamado || '').trim()) newErrors.versaoFatosReclamado = 'Versão dos fatos é obrigatória';
    const t = (formData.tesesDefesa || '').trim();
    if (!t) newErrors.tesesDefesa = 'Descreva as teses de defesa';
    if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';
    if (formData.alegaInexistenciaVinculo === 'sim') {
      if (!(formData.dataAdmissaoContestacao || '').trim()) newErrors.dataAdmissaoContestacao = 'Data de admissão é obrigatória';
      if (!(formData.dataDemissaoContestacao || '').trim()) newErrors.dataDemissaoContestacao = 'Data de demissão é obrigatória';
      if (!(formData.funcaoCargoContestacao || '').trim()) newErrors.funcaoCargoContestacao = 'Função/Cargo é obrigatório';
      if (!(formData.salarioContestacao || '').trim()) newErrors.salarioContestacao = 'Salário é obrigatório';
      if (!(formData.jornadaContratada || '').trim()) newErrors.jornadaContratada = 'Jornada contratada é obrigatória';
      if (!formData.tipoRescisaoContestacao) newErrors.tipoRescisaoContestacao = 'Tipo de rescisão é obrigatório';
      if (!formData.verbasRescisoriasPagas) newErrors.verbasRescisoriasPagas = 'Informe se as verbas rescisórias foram pagas';
    }
    const p = (formData.preliminaresArguidas || '').trim();
    if (p && !(formData.fundamentosPreliminares || '').trim()) newErrors.fundamentosPreliminares = 'Fundamentação das preliminares é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcordoExtrajudicialForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.empregadorTipo) newErrors.empregadorTipo = 'Tipo de empregador é obrigatório';
    if (!(formData.empregadorNomeRazao || '').trim()) newErrors.empregadorNomeRazao = 'Razão Social/Nome do empregador é obrigatório';
    if (!(formData.empregadorCpfCnpj || '').trim()) newErrors.empregadorCpfCnpj = 'CPF/CNPJ do empregador é obrigatório';
    if (!(formData.empregadorEndereco || '').trim()) newErrors.empregadorEndereco = 'Endereço do empregador é obrigatório';
    if (!(formData.representanteLegal || '').trim()) newErrors.representanteLegal = 'Representante legal é obrigatório';
    if (!(formData.representanteCpf || '').trim()) newErrors.representanteCpf = 'CPF do representante é obrigatório';
    if (!(formData.empregadoNome || '').trim()) newErrors.empregadoNome = 'Nome do empregado é obrigatório';
    if (!(formData.empregadoCpf || '').trim()) newErrors.empregadoCpf = 'CPF do empregado é obrigatório';
    if (!(formData.empregadoRg || '').trim()) newErrors.empregadoRg = 'RG do empregado é obrigatório';
    if (!(formData.empregadoCtps || '').trim()) newErrors.empregadoCtps = 'CTPS do empregado é obrigatória';
    if (!(formData.empregadoEndereco || '').trim()) newErrors.empregadoEndereco = 'Endereço do empregado é obrigatório';
    if (!(formData.dataAdmissao || '').trim()) newErrors.dataAdmissao = 'Data de admissão é obrigatória';
    if (!(formData.dataDemissao || '').trim()) newErrors.dataDemissao = 'Data de demissão é obrigatória';
    if (!(formData.funcaoCargo || '').trim()) newErrors.funcaoCargo = 'Função/Cargo é obrigatório';
    if (!(formData.ultimoSalario || '').trim()) newErrors.ultimoSalario = 'Último salário é obrigatório';
    if (!formData.tipoDispensa) newErrors.tipoDispensa = 'Motivo da rescisão é obrigatório';
    if (!(formData.valorAcordoTotal || '').trim()) newErrors.valorAcordoTotal = 'Valor total do acordo é obrigatório';
    if (!formData.formaPagamento) newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
    if (!formData.tipoQuitacao) newErrors.tipoQuitacao = 'Tipo de quitação é obrigatório';
    if (!(formData.advogadoEmpregadorNome || '').trim()) newErrors.advogadoEmpregadorNome = 'Advogado do empregador é obrigatório';
    if (!(formData.advogadoEmpregadorOab || '').trim()) newErrors.advogadoEmpregadorOab = 'OAB do empregador é obrigatória';
    if (!(formData.advogadoEmpregadoNome || '').trim()) newErrors.advogadoEmpregadoNome = 'Advogado do empregado é obrigatório';
    if (!(formData.advogadoEmpregadoOab || '').trim()) newErrors.advogadoEmpregadoOab = 'OAB do empregado é obrigatória';
    if (!(formData.varaTrabalho || '').trim()) newErrors.varaTrabalho = 'Vara do trabalho é obrigatória';
    if (!(formData.cidadeUfVara || '').trim()) newErrors.cidadeUfVara = 'Cidade/UF é obrigatória';
    if (formData.formaPagamento === 'parcelado') {
      if (!(formData.quantidadeParcelas || '').trim()) newErrors.quantidadeParcelas = 'Quantidade de parcelas é obrigatória';
      if (!(formData.primeiroVencimento || '').trim()) newErrors.primeiroVencimento = 'Data do primeiro pagamento é obrigatória';
      if (!(formData.multaPorAtraso || '').trim()) newErrors.multaPorAtraso = 'Multa por atraso é obrigatória';
      if (!((formData.banco || '').trim())) newErrors.banco = 'Banco é obrigatório';
      if (!((formData.agencia || '').trim())) newErrors.agencia = 'Agência é obrigatória';
      if (!((formData.conta || '').trim())) newErrors.conta = 'Conta é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRecursoOrdinarioForm = () => {
    const newErrors: Record<string, string> = {};
    if (!(formData.numeroProcesso || '').trim()) newErrors.numeroProcesso = 'Número do processo é obrigatório';
    if (!(formData.varaTrabalho || '').trim()) newErrors.varaTrabalho = 'Vara do trabalho de origem é obrigatória';
    if (!(formData.trtDestino || '').trim()) newErrors.trtDestino = 'TRT de destino é obrigatório';
    if (!(formData.cidadeUf || '').trim()) newErrors.cidadeUf = 'Cidade/UF é obrigatória';
    if (!formData.tipoRecorrente) newErrors.tipoRecorrente = 'Tipo de recorrente é obrigatório';
    if (!(formData.recorrenteNome || '').trim()) newErrors.recorrenteNome = 'Nome do recorrente é obrigatório';
    if (!(formData.recorrenteCpfCnpj || '').trim()) newErrors.recorrenteCpfCnpj = 'CPF/CNPJ do recorrente é obrigatório';
    if (!(formData.recorridoNome || '').trim()) newErrors.recorridoNome = 'Nome do recorrido é obrigatório';
    if (!(formData.dataPublicacaoSentenca || '').trim()) newErrors.dataPublicacaoSentenca = 'Data da publicação é obrigatória';
    if (!(formData.resumoSentenca || '').trim()) newErrors.resumoSentenca = 'Resumo da sentença é obrigatório';
    if (!(formData.pedidosDeferidos || '').trim()) newErrors.pedidosDeferidos = 'Informe os pedidos deferidos';
    if (!(formData.pedidosIndeferidos || '').trim()) newErrors.pedidosIndeferidos = 'Informe os pedidos indeferidos';
    if (!((formData.materiasRecorridas || '').trim())) newErrors.materiasRecorridas = 'Selecione ao menos uma matéria recorrida';
    if (!(formData.razoesReforma || '').trim()) newErrors.razoesReforma = 'Razões da reforma são obrigatórias';
    if (!(formData.dataProtocoloRecurso || '').trim()) newErrors.dataProtocoloRecurso = 'Data do protocolo é obrigatória';
    if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateHabeasCorpusForm = () => {
    const newErrors: Record<string, string> = {};
    if (!(formData.pacienteNome || '').trim()) newErrors.pacienteNome = 'Nome do paciente é obrigatório';
    if (!(formData.pacienteCpf || '').trim()) newErrors.pacienteCpf = 'CPF é obrigatório';
    if (!(formData.pacienteRg || '').trim()) newErrors.pacienteRg = 'RG é obrigatório';
    if (!(formData.pacienteEndereco || '').trim()) newErrors.pacienteEndereco = 'Endereço do paciente é obrigatório';
    if (!formData.estaPreso) newErrors.estaPreso = 'Informe se está preso';
    if (!formData.tipoPrisao) newErrors.tipoPrisao = 'Tipo de prisão é obrigatório';
    if (!(formData.dataPrisao || '').trim()) newErrors.dataPrisao = 'Data da prisão é obrigatória';
    if (!(formData.crimeImputado || '').trim()) newErrors.crimeImputado = 'Crime imputado é obrigatório';
    if (!(formData.autoridadeCoatora || '').trim()) newErrors.autoridadeCoatora = 'Autoridade coatora é obrigatória';
    if (!(formData.orgaoOrigem || '').trim()) newErrors.orgaoOrigem = 'Órgão/Juízo de origem é obrigatório';
    if (!formData.tribunalCompetente) newErrors.tribunalCompetente = 'Tribunal competente é obrigatório';
    if (!((formData.estadoRegiao || '').trim())) newErrors.estadoRegiao = 'Estado/Região é obrigatório';
    if (!((formData.tipoConstrangimento || '').trim())) newErrors.tipoConstrangimento = 'Selecione ao menos uma tese';
    if (!(formData.narrativaFatos || '').trim()) newErrors.narrativaFatos = 'Narrativa dos fatos é obrigatória';
    if (!(formData.argumentosDefesa || '').trim()) newErrors.argumentosDefesa = 'Argumentos da defesa são obrigatórios';
    if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';
    if (formData.haProcesso === 'sim') {
      if (!((formData.numeroProcesso || '').trim())) newErrors.numeroProcesso = 'Número do processo é obrigatório';
    }
    if (formData.haDecisao === 'sim') {
      if (!((formData.dataDecisaoAtacada || '').trim())) newErrors.dataDecisaoAtacada = 'Data da decisão é obrigatória';
    }
    if (formData.filhosMenores === 'sim') {
      if (!((formData.filhosMenoresQtdIdades || '').trim())) newErrors.filhosMenoresQtdIdades = 'Informe a quantidade/idades';
    }
    if (formData.temProblemasSaude === 'sim') {
      if (!((formData.problemasSaudeDetalhes || '').trim())) newErrors.problemasSaudeDetalhes = 'Detalhe os problemas de saúde';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRespostaAcusacaoForm = () => {
    const newErrors: Record<string, string> = {};
    if (!(formData.numeroProcesso || '').trim()) newErrors.numeroProcesso = 'Número do processo é obrigatório';
    if (!(formData.varaCriminal || '').trim()) newErrors.varaCriminal = 'Vara criminal é obrigatória';
    if (!formData.tipoAcao) newErrors.tipoAcao = 'Tipo de ação é obrigatório';
    if (!(formData.autorNome || '').trim()) newErrors.autorNome = 'Nome do autor é obrigatório';
    if (!(formData.acusadoNome || '').trim()) newErrors.acusadoNome = 'Nome do acusado é obrigatório';
    if (!(formData.acusadoCpf || '').trim()) newErrors.acusadoCpf = 'CPF é obrigatório';
    if (!(formData.acusadoRg || '').trim()) newErrors.acusadoRg = 'RG é obrigatório';
    if (!(formData.acusadoEndereco || '').trim()) newErrors.acusadoEndereco = 'Endereço do acusado é obrigatório';
    if (!(formData.crimeImputado || '').trim()) newErrors.crimeImputado = 'Crime imputado é obrigatório';
    if (!(formData.dataFatos || '').trim()) newErrors.dataFatos = 'Data dos fatos é obrigatória';
    if (!(formData.resumoDenuncia || '').trim()) newErrors.resumoDenuncia = 'Resumo da denúncia/queixa é obrigatório';
    if (!(formData.versaoFatosDefesa || '').trim()) newErrors.versaoFatosDefesa = 'Versão dos fatos (defesa) é obrigatória';
    if (!((formData.tesesDefensivas || '').trim())) newErrors.tesesDefensivas = 'Informe ao menos uma tese defensiva';
    if (!(formData.dataCitacao || '').trim()) newErrors.dataCitacao = 'Data da citação é obrigatória';
    if (!(formData.dataProtocolo || '').trim()) newErrors.dataProtocolo = 'Data do protocolo é obrigatória';
    if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';
    const p = (formData.preliminaresArguidas || '').trim();
    if (p && !(formData.fundamentosPreliminares || '').trim()) newErrors.fundamentosPreliminares = 'Fundamentação das preliminares é obrigatória';
    if (formData.requerAbsolvicaoSumaria === 'sim') {
      if (!((formData.fundamentoAbsolvicaoSumaria || '').trim())) newErrors.fundamentoAbsolvicaoSumaria = 'Fundamento da absolvição é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLiberdadeProvisoriaForm = () => {
    const newErrors: Record<string, string> = {};
    if (!(formData.numeroProcesso || '').trim()) newErrors.numeroProcesso = 'Número do processo é obrigatório';
    if (!(formData.varaCriminal || '').trim()) newErrors.varaCriminal = 'Vara criminal é obrigatória';
    if (!formData.tipoPrisaoAtual) newErrors.tipoPrisaoAtual = 'Tipo de prisão atual é obrigatório';
    if (!(formData.dataPrisao || '').trim()) newErrors.dataPrisao = 'Data da prisão é obrigatória';
    if (!(formData.crimeImputado || '').trim()) newErrors.crimeImputado = 'Crime imputado é obrigatório';
    if (!(formData.requerenteNome || '').trim()) newErrors.requerenteNome = 'Nome do requerente é obrigatório';
    if (!(formData.requerenteCpf || '').trim()) newErrors.requerenteCpf = 'CPF é obrigatório';
    if (!(formData.requerenteRg || '').trim()) newErrors.requerenteRg = 'RG é obrigatório';
    if (!(formData.requerenteEndereco || '').trim()) newErrors.requerenteEndereco = 'Endereço do requerente é obrigatório';
    if (!(formData.localPrisao || '').trim()) newErrors.localPrisao = 'Local da prisão é obrigatório';
    if (!(formData.narrativaFatos || '').trim()) newErrors.narrativaFatos = 'Narrativa dos fatos é obrigatória';
    if (!((formData.tesesLiberdade || '').trim())) newErrors.tesesLiberdade = 'Informe ao menos uma tese para liberdade';
    if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';
    if (formData.filhosMenores === 'sim') {
      if (!((formData.filhosMenoresQtdIdades || '').trim())) newErrors.filhosMenoresQtdIdades = 'Informe filhos e idades';
    }
    if (formData.temProblemasSaude === 'sim') {
      if (!((formData.problemasSaudeDetalhes || '').trim())) newErrors.problemasSaudeDetalhes = 'Descreva o problema de saúde';
    }
    if (formData.aceitaMedidasCautelares === 'sim') {
      if (!((formData.medidasSugeridas || '').trim())) newErrors.medidasSugeridas = 'Informe as medidas sugeridas';
    }
    if (formData.requerFianca === 'sim') {
      if (!((formData.valorFiancaSugerido || '').trim())) newErrors.valorFiancaSugerido = 'Informe o valor da fiança sugerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAlegacoesFinaisForm = () => {
    const newErrors: Record<string, string> = {};
    if (!(formData.numeroProcesso || '').trim()) newErrors.numeroProcesso = 'Número do processo é obrigatório';
    if (!(formData.varaCriminal || '').trim()) newErrors.varaCriminal = 'Vara criminal é obrigatória';
    if (!formData.tipoAcao) newErrors.tipoAcao = 'Tipo de ação é obrigatório';
    if (!(formData.crimeImputado || '').trim()) newErrors.crimeImputado = 'Crime imputado é obrigatório';
    if (!(formData.acusadoNome || '').trim()) newErrors.acusadoNome = 'Nome do acusado é obrigatório';
    if (!(formData.resumoDenuncia || '').trim()) newErrors.resumoDenuncia = 'Resumo da denúncia/queixa é obrigatório';
    if (!(formData.dataFatos || '').trim()) newErrors.dataFatos = 'Data dos fatos é obrigatória';
    if (!((formData.provasAcusacao || '').trim())) newErrors.provasAcusacao = 'Descreva as provas da acusação';
    if (!((formData.provasDefesa || '').trim())) newErrors.provasDefesa = 'Descreva as provas da defesa';
    if (!((formData.resumoInterrogatorio || '').trim())) newErrors.resumoInterrogatorio = 'Resumo do interrogatório é obrigatório';
    if (!((formData.tesesPrincipais || '').trim())) newErrors.tesesPrincipais = 'Selecione ao menos uma tese principal';
    if (!(formData.advogadoNome || '').trim()) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!(formData.advogadoOab || '').trim()) newErrors.advogadoOab = 'OAB é obrigatória';
    if (formData.requerAnaliseDosimetria === 'sim') {
      if (!((formData.circunstanciasFavoraveis || '').trim())) newErrors.circunstanciasFavoraveis = 'Descreva as circunstâncias favoráveis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDivorcioConsensualForm = () => {
    const newErrors: Record<string, string> = {};
    if (!((formData.conjuge1Nome || '').trim())) newErrors.conjuge1Nome = 'Nome do cônjuge 1 é obrigatório';
    if (!((formData.conjuge1Nacionalidade || '').trim())) newErrors.conjuge1Nacionalidade = 'Nacionalidade do cônjuge 1 é obrigatória';
    if (!((formData.conjuge1Profissao || '').trim())) newErrors.conjuge1Profissao = 'Profissão do cônjuge 1 é obrigatória';
    if (!((formData.conjuge1Rg || '').trim())) newErrors.conjuge1Rg = 'RG do cônjuge 1 é obrigatório';
    if (!((formData.conjuge1OrgaoExpedidor || '').trim())) newErrors.conjuge1OrgaoExpedidor = 'Órgão expedidor do cônjuge 1 é obrigatório';
    if (!((formData.conjuge1Cpf || '').trim())) newErrors.conjuge1Cpf = 'CPF do cônjuge 1 é obrigatório';
    if (!((formData.conjuge1Endereco || '').trim())) newErrors.conjuge1Endereco = 'Endereço do cônjuge 1 é obrigatório';
    if (!((formData.conjuge1Email || '').trim())) newErrors.conjuge1Email = 'E-mail do cônjuge 1 é obrigatório';

    if (!((formData.conjuge2Nome || '').trim())) newErrors.conjuge2Nome = 'Nome do cônjuge 2 é obrigatório';
    if (!((formData.conjuge2Nacionalidade || '').trim())) newErrors.conjuge2Nacionalidade = 'Nacionalidade do cônjuge 2 é obrigatória';
    if (!((formData.conjuge2Profissao || '').trim())) newErrors.conjuge2Profissao = 'Profissão do cônjuge 2 é obrigatória';
    if (!((formData.conjuge2Rg || '').trim())) newErrors.conjuge2Rg = 'RG do cônjuge 2 é obrigatório';
    if (!((formData.conjuge2OrgaoExpedidor || '').trim())) newErrors.conjuge2OrgaoExpedidor = 'Órgão expedidor do cônjuge 2 é obrigatório';
    if (!((formData.conjuge2Cpf || '').trim())) newErrors.conjuge2Cpf = 'CPF do cônjuge 2 é obrigatório';
    if (!((formData.conjuge2Endereco || '').trim())) newErrors.conjuge2Endereco = 'Endereço do cônjuge 2 é obrigatório';
    if (!((formData.conjuge2Email || '').trim())) newErrors.conjuge2Email = 'E-mail do cônjuge 2 é obrigatório';

    if (!((formData.dataCasamento || '').trim())) newErrors.dataCasamento = 'Data do casamento é obrigatória';
    if (!((formData.localCasamento || '').trim())) newErrors.localCasamento = 'Local do casamento é obrigatório';
    if (!formData.regimeBens) newErrors.regimeBens = 'Regime de bens é obrigatório';
    if (!((formData.varaFamilia || '').trim())) newErrors.varaFamilia = 'Vara de família é obrigatória';

    if (formData.filhosMenores === 'sim') {
      if (!formData.tipoGuarda) newErrors.tipoGuarda = 'Tipo de guarda é obrigatório';
      if (formData.tipoGuarda === 'unilateral' && !formData.guardiao) newErrors.guardiao = 'Defina o guardião';
      if (!((formData.residenciaFilhos || '').trim())) newErrors.residenciaFilhos = 'Residência dos filhos é obrigatória';
      if (!((formData.regimeConvivencia || '').trim())) newErrors.regimeConvivencia = 'Regime de convivência é obrigatório';
      if (!formData.quemPagaAlimentos) newErrors.quemPagaAlimentos = 'Quem paga alimentos é obrigatório';
      if (!formData.tipoValorAlimentos) newErrors.tipoValorAlimentos = 'Tipo de valor é obrigatório';
      if (!((formData.valorAlimentos || '').trim())) newErrors.valorAlimentos = 'Valor dos alimentos é obrigatório';
      if (!((formData.diaPagamento || '').trim())) newErrors.diaPagamento = 'Dia do pagamento é obrigatório';
    }

    if (formData.conjuge1AlterouNome === 'sim' && formData.conjuge1VoltarNome === 'sim') {
      if (!((formData.conjuge1NomeSolteiro || '').trim())) newErrors.conjuge1NomeSolteiro = 'Informe o nome de solteiro(a) do cônjuge 1';
    }
    if (formData.conjuge2AlterouNome === 'sim' && formData.conjuge2VoltarNome === 'sim') {
      if (!((formData.conjuge2NomeSolteiro || '').trim())) newErrors.conjuge2NomeSolteiro = 'Informe o nome de solteiro(a) do cônjuge 2';
    }

    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcaoAlimentosForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tipoAutor) newErrors.tipoAutor = 'Tipo de autor é obrigatório';
    if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do autor é obrigatório';
    if (!((formData.autorNascimento || '').trim())) newErrors.autorNascimento = 'Data de nascimento é obrigatória';
    if (!((formData.autorNacionalidade || '').trim())) newErrors.autorNacionalidade = 'Nacionalidade é obrigatória';
    if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço é obrigatório';
    if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail é obrigatório';
    if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone é obrigatório';

    if (formData.tipoAutor === 'menor_representado' || formData.tipoAutor === 'incapaz_representado') {
      if (!((formData.repNome || '').trim())) newErrors.repNome = 'Nome do representante é obrigatório';
      if (!formData.repParentesco) newErrors.repParentesco = 'Parentesco é obrigatório';
      if (!((formData.repNacionalidade || '').trim())) newErrors.repNacionalidade = 'Nacionalidade do representante é obrigatória';
      if (!formData.repEstadoCivil) newErrors.repEstadoCivil = 'Estado civil do representante é obrigatório';
      if (!((formData.repProfissao || '').trim())) newErrors.repProfissao = 'Profissão do representante é obrigatória';
      if (!((formData.repRg || '').trim())) newErrors.repRg = 'RG do representante é obrigatório';
      if (!((formData.repCpf || '').trim())) newErrors.repCpf = 'CPF do representante é obrigatório';
      if (!((formData.repEndereco || '').trim())) newErrors.repEndereco = 'Endereço do representante é obrigatório';
      if (!((formData.repEmail || '').trim())) newErrors.repEmail = 'E-mail do representante é obrigatório';
      if (!((formData.repTelefone || '').trim())) newErrors.repTelefone = 'Telefone do representante é obrigatório';
    }

    if (!((formData.reuNome || '').trim())) newErrors.reuNome = 'Nome do réu é obrigatório';
    if (!formData.parentescoComAutor) newErrors.parentescoComAutor = 'Parentesco com o autor é obrigatório';
    if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';

    if (!formData.documentoParentesco) newErrors.documentoParentesco = 'Documento que comprova parentesco é obrigatório';
    if (formData.reuPagaAtualmente === 'sim' && !((formData.valorAtual || '').trim())) newErrors.valorAtual = 'Informe o valor atual pago';

    if (!((formData.necessidadesDetalhamento || '').trim())) newErrors.necessidadesDetalhamento = 'Detalhamento das necessidades é obrigatório';
    if (!formData.situacaoProfissional) newErrors.situacaoProfissional = 'Situação profissional do réu é obrigatória';
    if (formData.temOutrosFilhos === 'sim' && !((formData.qtdOutrosFilhos || '').trim())) newErrors.qtdOutrosFilhos = 'Informe a quantidade de outros filhos';

    if (!formData.tipoValorPretendido) newErrors.tipoValorPretendido = 'Tipo de valor é obrigatório';
    if (!((formData.alimentosProvisorios || '').trim())) newErrors.alimentosProvisorios = 'Alimentos provisórios são obrigatórios';
    if (!((formData.alimentosDefinitivos || '').trim())) newErrors.alimentosDefinitivos = 'Alimentos definitivos são obrigatórios';
    if (!formData.formaPagamentoAlimentos) newErrors.formaPagamentoAlimentos = 'Forma de pagamento é obrigatória';
    if (formData.formaPagamentoAlimentos === 'deposito_conta' && !((formData.dadosBancarios || '').trim())) newErrors.dadosBancarios = 'Dados bancários são obrigatórios';

    if (!formData.requerJusticaGratuita) newErrors.requerJusticaGratuita = 'Informe justiça gratuita';
    if (!((formData.varaFamilia || '').trim())) newErrors.varaFamilia = 'Vara de família é obrigatória';
    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcaoGuardaForm = () => {
    const newErrors: Record<string, string> = {};
    if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do autor é obrigatório';
    if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço do autor é obrigatório';
    if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail do autor é obrigatório';
    if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone do autor é obrigatório';

    if (!((formData.reuNome || '').trim())) newErrors.reuNome = 'Nome do réu é obrigatório';
    if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';

    if (!((formData.varaFamilia || '').trim())) newErrors.varaFamilia = 'Vara de família é obrigatória';

    if (!((formData.filhosLista || '').trim())) newErrors.filhosLista = 'Informe ao menos um filho';

    if (!formData.tipoGuarda) newErrors.tipoGuarda = 'Tipo de guarda é obrigatório';
    if (formData.tipoGuarda === 'unilateral' && !formData.guardiao) newErrors.guardiao = 'Defina o guardião';
    if (!((formData.residenciaFilhos || '').trim())) newErrors.residenciaFilhos = 'Residência dos filhos é obrigatória';
    if (!((formData.regimeConvivencia || '').trim())) newErrors.regimeConvivencia = 'Regime de convivência é obrigatório';

    if (!formData.quemPagaAlimentos) newErrors.quemPagaAlimentos = 'Quem paga alimentos é obrigatório';
    if (!formData.tipoValorAlimentos) newErrors.tipoValorAlimentos = 'Tipo de valor é obrigatório';
    if (!((formData.valorAlimentos || '').trim())) newErrors.valorAlimentos = 'Valor dos alimentos é obrigatório';
    if (!((formData.diaPagamento || '').trim())) newErrors.diaPagamento = 'Dia do pagamento é obrigatório';

    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcaoInventarioForm = () => {
    const newErrors: Record<string, string> = {};
    if (!((formData.deCujusNome || '').trim())) newErrors.deCujusNome = 'Nome do falecido é obrigatório';
    if (!((formData.deCujusNacionalidade || '').trim())) newErrors.deCujusNacionalidade = 'Nacionalidade é obrigatória';
    if (!formData.deCujusEstadoCivil) newErrors.deCujusEstadoCivil = 'Estado civil é obrigatório';
    if (!((formData.deCujusRg || '').trim())) newErrors.deCujusRg = 'RG é obrigatório';
    if (!((formData.deCujusCpf || '').trim())) newErrors.deCujusCpf = 'CPF é obrigatório';
    if (!((formData.deCujusDomicilio || '').trim())) newErrors.deCujusDomicilio = 'Último domicílio é obrigatório';
    if (!((formData.deCujusDataFalecimento || '').trim())) newErrors.deCujusDataFalecimento = 'Data do falecimento é obrigatória';
    if (!((formData.deCujusMatriculaObito || '').trim())) newErrors.deCujusMatriculaObito = 'Matrícula da certidão é obrigatória';
    if (!((formData.deCujusCartorio || '').trim())) newErrors.deCujusCartorio = 'Cartório é obrigatório';
    if (!formData.deCujusDeixouTestamento) newErrors.deCujusDeixouTestamento = 'Informe testamento';

    if (!formData.temConjuge) newErrors.temConjuge = 'Informe cônjuge sobrevivente';
    if (formData.temConjuge === 'sim') {
      if (!((formData.conjugeNome || '').trim())) newErrors.conjugeNome = 'Nome do cônjuge é obrigatório';
      if (!formData.tipoUniao) newErrors.tipoUniao = 'Tipo de união é obrigatório';
      if (!formData.regimeBensInventario) newErrors.regimeBensInventario = 'Regime de bens é obrigatório';
      if (!((formData.dataUniao || '').trim())) newErrors.dataUniao = 'Data é obrigatória';
    }

    if ((herdeiros || []).length === 0 && !((formData.herdeirosLista || '').trim())) newErrors.herdeirosLista = 'Informe os herdeiros';

    if (!((formData.inventarianteNome || '').trim())) newErrors.inventarianteNome = 'Inventariante é obrigatório';

    if (!formData.temImoveis) newErrors.temImoveis = 'Informe imóveis';
    if (formData.temImoveis === 'sim' && !((formData.imoveisDetalhes || '').trim())) newErrors.imoveisDetalhes = 'Detalhe os imóveis';

    if (!formData.temVeiculos) newErrors.temVeiculos = 'Informe veículos';
    if (formData.temVeiculos === 'sim' && !((formData.veiculosDetalhes || '').trim())) newErrors.veiculosDetalhes = 'Detalhe os veículos';

    if (!formData.temContas) newErrors.temContas = 'Informe valores em conta';
    if (formData.temContas === 'sim' && !((formData.contasDetalhes || '').trim())) newErrors.contasDetalhes = 'Detalhe as contas';

    if (!formData.temOutrosBens) newErrors.temOutrosBens = 'Informe outros bens';
    if (formData.temOutrosBens === 'sim' && !((formData.outrosBensDetalhes || '').trim())) newErrors.outrosBensDetalhes = 'Detalhe outros bens';

    if (!formData.temDividas) newErrors.temDividas = 'Informe dívidas';
    if (formData.temDividas === 'sim' && !((formData.dividasDetalhes || '').trim())) newErrors.dividasDetalhes = 'Detalhe as dívidas';

    if (!((formData.propostaPartilha || '').trim())) newErrors.propostaPartilha = 'Proposta de partilha é obrigatória';
    if (!formData.requerJusticaGratuita) newErrors.requerJusticaGratuita = 'Informe justiça gratuita';
    if (!((formData.varaCompetente || '').trim())) newErrors.varaCompetente = 'Vara competente é obrigatória';
    if (!((formData.comarca || '').trim())) newErrors.comarca = 'Comarca é obrigatória';

    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcaoPlanoSaudeForm = () => {
    const newErrors: Record<string, string> = {};
    if (!((formData.itensNegados || '').trim())) newErrors.itensNegados = 'Selecione o que foi negado';
    if (!((formData.motivosNegativa || '').trim())) newErrors.motivosNegativa = 'Selecione o motivo da negativa';
    if (!((formData.negativaData || '').trim())) newErrors.negativaData = 'Data da negativa é obrigatória';

    if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do autor é obrigatório';
    if (!((formData.autorCpf || '').trim())) newErrors.autorCpf = 'CPF do autor é obrigatório';
    if (!((formData.autorRg || '').trim())) newErrors.autorRg = 'RG do autor é obrigatório';
    if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço do autor é obrigatório';
    if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail do autor é obrigatório';
    if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone do autor é obrigatório';

    if (!((formData.planoSaudeNome || '').trim())) newErrors.planoSaudeNome = 'Nome do plano é obrigatório';
    if (!((formData.planoSaudeCnpj || '').trim())) newErrors.planoSaudeCnpj = 'CNPJ do plano é obrigatório';
    if (!((formData.planoSaudeRegistroAns || '').trim())) newErrors.planoSaudeRegistroAns = 'Registro ANS é obrigatório';
    if (!((formData.planoSaudeCarteirinha || '').trim())) newErrors.planoSaudeCarteirinha = 'Nº da carteirinha é obrigatório';
    if (!formData.planoSaudeTipoContratacao) newErrors.planoSaudeTipoContratacao = 'Tipo de contratação é obrigatório';

    if (!((formData.varaCivel || '').trim())) newErrors.varaCivel = 'Vara é obrigatória';
    if (!((formData.comarca || '').trim())) newErrors.comarca = 'Comarca é obrigatória';
    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcaoIndenizatoriaForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tipoDano) newErrors.tipoDano = 'Tipo de dano é obrigatório';
    if (!((formData.tipoProblema || '').trim())) newErrors.tipoProblema = 'Descreva os problemas enfrentados';
    if (!((formData.dataFato || '').trim())) newErrors.dataFato = 'Data do fato é obrigatória';
    if (!((formData.descricaoFatos || '').trim())) newErrors.descricaoFatos = 'Narrativa dos fatos é obrigatória';
    if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do autor é obrigatório';
    if (!((formData.autorCpf || '').trim())) newErrors.autorCpf = 'CPF do autor é obrigatório';
    if (!((formData.autorRg || '').trim())) newErrors.autorRg = 'RG do autor é obrigatório';
    if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço do autor é obrigatório';
    if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail do autor é obrigatório';
    if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone do autor é obrigatório';
    if (!formData.reuTipoPessoa) newErrors.reuTipoPessoa = 'Tipo de réu é obrigatório';
    if (formData.reuTipoPessoa === 'fisica') {
      if (!((formData.reuNome || '').trim())) newErrors.reuNome = 'Nome do réu é obrigatório';
      if (!((formData.reuCpf || '').trim())) newErrors.reuCpf = 'CPF do réu é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';
    } else if (formData.reuTipoPessoa === 'juridica') {
      if (!((formData.reuRazaoSocial || '').trim())) newErrors.reuRazaoSocial = 'Razão social do réu é obrigatória';
      if (!((formData.reuCnpj || '').trim())) newErrors.reuCnpj = 'CNPJ do réu é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateAcaoCobrancaForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.autorTipoPessoa) newErrors.autorTipoPessoa = 'Tipo de Autor é obrigatório';
    if (!formData.reuTipoPessoa) newErrors.reuTipoPessoa = 'Tipo de Réu é obrigatório';

    if (formData.autorTipoPessoa === 'fisica') {
      if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do autor é obrigatório';
      if (!((formData.autorNacionalidade || '').trim())) newErrors.autorNacionalidade = 'Nacionalidade é obrigatória';
      if (!formData.autorEstadoCivil) newErrors.autorEstadoCivil = 'Estado civil é obrigatório';
      if (!((formData.autorProfissao || '').trim())) newErrors.autorProfissao = 'Profissão é obrigatória';
      if (!((formData.autorRg || '').trim())) newErrors.autorRg = 'RG é obrigatório';
      if (!((formData.autorCpf || '').trim())) newErrors.autorCpf = 'CPF é obrigatório';
      if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço é obrigatório';
      if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail é obrigatório';
      if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone é obrigatório';
    } else if (formData.autorTipoPessoa === 'juridica') {
      if (!((formData.autorRazaoSocial || '').trim())) newErrors.autorRazaoSocial = 'Razão Social é obrigatória';
      if (!((formData.autorCnpj || '').trim())) newErrors.autorCnpj = 'CNPJ é obrigatório';
      if (!((formData.autorEnderecoSede || '').trim())) newErrors.autorEnderecoSede = 'Endereço da sede é obrigatório';
      if (!((formData.autorRepresentanteLegal || '').trim())) newErrors.autorRepresentanteLegal = 'Representante legal é obrigatório';
      if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail é obrigatório';
      if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone é obrigatório';
    }

    if (formData.reuTipoPessoa === 'fisica') {
      if (!((formData.reuNome || '').trim())) newErrors.reuNome = 'Nome do réu é obrigatório';
      if (!((formData.reuCpf || '').trim())) newErrors.reuCpf = 'CPF do réu é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';
    } else if (formData.reuTipoPessoa === 'juridica') {
      if (!((formData.reuRazaoSocial || '').trim())) newErrors.reuRazaoSocial = 'Razão Social do réu é obrigatória';
      if (!((formData.reuCnpj || '').trim())) newErrors.reuCnpj = 'CNPJ do réu é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';
    }

    if (!formData.tipoRelacaoCobranca) newErrors.tipoRelacaoCobranca = 'Tipo de relação é obrigatório';
    if (!((formData.descricaoOrigemDivida || '').trim())) newErrors.descricaoOrigemDivida = 'Descrição da origem é obrigatória';
    if (!((formData.dataContratacao || '').trim())) newErrors.dataContratacao = 'Data da contratação é obrigatória';
    if (!((formData.objetoContrato || '').trim())) newErrors.objetoContrato = 'Objeto do contrato é obrigatório';
    if (!((formData.valorOriginal || '').trim())) newErrors.valorOriginal = 'Valor original é obrigatório';
    if (!((formData.dataVencimento || '').trim())) newErrors.dataVencimento = 'Data de vencimento é obrigatória';
    if (!((formData.saldoDevedorOriginal || '').trim())) newErrors.saldoDevedorOriginal = 'Saldo devedor original é obrigatório';
    if (formData.houvePagamentoParcial === 'sim' && !((formData.valorPago || '').trim())) newErrors.valorPago = 'Informe o valor já pago';

    if (!((formData.valorPrincipal || '').trim())) newErrors.valorPrincipal = 'Valor principal é obrigatório';
    if (!((formData.dataInicialCalculo || '').trim())) newErrors.dataInicialCalculo = 'Data inicial é obrigatória';
    if (!formData.indiceCorrecao) newErrors.indiceCorrecao = 'Índice de correção é obrigatório';
    if (!((formData.taxaJuros || '').trim())) newErrors.taxaJuros = 'Taxa de juros é obrigatória';
    if (formData.haMultaContratual === 'sim' && !((formData.percentualMulta || '').trim())) newErrors.percentualMulta = 'Percentual da multa é obrigatório';
    if (formData.haClausulaPenal === 'sim' && !((formData.valorPercentualClausulaPenal || '').trim())) newErrors.valorPercentualClausulaPenal = 'Valor/percentual da cláusula penal é obrigatório';
    if (!((formData.valorTotalAtualizado || '').trim())) newErrors.valorTotalAtualizado = 'Valor total atualizado é obrigatório';
    if (!((formData.dataCalculo || '').trim())) newErrors.dataCalculo = 'Data do cálculo é obrigatória';

    if (!formData.requerJusticaGratuita) newErrors.requerJusticaGratuita = 'Informe se requer justiça gratuita';
    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAcaoDespejoForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tipoLocacao) newErrors.tipoLocacao = 'Tipo de locação é obrigatório';
    if (!formData.tipoContratoLocacao) newErrors.tipoContratoLocacao = 'Tipo de contrato é obrigatório';
    if (!((formData.dataInicioLocacao || '').trim())) newErrors.dataInicioLocacao = 'Data de início é obrigatória';
    if (formData.tipoContratoLocacao === 'prazo_determinado') {
      if (!((formData.dataTerminoLocacao || '').trim())) newErrors.dataTerminoLocacao = 'Data de término é obrigatória';
      if (!((formData.prazoContratual || '').trim())) newErrors.prazoContratual = 'Prazo contratual é obrigatório';
    }

    if (!formData.motivoDespejo) newErrors.motivoDespejo = 'Motivo do despejo é obrigatório';

    if (!formData.autorTipoPessoa) newErrors.autorTipoPessoa = 'Tipo de Autor é obrigatório';
    if (formData.autorTipoPessoa === 'fisica') {
      if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do autor é obrigatório';
      if (!((formData.autorCpf || '').trim())) newErrors.autorCpf = 'CPF do autor é obrigatório';
      if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço do autor é obrigatório';
      if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail do autor é obrigatório';
      if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone do autor é obrigatório';
    } else if (formData.autorTipoPessoa === 'juridica') {
      if (!((formData.autorRazaoSocial || '').trim())) newErrors.autorRazaoSocial = 'Razão Social é obrigatória';
      if (!((formData.autorCnpj || '').trim())) newErrors.autorCnpj = 'CNPJ é obrigatório';
      if (!((formData.autorEnderecoSede || '').trim())) newErrors.autorEnderecoSede = 'Endereço da sede é obrigatório';
      if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail é obrigatório';
      if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone é obrigatório';
    }

    if (!formData.reuTipoPessoa) newErrors.reuTipoPessoa = 'Tipo de Réu é obrigatório';
    if (formData.reuTipoPessoa === 'fisica') {
      if (!((formData.reuNome || '').trim())) newErrors.reuNome = 'Nome do réu é obrigatório';
      if (!((formData.reuCpf || '').trim())) newErrors.reuCpf = 'CPF do réu é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';
    } else if (formData.reuTipoPessoa === 'juridica') {
      if (!((formData.reuRazaoSocial || '').trim())) newErrors.reuRazaoSocial = 'Razão Social do réu é obrigatória';
      if (!((formData.reuCnpj || '').trim())) newErrors.reuCnpj = 'CNPJ do réu é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do réu é obrigatório';
    }

    if (!((formData.imovelEnderecoCompleto || '').trim())) newErrors.imovelEnderecoCompleto = 'Endereço do imóvel é obrigatório';
    if (!formData.imovelTipo) newErrors.imovelTipo = 'Tipo de imóvel é obrigatório';

    if (!((formData.valorAluguel || '').trim())) newErrors.valorAluguel = 'Valor do aluguel é obrigatório';
    if (!((formData.diaVencimento || '').trim())) newErrors.diaVencimento = 'Dia do vencimento é obrigatório';
    if (!formData.indiceReajuste) newErrors.indiceReajuste = 'Índice de reajuste é obrigatório';

    if (formData.tipoGarantia === 'caucao' && !((formData.valorCaucao || '').trim())) newErrors.valorCaucao = 'Valor da caução é obrigatório';
    if (formData.tipoGarantia === 'fianca') {
      if (!((formData.fiadorNome || '').trim())) newErrors.fiadorNome = 'Nome do fiador é obrigatório';
      if (!((formData.fiadorCpf || '').trim())) newErrors.fiadorCpf = 'CPF do fiador é obrigatório';
      if (!((formData.fiadorEndereco || '').trim())) newErrors.fiadorEndereco = 'Endereço do fiador é obrigatório';
    }
    if (formData.haCondominio === 'sim' && !((formData.valorCondominio || '').trim())) newErrors.valorCondominio = 'Valor do condomínio é obrigatório';
    if (formData.haIptu === 'sim' && !((formData.valorIptu || '').trim())) newErrors.valorIptu = 'Valor do IPTU é obrigatório';

    if (formData.motivoDespejo === 'falta_pagamento') {
      if (!((formData.mesesEmAtraso || '').trim())) newErrors.mesesEmAtraso = 'Meses em atraso são obrigatórios';
      if (!((formData.valorTotalAlugueis || '').trim())) newErrors.valorTotalAlugueis = 'Valor total de aluguéis é obrigatório';
      if (!((formData.valorTotalDebito || '').trim())) newErrors.valorTotalDebito = 'Valor total do débito é obrigatório';
      if (!((formData.dataCalculoDebito || '').trim())) newErrors.dataCalculoDebito = 'Data do cálculo é obrigatória';
    }

    if (formData.motivoDespejo === 'infracao_contratual') {
      if (!((formData.qualInfracao || '').trim())) newErrors.qualInfracao = 'Descreva a infração';
      if (!((formData.clausulaViolada || '').trim())) newErrors.clausulaViolada = 'Cláusula violada é obrigatória';
      if (!((formData.dataInfracao || '').trim())) newErrors.dataInfracao = 'Data da infração é obrigatória';
      if (!formData.foiNotificado) newErrors.foiNotificado = 'Informe se houve notificação';
      if (formData.foiNotificado === 'sim' && !((formData.dataNotificacaoInfracao || '').trim())) newErrors.dataNotificacaoInfracao = 'Data da notificação é obrigatória';
    }

    if (formData.enviouNotificacaoPrevia === 'sim') {
      if (!formData.tipoNotificacaoPrevia) newErrors.tipoNotificacaoPrevia = 'Tipo de notificação é obrigatório';
      if (!((formData.dataNotificacaoPrevia || '').trim())) newErrors.dataNotificacaoPrevia = 'Data da notificação é obrigatória';
      if (!((formData.prazoConcedidoNotificacao || '').trim())) newErrors.prazoConcedidoNotificacao = 'Prazo concedido é obrigatório';
      if (formData.houveRespostaNotificacao === 'sim' && !((formData.respostaNotificacaoDetalhe || '').trim())) newErrors.respostaNotificacaoDetalhe = 'Detalhe a resposta';
    }

    if (!formData.requerLiminarDespejo) newErrors.requerLiminarDespejo = 'Informe se requer liminar';
    if (formData.requerLiminarDespejo === 'sim') {
      if (!formData.fundamentoArt59Inciso) newErrors.fundamentoArt59Inciso = 'Fundamento é obrigatório';
      if (!formData.ofereceCaucao) newErrors.ofereceCaucao = 'Informe se oferece caução';
      if (formData.ofereceCaucao === 'sim' && !((formData.valorCaucaoLiminar || '').trim())) newErrors.valorCaucaoLiminar = 'Valor da caução é obrigatório';
    }

    if (!formData.requerJusticaGratuita) newErrors.requerJusticaGratuita = 'Informe se requer justiça gratuita';
    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateExecucaoTituloForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tipoTitulo) newErrors.tipoTitulo = 'Tipo de título é obrigatório';

    if (!((formData.dataEmissaoTitulo || '').trim())) newErrors.dataEmissaoTitulo = 'Data de emissão é obrigatória';
    if (!((formData.dataVencimentoTitulo || '').trim())) newErrors.dataVencimentoTitulo = 'Data de vencimento é obrigatória';
    if (!((formData.valorNominalTitulo || '').trim())) newErrors.valorNominalTitulo = 'Valor nominal é obrigatório';

    if (formData.tipoTitulo === 'cheque') {
      if (!((formData.bancoSacado || '').trim())) newErrors.bancoSacado = 'Banco sacado é obrigatório para cheque';
      if (!((formData.agenciaConta || '').trim())) newErrors.agenciaConta = 'Agência/Conta é obrigatória para cheque';
    }

    if (!formData.foiProtestado) newErrors.foiProtestado = 'Informe se houve protesto';
    if (formData.foiProtestado === 'sim') {
      if (!((formData.dataProtesto || '').trim())) newErrors.dataProtesto = 'Data do protesto é obrigatória';
      if (!((formData.cartorioProtesto || '').trim())) newErrors.cartorioProtesto = 'Cartório do protesto é obrigatório';
    }

    if (!formData.autorTipoPessoa) newErrors.autorTipoPessoa = 'Tipo de Exequente é obrigatório';
    if (formData.autorTipoPessoa === 'fisica') {
      if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do exequente é obrigatório';
      if (!((formData.autorCpf || '').trim())) newErrors.autorCpf = 'CPF do exequente é obrigatório';
      if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço do exequente é obrigatório';
      if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail do exequente é obrigatório';
      if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone do exequente é obrigatório';
    } else if (formData.autorTipoPessoa === 'juridica') {
      if (!((formData.autorRazaoSocial || '').trim())) newErrors.autorRazaoSocial = 'Razão Social do exequente é obrigatória';
      if (!((formData.autorCnpj || '').trim())) newErrors.autorCnpj = 'CNPJ do exequente é obrigatório';
      if (!((formData.autorEnderecoSede || '').trim())) newErrors.autorEnderecoSede = 'Endereço da sede é obrigatório';
      if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail é obrigatório';
      if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone é obrigatório';
    }

    if (!formData.reuTipoPessoa) newErrors.reuTipoPessoa = 'Tipo de Executado é obrigatório';
    if (formData.reuTipoPessoa === 'fisica') {
      if (!((formData.reuNome || '').trim())) newErrors.reuNome = 'Nome do executado é obrigatório';
      if (!((formData.reuCpf || '').trim())) newErrors.reuCpf = 'CPF do executado é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do executado é obrigatório';
    } else if (formData.reuTipoPessoa === 'juridica') {
      if (!((formData.reuRazaoSocial || '').trim())) newErrors.reuRazaoSocial = 'Razão Social do executado é obrigatória';
      if (!((formData.reuCnpj || '').trim())) newErrors.reuCnpj = 'CNPJ do executado é obrigatório';
      if (!((formData.reuEndereco || '').trim())) newErrors.reuEndereco = 'Endereço do executado é obrigatório';
    }

    if (!formData.constituicaoMora) newErrors.constituicaoMora = 'Constituição em mora é obrigatória';

    if (!((formData.valorPrincipal || '').trim())) newErrors.valorPrincipal = 'Valor principal é obrigatório';
    if (!((formData.dataInicialCalculo || '').trim())) newErrors.dataInicialCalculo = 'Data inicial é obrigatória';
    if (!formData.indiceCorrecao) newErrors.indiceCorrecao = 'Índice de correção é obrigatório';
    if (!((formData.taxaJuros || '').trim())) newErrors.taxaJuros = 'Taxa de juros é obrigatória';
    if (formData.haMultaContratual === 'sim' && !((formData.percentualMulta || '').trim())) newErrors.percentualMulta = 'Percentual da multa é obrigatório';
    if (formData.haHonorariosContratuais === 'sim' && !((formData.percentualHonorarios || '').trim())) newErrors.percentualHonorarios = 'Percentual dos honorários é obrigatório';
    if (!((formData.valorTotalAtualizado || '').trim())) newErrors.valorTotalAtualizado = 'Valor total atualizado é obrigatório';
    if (!((formData.dataCalculo || '').trim())) newErrors.dataCalculo = 'Data do cálculo é obrigatória';

    if (!formData.requerJusticaGratuita) newErrors.requerJusticaGratuita = 'Informe se requer justiça gratuita';
    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateConcessaoBeneficioForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.beneficioPleiteado) newErrors.beneficioPleiteado = 'Benefício pleiteado é obrigatório';
    if (!formData.situacaoBeneficio) newErrors.situacaoBeneficio = 'Situação é obrigatória';

    if (!((formData.autorNome || '').trim())) newErrors.autorNome = 'Nome do segurado é obrigatório';
    if (!((formData.autorNacionalidade || '').trim())) newErrors.autorNacionalidade = 'Nacionalidade é obrigatória';
    if (!formData.autorEstadoCivil) newErrors.autorEstadoCivil = 'Estado civil é obrigatório';
    if (!((formData.autorNascimento || '').trim())) newErrors.autorNascimento = 'Data de nascimento é obrigatória';
    if (!((formData.autorProfissao || '').trim())) newErrors.autorProfissao = 'Profissão é obrigatória';
    if (!((formData.autorRg || '').trim())) newErrors.autorRg = 'RG é obrigatório';
    if (!((formData.autorCpf || '').trim())) newErrors.autorCpf = 'CPF é obrigatório';
    if (!((formData.pisPasep || '').trim())) newErrors.pisPasep = 'NIT/PIS é obrigatório';
    if (!((formData.autorEndereco || '').trim())) newErrors.autorEndereco = 'Endereço é obrigatório';
    if (!((formData.autorEmail || '').trim())) newErrors.autorEmail = 'E-mail é obrigatório';
    if (!((formData.autorTelefone || '').trim())) newErrors.autorTelefone = 'Telefone é obrigatório';

    if (!formData.fezRequerimentoAdm) newErrors.fezRequerimentoAdm = 'Informe se houve requerimento administrativo';
    if (formData.fezRequerimentoAdm === 'sim') {
      if (!((formData.dataDER || '').trim())) newErrors.dataDER = 'DER é obrigatória';
      if (!((formData.nbNumero || '').trim())) newErrors.nbNumero = 'NB é obrigatório';
      if (!((formData.especie || '').trim())) newErrors.especie = 'Espécie é obrigatória';
      if (!formData.resultadoRequerimento) newErrors.resultadoRequerimento = 'Resultado é obrigatório';
      if ((formData.resultadoRequerimento === 'indeferido' || formData.resultadoRequerimento === 'cessado') && !((formData.dataDecisaoCessacao || '').trim())) newErrors.dataDecisaoCessacao = 'Data da decisão/cessação é obrigatória';
      if (formData.resultadoRequerimento === 'indeferido' && !((formData.motivoNegativa || '').trim())) newErrors.motivoNegativa = 'Motivo da negativa é obrigatório';
    }

    if (formData.beneficioPleiteado === 'auxilio_doenca' || formData.beneficioPleiteado === 'aposentadoria_invalidez') {
      if (!((formData.cid10Diagnostico || '').trim())) newErrors.cid10Diagnostico = 'Diagnóstico/CID-10 é obrigatório';
      if (!((formData.doencaDescricao || '').trim())) newErrors.doencaDescricao = 'Descrição da doença é obrigatória';
      if (!((formData.dataInicioIncapacidade || '').trim())) newErrors.dataInicioIncapacidade = 'Data início da incapacidade é obrigatória';
      if (!formData.tipoIncapacidade) newErrors.tipoIncapacidade = 'Tipo de incapacidade é obrigatório';
      if (formData.estaEmTratamento === 'sim' && !((formData.qualTratamento || '').trim())) newErrors.qualTratamento = 'Descreva o tratamento';
    }

    if (formData.beneficioPleiteado === 'pensao_morte') {
      if (!((formData.falecidoNome || '').trim())) newErrors.falecidoNome = 'Nome do falecido é obrigatório';
      if (!((formData.falecidoDataObito || '').trim())) newErrors.falecidoDataObito = 'Data do óbito é obrigatória';
      if (!((formData.falecidoCpf || '').trim())) newErrors.falecidoCpf = 'CPF do falecido é obrigatório';
      if (!formData.vinculoFalecido) newErrors.vinculoFalecido = 'Vínculo com o falecido é obrigatório';
    }

    if (formData.beneficioPleiteado === 'bpc_loas') {
      if (!((formData.bpcRendaFamiliarMensal || '').trim())) newErrors.bpcRendaFamiliarMensal = 'Renda familiar mensal é obrigatória';
      if (!((formData.bpcComposicaoFamiliar || '').trim())) newErrors.bpcComposicaoFamiliar = 'Composição familiar é obrigatória';
      if (!((formData.bpcNumeroMembros || '').trim())) newErrors.bpcNumeroMembros = 'Número de membros é obrigatório';
      if (formData.bpcPcD === 'sim') {
        if (!formData.bpcTipoDeficiencia) newErrors.bpcTipoDeficiencia = 'Tipo de deficiência é obrigatório';
        if (!((formData.bpcDescricaoDeficiencia || '').trim())) newErrors.bpcDescricaoDeficiencia = 'Descrição da deficiência é obrigatória';
      }
    }

    if (!formData.categoriaSegurado) newErrors.categoriaSegurado = 'Categoria do segurado é obrigatória';

    if (!formData.tutelaUrgencia) newErrors.tutelaUrgencia = 'Informe se requer tutela de urgência';
    if (formData.tutelaUrgencia === 'sim' && !((formData.motivoUrgencia || '').trim())) newErrors.motivoUrgencia = 'Motivo da urgência é obrigatório';

    if (!formData.requerJusticaGratuita) newErrors.requerJusticaGratuita = 'Informe se requer justiça gratuita';
    if (!((formData.advogadoNome || '').trim())) newErrors.advogadoNome = 'Nome do advogado é obrigatório';
    if (!((formData.advogadoOab || '').trim())) newErrors.advogadoOab = 'OAB é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const areaGroups = useMemo(() => ([
    { title: 'TRABALHISTA', items: [
      { id: 'reclamacao_trabalhista', name: 'Reclamação Trabalhista' },
      { id: 'contestacao_trabalhista', name: 'Contestação Trabalhista' },
      { id: 'acordo_extrajudicial_trabalhista', name: 'Acordo Extrajudicial' },
      { id: 'recurso_ordinario_trabalhista', name: 'Recurso Ordinário' },
    ]},
    { title: 'CRIMINAL', items: [
      { id: 'habeas_corpus', name: 'Habeas Corpus' },
      { id: 'resposta_acusacao', name: 'Resposta à Acusação' },
      { id: 'liberdade_provisoria', name: 'Liberdade Provisória' },
      { id: 'alegacoes_finais', name: 'Alegações Finais' },
    ]},
    { title: 'FAMÍLIA', items: [
      { id: 'divorcio_consensual', name: 'Divórcio Consensual' },
      { id: 'acao_alimentos', name: 'Ação de Alimentos' },
      { id: 'acao_guarda', name: 'Ação de Guarda' },
      { id: 'acao_inventario', name: 'Ação de Inventário' },
    ]},
    { title: 'CONSUMIDOR', items: [
      { id: 'acao_indenizatoria', name: 'Ação Indenizatória' },
      { id: 'acao_plano_saude', name: 'Ação contra Plano de Saúde' },
    ]},
    { title: 'CÍVEL', items: [
      { id: 'acao_cobranca', name: 'Ação de Cobrança' },
      { id: 'acao_despejo', name: 'Ação de Despejo' },
      { id: 'execucao_titulo', name: 'Execução de Título' },
    ]},
    { title: 'PREVIDENCIÁRIO', items: [
      { id: 'concessao_beneficio', name: 'Concessão de Benefício' },
      { id: 'recurso_adm_inss', name: 'Recurso Administrativo INSS' },
    ]},
  ]), []);

  // Unifica todos os documentos para o novo grid
  const allDocuments = useMemo(() => {
    // Começa com os documentos gerais
    const docs = documentTypes.map(doc => ({ ...doc, category: 'Geral' }));
    
    // Adiciona documentos das áreas
    areaGroups.forEach(group => {
      group.items.forEach(item => {
        docs.push({ ...item, category: group.title });
      });
    });
    
    return docs;
  }, [areaGroups]);

  // Filtra documentos baseado na busca e categoria
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || 
                              (activeCategory === 'Geral' && doc.category === 'Geral') ||
                              (activeCategory !== 'Geral' && doc.category === activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [allDocuments, searchQuery, activeCategory]);

  const categories = ['Todos', 'Geral', ...areaGroups.map(g => g.title)];
  const formatLabel = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

  const handleCancelSelection = () => {
    resetDocumentForm();
    setSelectedType('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const max = 10;
    if (uploadedFiles.length + files.length > max) {
      setUploadError(`Máximo de ${max} documentos permitidos`);
      return;
    }
    setUploadedFiles(prev => [...prev, ...files]);
    setUploadError('');
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUploadMax10 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const max = 10;
    if (uploadedFiles.length + files.length > max) {
      setUploadError(`Máximo de ${max} documentos permitidos`);
      return;
    }
    setUploadedFiles(prev => [...prev, ...files]);
    setUploadError('');
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      } catch (err) {
        reject(err);
      }
    });
  };

  const generateDocument = async () => {
    setGenerateError('');
    if (selectedType === 'notificacao_extrajudicial') {
      if (!validateNotificacaoForm()) return;
    } else if (selectedType === 'contrato_honorarios') {
      if (!validateContratoHonorariosForm()) return;
    } else if (selectedType === 'reclamacao_trabalhista') {
      if (!validateReclamacaoTrabalhistaForm()) return;
    } else if (selectedType === 'contestacao_trabalhista') {
      if (!validateContestacaoTrabalhistaForm()) return;
    } else if (selectedType === 'acordo_extrajudicial_trabalhista') {
      if (!validateAcordoExtrajudicialForm()) return;
    } else if (selectedType === 'recurso_ordinario_trabalhista') {
      if (!validateRecursoOrdinarioForm()) return;
    } else if (selectedType === 'habeas_corpus') {
      if (!validateHabeasCorpusForm()) return;
    } else if (selectedType === 'resposta_acusacao') {
      if (!validateRespostaAcusacaoForm()) return;
    } else if (selectedType === 'liberdade_provisoria') {
      if (!validateLiberdadeProvisoriaForm()) return;
    } else if (selectedType === 'alegacoes_finais') {
      if (!validateAlegacoesFinaisForm()) return;
    } else if (selectedType === 'divorcio_consensual') {
      if (!validateDivorcioConsensualForm()) return;
    } else if (selectedType === 'acao_alimentos') {
      if (!validateAcaoAlimentosForm()) return;
    } else if (selectedType === 'acao_guarda') {
      if (!validateAcaoGuardaForm()) return;
    } else if (selectedType === 'acao_inventario') {
      if (!validateAcaoInventarioForm()) return;
    } else if (selectedType === 'acao_indenizatoria') {
      if (!validateAcaoIndenizatoriaForm()) return;
    } else if (selectedType === 'acao_plano_saude') {
      if (!validateAcaoPlanoSaudeForm()) return;
    } else if (selectedType === 'acao_cobranca') {
      if (!validateAcaoCobrancaForm()) return;
    } else if (selectedType === 'acao_despejo') {
      if (!validateAcaoDespejoForm()) return;
    } else if (selectedType === 'execucao_titulo') {
      if (!validateExecucaoTituloForm()) return;
    } else if (selectedType === 'concessao_beneficio') {
      if (!validateConcessaoBeneficioForm()) return;
    } else if (selectedType === 'substabelecimento') {
      if (!validateSubstabelecimentoForm()) return;
    } else {
      if (!validateForm()) return;
    }

    setIsGenerating(true);

    try {
      if (selectedType === 'notificacao_extrajudicial') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'notificacao_extrajudicial',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: {
            notificanteTipo: formData.notificanteTipo || '',
            notificanteNomeRazao: formData.notificanteNomeRazao || '',
            notificanteCpfCnpj: formData.notificanteCpfCnpj || '',
            notificanteEndereco: formData.notificanteEndereco || '',
            notificadoTipo: formData.notificadoTipo || '',
            notificadoNomeRazao: formData.notificadoNomeRazao || '',
            notificadoCpfCnpj: formData.notificadoCpfCnpj || '',
            notificadoEndereco: formData.notificadoEndereco || '',
            finalidade: formData.finalidade || '',
            descricaoFatos: formData.descricaoFatos || '',
            providenciaExigida: formData.providenciaExigida || '',
            prazoCumprimento: formData.prazoCumprimento || '',
            advogadoNome: formData.advogadoNome || '',
            advogadoOab: formData.advogadoOab || '',
            qualificacaoAdicional: formData.qualificacaoAdicional || '',
            valorEnvolvido: formData.valorEnvolvido || '',
            consequencias: formData.consequencias || '',
            telefoneContato: formData.telefoneContato || '',
            emailContato: formData.emailContato || '',
            observacoes: formData.observacoes || ''
          },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/notificacao-extrajudicial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao gerar documento com IA.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('notificacao_extrajudicial_ia')
          .select('*')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let contentFromDb = '';
        if (!error && data && data.length > 0) {
          contentFromDb = data[0].documento_gerado || '';
        }
        const finalContent = contentFromDb || '';
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'resposta_acusacao') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'resposta_acusacao',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/resposta-acusacao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da resposta à acusação.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('resposta_a_acusacao_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'contrato_honorarios') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'contrato_honorarios_extrajudicial',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: {
            clienteTipo: formData.clienteTipo || '',
            contratadoTipo: formData.contratadoTipo || '',
            clienteNomeRazao: formData.clienteNomeRazao || '',
            contratadoNomeRazao: formData.contratadoNomeRazao || '',
            clienteCpfCnpj: formData.clienteCpfCnpj || '',
            contratadoCpfCnpj: formData.contratadoCpfCnpj || '',
            clienteRg: formData.clienteRg || '',
            contratadoOab: formData.contratadoOab || '',
            clienteEndereco: formData.clienteEndereco || '',
            escritorioEndereco: formData.escritorioEndereco || '',
            clienteEmail: formData.clienteEmail || '',
            clienteTelefone: formData.clienteTelefone || '',
            objetoContrato: formData.objetoContrato || '',
            areaDireito: formData.areaDireito || '',
            tipoHonorarios: formData.tipoHonorarios || '',
            valorHonorarios: formData.valorHonorarios || '',
            formaPagamento: formData.formaPagamento || '',
            nacionalidade: formData.nacionalidade || '',
            estadoCivil: formData.estadoCivil || '',
            profissao: formData.profissao || '',
            representanteLegal: formData.representanteLegal || '',
            quantidadeParcelas: formData.quantidadeParcelas || '',
            primeiroVencimento: formData.primeiroVencimento || '',
            percentualExito: formData.percentualExito || '',
            valorHora: formData.valorHora || '',
            parteContraria: formData.parteContraria || '',
            numeroProcesso: formData.numeroProcesso || '',
            incluiRecursos: formData.incluiRecursos || '',
            despesasPorContaDe: formData.despesasPorContaDe || '',
            banco: formData.banco || '',
            agencia: formData.agencia || '',
            conta: formData.conta || '',
            pix: formData.pix || '',
            observacoesAdicionais: formData.observacoesAdicionais || ''
          },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/contrato-de-honorarios-extrajudicial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao gerar documento com IA.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('contrato_de_honorarios_ia')
          .select('*')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let resultContent = '';
        if (!error && data && data.length > 0) {
          resultContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: resultContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(resultContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'substabelecimento') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'substabelecimento',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/substabelecimento', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Erro ao gerar documento com IA.');
        }

        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('substabelecimento_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);

        let content = '';
        if (!error && data && data.length > 0) {
          content = data[0].documento_gerado || '';
        }

        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: content,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(content);
        setDocCurrentStep(1);
      } else if (selectedType === 'reclamacao_trabalhista') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'reclamacao_trabalhista',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/reclamacao-trabalhista', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao gerar documento com IA.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('reclamacao_trabalhista_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let resultContent = '';
        if (!error && data && data.length > 0) {
          resultContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: resultContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(resultContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'contestacao_trabalhista') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'contestacao_trabalhista',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/contestacao-trabalhista', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da contestação trabalhista.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('contestacao_trabalhista_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'acordo_extrajudicial_trabalhista') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acordo_extrajudicial',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acordo-extrajudicial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados do acordo extrajudicial.');
        }
        await new Promise(resolve => setTimeout(resolve, 40000));
        const { data, error } = await supabase
          .from('acordo_extrajudicial_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'recurso_ordinario_trabalhista') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'recurso_ordinario',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/recurso-ordinario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados do recurso ordinário.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('recurso_ordinario_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'habeas_corpus') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'habeas_corpus',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/habeas-corpus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados do habeas corpus.');
        }
        await new Promise(resolve => setTimeout(resolve, 40000));
        const { data, error } = await supabase
          .from('habeas_corpus_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'liberdade_provisoria') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'liberdade_provisoria',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/liberdade-provisoria', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da liberdade provisória.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('liberdade_provisoria_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'alegacoes_finais') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'alegacoes_finais',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/alegacoes-finais', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados das alegações finais.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('alegacoes_finais_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'divorcio_consensual') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'divorcio_consensual',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/divorcio-consensual', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados do divórcio consensual.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        let finalContent = '';
        const { data: dataPrimary, error: errorPrimary } = await supabase
          .from('divorcio_consensual_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        if (!errorPrimary && dataPrimary && dataPrimary.length > 0) {
          finalContent = dataPrimary[0].documento_gerado || '';
        }
        if (!finalContent) {
          const { data: dataFallback, error: errorFallback } = await supabase
            .from('divorcio_concensual_ia')
            .select('documento_gerado')
            .order('id', { ascending: false })
            .limit(1);
          if (!errorFallback && dataFallback && dataFallback.length > 0) {
            finalContent = dataFallback[0].documento_gerado || '';
          }
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'acao_alimentos') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acao_alimentos',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acao-de-alimentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Ação de Alimentos.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_de_alimentos_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'acao_guarda') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acao_guarda',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acao-de-guarda', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Ação de Guarda.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_de_guarda_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'acao_inventario') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acao_inventario',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acao-de-inventario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Ação de Inventário.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_de_inventario_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'acao_indenizatoria') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acao_indenizadora',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acao-indenizadora', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Ação Indenizatória.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_indenizadora_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContent = '';
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        if (!finalContent) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryData, error: retryError } = await supabase
            .from('acao_indenizadora_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryError && retryData && retryData.length > 0) {
            finalContent = retryData[0].documento_gerado || '';
          }
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else if (selectedType === 'acao_plano_saude') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acao_contra_plano_de_saude',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acao-contra-plano-de-saude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Ação contra Plano de Saúde.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_contra_plano_de_saude_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContentPlano = '';
        if (!error && data && data.length > 0) {
          finalContentPlano = data[0].documento_gerado || '';
        }
        if (!finalContentPlano) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryPlano, error: retryPlanoErr } = await supabase
            .from('acao_contra_plano_de_saude_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryPlanoErr && retryPlano && retryPlano.length > 0) {
            finalContentPlano = retryPlano[0].documento_gerado || '';
          }
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContentPlano,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContentPlano);
        setDocCurrentStep(1);
      } else if (selectedType === 'acao_cobranca') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acao_de_cobranca',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acao-de-cobranca', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Ação de Cobrança.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_de_cobranca_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContentCobranca = '';
        if (!error && data && data.length > 0) {
          finalContentCobranca = data[0].documento_gerado || '';
        }
        if (!finalContentCobranca) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryCobranca, error: retryCobrancaErr } = await supabase
            .from('acao_de_cobranca_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryCobrancaErr && retryCobranca && retryCobranca.length > 0) {
            finalContentCobranca = retryCobranca[0].documento_gerado || '';
          }
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContentCobranca,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContentCobranca);
        setDocCurrentStep(1);
      } else if (selectedType === 'acao_despejo') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'acao_de_despejo',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/acao-de-despejo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Ação de Despejo.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        const { data, error } = await supabase
          .from('acao_de_despejo_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        let finalContentDespejo = '';
        if (!error && data && data.length > 0) {
          finalContentDespejo = data[0].documento_gerado || '';
        }
        if (!finalContentDespejo) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryDespejo, error: retryDespejoErr } = await supabase
            .from('acao_de_despejo_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryDespejoErr && retryDespejo && retryDespejo.length > 0) {
            finalContentDespejo = retryDespejo[0].documento_gerado || '';
          }
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContentDespejo,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContentDespejo);
        setDocCurrentStep(1);
      } else if (selectedType === 'execucao_titulo') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'execucao_titulo',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/execucao-de-titulo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Execução de Título.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        let finalContentExecucao = '';
        const { data: dataPrimary, error: errorPrimary } = await supabase
          .from('execucao_de_titulo_ia')
          .select('documento_gerado')
          .order('id', { ascending: false })
          .limit(1);
        if (!errorPrimary && dataPrimary && dataPrimary.length > 0) {
          finalContentExecucao = dataPrimary[0].documento_gerado || '';
        }
        if (!finalContentExecucao) {
          const { data: dataFallback, error: errorFallback } = await supabase
            .from('execucao_titulo_ia')
            .select('documento_gerado')
            .order('id', { ascending: false })
            .limit(1);
          if (!errorFallback && dataFallback && dataFallback.length > 0) {
            finalContentExecucao = dataFallback[0].documento_gerado || '';
          }
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContentExecucao,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContentExecucao);
        setDocCurrentStep(1);
      } else if (selectedType === 'concessao_beneficio') {
        const attachmentsPayload = await Promise.all((uploadedFiles || []).map(async (f) => {
          const base64 = await fileToBase64(f).catch(() => null);
          return { name: f.name, size: f.size, type: f.type || 'application/pdf', base64 };
        }));
        const payload = {
          tipo: 'concessao_beneficio',
          etapa: 'dados_iniciais',
          timestamp: new Date().toISOString(),
          dados: { ...formData },
          uploadedFiles: attachmentsPayload
        };
        const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/concessao-de-beneficio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Erro ao enviar dados da Concessão de Benefício.');
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
        let finalContent = '';
        const { data, error } = await supabase
          .from('concessao_de_beneficio_ia')
          .select('documento_gerado')
          .not('documento_gerado', 'is', null)
          .neq('documento_gerado', '')
          .order('id', { ascending: false })
          .limit(1);
        if (!error && data && data.length > 0) {
          finalContent = data[0].documento_gerado || '';
        }
        if (!finalContent) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: retryData, error: retryError } = await supabase
            .from('concessao_de_beneficio_ia')
            .select('documento_gerado')
            .not('documento_gerado', 'is', null)
            .neq('documento_gerado', '')
            .order('id', { ascending: false })
            .limit(1);
          if (!retryError && retryData && retryData.length > 0) {
            finalContent = retryData[0].documento_gerado || '';
          }
        }
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: finalContent,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(finalContent);
        setDocCurrentStep(1);
      } else {
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
        setGeneratedDoc({
          id: Date.now(),
          type: formData.type,
          title: formData.title,
          content: result.content,
          createdAt: new Date().toISOString(),
          status: 'Gerado'
        });
        setIsEditing(false);
        setEditedContent(result.content || '');
        setDocCurrentStep(1);
      }
    } catch (error) {
      console.error('Erro ao gerar documento com IA:', error);
      setGenerateError('Falha ao gerar documento com IA. Tente novamente.');
    } finally {
      if (selectedType !== 'concessao_beneficio') {
        setIsGenerating(false);
      }
    }
  };

  const processTextToParagraphs = (text: string) => {
    const paragraphs: Paragraph[] = [];
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        paragraphs.push(new Paragraph({ text: '' }));
        continue;
      }
      const isTitle = line.endsWith(':') || (line.length < 50 && line === line.toUpperCase() && line.length > 3) || line.includes('Diante do exposto') || line.includes('Exposição dos Motivos');
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
    const content = (isEditing ? editedContent : generatedDoc?.content) || '';
    const titleText = formData.title || selectedLabel || selectedType || 'Documento';
    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          new Paragraph({
            children: [new TextRun({ text: titleText, bold: true, size: 28 })],
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
      setDocxError('');
      const doc = generateDocxDocument();
      const blob = await Packer.toBlob(doc);
      const fileName = `${(formData.title || selectedType || 'documento').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      setDocxError('Erro ao gerar documento. Tente novamente.');
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedContent(generatedDoc?.content || editedContent || '');
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    setGeneratedDoc(prev => prev ? { ...prev, content: editedContent || prev.content } : prev);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(generatedDoc?.content || '');
  };

  // Paginação removida

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
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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

      {/* aviso removido conforme solicitação */}

      {!selectedType && (
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Selecione o Tipo de Documento
            </h2>
            <div className="relative flex-1 md:max-w-md">
              {!isDocSearchFocused && (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsDocSearchFocused(true)}
                onBlur={() => setIsDocSearchFocused(false)}
                placeholder="Pesquisar documento..."
                className="input-primary pr-24 h-11 w-full text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                style={{ paddingLeft: isDocSearchFocused ? '20px' : '34px' }}
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto md:overflow-visible pb-3 gap-2 mb-6 scroll-smooth snap-x snap-mandatory md:flex-wrap scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 px-6 sm:px-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors snap-start flex-shrink-0 min-w-max sm:first:ml-6 ${
                    activeCategory === category
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {formatLabel(category)}
                </button>
              ))}
            </div>
            <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent dark:from-gray-800 pointer-events-none hidden sm:block"></div>
            <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent dark:from-gray-800 pointer-events-none hidden sm:block"></div>
          </div>

          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
            {filteredDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleTypeChange(doc.id, doc.name)}
                className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 flex flex-col items-start gap-2 h-36 hover:border-black dark:hover:border-white hover:shadow-md text-left"
              >
                <FileText className="h-7 w-7 text-gray-500 group-hover:text-black dark:text-gray-400 dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
                    {doc.name}
                  </p>
                  {doc.category && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 tracking-wider">
                      {formatLabel(doc.category)}
                    </p>
                  )}
                </div>
              </button>
            ))}
            {filteredDocuments.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum documento encontrado para "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Formulário / Placeholder */}
      {selectedType && !wizardTypes.has(selectedType) && (
        <StepIndicator steps={docSteps} currentStep={docCurrentStep} />
      )}
      {selectedType && !wizardTypes.has(selectedType) && (
        <div className="mt-2">
          {uploadError && (
            <p className="text-red-700 text-xs">{uploadError}</p>
          )}
          {generateError && (
            <p className="text-red-700 text-xs">{generateError}</p>
          )}
        </div>
      )}
      {selectedType === 'peticao_simples' ? (
        <PeticaoSimplesWizard onCancel={handleCancelSelection} />
      ) : selectedType === 'peticao' ? (
        <PeticaoInicialWizard onCancel={handleCancelSelection} />
      ) : selectedType === 'recurso_adm_inss' ? (
        <DocumentWizard documentType="recurso_inss" onCancel={handleCancelSelection} />
      ) : selectedType && ['contestacao', 'recurso', 'contrato', 'procuracao', 'replica'].includes(selectedType) ? (
        <DocumentWizard documentType={selectedType} onCancel={handleCancelSelection} />
      ) : selectedType === 'notificacao_extrajudicial' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Notificação Extrajudicial</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Notificante *</label>
                <select name="notificanteTipo" value={formData.notificanteTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificanteTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.notificanteTipo && <p className="text-red-700 text-xs mt-1">{errors.notificanteTipo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Notificado *</label>
                <select name="notificadoTipo" value={formData.notificadoTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificadoTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.notificadoTipo && <p className="text-red-700 text-xs mt-1">{errors.notificadoTipo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome/Razão Social do Notificante *</label>
                <input type="text" name="notificanteNomeRazao" value={formData.notificanteNomeRazao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificanteNomeRazao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo ou razão social" />
                {errors.notificanteNomeRazao && <p className="text-red-700 text-xs mt-1">{errors.notificanteNomeRazao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome/Razão Social do Notificado *</label>
                <input type="text" name="notificadoNomeRazao" value={formData.notificadoNomeRazao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificadoNomeRazao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo ou razão social" />
                {errors.notificadoNomeRazao && <p className="text-red-700 text-xs mt-1">{errors.notificadoNomeRazao}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF ou CNPJ do Notificante *</label>
                <input type="text" name="notificanteCpfCnpj" value={formData.notificanteCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificanteCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00 ou 00.000.000/0000-00" />
                {errors.notificanteCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.notificanteCpfCnpj}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF ou CNPJ do Notificado *</label>
                <input type="text" name="notificadoCpfCnpj" value={formData.notificadoCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificadoCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00 ou 00.000.000/0000-00" />
                {errors.notificadoCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.notificadoCpfCnpj}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Notificante *</label>
                <input type="text" name="notificanteEndereco" value={formData.notificanteEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificanteEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.notificanteEndereco && <p className="text-red-700 text-xs mt-1">{errors.notificanteEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Notificado *</label>
                <input type="text" name="notificadoEndereco" value={formData.notificadoEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notificadoEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.notificadoEndereco && <p className="text-red-700 text-xs mt-1">{errors.notificadoEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Finalidade da Notificação *</label>
                <select name="finalidade" value={formData.finalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.finalidade ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="cobranca">Cobrança</option>
                  <option value="rescisao">Rescisão Contratual</option>
                  <option value="cessacao">Cessação de Conduta</option>
                  <option value="interpelacao">Interpelação</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.finalidade && <p className="text-red-700 text-xs mt-1">{errors.finalidade}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Prazo para Cumprimento *</label>
                <input type="text" name="prazoCumprimento" value={formData.prazoCumprimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.prazoCumprimento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 5 dias úteis, 48 horas" />
                {errors.prazoCumprimento && <p className="text-red-700 text-xs mt-1">{errors.prazoCumprimento}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição dos Fatos *</label>
              <textarea name="descricaoFatos" value={formData.descricaoFatos || ''} onChange={handleInputChange} rows={6} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.descricaoFatos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva detalhadamente o que motivou esta notificação" />
              {errors.descricaoFatos && <p className="text-red-700 text-xs mt-1">{errors.descricaoFatos}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Providência Exigida *</label>
              <textarea name="providenciaExigida" value={formData.providenciaExigida || ''} onChange={handleInputChange} rows={5} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.providenciaExigida ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que você espera que o notificado faça" />
              {errors.providenciaExigida && <p className="text-red-700 text-xs mt-1">{errors.providenciaExigida}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo do advogado" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Qualificação Adicional (PF)</label>
                <input type="text" name="qualificacaoAdicional" value={formData.qualificacaoAdicional || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nacionalidade, estado civil, profissão" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Envolvido</label>
                <input type="text" name="valorEnvolvido" value={formData.valorEnvolvido || ''} onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.,R$\s]/g, '');
                  setFormData(prev => ({ ...prev, valorEnvolvido: value }));
                  if (errors.valorEnvolvido) setErrors(prev => ({ ...prev, valorEnvolvido: '' }));
                }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorEnvolvido ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 10.000,00" />
                {errors.valorEnvolvido && <p className="text-red-700 text-xs mt-1">{errors.valorEnvolvido}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Consequências do Descumprimento</label>
              <textarea name="consequencias" value={formData.consequencias || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Medidas que serão tomadas (se vazio, usar padrão)" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone para Contato</label>
                <input type="text" name="telefoneContato" value={formData.telefoneContato || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail para Contato</label>
                <input type="email" name="emailContato" value={formData.emailContato || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Observações Adicionais</label>
              <textarea name="observacoes" value={formData.observacoes || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Informações extras relevantes" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos Anexos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="not-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="not-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
              </label>
            </div>
            {uploadError && (
              <p className="text-red-700 text-xs mt-2">{uploadError}</p>
            )}
            {uploadedFiles && uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'contrato_honorarios' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Contrato de Honorários</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Cliente *</label>
                <select name="clienteTipo" value={formData.clienteTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.clienteTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.clienteTipo && <p className="text-red-700 text-xs mt-1">{errors.clienteTipo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Contratado *</label>
                <select name="contratadoTipo" value={formData.contratadoTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.contratadoTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="adv_pf">Advogado Pessoa Física</option>
                  <option value="sociedade">Sociedade de Advogados</option>
                </select>
                {errors.contratadoTipo && <p className="text-red-700 text-xs mt-1">{errors.contratadoTipo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome/Razão Social do Cliente *</label>
                <input type="text" name="clienteNomeRazao" value={formData.clienteNomeRazao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.clienteNomeRazao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo ou razão social" />
                {errors.clienteNomeRazao && <p className="text-red-700 text-xs mt-1">{errors.clienteNomeRazao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado/Escritório *</label>
                <input type="text" name="contratadoNomeRazao" value={formData.contratadoNomeRazao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.contratadoNomeRazao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo ou razão social" />
                {errors.contratadoNomeRazao && <p className="text-red-700 text-xs mt-1">{errors.contratadoNomeRazao}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF ou CNPJ do Cliente *</label>
                <input type="text" name="clienteCpfCnpj" value={formData.clienteCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.clienteCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00 ou 00.000.000/0000-00" />
                {errors.clienteCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.clienteCpfCnpj}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF ou CNPJ do Advogado *</label>
                <input type="text" name="contratadoCpfCnpj" value={formData.contratadoCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.contratadoCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Documento do advogado/escritório" />
                {errors.contratadoCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.contratadoCpfCnpj}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG do Cliente</label>
                <input type="text" name="clienteRg" value={formData.clienteRg || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="00.000.000-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="contratadoOab" value={formData.contratadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.contratadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.contratadoOab && <p className="text-red-700 text-xs mt-1">{errors.contratadoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Cliente *</label>
                <input type="text" name="clienteEndereco" value={formData.clienteEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.clienteEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.clienteEndereco && <p className="text-red-700 text-xs mt-1">{errors.clienteEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório *</label>
                <input type="text" name="escritorioEndereco" value={formData.escritorioEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.escritorioEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço profissional completo" />
                {errors.escritorioEndereco && <p className="text-red-700 text-xs mt-1">{errors.escritorioEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Cliente *</label>
                <input type="email" name="clienteEmail" value={formData.clienteEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.clienteEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="cliente@email.com" />
                {errors.clienteEmail && <p className="text-red-700 text-xs mt-1">{errors.clienteEmail}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone do Cliente *</label>
                <input type="text" name="clienteTelefone" value={formData.clienteTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.clienteTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(11) 99999-9999" />
                {errors.clienteTelefone && <p className="text-red-700 text-xs mt-1">{errors.clienteTelefone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Objeto do Contrato *</label>
              <textarea name="objetoContrato" value={formData.objetoContrato || ''} onChange={handleInputChange} rows={5} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.objetoContrato ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva o serviço jurídico a ser prestado" />
              {errors.objetoContrato && <p className="text-red-700 text-xs mt-1">{errors.objetoContrato}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Área do Direito *</label>
                <select name="areaDireito" value={formData.areaDireito || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.areaDireito ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="civel">Cível</option>
                  <option value="trabalhista">Trabalhista</option>
                  <option value="criminal">Criminal</option>
                  <option value="familia">Família</option>
                  <option value="consumidor">Consumidor</option>
                  <option value="previdenciario">Previdenciário</option>
                  <option value="tributario">Tributário</option>
                  <option value="empresarial">Empresarial</option>
                </select>
                {errors.areaDireito && <p className="text-red-700 text-xs mt-1">{errors.areaDireito}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Honorários *</label>
                <select name="tipoHonorarios" value={formData.tipoHonorarios || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoHonorarios ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fixo">Fixo</option>
                  <option value="exito">Por Êxito</option>
                  <option value="misto">Misto</option>
                  <option value="hora">Por Hora</option>
                </select>
                {errors.tipoHonorarios && <p className="text-red-700 text-xs mt-1">{errors.tipoHonorarios}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor dos Honorários *</label>
                <input type="text" name="valorHonorarios" value={formData.valorHonorarios || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); setFormData(prev => ({ ...prev, valorHonorarios: value })); if (errors.valorHonorarios) setErrors(prev => ({ ...prev, valorHonorarios: '' })); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorHonorarios ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 5.000,00 ou 20%" />
                {errors.valorHonorarios && <p className="text-red-700 text-xs mt-1">{errors.valorHonorarios}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Forma de Pagamento *</label>
                <select name="formaPagamento" value={formData.formaPagamento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.formaPagamento ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="avista">À Vista</option>
                  <option value="parcelado">Parcelado</option>
                  <option value="exito">No Êxito</option>
                </select>
                {errors.formaPagamento && <p className="text-red-700 text-xs mt-1">{errors.formaPagamento}</p>}
              </div>
            </div>

            {formData.clienteTipo === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                  <input type="text" name="nacionalidade" value={formData.nacionalidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                  <select name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="uniao_estavel">União Estável</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                  <input type="text" name="profissao" value={formData.profissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Engenheiro, Médico, etc." />
                </div>
              </div>
            )}

            {formData.clienteTipo === 'juridica' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Representante Legal</label>
                <input type="text" name="representanteLegal" value={formData.representanteLegal || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome do sócio/representante" />
              </div>
            )}

            {formData.formaPagamento === 'parcelado' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quantidade de Parcelas{formData.formaPagamento === 'parcelado' ? ' *' : ''}</label>
                  <input type="number" name="quantidadeParcelas" value={formData.quantidadeParcelas || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${(formData.formaPagamento === 'parcelado' && errors.quantidadeParcelas) ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1-24" />
                  {formData.formaPagamento === 'parcelado' && errors.quantidadeParcelas && <p className="text-red-700 text-xs mt-1">{errors.quantidadeParcelas}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Primeiro Vencimento{formData.formaPagamento === 'parcelado' ? ' *' : ''}</label>
                  <input type="text" name="primeiroVencimento" value={formData.primeiroVencimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${(formData.formaPagamento === 'parcelado' && errors.primeiroVencimento) ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                  {formData.formaPagamento === 'parcelado' && errors.primeiroVencimento && <p className="text-red-700 text-xs mt-1">{errors.primeiroVencimento}</p>}
                </div>
              </div>
            )}

            {(formData.tipoHonorarios === 'exito' || formData.tipoHonorarios === 'misto') && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Percentual de Êxito</label>
                <input type="text" name="percentualExito" value={formData.percentualExito || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.percentualExito ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 20%" />
                {errors.percentualExito && <p className="text-red-700 text-xs mt-1">{errors.percentualExito}</p>}
              </div>
            )}

            {formData.tipoHonorarios === 'hora' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor por Hora</label>
                <input type="text" name="valorHora" value={formData.valorHora || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorHora ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 350,00" />
                {errors.valorHora && <p className="text-red-700 text-xs mt-1">{errors.valorHora}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Parte Contrária</label>
                <input type="text" name="parteContraria" value={formData.parteContraria || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome da outra parte" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Processo</label>
                <input type="text" name="numeroProcesso" value={formData.numeroProcesso || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="0000000-00.0000.0.00.0000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Inclui Recursos?</label>
                <select name="incluiRecursos" value={formData.incluiRecursos || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Despesas por Conta de</label>
                <select name="despesasPorContaDe" value={formData.despesasPorContaDe || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="cliente">Cliente</option>
                  <option value="advogado">Advogado Antecipa</option>
                  <option value="inclusas">Inclusas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Banco</label>
                <input type="text" name="banco" value={formData.banco || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome do banco" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Agência</label>
                <input type="text" name="agencia" value={formData.agencia || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="0000" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Conta</label>
                <input type="text" name="conta" value={formData.conta || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="00000-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">PIX</label>
                <input type="text" name="pix" value={formData.pix || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Chave PIX" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Observações Adicionais</label>
              <textarea name="observacoesAdicionais" value={formData.observacoesAdicionais || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Cláusulas especiais, condições específicas" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos Anexos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="honorarios-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="honorarios-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadError && (
                <p className="text-red-700 text-xs mt-2">{uploadError}</p>
              )}
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'substabelecimento' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Substabelecimento</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Modalidade *</label>
                <select name="modalidade" value={formData.modalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.modalidade ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="com_reserva">Com reserva de poderes</option>
                  <option value="sem_reserva">Sem reserva de poderes</option>
                </select>
                {errors.modalidade && <p className="text-red-700 text-xs mt-1">{errors.modalidade}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outorgante *</label>
                <input type="text" name="outorganteNome" value={formData.outorganteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.outorganteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do outorgante" />
                {errors.outorganteNome && <p className="text-red-700 text-xs mt-1">{errors.outorganteNome}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Advogado Substabelecente *</label>
                <input type="text" name="substabelecenteNome" value={formData.substabelecenteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.substabelecenteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do substabelecente" />
                {errors.substabelecenteNome && <p className="text-red-700 text-xs mt-1">{errors.substabelecenteNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB do Substabelecente *</label>
                <input type="text" name="substabelecenteOab" value={formData.substabelecenteOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.substabelecenteOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.substabelecenteOab && <p className="text-red-700 text-xs mt-1">{errors.substabelecenteOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Substabelecente *</label>
                <input type="text" name="substabelecenteEndereco" value={formData.substabelecenteEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.substabelecenteEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.substabelecenteEndereco && <p className="text-red-700 text-xs mt-1">{errors.substabelecenteEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cidade/UF *</label>
                <input type="text" name="cidadeUf" value={formData.cidadeUf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cidadeUf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Cidade/UF" />
                {errors.cidadeUf && <p className="text-red-700 text-xs mt-1">{errors.cidadeUf}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Advogado Substabelecido *</label>
                <input type="text" name="substabelecidoNome" value={formData.substabelecidoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.substabelecidoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do substabelecido" />
                {errors.substabelecidoNome && <p className="text-red-700 text-xs mt-1">{errors.substabelecidoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB do Substabelecido *</label>
                <input type="text" name="substabelecidoOab" value={formData.substabelecidoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.substabelecidoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.substabelecidoOab && <p className="text-red-700 text-xs mt-1">{errors.substabelecidoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Substabelecido *</label>
                <input type="text" name="substabelecidoEndereco" value={formData.substabelecidoEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.substabelecidoEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.substabelecidoEndereco && <p className="text-red-700 text-xs mt-1">{errors.substabelecidoEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Poderes Substabelecidos *</label>
                <select name="poderesSubstabelecidos" value={formData.poderesSubstabelecidos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.poderesSubstabelecidos ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="gerais">Gerais</option>
                  <option value="especificos">Específicos</option>
                </select>
                {errors.poderesSubstabelecidos && <p className="text-red-700 text-xs mt-1">{errors.poderesSubstabelecidos}</p>}
              </div>
            </div>

            {formData.poderesSubstabelecidos === 'especificos' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Especificação dos Poderes *</label>
                <textarea name="especificacaoPoderes" value={formData.especificacaoPoderes || ''} onChange={handleInputChange} rows={5} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.especificacaoPoderes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva quais poderes" />
                {errors.especificacaoPoderes && <p className="text-red-700 text-xs mt-1">{errors.especificacaoPoderes}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos Anexos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="subst-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="subst-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'reclamacao_trabalhista' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Reclamação Trabalhista</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Reclamante *</label>
                <input type="text" name="reclamanteNome" value={formData.reclamanteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo do trabalhador" />
                {errors.reclamanteNome && <p className="text-red-700 text-xs mt-1">{errors.reclamanteNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do Reclamante *</label>
                <input type="text" name="reclamanteCpf" value={formData.reclamanteCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.reclamanteCpf && <p className="text-red-700 text-xs mt-1">{errors.reclamanteCpf}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG do Reclamante *</label>
                <input type="text" name="reclamanteRg" value={formData.reclamanteRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.reclamanteRg && <p className="text-red-700 text-xs mt-1">{errors.reclamanteRg}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Órgão Expedidor *</label>
                <input type="text" name="reclamanteOrgaoExpedidor" value={formData.reclamanteOrgaoExpedidor || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteOrgaoExpedidor ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="SSP/SP" />
                {errors.reclamanteOrgaoExpedidor && <p className="text-red-700 text-xs mt-1">{errors.reclamanteOrgaoExpedidor}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="reclamanteTelefone" value={formData.reclamanteTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(11) 99999-9999" />
                {errors.reclamanteTelefone && <p className="text-red-700 text-xs mt-1">{errors.reclamanteTelefone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Reclamante *</label>
                <input type="text" name="reclamanteEndereco" value={formData.reclamanteEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.reclamanteEndereco && <p className="text-red-700 text-xs mt-1">{errors.reclamanteEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Reclamante *</label>
                <input type="email" name="reclamanteEmail" value={formData.reclamanteEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="trabalhador@email.com" />
                {errors.reclamanteEmail && <p className="text-red-700 text-xs mt-1">{errors.reclamanteEmail}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                <input type="text" name="nacionalidade" value={formData.nacionalidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="uniao_estavel">União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                <input type="text" name="profissao" value={formData.profissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Conforme atividade" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CTPS (Número e Série)</label>
                <input type="text" name="ctps" value={formData.ctps || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="123456 / 00001-SP" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">PIS/PASEP</label>
                <input type="text" name="pisPasep" value={formData.pisPasep || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="123.45678.90-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Reclamado *</label>
                <select name="reclamadoTipo" value={formData.reclamadoTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.reclamadoTipo && <p className="text-red-700 text-xs mt-1">{errors.reclamadoTipo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome/Razão Social do Reclamado *</label>
                <input type="text" name="reclamadoNomeRazao" value={formData.reclamadoNomeRazao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoNomeRazao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome ou razão social do empregador" />
                {errors.reclamadoNomeRazao && <p className="text-red-700 text-xs mt-1">{errors.reclamadoNomeRazao}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF/CNPJ do Reclamado *</label>
                <input type="text" name="reclamadoCpfCnpj" value={formData.reclamadoCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Documento do empregador" />
                {errors.reclamadoCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.reclamadoCpfCnpj}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Reclamado *</label>
                <input type="text" name="reclamadoEndereco" value={formData.reclamadoEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo para citação" />
                {errors.reclamadoEndereco && <p className="text-red-700 text-xs mt-1">{errors.reclamadoEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Admissão *</label>
                <input type="text" name="dataAdmissao" value={formData.dataAdmissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataAdmissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataAdmissao && <p className="text-red-700 text-xs mt-1">{errors.dataAdmissao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Demissão *</label>
                <input type="text" name="dataDemissao" value={formData.dataDemissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataDemissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa ou Ainda empregado" />
                {errors.dataDemissao && <p className="text-red-700 text-xs mt-1">{errors.dataDemissao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Função/Cargo *</label>
                <input type="text" name="funcaoCargo" value={formData.funcaoCargo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.funcaoCargo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: Vendedor" />
                {errors.funcaoCargo && <p className="text-red-700 text-xs mt-1">{errors.funcaoCargo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Último Salário *</label>
                <input type="text" name="ultimoSalario" value={formData.ultimoSalario || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); setFormData(prev => ({ ...prev, ultimoSalario: value })); if (errors.ultimoSalario) setErrors(prev => ({ ...prev, ultimoSalario: '' })); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.ultimoSalario ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 2.500,00" />
                {errors.ultimoSalario && <p className="text-red-700 text-xs mt-1">{errors.ultimoSalario}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Jornada de Trabalho *</label>
                <input type="text" name="jornadaTrabalho" value={formData.jornadaTrabalho || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.jornadaTrabalho ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Seg a Sex, 08h às 18h, 1h intervalo" />
                {errors.jornadaTrabalho && <p className="text-red-700 text-xs mt-1">{errors.jornadaTrabalho}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Havia Registro em CTPS? *</label>
                <select name="registroCtps" value={formData.registroCtps || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.registroCtps ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.registroCtps && <p className="text-red-700 text-xs mt-1">{errors.registroCtps}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Dispensa *</label>
                <select name="tipoDispensa" value={formData.tipoDispensa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoDispensa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sem_justa_causa">Sem justa causa</option>
                  <option value="com_justa_causa">Com justa causa</option>
                  <option value="pedido_demissao">Pedido de demissão</option>
                  <option value="rescisao_indireta">Rescisão indireta</option>
                </select>
                {errors.tipoDispensa && <p className="text-red-700 text-xs mt-1">{errors.tipoDispensa}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Forma de Pagamento do Salário</label>
                <select name="formaPagamentoSalario" value={formData.formaPagamentoSalario || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="deposito">Depósito</option>
                  <option value="especie">Espécie</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Narrativa dos Fatos *</label>
              <textarea name="narrativaFatos" value={formData.narrativaFatos || ''} onChange={handleInputChange} rows={6} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.narrativaFatos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva detalhadamente o que aconteceu" />
              {errors.narrativaFatos && <p className="text-red-700 text-xs mt-1">{errors.narrativaFatos}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Verbas Pleiteadas *</label>
              <textarea name="verbasPleiteadas" value={formData.verbasPleiteadas || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.verbasPleiteadas ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva as verbas pleiteadas e seus fundamentos" />
              {errors.verbasPleiteadas && <p className="text-red-700 text-xs mt-1">{errors.verbasPleiteadas}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor da Causa *</label>
                <input type="text" name="caseValue" value={formData.caseValue || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); setFormData(prev => ({ ...prev, caseValue: value })); if (errors.caseValue) setErrors(prev => ({ ...prev, caseValue: '' })); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.caseValue ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 50.000,00" />
                {errors.caseValue && <p className="text-red-700 text-xs mt-1">{errors.caseValue}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cidade/UF da Vara *</label>
                <input type="text" name="cidadeUfVara" value={formData.cidadeUfVara || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cidadeUfVara ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="São Paulo/SP" />
                {errors.cidadeUfVara && <p className="text-red-700 text-xs mt-1">{errors.cidadeUfVara}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do advogado" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Advogado</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos Anexos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="rt-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="rt-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'contestacao_trabalhista' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Contestação Trabalhista</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Processo *</label>
                <input type="text" name="numeroProcesso" value={formData.numeroProcesso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.numeroProcesso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="0000000-00.0000.0.00.0000" />
                {errors.numeroProcesso && <p className="text-red-700 text-xs mt-1">{errors.numeroProcesso}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara do Trabalho *</label>
                <input type="text" name="varaTrabalho" value={formData.varaTrabalho || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaTrabalho ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara do Trabalho de São Paulo" />
                {errors.varaTrabalho && <p className="text-red-700 text-xs mt-1">{errors.varaTrabalho}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Reclamante *</label>
                <input type="text" name="reclamanteNome" value={formData.reclamanteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamanteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do autor da ação" />
                {errors.reclamanteNome && <p className="text-red-700 text-xs mt-1">{errors.reclamanteNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Reclamado *</label>
                <select name="reclamadoTipo" value={formData.reclamadoTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.reclamadoTipo && <p className="text-red-700 text-xs mt-1">{errors.reclamadoTipo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome/Razão Social do Reclamado *</label>
                <input type="text" name="reclamadoNomeRazao" value={formData.reclamadoNomeRazao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoNomeRazao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome ou razão social do cliente" />
                {errors.reclamadoNomeRazao && <p className="text-red-700 text-xs mt-1">{errors.reclamadoNomeRazao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF ou CNPJ *</label>
                <input type="text" name="reclamadoCpfCnpj" value={formData.reclamadoCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Documento do cliente" />
                {errors.reclamadoCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.reclamadoCpfCnpj}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Reclamado *</label>
                <input type="text" name="reclamadoEndereco" value={formData.reclamadoEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reclamadoEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                {errors.reclamadoEndereco && <p className="text-red-700 text-xs mt-1">{errors.reclamadoEndereco}</p>}
              </div>
              {formData.reclamadoTipo === 'juridica' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Representante Legal</label>
                  <input type="text" name="representanteLegal" value={formData.representanteLegal || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome do sócio/preposto" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo das Alegações do Reclamante *</label>
              <textarea name="resumoAlegacoesReclamante" value={formData.resumoAlegacoesReclamante || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.resumoAlegacoesReclamante ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que o autor alega nos fatos" />
              {errors.resumoAlegacoesReclamante && <p className="text-red-700 text-xs mt-1">{errors.resumoAlegacoesReclamante}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo dos Pedidos do Reclamante *</label>
              <textarea name="resumoPedidosReclamante" value={formData.resumoPedidosReclamante || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.resumoPedidosReclamante ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que o autor está pedindo" />
              {errors.resumoPedidosReclamante && <p className="text-red-700 text-xs mt-1">{errors.resumoPedidosReclamante}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Versão dos Fatos (Reclamado) *</label>
              <textarea name="versaoFatosReclamado" value={formData.versaoFatosReclamado || ''} onChange={handleInputChange} rows={6} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.versaoFatosReclamado ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Como os fatos realmente ocorreram" />
              {errors.versaoFatosReclamado && <p className="text-red-700 text-xs mt-1">{errors.versaoFatosReclamado}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Teses de Defesa *</label>
              <textarea name="tesesDefesa" value={formData.tesesDefesa || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tesesDefesa ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva as teses de defesa adotadas" />
              {errors.tesesDefesa && <p className="text-red-700 text-xs mt-1">{errors.tesesDefesa}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Houve Vínculo Empregatício?</label>
                <select name="alegaInexistenciaVinculo" value={formData.alegaInexistenciaVinculo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.alegaInexistenciaVinculo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.alegaInexistenciaVinculo && <p className="text-red-700 text-xs mt-1">{errors.alegaInexistenciaVinculo}</p>}
              </div>
            </div>

            {formData.alegaInexistenciaVinculo === 'sim' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Admissão *</label>
                    <input type="text" name="dataAdmissaoContestacao" value={formData.dataAdmissaoContestacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataAdmissaoContestacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataAdmissaoContestacao && <p className="text-red-700 text-xs mt-1">{errors.dataAdmissaoContestacao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Demissão *</label>
                    <input type="text" name="dataDemissaoContestacao" value={formData.dataDemissaoContestacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataDemissaoContestacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataDemissaoContestacao && <p className="text-red-700 text-xs mt-1">{errors.dataDemissaoContestacao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Função/Cargo *</label>
                    <input type="text" name="funcaoCargoContestacao" value={formData.funcaoCargoContestacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.funcaoCargoContestacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Função real" />
                    {errors.funcaoCargoContestacao && <p className="text-red-700 text-xs mt-1">{errors.funcaoCargoContestacao}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Salário *</label>
                    <input
                      type="text"
                      name="salarioContestacao"
                      value={formData.salarioContestacao || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,R$\s]/g, '');
                        setFormData(prev => ({ ...prev, salarioContestacao: value }));
                        if (errors.salarioContestacao) setErrors(prev => ({ ...prev, salarioContestacao: '' }));
                      }}
                      className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.salarioContestacao ? 'border-red-600 focus:ring-red-600' : ''}`}
                      placeholder="R$ 0.000,00"
                    />
                    {errors.salarioContestacao && <p className="text-red-700 text-xs mt-1">{errors.salarioContestacao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Jornada Contratada *</label>
                    <input type="text" name="jornadaContratada" value={formData.jornadaContratada || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.jornadaContratada ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Horário contratual" />
                    {errors.jornadaContratada && <p className="text-red-700 text-xs mt-1">{errors.jornadaContratada}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Rescisão *</label>
                    <select name="tipoRescisaoContestacao" value={formData.tipoRescisaoContestacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoRescisaoContestacao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="pedido_demissao">Pedido de demissão</option>
                      <option value="sem_justa_causa">Sem justa causa</option>
                      <option value="com_justa_causa">Com justa causa</option>
                    </select>
                    {errors.tipoRescisaoContestacao && <p className="text-red-700 text-xs mt-1">{errors.tipoRescisaoContestacao}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Verbas Rescisórias Pagas *</label>
                  <select name="verbasRescisoriasPagas" value={formData.verbasRescisoriasPagas || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.verbasRescisoriasPagas ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                    <option value="parcialmente">Parcialmente</option>
                  </select>
                  {errors.verbasRescisoriasPagas && <p className="text-red-700 text-xs mt-1">{errors.verbasRescisoriasPagas}</p>}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Preliminares Arguidas</label>
              <textarea name="preliminaresArguidas" value={formData.preliminaresArguidas || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva as preliminares arguidas" />
            </div>

            {(formData.preliminaresArguidas || '').trim().length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fundamentação das Preliminares *</label>
                <textarea name="fundamentosPreliminares" value={formData.fundamentosPreliminares || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fundamentosPreliminares ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Detalhes das preliminares" />
                {errors.fundamentosPreliminares && <p className="text-red-700 text-xs mt-1">{errors.fundamentosPreliminares}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Reclamado</label>
                <input type="email" name="emailReclamado" value={formData.emailReclamado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="empresa@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do advogado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Advogado</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="ct-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="ct-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acordo_extrajudicial_trabalhista' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Acordo Extrajudicial Trabalhista</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Empregador *</label>
                <select name="empregadorTipo" value={formData.empregadorTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadorTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.empregadorTipo && <p className="text-red-700 text-xs mt-1">{errors.empregadorTipo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social/Nome do Empregador *</label>
                <input type="text" name="empregadorNomeRazao" value={formData.empregadorNomeRazao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadorNomeRazao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo ou razão social" />
                {errors.empregadorNomeRazao && <p className="text-red-700 text-xs mt-1">{errors.empregadorNomeRazao}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ/CPF do Empregador *</label>
                <input type="text" name="empregadorCpfCnpj" value={formData.empregadorCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadorCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00 ou 00.000.000/0000-00" />
                {errors.empregadorCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.empregadorCpfCnpj}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Empregador *</label>
                <input type="text" name="empregadorEndereco" value={formData.empregadorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.empregadorEndereco && <p className="text-red-700 text-xs mt-1">{errors.empregadorEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Representante Legal *</label>
                <input type="text" name="representanteLegal" value={formData.representanteLegal || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.representanteLegal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do representante" />
                {errors.representanteLegal && <p className="text-red-700 text-xs mt-1">{errors.representanteLegal}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do Representante *</label>
                <input type="text" name="representanteCpf" value={formData.representanteCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.representanteCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.representanteCpf && <p className="text-red-700 text-xs mt-1">{errors.representanteCpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG do Representante</label>
                <input type="text" name="representanteRg" value={formData.representanteRg || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="00.000.000-0" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Empregado *</label>
                <input type="text" name="empregadoNome" value={formData.empregadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.empregadoNome && <p className="text-red-700 text-xs mt-1">{errors.empregadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do Empregado *</label>
                <input type="text" name="empregadoCpf" value={formData.empregadoCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadoCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.empregadoCpf && <p className="text-red-700 text-xs mt-1">{errors.empregadoCpf}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG do Empregado *</label>
                <input type="text" name="empregadoRg" value={formData.empregadoRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadoRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.empregadoRg && <p className="text-red-700 text-xs mt-1">{errors.empregadoRg}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CTPS do Empregado *</label>
                <input type="text" name="empregadoCtps" value={formData.empregadoCtps || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadoCtps ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Número e série" />
                {errors.empregadoCtps && <p className="text-red-700 text-xs mt-1">{errors.empregadoCtps}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Empregado *</label>
                <input type="text" name="empregadoEndereco" value={formData.empregadoEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.empregadoEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.empregadoEndereco && <p className="text-red-700 text-xs mt-1">{errors.empregadoEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                <input type="text" name="empregadoNacionalidade" value={formData.empregadoNacionalidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                <select name="empregadoEstadoCivil" value={formData.empregadoEstadoCivil || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="uniao_estavel">União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                <input type="text" name="empregadoProfissao" value={formData.empregadoProfissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Atividade" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">PIS/PASEP</label>
                <input type="text" name="pisPasep" value={formData.pisPasep || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="123.45678.90-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Admissão *</label>
                <input type="text" name="dataAdmissao" value={formData.dataAdmissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataAdmissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataAdmissao && <p className="text-red-700 text-xs mt-1">{errors.dataAdmissao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Demissão *</label>
                <input type="text" name="dataDemissao" value={formData.dataDemissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataDemissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataDemissao && <p className="text-red-700 text-xs mt-1">{errors.dataDemissao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Função/Cargo *</label>
                <input type="text" name="funcaoCargo" value={formData.funcaoCargo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.funcaoCargo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: Vendedor" />
                {errors.funcaoCargo && <p className="text-red-700 text-xs mt-1">{errors.funcaoCargo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Último Salário *</label>
                <input type="text" name="ultimoSalario" value={formData.ultimoSalario || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); setFormData(prev => ({ ...prev, ultimoSalario: value })); if (errors.ultimoSalario) setErrors(prev => ({ ...prev, ultimoSalario: '' })); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.ultimoSalario ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 0,00" />
                {errors.ultimoSalario && <p className="text-red-700 text-xs mt-1">{errors.ultimoSalario}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da Rescisão *</label>
                <select name="tipoDispensa" value={formData.tipoDispensa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoDispensa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sem_justa_causa">Sem justa causa</option>
                  <option value="com_justa_causa">Com justa causa</option>
                  <option value="pedido_demissao">Pedido de demissão</option>
                  <option value="rescisao_indireta">Rescisão indireta</option>
                </select>
                {errors.tipoDispensa && <p className="text-red-700 text-xs mt-1">{errors.tipoDispensa}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Total do Acordo *</label>
                <input type="text" name="valorAcordoTotal" value={formData.valorAcordoTotal || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); setFormData(prev => ({ ...prev, valorAcordoTotal: value })); if (errors.valorAcordoTotal) setErrors(prev => ({ ...prev, valorAcordoTotal: '' })); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorAcordoTotal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 0,00" />
                {errors.valorAcordoTotal && <p className="text-red-700 text-xs mt-1">{errors.valorAcordoTotal}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Forma de Pagamento *</label>
                <select name="formaPagamento" value={formData.formaPagamento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.formaPagamento ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="avista">À vista</option>
                  <option value="parcelado">Parcelado</option>
                </select>
                {errors.formaPagamento && <p className="text-red-700 text-xs mt-1">{errors.formaPagamento}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Quitação *</label>
                <select name="tipoQuitacao" value={formData.tipoQuitacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoQuitacao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="geral">Geral</option>
                  <option value="parcial">Parcial</option>
                  <option value="com_reserva">Com reserva</option>
                </select>
                {errors.tipoQuitacao && <p className="text-red-700 text-xs mt-1">{errors.tipoQuitacao}</p>}
              </div>
            </div>

            {formData.formaPagamento === 'parcelado' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quantidade de Parcelas *</label>
                  <input type="number" name="quantidadeParcelas" value={formData.quantidadeParcelas || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${(formData.formaPagamento === 'parcelado' && errors.quantidadeParcelas) ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1-24" />
                  {formData.formaPagamento === 'parcelado' && errors.quantidadeParcelas && <p className="text-red-700 text-xs mt-1">{errors.quantidadeParcelas}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Primeiro Pagamento *</label>
                  <input type="text" name="primeiroVencimento" value={formData.primeiroVencimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${(formData.formaPagamento === 'parcelado' && errors.primeiroVencimento) ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                  {formData.formaPagamento === 'parcelado' && errors.primeiroVencimento && <p className="text-red-700 text-xs mt-1">{errors.primeiroVencimento}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Multa por Atraso *</label>
                  <input type="text" name="multaPorAtraso" value={formData.multaPorAtraso || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$%\s]/g, ''); setFormData(prev => ({ ...prev, multaPorAtraso: value })); if (errors.multaPorAtraso) setErrors(prev => ({ ...prev, multaPorAtraso: '' })); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.multaPorAtraso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 10% ou R$ 100,00" />
                  {errors.multaPorAtraso && <p className="text-red-700 text-xs mt-1">{errors.multaPorAtraso}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Banco</label>
                <input type="text" name="banco" value={formData.banco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.banco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do banco" />
                {errors.banco && <p className="text-red-700 text-xs mt-1">{errors.banco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Agência</label>
                <input type="text" name="agencia" value={formData.agencia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.agencia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="0000" />
                {errors.agencia && <p className="text-red-700 text-xs mt-1">{errors.agencia}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Conta</label>
                <input type="text" name="conta" value={formData.conta || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conta ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00000-0" />
                {errors.conta && <p className="text-red-700 text-xs mt-1">{errors.conta}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">PIX</label>
                <input type="text" name="pix" value={formData.pix || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Chave PIX" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Advogado do Empregador *</label>
                <input type="text" name="advogadoEmpregadorNome" value={formData.advogadoEmpregadorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoEmpregadorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoEmpregadorNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoEmpregadorNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB do Empregador *</label>
                <input type="text" name="advogadoEmpregadorOab" value={formData.advogadoEmpregadorOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoEmpregadorOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoEmpregadorOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoEmpregadorOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Advogado do Empregado *</label>
                <input type="text" name="advogadoEmpregadoNome" value={formData.advogadoEmpregadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoEmpregadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoEmpregadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoEmpregadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB do Empregado *</label>
                <input type="text" name="advogadoEmpregadoOab" value={formData.advogadoEmpregadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoEmpregadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoEmpregadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoEmpregadoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara do Trabalho *</label>
                <input type="text" name="varaTrabalho" value={formData.varaTrabalho || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaTrabalho ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara do Trabalho de ..." />
                {errors.varaTrabalho && <p className="text-red-700 text-xs mt-1">{errors.varaTrabalho}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cidade/UF *</label>
                <input type="text" name="cidadeUfVara" value={formData.cidadeUfVara || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cidadeUfVara ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="São Paulo/SP" />
                {errors.cidadeUfVara && <p className="text-red-700 text-xs mt-1">{errors.cidadeUfVara}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Verbas do Acordo</label>
              <textarea name="verbasAcordo" value={formData.verbasAcordo || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva as verbas do acordo e valores" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Testemunhas</label>
              <textarea name="testemunhas" value={formData.testemunhas || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Informe nomes completos, um por linha" />
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="ae-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="ae-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'recurso_ordinario_trabalhista' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recurso Ordinário</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Processo *</label>
                <input type="text" name="numeroProcesso" value={formData.numeroProcesso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.numeroProcesso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="0000000-00.0000.0.00.0000" />
                {errors.numeroProcesso && <p className="text-red-700 text-xs mt-1">{errors.numeroProcesso}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara do Trabalho de Origem *</label>
                <input type="text" name="varaTrabalho" value={formData.varaTrabalho || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaTrabalho ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara do Trabalho de São Paulo" />
                {errors.varaTrabalho && <p className="text-red-700 text-xs mt-1">{errors.varaTrabalho}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">TRT de Destino *</label>
                <select name="trtDestino" value={formData.trtDestino || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.trtDestino ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  {trtOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.trtDestino && <p className="text-red-700 text-xs mt-1">{errors.trtDestino}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cidade/UF *</label>
                <input type="text" name="cidadeUf" value={formData.cidadeUf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cidadeUf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="São Paulo/SP" />
                {errors.cidadeUf && <p className="text-red-700 text-xs mt-1">{errors.cidadeUf}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Recorrente *</label>
                <select name="tipoRecorrente" value={formData.tipoRecorrente || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoRecorrente ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="reclamante">Reclamante</option>
                  <option value="reclamado">Reclamado</option>
                </select>
                {errors.tipoRecorrente && <p className="text-red-700 text-xs mt-1">{errors.tipoRecorrente}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Recorrente *</label>
                <input type="text" name="recorrenteNome" value={formData.recorrenteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.recorrenteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome de quem recorre" />
                {errors.recorrenteNome && <p className="text-red-700 text-xs mt-1">{errors.recorrenteNome}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF/CNPJ do Recorrente *</label>
                <input type="text" name="recorrenteCpfCnpj" value={formData.recorrenteCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.recorrenteCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Documento do recorrente" />
                {errors.recorrenteCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.recorrenteCpfCnpj}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Recorrido *</label>
                <input type="text" name="recorridoNome" value={formData.recorridoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.recorridoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome da outra parte" />
                {errors.recorridoNome && <p className="text-red-700 text-xs mt-1">{errors.recorridoNome}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da Publicação da Sentença *</label>
                <input type="text" name="dataPublicacaoSentenca" value={formData.dataPublicacaoSentenca || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataPublicacaoSentenca ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataPublicacaoSentenca && <p className="text-red-700 text-xs mt-1">{errors.dataPublicacaoSentenca}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Protocolo do Recurso *</label>
                <input type="text" name="dataProtocoloRecurso" value={formData.dataProtocoloRecurso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataProtocoloRecurso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataProtocoloRecurso && <p className="text-red-700 text-xs mt-1">{errors.dataProtocoloRecurso}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo da Sentença *</label>
              <textarea name="resumoSentenca" value={formData.resumoSentenca || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.resumoSentenca ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que foi decidido" />
              {errors.resumoSentenca && <p className="text-red-700 text-xs mt-1">{errors.resumoSentenca}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Pedidos Deferidos *</label>
                <textarea name="pedidosDeferidos" value={formData.pedidosDeferidos || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.pedidosDeferidos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que o juiz concedeu" />
                {errors.pedidosDeferidos && <p className="text-red-700 text-xs mt-1">{errors.pedidosDeferidos}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Pedidos Indeferidos *</label>
                <textarea name="pedidosIndeferidos" value={formData.pedidosIndeferidos || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.pedidosIndeferidos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que o juiz negou" />
                {errors.pedidosIndeferidos && <p className="text-red-700 text-xs mt-1">{errors.pedidosIndeferidos}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Matérias Recorridas *</label>
              <textarea name="materiasRecorridas" value={formData.materiasRecorridas || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.materiasRecorridas ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Pontos a serem impugnados (uma matéria por linha)" />
              {errors.materiasRecorridas && <p className="text-red-700 text-xs mt-1">{errors.materiasRecorridas}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razões da Reforma *</label>
              <textarea name="razoesReforma" value={formData.razoesReforma || ''} onChange={handleInputChange} rows={6} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.razoesReforma ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Por que a sentença deve ser reformada" />
              {errors.razoesReforma && <p className="text-red-700 text-xs mt-1">{errors.razoesReforma}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Houve condenação?</label>
                <select name="houveCondenacao" value={formData.houveCondenacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.tipoRecorrente === 'reclamado' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">É Microempresa/EPP?</label>
                  <select name="ehMPEEPP" value={formData.ehMPEEPP || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.houveCondenacao === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor da Condenação</label>
                  <input type="text" name="valorCondenacao" value={formData.valorCondenacao || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 00.000,00" />
                </div>
              )}
              {formData.tipoRecorrente === 'reclamado' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Custas Processuais</label>
                  <input type="text" name="custasProcessuais" value={formData.custasProcessuais || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); setFormData(prev => ({ ...prev, custasProcessuais: value })); if (errors.custasProcessuais) setErrors(prev => ({ ...prev, custasProcessuais: '' })); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 000,00" />
                </div>
              )}
              {formData.tipoRecorrente === 'reclamado' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Depósito Recursal</label>
                  <input type="text" name="depositoRecursal" value={formData.depositoRecursal || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s]/g, ''); setFormData(prev => ({ ...prev, depositoRecursal: value })); if (errors.depositoRecursal) setErrors(prev => ({ ...prev, depositoRecursal: '' })); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 00.000,00" />
                </div>
              )}
              {formData.tipoRecorrente === 'reclamante' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Beneficiário de Justiça Gratuita?</label>
                  <select name="beneficioJusticaGratuita" value={formData.beneficioJusticaGratuita || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Teses Recursais Específicas</label>
                <textarea name="tesesRecursais" value={formData.tesesRecursais || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Argumentos jurídicos detalhados" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Jurisprudência a Citar</label>
                <textarea name="jurisprudenciaCitar" value={formData.jurisprudenciaCitar || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Súmulas, OJs, julgados" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Trechos de Depoimentos</label>
              <textarea name="trechosDepoimentos" value={formData.trechosDepoimentos || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Citações da prova testemunhal" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do advogado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Advogado</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="ro-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="ro-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'habeas_corpus' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Habeas Corpus</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Paciente *</label>
                <input type="text" name="pacienteNome" value={formData.pacienteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.pacienteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.pacienteNome && <p className="text-red-700 text-xs mt-1">{errors.pacienteNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="pacienteCpf" value={formData.pacienteCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.pacienteCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.pacienteCpf && <p className="text-red-700 text-xs mt-1">{errors.pacienteCpf}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="pacienteRg" value={formData.pacienteRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.pacienteRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.pacienteRg && <p className="text-red-700 text-xs mt-1">{errors.pacienteRg}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Paciente *</label>
                <input type="text" name="pacienteEndereco" value={formData.pacienteEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.pacienteEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.pacienteEndereco && <p className="text-red-700 text-xs mt-1">{errors.pacienteEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Está Preso? *</label>
                <select name="estaPreso" value={formData.estaPreso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.estaPreso ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.estaPreso && <p className="text-red-700 text-xs mt-1">{errors.estaPreso}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Prisão *</label>
                <select name="tipoPrisao" value={formData.tipoPrisao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoPrisao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="flagrante">Flagrante</option>
                  <option value="preventiva">Preventiva</option>
                  <option value="temporaria">Temporária</option>
                  <option value="condenacao">Condenação</option>
                </select>
                {errors.tipoPrisao && <p className="text-red-700 text-xs mt-1">{errors.tipoPrisao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da Prisão *</label>
                <input type="text" name="dataPrisao" value={formData.dataPrisao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataPrisao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataPrisao && <p className="text-red-700 text-xs mt-1">{errors.dataPrisao}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Crime Imputado *</label>
                <input type="text" name="crimeImputado" value={formData.crimeImputado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.crimeImputado ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: Roubo (art. 157 CP)" />
                {errors.crimeImputado && <p className="text-red-700 text-xs mt-1">{errors.crimeImputado}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Autoridade Coatora *</label>
                <input type="text" name="autoridadeCoatora" value={formData.autoridadeCoatora || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autoridadeCoatora ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome/cargo da autoridade" />
                {errors.autoridadeCoatora && <p className="text-red-700 text-xs mt-1">{errors.autoridadeCoatora}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Órgão/Juízo de Origem *</label>
                <input type="text" name="orgaoOrigem" value={formData.orgaoOrigem || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.orgaoOrigem ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Vara/Comarca" />
                {errors.orgaoOrigem && <p className="text-red-700 text-xs mt-1">{errors.orgaoOrigem}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tribunal Competente *</label>
                <select name="tribunalCompetente" value={formData.tribunalCompetente || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tribunalCompetente ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  {tribunalCompetenteOptions.map(opt => (
                    <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                  ))}
                </select>
                {errors.tribunalCompetente && <p className="text-red-700 text-xs mt-1">{errors.tribunalCompetente}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado/Região *</label>
                <select name="estadoRegiao" value={formData.estadoRegiao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.estadoRegiao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  {estadoRegiaoOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.estadoRegiao && <p className="text-red-700 text-xs mt-1">{errors.estadoRegiao}</p>}
              </div>
              {formData.estaPreso === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Local da Prisão</label>
                  <input type="text" name="localPrisao" value={formData.localPrisao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.localPrisao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do presídio/delegacia" />
                  {errors.localPrisao && <p className="text-red-700 text-xs mt-1">{errors.localPrisao}</p>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Constrangimento *</label>
              <textarea name="tipoConstrangimento" value={formData.tipoConstrangimento || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoConstrangimento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Teses do HC (uma por linha)" />
              {errors.tipoConstrangimento && <p className="text-red-700 text-xs mt-1">{errors.tipoConstrangimento}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Narrativa dos Fatos *</label>
              <textarea name="narrativaFatos" value={formData.narrativaFatos || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.narrativaFatos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que aconteceu" />
              {errors.narrativaFatos && <p className="text-red-700 text-xs mt-1">{errors.narrativaFatos}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Argumentos da Defesa *</label>
              <textarea name="argumentosDefesa" value={formData.argumentosDefesa || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.argumentosDefesa ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Por que a prisão é ilegal" />
              {errors.argumentosDefesa && <p className="text-red-700 text-xs mt-1">{errors.argumentosDefesa}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há Processo?</label>
                <select name="haProcesso" value={formData.haProcesso || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há Decisão Atacada?</label>
                <select name="haDecisao" value={formData.haDecisao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.haProcesso === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Processo</label>
                  <input type="text" name="numeroProcesso" value={formData.numeroProcesso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.numeroProcesso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="0000000-00.0000.0.00.0000" />
                  {errors.numeroProcesso && <p className="text-red-700 text-xs mt-1">{errors.numeroProcesso}</p>}
                </div>
              )}
              {formData.haDecisao === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da Decisão Atacada</label>
                  <input type="text" name="dataDecisaoAtacada" value={formData.dataDecisaoAtacada || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataDecisaoAtacada ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                  {errors.dataDecisaoAtacada && <p className="text-red-700 text-xs mt-1">{errors.dataDecisaoAtacada}</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                <input type="text" name="nacionalidade" value={formData.nacionalidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="uniao_estavel">União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                <input type="text" name="profissao" value={formData.profissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ocupação" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tem Filhos Menores?</label>
                <select name="filhosMenores" value={formData.filhosMenores || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.filhosMenores === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quantos Filhos e Idades</label>
                  <input type="text" name="filhosMenoresQtdIdades" value={formData.filhosMenoresQtdIdades || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.filhosMenoresQtdIdades ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 2 filhos (3 e 5 anos)" />
                  {errors.filhosMenoresQtdIdades && <p className="text-red-700 text-xs mt-1">{errors.filhosMenoresQtdIdades}</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Problemas de Saúde?</label>
                <select name="temProblemasSaude" value={formData.temProblemasSaude || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.temProblemasSaude === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Problemas de Saúde</label>
                  <input type="text" name="problemasSaudeDetalhes" value={formData.problemasSaudeDetalhes || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.problemasSaudeDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Especificar" />
                  {errors.problemasSaudeDetalhes && <p className="text-red-700 text-xs mt-1">{errors.problemasSaudeDetalhes}</p>}
                </div>
              )}
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="hc-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="hc-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'resposta_acusacao' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Resposta à Acusação</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Processo *</label>
                <input type="text" name="numeroProcesso" value={formData.numeroProcesso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.numeroProcesso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="0000000-00.0000.0.00.0000" />
                {errors.numeroProcesso && <p className="text-red-700 text-xs mt-1">{errors.numeroProcesso}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara Criminal *</label>
                <input type="text" name="varaCriminal" value={formData.varaCriminal || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaCriminal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara Criminal de São Paulo" />
                {errors.varaCriminal && <p className="text-red-700 text-xs mt-1">{errors.varaCriminal}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Ação *</label>
                <select name="tipoAcao" value={formData.tipoAcao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoAcao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="publica">Ação Penal Pública</option>
                  <option value="privada">Ação Penal Privada</option>
                </select>
                {errors.tipoAcao && <p className="text-red-700 text-xs mt-1">{errors.tipoAcao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Autor *</label>
                <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ministério Público ou Querelante" />
                {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Acusado *</label>
                <input type="text" name="acusadoNome" value={formData.acusadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.acusadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.acusadoNome && <p className="text-red-700 text-xs mt-1">{errors.acusadoNome}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="acusadoCpf" value={formData.acusadoCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.acusadoCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.acusadoCpf && <p className="text-red-700 text-xs mt-1">{errors.acusadoCpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="acusadoRg" value={formData.acusadoRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.acusadoRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0 (Órgão)" />
                {errors.acusadoRg && <p className="text-red-700 text-xs mt-1">{errors.acusadoRg}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Acusado *</label>
                <input type="text" name="acusadoEndereco" value={formData.acusadoEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.acusadoEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                {errors.acusadoEndereco && <p className="text-red-700 text-xs mt-1">{errors.acusadoEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Crime Imputado *</label>
                <input type="text" name="crimeImputado" value={formData.crimeImputado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.crimeImputado ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: Furto (art. 155 CP)" />
                {errors.crimeImputado && <p className="text-red-700 text-xs mt-1">{errors.crimeImputado}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data dos Fatos *</label>
                <input type="text" name="dataFatos" value={formData.dataFatos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataFatos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataFatos && <p className="text-red-700 text-xs mt-1">{errors.dataFatos}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo da Denúncia/Queixa *</label>
              <textarea name="resumoDenuncia" value={formData.resumoDenuncia || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.resumoDenuncia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que a acusação alega" />
              {errors.resumoDenuncia && <p className="text-red-700 text-xs mt-1">{errors.resumoDenuncia}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Versão dos Fatos (Defesa) *</label>
              <textarea name="versaoFatosDefesa" value={formData.versaoFatosDefesa || ''} onChange={handleInputChange} rows={6} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.versaoFatosDefesa ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que realmente aconteceu" />
              {errors.versaoFatosDefesa && <p className="text-red-700 text-xs mt-1">{errors.versaoFatosDefesa}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Teses Defensivas *</label>
              <textarea name="tesesDefensivas" value={formData.tesesDefensivas || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tesesDefensivas ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Teses defensivas (uma por linha)" />
              {errors.tesesDefensivas && <p className="text-red-700 text-xs mt-1">{errors.tesesDefensivas}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da Citação *</label>
                <input type="text" name="dataCitacao" value={formData.dataCitacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataCitacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataCitacao && <p className="text-red-700 text-xs mt-1">{errors.dataCitacao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Protocolo *</label>
                <input type="text" name="dataProtocolo" value={formData.dataProtocolo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataProtocolo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataProtocolo && <p className="text-red-700 text-xs mt-1">{errors.dataProtocolo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Está Preso?</label>
                <select name="estaPreso" value={formData.estaPreso || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                <input type="text" name="nacionalidade" value={formData.nacionalidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="uniao_estavel">União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                <input type="text" name="profissao" value={formData.profissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ocupação" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="acusadoEmail" value={formData.acusadoEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="acusado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Preliminares Arguidas</label>
              <textarea name="preliminaresArguidas" value={formData.preliminaresArguidas || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Preliminares (uma por linha)" />
            </div>
            {(formData.preliminaresArguidas || '').trim() && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fundamentação das Preliminares</label>
                <textarea name="fundamentosPreliminares" value={formData.fundamentosPreliminares || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fundamentosPreliminares ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Detalhes" />
                {errors.fundamentosPreliminares && <p className="text-red-700 text-xs mt-1">{errors.fundamentosPreliminares}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Absolvição Sumária?</label>
                <select name="requerAbsolvicaoSumaria" value={formData.requerAbsolvicaoSumaria || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.requerAbsolvicaoSumaria === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fundamento da Absolvição Sumária</label>
                  <select name="fundamentoAbsolvicaoSumaria" value={formData.fundamentoAbsolvicaoSumaria || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fundamentoAbsolvicaoSumaria ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="atipicidade">Atipicidade</option>
                    <option value="excludente_ilicitude">Excludente de ilicitude</option>
                    <option value="excludente_culpabilidade">Excludente de culpabilidade</option>
                    <option value="falta_provas">Falta de provas</option>
                    <option value="prescricao">Prescrição</option>
                  </select>
                  {errors.fundamentoAbsolvicaoSumaria && <p className="text-red-700 text-xs mt-1">{errors.fundamentoAbsolvicaoSumaria}</p>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Argumentos Específicos</label>
              <textarea name="argumentosEspecificos" value={formData.argumentosEspecificos || ''} onChange={handleInputChange} rows={5} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Desenvolvimento das teses" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium">Testemunhas (até 8)</label>
                <button type="button" onClick={() => { if (witnesses.length < 8) setWitnesses(prev => { const next = [...prev, { nome: '', nacionalidade: '', estadoCivil: '', profissao: '', cpf: '', rg: '', endereco: '' }]; const texto = next.map((w,i) => `Testemunha ${i+1}: ${w.nome}; ${w.nacionalidade}; ${w.estadoCivil}; ${w.profissao}; CPF ${w.cpf}; RG ${w.rg}; ${w.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="btn-secondary px-3 py-2">Adicionar</button>
              </div>
              {witnesses.map((w, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input type="text" value={w.nome} onChange={(e) => { const val = e.target.value; setWitnesses(prev => { const next = [...prev]; next[idx] = { ...next[idx], nome: val }; const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome completo" />
                  <input type="text" value={w.nacionalidade} onChange={(e) => { const val = e.target.value; setWitnesses(prev => { const next = [...prev]; next[idx] = { ...next[idx], nacionalidade: val }; const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
                  <select value={w.estadoCivil} onChange={(e) => { const val = e.target.value; setWitnesses(prev => { const next = [...prev]; next[idx] = { ...next[idx], estadoCivil: val }; const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Estado Civil</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="uniao_estavel">União Estável</option>
                  </select>
                  <input type="text" value={w.profissao} onChange={(e) => { const val = e.target.value; setWitnesses(prev => { const next = [...prev]; next[idx] = { ...next[idx], profissao: val }; const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ocupação" />
                  <input type="text" value={w.cpf} onChange={(e) => { const val = e.target.value; setWitnesses(prev => { const next = [...prev]; next[idx] = { ...next[idx], cpf: val }; const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="000.000.000-00" />
                  <input type="text" value={w.rg} onChange={(e) => { const val = e.target.value; setWitnesses(prev => { const next = [...prev]; next[idx] = { ...next[idx], rg: val }; const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="00.000.000-0" />
                  <input type="text" value={w.endereco} onChange={(e) => { const val = e.target.value; setWitnesses(prev => { const next = [...prev]; next[idx] = { ...next[idx], endereco: val }; const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço completo" />
                  <div className="flex items-center">
                    <button type="button" onClick={() => { setWitnesses(prev => { const next = prev.filter((_,i) => i !== idx); const texto = next.map((x,i) => `Testemunha ${i+1}: ${x.nome}; ${x.nacionalidade}; ${x.estadoCivil}; ${x.profissao}; CPF ${x.cpf}; RG ${x.rg}; ${x.endereco}`).join('\n'); setFormData(fd => ({ ...fd, testemunhas: texto })); return next; }); }} className="text-red-600 hover:text-red-700">Remover</button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Provas Apresentadas pela Acusação</label>
              <textarea name="provasAcusacao" value={formData.provasAcusacao || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="O que foi juntado" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do advogado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Advogado</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="ra-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="ra-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'liberdade_provisoria' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Liberdade Provisória</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Processo *</label>
                <input type="text" name="numeroProcesso" value={formData.numeroProcesso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.numeroProcesso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="0000000-00.0000.0.00.0000" />
                {errors.numeroProcesso && <p className="text-red-700 text-xs mt-1">{errors.numeroProcesso}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara Criminal *</label>
                <input type="text" name="varaCriminal" value={formData.varaCriminal || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaCriminal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara Criminal de São Paulo" />
                {errors.varaCriminal && <p className="text-red-700 text-xs mt-1">{errors.varaCriminal}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Prisão Atual *</label>
                <select name="tipoPrisaoAtual" value={formData.tipoPrisaoAtual || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoPrisaoAtual ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="flagrante_convertida_preventiva">Flagrante convertido em preventiva</option>
                  <option value="preventiva">Preventiva</option>
                  <option value="temporaria">Temporária</option>
                </select>
                {errors.tipoPrisaoAtual && <p className="text-red-700 text-xs mt-1">{errors.tipoPrisaoAtual}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da Prisão *</label>
                <input type="text" name="dataPrisao" value={formData.dataPrisao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataPrisao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataPrisao && <p className="text-red-700 text-xs mt-1">{errors.dataPrisao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Crime Imputado *</label>
                <input type="text" name="crimeImputado" value={formData.crimeImputado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.crimeImputado ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: Furto (art. 155 CP)" />
                {errors.crimeImputado && <p className="text-red-700 text-xs mt-1">{errors.crimeImputado}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Requerente *</label>
                <input type="text" name="requerenteNome" value={formData.requerenteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerenteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.requerenteNome && <p className="text-red-700 text-xs mt-1">{errors.requerenteNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="requerenteCpf" value={formData.requerenteCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerenteCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.requerenteCpf && <p className="text-red-700 text-xs mt-1">{errors.requerenteCpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="requerenteRg" value={formData.requerenteRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerenteRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.requerenteRg && <p className="text-red-700 text-xs mt-1">{errors.requerenteRg}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Requerente *</label>
                <input type="text" name="requerenteEndereco" value={formData.requerenteEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerenteEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                {errors.requerenteEndereco && <p className="text-red-700 text-xs mt-1">{errors.requerenteEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Local da Prisão *</label>
                <input type="text" name="localPrisao" value={formData.localPrisao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.localPrisao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do estabelecimento prisional" />
                {errors.localPrisao && <p className="text-red-700 text-xs mt-1">{errors.localPrisao}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Narrativa dos Fatos *</label>
              <textarea name="narrativaFatos" value={formData.narrativaFatos || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.narrativaFatos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que aconteceu" />
              {errors.narrativaFatos && <p className="text-red-700 text-xs mt-1">{errors.narrativaFatos}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Teses para Liberdade *</label>
              <textarea name="tesesLiberdade" value={formData.tesesLiberdade || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tesesLiberdade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Teses para liberdade (uma por linha)" />
              {errors.tesesLiberdade && <p className="text-red-700 text-xs mt-1">{errors.tesesLiberdade}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Condições Pessoais</label>
              <textarea name="condicoesPessoais" value={formData.condicoesPessoais || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Condições pessoais (uma por linha)" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.filhosMenores === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quantos filhos e idades</label>
                  <input type="text" name="filhosMenoresQtdIdades" value={formData.filhosMenoresQtdIdades || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.filhosMenoresQtdIdades ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 2 filhos (3 e 5 anos)" />
                  {errors.filhosMenoresQtdIdades && <p className="text-red-700 text-xs mt-1">{errors.filhosMenoresQtdIdades}</p>}
                </div>
              )}
              {formData.temProblemasSaude === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Qual problema de saúde</label>
                  <input type="text" name="problemasSaudeDetalhes" value={formData.problemasSaudeDetalhes || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.problemasSaudeDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Especificar" />
                  {errors.problemasSaudeDetalhes && <p className="text-red-700 text-xs mt-1">{errors.problemasSaudeDetalhes}</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                <input type="text" name="nacionalidade" value={formData.nacionalidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="uniao_estavel">União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                <input type="text" name="profissao" value={formData.profissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ocupação" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Circunstâncias da Prisão</label>
              <textarea name="circunstanciasPrisao" value={formData.circunstanciasPrisao || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Como ocorreu a prisão" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fundamentos da Decisão</label>
              <textarea name="fundamentosDecisao" value={formData.fundamentosDecisao || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="O que o juiz disse" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Argumentos Específicos</label>
              <textarea name="argumentosEspecificos" value={formData.argumentosEspecificos || ''} onChange={handleInputChange} rows={5} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Desenvolvimento das teses" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Aceita Medidas Cautelares?</label>
                <select name="aceitaMedidasCautelares" value={formData.aceitaMedidasCautelares || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Fiança?</label>
                <select name="requerFianca" value={formData.requerFianca || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            {formData.aceitaMedidasCautelares === 'sim' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Medidas Sugeridas</label>
                <textarea
                  name="medidasSugeridas"
                  value={formData.medidasSugeridas || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Descreva as medidas cautelares a serem sugeridas"
                />
                {errors.medidasSugeridas && <p className="text-red-700 text-xs mt-1">{errors.medidasSugeridas}</p>}
              </div>
            )}

            {formData.requerFianca === 'sim' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor de fiança sugerido</label>
                <input
                  type="text"
                  name="valorFiancaSugerido"
                  value={formData.valorFiancaSugerido || ''}
                  onChange={handleInputChange}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorFiancaSugerido ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="R$ 0.000,00"
                />
                {errors.valorFiancaSugerido && <p className="text-red-700 text-xs mt-1">{errors.valorFiancaSugerido}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outras condições favoráveis</label>
              <textarea name="outrasCondicoesFavoraveis" value={formData.outrasCondicoesFavoraveis || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Informações adicionais" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do advogado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Advogado</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="telefoneContato" value={formData.telefoneContato || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="lp-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="lp-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'alegacoes_finais' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Alegações Finais</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Processo *</label>
                <input type="text" name="numeroProcesso" value={formData.numeroProcesso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.numeroProcesso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="0000000-00.0000.0.00.0000" />
                {errors.numeroProcesso && <p className="text-red-700 text-xs mt-1">{errors.numeroProcesso}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara Criminal *</label>
                <input type="text" name="varaCriminal" value={formData.varaCriminal || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaCriminal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara Criminal de São Paulo" />
                {errors.varaCriminal && <p className="text-red-700 text-xs mt-1">{errors.varaCriminal}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Ação *</label>
                <select name="tipoAcao" value={formData.tipoAcao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoAcao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="publica">Ação Penal Pública</option>
                  <option value="privada">Ação Penal Privada</option>
                </select>
                {errors.tipoAcao && <p className="text-red-700 text-xs mt-1">{errors.tipoAcao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Crime Imputado *</label>
                <input type="text" name="crimeImputado" value={formData.crimeImputado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.crimeImputado ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: Injúria (art. 140 CP)" />
                {errors.crimeImputado && <p className="text-red-700 text-xs mt-1">{errors.crimeImputado}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Está Preso?</label>
                <select name="estaPreso" value={formData.estaPreso || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Acusado *</label>
                <input type="text" name="acusadoNome" value={formData.acusadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.acusadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.acusadoNome && <p className="text-red-700 text-xs mt-1">{errors.acusadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data dos Fatos *</label>
                <input type="text" name="dataFatos" value={formData.dataFatos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataFatos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataFatos && <p className="text-red-700 text-xs mt-1">{errors.dataFatos}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Análise da Dosimetria?</label>
                <select name="requerAnaliseDosimetria" value={formData.requerAnaliseDosimetria || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo da Denúncia/Queixa *</label>
              <textarea name="resumoDenuncia" value={formData.resumoDenuncia || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.resumoDenuncia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que a acusação alega" />
              {errors.resumoDenuncia && <p className="text-red-700 text-xs mt-1">{errors.resumoDenuncia}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Provas Produzidas pela Acusação *</label>
                <textarea name="provasAcusacao" value={formData.provasAcusacao || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.provasAcusacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Testemunhas, documentos, perícias" />
                {errors.provasAcusacao && <p className="text-red-700 text-xs mt-1">{errors.provasAcusacao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Provas Produzidas pela Defesa *</label>
                <textarea name="provasDefesa" value={formData.provasDefesa || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.provasDefesa ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Testemunhas, documentos, perícias" />
                {errors.provasDefesa && <p className="text-red-700 text-xs mt-1">{errors.provasDefesa}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resumo do Interrogatório *</label>
              <textarea name="resumoInterrogatorio" value={formData.resumoInterrogatorio || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.resumoInterrogatorio ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="O que o acusado disse" />
              {errors.resumoInterrogatorio && <p className="text-red-700 text-xs mt-1">{errors.resumoInterrogatorio}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Teses Principais *</label>
              <textarea name="tesesPrincipais" value={formData.tesesPrincipais || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tesesPrincipais ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Teses principais (uma por linha)" />
              {errors.tesesPrincipais && <p className="text-red-700 text-xs mt-1">{errors.tesesPrincipais}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Pontos Favoráveis à Defesa</label>
              <textarea name="pontosFavoraveisDefesa" value={formData.pontosFavoraveisDefesa || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Contradições, fragilidades" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Pontos Desfavoráveis</label>
              <textarea name="pontosDesfavoraveisDefesa" value={formData.pontosDesfavoraveisDefesa || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="O que a acusação provou" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Desenvolvimento das Teses</label>
              <textarea name="desenvolvimentoTeses" value={formData.desenvolvimentoTeses || ''} onChange={handleInputChange} rows={5} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Argumentos específicos" />
            </div>

            {formData.requerAnaliseDosimetria === 'sim' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Circunstâncias Favoráveis</label>
                <textarea name="circunstanciasFavoraveis" value={formData.circunstanciasFavoraveis || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva as circunstâncias favoráveis" />
                {errors.circunstanciasFavoraveis && <p className="text-red-700 text-xs mt-1">{errors.circunstanciasFavoraveis}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do advogado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail do Advogado</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="af-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="af-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'divorcio_consensual' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Divórcio Consensual</h2>
          <form className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cônjuge 1</h3>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo (Cônjuge 1) *</label>
              <input type="text" name="conjuge1Nome" value={formData.conjuge1Nome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1Nome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
              {errors.conjuge1Nome && <p className="text-red-700 text-xs mt-1">{errors.conjuge1Nome}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade (Cônjuge 1) *</label>
                <input type="text" name="conjuge1Nacionalidade" value={formData.conjuge1Nacionalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1Nacionalidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Brasileiro(a)" />
                {errors.conjuge1Nacionalidade && <p className="text-red-700 text-xs mt-1">{errors.conjuge1Nacionalidade}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão (Cônjuge 1) *</label>
                <input type="text" name="conjuge1Profissao" value={formData.conjuge1Profissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1Profissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ocupação" />
                {errors.conjuge1Profissao && <p className="text-red-700 text-xs mt-1">{errors.conjuge1Profissao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG (Cônjuge 1) *</label>
                <input type="text" name="conjuge1Rg" value={formData.conjuge1Rg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1Rg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.conjuge1Rg && <p className="text-red-700 text-xs mt-1">{errors.conjuge1Rg}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Órgão Expedidor (Cônjuge 1) *</label>
                <input type="text" name="conjuge1OrgaoExpedidor" value={formData.conjuge1OrgaoExpedidor || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1OrgaoExpedidor ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="SSP/SP" />
                {errors.conjuge1OrgaoExpedidor && <p className="text-red-700 text-xs mt-1">{errors.conjuge1OrgaoExpedidor}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF (Cônjuge 1) *</label>
                <input type="text" name="conjuge1Cpf" value={formData.conjuge1Cpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1Cpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.conjuge1Cpf && <p className="text-red-700 text-xs mt-1">{errors.conjuge1Cpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail (Cônjuge 1) *</label>
                <input type="email" name="conjuge1Email" value={formData.conjuge1Email || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1Email ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                {errors.conjuge1Email && <p className="text-red-700 text-xs mt-1">{errors.conjuge1Email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço Completo (Cônjuge 1) *</label>
              <input type="text" name="conjuge1Endereco" value={formData.conjuge1Endereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1Endereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
              {errors.conjuge1Endereco && <p className="text-red-700 text-xs mt-1">{errors.conjuge1Endereco}</p>}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cônjuge 2</h3>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo (Cônjuge 2) *</label>
              <input type="text" name="conjuge2Nome" value={formData.conjuge2Nome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2Nome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
              {errors.conjuge2Nome && <p className="text-red-700 text-xs mt-1">{errors.conjuge2Nome}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade (Cônjuge 2) *</label>
                <input type="text" name="conjuge2Nacionalidade" value={formData.conjuge2Nacionalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2Nacionalidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Brasileiro(a)" />
                {errors.conjuge2Nacionalidade && <p className="text-red-700 text-xs mt-1">{errors.conjuge2Nacionalidade}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão (Cônjuge 2) *</label>
                <input type="text" name="conjuge2Profissao" value={formData.conjuge2Profissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2Profissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ocupação" />
                {errors.conjuge2Profissao && <p className="text-red-700 text-xs mt-1">{errors.conjuge2Profissao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG (Cônjuge 2) *</label>
                <input type="text" name="conjuge2Rg" value={formData.conjuge2Rg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2Rg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.conjuge2Rg && <p className="text-red-700 text-xs mt-1">{errors.conjuge2Rg}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Órgão Expedidor (Cônjuge 2) *</label>
                <input type="text" name="conjuge2OrgaoExpedidor" value={formData.conjuge2OrgaoExpedidor || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2OrgaoExpedidor ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="SSP/SP" />
                {errors.conjuge2OrgaoExpedidor && <p className="text-red-700 text-xs mt-1">{errors.conjuge2OrgaoExpedidor}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF (Cônjuge 2) *</label>
                <input type="text" name="conjuge2Cpf" value={formData.conjuge2Cpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2Cpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.conjuge2Cpf && <p className="text-red-700 text-xs mt-1">{errors.conjuge2Cpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail (Cônjuge 2) *</label>
                <input type="email" name="conjuge2Email" value={formData.conjuge2Email || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2Email ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                {errors.conjuge2Email && <p className="text-red-700 text-xs mt-1">{errors.conjuge2Email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço Completo (Cônjuge 2) *</label>
              <input type="text" name="conjuge2Endereco" value={formData.conjuge2Endereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2Endereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
              {errors.conjuge2Endereco && <p className="text-red-700 text-xs mt-1">{errors.conjuge2Endereco}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Casamento *</label>
                <input type="text" name="dataCasamento" value={formData.dataCasamento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataCasamento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataCasamento && <p className="text-red-700 text-xs mt-1">{errors.dataCasamento}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Local do Casamento *</label>
                <input type="text" name="localCasamento" value={formData.localCasamento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.localCasamento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Cartório, Cidade/UF" />
                {errors.localCasamento && <p className="text-red-700 text-xs mt-1">{errors.localCasamento}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Regime de Bens *</label>
                <select name="regimeBens" value={formData.regimeBens || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.regimeBens ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="comunhao_parcial">Comunhão Parcial</option>
                  <option value="comunhao_universal">Comunhão Universal</option>
                  <option value="separacao_total">Separação Total</option>
                  <option value="participacao_final">Participação Final</option>
                </select>
                {errors.regimeBens && <p className="text-red-700 text-xs mt-1">{errors.regimeBens}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara de Família *</label>
              <input type="text" name="varaFamilia" value={formData.varaFamilia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaFamilia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara de Família de São Paulo" />
              {errors.varaFamilia && <p className="text-red-700 text-xs mt-1">{errors.varaFamilia}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Possui filhos menores?</label>
                <select name="filhosMenores" value={formData.filhosMenores || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.filhosMenores === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quantos Filhos e Idades *</label>
                  <input type="text" name="filhosMenoresQtdIdades" value={formData.filhosMenoresQtdIdades || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.filhosMenoresQtdIdades ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 2 filhos (3 e 5 anos)" />
                  {errors.filhosMenoresQtdIdades && <p className="text-red-700 text-xs mt-1">{errors.filhosMenoresQtdIdades}</p>}
                </div>
              )}
            </div>

            {formData.filhosMenores === 'sim' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium">Filhos</label>
                  <button type="button" onClick={() => { const next = [...filhos, { nome: '', nascimento: '' }]; setFilhos(next); const texto = next.map((f,i) => `Filho ${i+1}: ${f.nome}; Nasc. ${f.nascimento}`).join('\n'); setFormData(fd => ({ ...fd, filhosLista: texto })); }} className="btn-secondary px-3 py-2">Adicionar Filho</button>
                </div>
                {filhos.map((f, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={f.nome} onChange={(e) => { const val = e.target.value; setFilhos(prev => { const next = [...prev]; next[idx] = { ...next[idx], nome: val }; const texto = next.map((x,i) => `Filho ${i+1}: ${x.nome}; Nasc. ${x.nascimento}`).join('\n'); setFormData(fd => ({ ...fd, filhosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome completo" />
                    <input type="text" value={f.nascimento} onChange={(e) => { const val = e.target.value; setFilhos(prev => { const next = [...prev]; next[idx] = { ...next[idx], nascimento: val }; const texto = next.map((x,i) => `Filho ${i+1}: ${x.nome}; Nasc. ${x.nascimento}`).join('\n'); setFormData(fd => ({ ...fd, filhosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="dd/mm/aaaa" />
                    <div className="flex items-center">
                      <button type="button" onClick={() => { setFilhos(prev => { const next = prev.filter((_,i) => i !== idx); const texto = next.map((x,i) => `Filho ${i+1}: ${x.nome}; Nasc. ${x.nascimento}`).join('\n'); setFormData(fd => ({ ...fd, filhosLista: texto })); return next; }); }} className="text-red-600 hover:text-red-700">Remover</button>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Guarda *</label>
                    <select name="tipoGuarda" value={formData.tipoGuarda || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoGuarda ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="compartilhada">Compartilhada</option>
                      <option value="unilateral">Unilateral</option>
                    </select>
                    {errors.tipoGuarda && <p className="text-red-700 text-xs mt-1">{errors.tipoGuarda}</p>}
                  </div>
                  {formData.tipoGuarda === 'unilateral' && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Guardião</label>
                      <select name="guardiao" value={formData.guardiao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.guardiao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                        <option value="">Selecione</option>
                        <option value="conjuge1">Cônjuge 1</option>
                        <option value="conjuge2">Cônjuge 2</option>
                      </select>
                      {errors.guardiao && <p className="text-red-700 text-xs mt-1">{errors.guardiao}</p>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Residência dos Filhos *</label>
                    <input type="text" name="residenciaFilhos" value={formData.residenciaFilhos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.residenciaFilhos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço" />
                    {errors.residenciaFilhos && <p className="text-red-700 text-xs mt-1">{errors.residenciaFilhos}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Regime de Convivência *</label>
                    <textarea name="regimeConvivencia" value={formData.regimeConvivencia || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.regimeConvivencia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Detalhamento das visitas" />
                    {errors.regimeConvivencia && <p className="text-red-700 text-xs mt-1">{errors.regimeConvivencia}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quem paga alimentos? *</label>
                    <select name="quemPagaAlimentos" value={formData.quemPagaAlimentos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.quemPagaAlimentos ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="conjuge1">Cônjuge 1</option>
                      <option value="conjuge2">Cônjuge 2</option>
                      <option value="ambos">Ambos</option>
                    </select>
                    {errors.quemPagaAlimentos && <p className="text-red-700 text-xs mt-1">{errors.quemPagaAlimentos}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Valor *</label>
                    <select name="tipoValorAlimentos" value={formData.tipoValorAlimentos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoValorAlimentos ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="fixo">Valor Fixo</option>
                      <option value="percentual">Percentual</option>
                      <option value="salarios_minimos">Salários Mínimos</option>
                    </select>
                    {errors.tipoValorAlimentos && <p className="text-red-700 text-xs mt-1">{errors.tipoValorAlimentos}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor dos Alimentos *</label>
                    <input type="text" name="valorAlimentos" value={formData.valorAlimentos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorAlimentos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ ou % ou nº SM" />
                    {errors.valorAlimentos && <p className="text-red-700 text-xs mt-1">{errors.valorAlimentos}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Dia do Pagamento *</label>
                    <input type="text" name="diaPagamento" value={formData.diaPagamento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.diaPagamento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1 a 31" />
                    {errors.diaPagamento && <p className="text-red-700 text-xs mt-1">{errors.diaPagamento}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Conta para Depósito</label>
                    <input type="text" name="contaDeposito" value={formData.contaDeposito || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Banco, Ag, Conta" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há bens a partilhar?</label>
                <select name="haBensPartilha" value={formData.haBensPartilha || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            {formData.haBensPartilha === 'sim' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white uppercase">Imóveis</span>
                  <button type="button" onClick={() => { const next = [...imoveis, { descricao: '', matricula: '', destinacao: '' }]; setImoveis(next); const texto = next.map((m,i) => `Imóvel ${i+1}: ${m.descricao}; Matrícula ${m.matricula}; Destinação ${m.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, imoveisLista: texto })); }} className="btn-secondary px-3 py-2">Adicionar Imóvel</button>
                </div>
                {imoveis.map((m, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <textarea value={m.descricao} onChange={(e) => { const val = e.target.value; setImoveis(prev => { const next = [...prev]; next[idx] = { ...next[idx], descricao: val }; const texto = next.map((x,i) => `Imóvel ${i+1}: ${x.descricao}; Matrícula ${x.matricula}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, imoveisLista: texto })); return next; }); }} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço, características" />
                    <input type="text" value={m.matricula} onChange={(e) => { const val = e.target.value; setImoveis(prev => { const next = [...prev]; next[idx] = { ...next[idx], matricula: val }; const texto = next.map((x,i) => `Imóvel ${i+1}: ${x.descricao}; Matrícula ${x.matricula}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, imoveisLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nº da matrícula" />
                    <select value={m.destinacao} onChange={(e) => { const val = e.target.value; setImoveis(prev => { const next = [...prev]; next[idx] = { ...next[idx], destinacao: val }; const texto = next.map((x,i) => `Imóvel ${i+1}: ${x.descricao}; Matrícula ${x.matricula}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, imoveisLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Destinação</option>
                      <option value="conjuge1">Cônjuge 1</option>
                      <option value="conjuge2">Cônjuge 2</option>
                      <option value="vender_dividir">Vender e dividir</option>
                    </select>
                    <div className="md:col-span-3 flex items-center">
                      <button type="button" onClick={() => { setImoveis(prev => { const next = prev.filter((_,i) => i !== idx); const texto = next.map((x,i) => `Imóvel ${i+1}: ${x.descricao}; Matrícula ${x.matricula}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, imoveisLista: texto })); return next; }); }} className="text-red-600 hover:text-red-700">Remover</button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white uppercase">Veículos</span>
                  <button type="button" onClick={() => { const next = [...veiculos, { descricao: '', placa: '', destinacao: '' }]; setVeiculos(next); const texto = next.map((v,i) => `Veículo ${i+1}: ${v.descricao}; Placa ${v.placa}; Destinação ${v.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, veiculosLista: texto })); }} className="btn-secondary px-3 py-2">Adicionar Veículo</button>
                </div>
                {veiculos.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={v.descricao} onChange={(e) => { const val = e.target.value; setVeiculos(prev => { const next = [...prev]; next[idx] = { ...next[idx], descricao: val }; const texto = next.map((x,i) => `Veículo ${i+1}: ${x.descricao}; Placa ${x.placa}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, veiculosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Marca/Modelo/Ano" />
                    <input type="text" value={v.placa} onChange={(e) => { const val = e.target.value; setVeiculos(prev => { const next = [...prev]; next[idx] = { ...next[idx], placa: val }; const texto = next.map((x,i) => `Veículo ${i+1}: ${x.descricao}; Placa ${x.placa}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, veiculosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="ABC-1234" />
                    <select value={v.destinacao} onChange={(e) => { const val = e.target.value; setVeiculos(prev => { const next = [...prev]; next[idx] = { ...next[idx], destinacao: val }; const texto = next.map((x,i) => `Veículo ${i+1}: ${x.descricao}; Placa ${x.placa}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, veiculosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Destinação</option>
                      <option value="conjuge1">Cônjuge 1</option>
                      <option value="conjuge2">Cônjuge 2</option>
                    </select>
                    <div className="md:col-span-3 flex items-center">
                      <button type="button" onClick={() => { setVeiculos(prev => { const next = prev.filter((_,i) => i !== idx); const texto = next.map((x,i) => `Veículo ${i+1}: ${x.descricao}; Placa ${x.placa}; Destinação ${x.destinacao}`).join('\n'); setFormData(fd => ({ ...fd, veiculosLista: texto })); return next; }); }} className="text-red-600 hover:text-red-700">Remover</button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white uppercase">Contas/Investimentos</span>
                  <button type="button" onClick={() => { const next = [...contasInvestimentos, { descricao: '', divisao: '' }]; setContasInvestimentos(next); const texto = next.map((c,i) => `Conta/Investimento ${i+1}: ${c.descricao}; Divisão ${c.divisao}`).join('\n'); setFormData(fd => ({ ...fd, contasInvestimentosLista: texto })); }} className="btn-secondary px-3 py-2">Adicionar Conta/Investimento</button>
                </div>
                {contasInvestimentos.map((c, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={c.descricao} onChange={(e) => { const val = e.target.value; setContasInvestimentos(prev => { const next = [...prev]; next[idx] = { ...next[idx], descricao: val }; const texto = next.map((x,i) => `Conta/Investimento ${i+1}: ${x.descricao}; Divisão ${x.divisao}`).join('\n'); setFormData(fd => ({ ...fd, contasInvestimentosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Banco, tipo, valor" />
                    <input type="text" value={c.divisao} onChange={(e) => { const val = e.target.value; setContasInvestimentos(prev => { const next = [...prev]; next[idx] = { ...next[idx], divisao: val }; const texto = next.map((x,i) => `Conta/Investimento ${i+1}: ${x.descricao}; Divisão ${x.divisao}`).join('\n'); setFormData(fd => ({ ...fd, contasInvestimentosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Como será dividido" />
                    <div className="flex items-center">
                      <button type="button" onClick={() => { setContasInvestimentos(prev => { const next = prev.filter((_,i) => i !== idx); const texto = next.map((x,i) => `Conta/Investimento ${i+1}: ${x.descricao}; Divisão ${x.divisao}`).join('\n'); setFormData(fd => ({ ...fd, contasInvestimentosLista: texto })); return next; }); }} className="text-red-600 hover:text-red-700">Remover</button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white uppercase">Dívidas</span>
                  <button type="button" onClick={() => { const next = [...dividas, { descricao: '', responsavel: '' }]; setDividas(next); const texto = next.map((d,i) => `Dívida ${i+1}: ${d.descricao}; Responsável ${d.responsavel}`).join('\n'); setFormData(fd => ({ ...fd, dividasLista: texto })); }} className="btn-secondary px-3 py-2">Adicionar Dívida</button>
                </div>
                {dividas.map((d, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={d.descricao} onChange={(e) => { const val = e.target.value; setDividas(prev => { const next = [...prev]; next[idx] = { ...next[idx], descricao: val }; const texto = next.map((x,i) => `Dívida ${i+1}: ${x.descricao}; Responsável ${x.responsavel}`).join('\n'); setFormData(fd => ({ ...fd, dividasLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Credor, valor" />
                    <select value={d.responsavel} onChange={(e) => { const val = e.target.value; setDividas(prev => { const next = [...prev]; next[idx] = { ...next[idx], responsavel: val }; const texto = next.map((x,i) => `Dívida ${i+1}: ${x.descricao}; Responsável ${x.responsavel}`).join('\n'); setFormData(fd => ({ ...fd, dividasLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Responsável</option>
                      <option value="conjuge1">Cônjuge 1</option>
                      <option value="conjuge2">Cônjuge 2</option>
                      <option value="ambos">Ambos</option>
                    </select>
                    <div className="flex items-center">
                      <button type="button" onClick={() => { setDividas(prev => { const next = prev.filter((_,i) => i !== idx); const texto = next.map((x,i) => `Dívida ${i+1}: ${x.descricao}; Responsável ${x.responsavel}`).join('\n'); setFormData(fd => ({ ...fd, dividasLista: texto })); return next; }); }} className="text-red-600 hover:text-red-700">Remover</button>
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outros Bens</label>
                  <textarea name="outrosBens" value={formData.outrosBens || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descrição e divisão" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cônjuge 1 alterou nome no casamento?</label>
                <select name="conjuge1AlterouNome" value={formData.conjuge1AlterouNome || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.conjuge1AlterouNome === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Deseja voltar ao nome de solteiro(a)?</label>
                  <select name="conjuge1VoltarNome" value={formData.conjuge1VoltarNome || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              )}
            </div>

            {formData.conjuge1AlterouNome === 'sim' && formData.conjuge1VoltarNome === 'sim' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome de Solteiro(a) - Cônjuge 1</label>
                <input type="text" name="conjuge1NomeSolteiro" value={formData.conjuge1NomeSolteiro || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge1NomeSolteiro ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo de solteiro(a)" />
                {errors.conjuge1NomeSolteiro && <p className="text-red-700 text-xs mt-1">{errors.conjuge1NomeSolteiro}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cônjuge 2 alterou nome no casamento?</label>
                <select name="conjuge2AlterouNome" value={formData.conjuge2AlterouNome || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.conjuge2AlterouNome === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Deseja voltar ao nome de solteiro(a)?</label>
                  <select name="conjuge2VoltarNome" value={formData.conjuge2VoltarNome || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              )}
            </div>

            {formData.conjuge2AlterouNome === 'sim' && formData.conjuge2VoltarNome === 'sim' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome de Solteiro(a) - Cônjuge 2</label>
                <input type="text" name="conjuge2NomeSolteiro" value={formData.conjuge2NomeSolteiro || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjuge2NomeSolteiro ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo de solteiro(a)" />
                {errors.conjuge2NomeSolteiro && <p className="text-red-700 text-xs mt-1">{errors.conjuge2NomeSolteiro}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="dc-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="dc-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acao_alimentos' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ação de Alimentos</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Autor *</label>
                <select name="tipoAutor" value={formData.tipoAutor || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoAutor ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="menor_representado">Menor representado</option>
                  <option value="maior_capaz">Maior capaz</option>
                  <option value="incapaz_representado">Incapaz representado</option>
                </select>
                {errors.tipoAutor && <p className="text-red-700 text-xs mt-1">{errors.tipoAutor}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Autor *</label>
                <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Nascimento *</label>
                <input type="text" name="autorNascimento" value={formData.autorNascimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNascimento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.autorNascimento && <p className="text-red-700 text-xs mt-1">{errors.autorNascimento}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade *</label>
                <input type="text" name="autorNacionalidade" value={formData.autorNacionalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNacionalidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Brasileiro(a)" />
                {errors.autorNacionalidade && <p className="text-red-700 text-xs mt-1">{errors.autorNacionalidade}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço Completo *</label>
                <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
              </div>
            </div>

            {(formData.tipoAutor === 'menor_representado' || formData.tipoAutor === 'incapaz_representado') && (
              <>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Representante Legal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Representante *</label>
                    <input type="text" name="repNome" value={formData.repNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                    {errors.repNome && <p className="text-red-700 text-xs mt-1">{errors.repNome}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Parentesco *</label>
                    <select name="repParentesco" value={formData.repParentesco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repParentesco ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="mae">Mãe</option>
                      <option value="pai">Pai</option>
                      <option value="tutor">Tutor</option>
                      <option value="curador">Curador</option>
                    </select>
                    {errors.repParentesco && <p className="text-red-700 text-xs mt-1">{errors.repParentesco}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade *</label>
                    <input type="text" name="repNacionalidade" value={formData.repNacionalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repNacionalidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Brasileiro(a)" />
                    {errors.repNacionalidade && <p className="text-red-700 text-xs mt-1">{errors.repNacionalidade}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil *</label>
                    <select name="repEstadoCivil" value={formData.repEstadoCivil || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repEstadoCivil ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="solteiro">Solteiro(a)</option>
                      <option value="casado">Casado(a)</option>
                      <option value="divorciado">Divorciado(a)</option>
                      <option value="viuvo">Viúvo(a)</option>
                      <option value="uniao_estavel">União Estável</option>
                    </select>
                    {errors.repEstadoCivil && <p className="text-red-700 text-xs mt-1">{errors.repEstadoCivil}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão *</label>
                    <input type="text" name="repProfissao" value={formData.repProfissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repProfissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ocupação" />
                    {errors.repProfissao && <p className="text-red-700 text-xs mt-1">{errors.repProfissao}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                    <input type="text" name="repRg" value={formData.repRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                    {errors.repRg && <p className="text-red-700 text-xs mt-1">{errors.repRg}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                    <input type="text" name="repCpf" value={formData.repCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                    {errors.repCpf && <p className="text-red-700 text-xs mt-1">{errors.repCpf}</p>}
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                    <input type="text" name="repTelefone" value={formData.repTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                    {errors.repTelefone && <p className="text-red-700 text-xs mt-1">{errors.repTelefone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                    <input type="text" name="repEndereco" value={formData.repEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                    {errors.repEndereco && <p className="text-red-700 text-xs mt-1">{errors.repEndereco}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                    <input type="email" name="repEmail" value={formData.repEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.repEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                    {errors.repEmail && <p className="text-red-700 text-xs mt-1">{errors.repEmail}</p>}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Situação do Representante</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Situação Profissional</label>
                    <select name="sitProfissionalRep" value={formData.sitProfissionalRep || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Selecione</option>
                      <option value="empregado">Empregado</option>
                      <option value="autonomo">Autônomo</option>
                      <option value="desempregado">Desempregado</option>
                      <option value="do_lar">Do lar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda Mensal</label>
                    <input type="text" name="rendaMensalRep" value={formData.rendaMensalRep || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Possui outros filhos?</label>
                    <select name="outrosFilhosRep" value={formData.outrosFilhosRep || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Selecione</option>
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                    </select>
                  </div>
                </div>
                {formData.outrosFilhosRep === 'sim' && (
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quantos?</label>
                    <input type="text" name="qtdOutrosFilhosRep" value={formData.qtdOutrosFilhosRep || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Número" />
                  </div>
                )}
              </>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Réu (Alimentante)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Réu *</label>
                <input type="text" name="reuNome" value={formData.reuNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.reuNome && <p className="text-red-700 text-xs mt-1">{errors.reuNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Parentesco com Autor *</label>
                <select name="parentescoComAutor" value={formData.parentescoComAutor || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.parentescoComAutor ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="pai">Pai</option>
                  <option value="mae">Mãe</option>
                  <option value="avo">Avô</option>
                  <option value="avoa">Avó</option>
                  <option value="filho">Filho</option>
                  <option value="ex_conjuge">Ex-cônjuge</option>
                </select>
                {errors.parentescoComAutor && <p className="text-red-700 text-xs mt-1">{errors.parentescoComAutor}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade</label>
                <input type="text" name="reuNacionalidade" value={formData.reuNacionalidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil</label>
                <select name="reuEstadoCivil" value={formData.reuEstadoCivil || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="uniao_estavel">União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                <input type="text" name="reuProfissao" value={formData.reuProfissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ocupação" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG</label>
                <input type="text" name="reuRg" value={formData.reuRg || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="00.000.000-0" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF</label>
                <input type="text" name="reuCpf" value={formData.reuCpf || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Réu *</label>
                <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço para citação" />
                {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email (se souber)" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Informações sobre a Relação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documento que comprova parentesco *</label>
                <select name="documentoParentesco" value={formData.documentoParentesco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.documentoParentesco ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="certidao_nascimento">Certidão de nascimento</option>
                  <option value="certidao_casamento">Certidão de casamento</option>
                  <option value="dna">DNA</option>
                </select>
                {errors.documentoParentesco && <p className="text-red-700 text-xs mt-1">{errors.documentoParentesco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Houve separação dos pais?</label>
                <select name="houveSeparacaoPais" value={formData.houveSeparacaoPais || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.houveSeparacaoPais === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data aproximada da separação</label>
                  <input type="text" name="dataSeparacao" value={formData.dataSeparacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="dd/mm/aaaa" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">O réu paga algum valor atualmente?</label>
                <select name="reuPagaAtualmente" value={formData.reuPagaAtualmente || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                  <option value="irregularmente">Irregularmente</option>
                </select>
              </div>
              {formData.reuPagaAtualmente === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor atual</label>
                  <input type="text" name="valorAtual" value={formData.valorAtual || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorAtual ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 0.000,00" />
                  {errors.valorAtual && <p className="text-red-700 text-xs mt-1">{errors.valorAtual}</p>}
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Necessidades do Alimentando</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Despesas com Alimentação</label>
                <input type="text" name="despesasAlimentacao" value={formData.despesasAlimentacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Despesas com Moradia</label>
                <input type="text" name="despesasMoradia" value={formData.despesasMoradia || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Despesas com Educação</label>
                <input type="text" name="despesasEducacao" value={formData.despesasEducacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Despesas com Saúde</label>
                <input type="text" name="despesasSaude" value={formData.despesasSaude || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Despesas com Vestuário</label>
                <input type="text" name="despesasVestuario" value={formData.despesasVestuario || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Despesas com Lazer</label>
                <input type="text" name="despesasLazer" value={formData.despesasLazer || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outras Despesas</label>
                <input type="text" name="outrasDespesas" value={formData.outrasDespesas || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Detalhamento das Necessidades *</label>
                <textarea name="necessidadesDetalhamento" value={formData.necessidadesDetalhamento || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.necessidadesDetalhamento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva as necessidades" />
                {errors.necessidadesDetalhamento && <p className="text-red-700 text-xs mt-1">{errors.necessidadesDetalhamento}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Possibilidades do Alimentante (Réu)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Situação Profissional *</label>
                <select name="situacaoProfissional" value={formData.situacaoProfissional || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.situacaoProfissional ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="empregado_clt">Empregado CLT</option>
                  <option value="autonomo">Autônomo</option>
                  <option value="empresario">Empresário</option>
                  <option value="servidor">Servidor</option>
                  <option value="desempregado">Desempregado</option>
                </select>
                {errors.situacaoProfissional && <p className="text-red-700 text-xs mt-1">{errors.situacaoProfissional}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Local de Trabalho</label>
                <input type="text" name="localTrabalho" value={formData.localTrabalho || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome da empresa/órgão" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cargo/Função</label>
                <input type="text" name="cargoFuncao" value={formData.cargoFuncao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Cargo exercido" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda Estimada</label>
                <input type="text" name="rendaEstimada" value={formData.rendaEstimada || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0.000,00" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Possui outros bens/rendas?</label>
                <textarea name="outrosBensRendas" value={formData.outrosBensRendas || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tem outros filhos?</label>
                <select name="temOutrosFilhos" value={formData.temOutrosFilhos || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
            </div>
            {formData.temOutrosFilhos === 'sim' && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quantos?</label>
                <input type="text" name="qtdOutrosFilhos" value={formData.qtdOutrosFilhos || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Número" />
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Alimentos Pretendidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Valor *</label>
                <select name="tipoValorPretendido" value={formData.tipoValorPretendido || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoValorPretendido ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="percentual">Percentual da renda</option>
                  <option value="valor_fixo">Valor fixo</option>
                  <option value="salarios_minimos">Salários mínimos</option>
                </select>
                {errors.tipoValorPretendido && <p className="text-red-700 text-xs mt-1">{errors.tipoValorPretendido}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Alimentos Provisórios *</label>
                <input type="text" name="alimentosProvisorios" value={formData.alimentosProvisorios || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.alimentosProvisorios ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 30% ou R$ 1.500,00 ou 1,5 SM" />
                {errors.alimentosProvisorios && <p className="text-red-700 text-xs mt-1">{errors.alimentosProvisorios}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Alimentos Definitivos *</label>
                <input type="text" name="alimentosDefinitivos" value={formData.alimentosDefinitivos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.alimentosDefinitivos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 30% ou R$ 1.500,00 ou 1,5 SM" />
                {errors.alimentosDefinitivos && <p className="text-red-700 text-xs mt-1">{errors.alimentosDefinitivos}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Subsidiário (se desempregado)</label>
                <input type="text" name="valorSubsidiario" value={formData.valorSubsidiario || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: 30% do SM" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Forma de Pagamento *</label>
                <select name="formaPagamentoAlimentos" value={formData.formaPagamentoAlimentos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.formaPagamentoAlimentos ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="deposito_conta">Depósito em conta</option>
                  <option value="desconto_folha">Desconto em folha</option>
                </select>
                {errors.formaPagamentoAlimentos && <p className="text-red-700 text-xs mt-1">{errors.formaPagamentoAlimentos}</p>}
              </div>
              {formData.formaPagamentoAlimentos === 'deposito_conta' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Dados Bancários</label>
                  <input type="text" name="dadosBancarios" value={formData.dadosBancarios || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dadosBancarios ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Banco, Ag, Conta, Titular" />
                  {errors.dadosBancarios && <p className="text-red-700 text-xs mt-1">{errors.dadosBancarios}</p>}
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outros Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Justiça Gratuita? *</label>
                <select name="requerJusticaGratuita" value={formData.requerJusticaGratuita || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerJusticaGratuita ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.requerJusticaGratuita && <p className="text-red-700 text-xs mt-1">{errors.requerJusticaGratuita}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara de Família *</label>
                <input type="text" name="varaFamilia" value={formData.varaFamilia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaFamilia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara de Família de São Paulo" />
                {errors.varaFamilia && <p className="text-red-700 text-xs mt-1">{errors.varaFamilia}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
            <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="afm-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="afm-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acao_guarda' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ação de Guarda</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Autor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Autor *</label>
                <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço Completo *</label>
                <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Réu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Réu *</label>
                <input type="text" name="reuNome" value={formData.reuNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.reuNome && <p className="text-red-700 text-xs mt-1">{errors.reuNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Réu *</label>
                <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço para citação" />
                {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email (se souber)" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara de Família *</label>
              <input type="text" name="varaFamilia" value={formData.varaFamilia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaFamilia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1ª Vara de Família de São Paulo" />
              {errors.varaFamilia && <p className="text-red-700 text-xs mt-1">{errors.varaFamilia}</p>}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Filhos</h3>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Filhos *</label>
              <textarea
                name="filhosLista"
                value={formData.filhosLista || ''}
                onChange={handleInputChange}
                rows={3}
                className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.filhosLista ? 'border-red-600 focus:ring-red-600' : ''}`}
                placeholder="Ex.: Filho 1: Nome completo; Nasc. dd/mm/aaaa\nFilho 2: Nome completo; Nasc. dd/mm/aaaa"
              />
              {errors.filhosLista && <p className="text-red-700 text-xs mt-1">{errors.filhosLista}</p>}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Guarda e Convivência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Guarda *</label>
                <select name="tipoGuarda" value={formData.tipoGuarda || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoGuarda ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="compartilhada">Compartilhada</option>
                  <option value="unilateral">Unilateral</option>
                </select>
                {errors.tipoGuarda && <p className="text-red-700 text-xs mt-1">{errors.tipoGuarda}</p>}
              </div>
              {formData.tipoGuarda === 'unilateral' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Guardião</label>
                  <select name="guardiao" value={formData.guardiao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.guardiao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="conjuge1">Cônjuge 1</option>
                    <option value="conjuge2">Cônjuge 2</option>
                  </select>
                  {errors.guardiao && <p className="text-red-700 text-xs mt-1">{errors.guardiao}</p>}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Residência dos Filhos *</label>
                <input type="text" name="residenciaFilhos" value={formData.residenciaFilhos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.residenciaFilhos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço" />
                {errors.residenciaFilhos && <p className="text-red-700 text-xs mt-1">{errors.residenciaFilhos}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Regime de Convivência *</label>
                <textarea name="regimeConvivencia" value={formData.regimeConvivencia || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.regimeConvivencia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Detalhamento das visitas" />
                {errors.regimeConvivencia && <p className="text-red-700 text-xs mt-1">{errors.regimeConvivencia}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Alimentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quem paga alimentos? *</label>
                <select name="quemPagaAlimentos" value={formData.quemPagaAlimentos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.quemPagaAlimentos ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="autor">Autor</option>
                  <option value="reu">Réu</option>
                  <option value="ambos">Ambos</option>
                </select>
                {errors.quemPagaAlimentos && <p className="text-red-700 text-xs mt-1">{errors.quemPagaAlimentos}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Valor *</label>
                <select name="tipoValorAlimentos" value={formData.tipoValorAlimentos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoValorAlimentos ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fixo">Valor Fixo</option>
                  <option value="percentual">Percentual</option>
                  <option value="salarios_minimos">Salários Mínimos</option>
                </select>
                {errors.tipoValorAlimentos && <p className="text-red-700 text-xs mt-1">{errors.tipoValorAlimentos}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor dos Alimentos *</label>
                <input type="text" name="valorAlimentos" value={formData.valorAlimentos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorAlimentos ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ ou % ou nº SM" />
                {errors.valorAlimentos && <p className="text-red-700 text-xs mt-1">{errors.valorAlimentos}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Dia do Pagamento *</label>
                <input type="text" name="diaPagamento" value={formData.diaPagamento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.diaPagamento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1 a 31" />
                {errors.diaPagamento && <p className="text-red-700 text-xs mt-1">{errors.diaPagamento}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Conta para Depósito</label>
                <input type="text" name="contaDeposito" value={formData.contaDeposito || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Banco, Ag, Conta" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="ag-file-upload" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="ag-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acao_inventario' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ação de Inventário</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Falecido (De Cujus)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo *</label>
                <input type="text" name="deCujusNome" value={formData.deCujusNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.deCujusNome && <p className="text-red-700 text-xs mt-1">{errors.deCujusNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade *</label>
                <input type="text" name="deCujusNacionalidade" value={formData.deCujusNacionalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusNacionalidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Brasileiro(a)" />
                {errors.deCujusNacionalidade && <p className="text-red-700 text-xs mt-1">{errors.deCujusNacionalidade}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil ao Falecer *</label>
                <select name="deCujusEstadoCivil" value={formData.deCujusEstadoCivil || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusEstadoCivil ? 'border-red-600 focus:ring-red-600' : ''}`}> 
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro</option>
                  <option value="casado">Casado</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="viuvo">Viúvo</option>
                  <option value="uniao_estavel">União Estável</option>
                </select>
                {errors.deCujusEstadoCivil && <p className="text-red-700 text-xs mt-1">{errors.deCujusEstadoCivil}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão</label>
                <input type="text" name="deCujusProfissao" value={formData.deCujusProfissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ocupação" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="deCujusRg" value={formData.deCujusRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.deCujusRg && <p className="text-red-700 text-xs mt-1">{errors.deCujusRg}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="deCujusCpf" value={formData.deCujusCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.deCujusCpf && <p className="text-red-700 text-xs mt-1">{errors.deCujusCpf}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Último Domicílio *</label>
                <input type="text" name="deCujusDomicilio" value={formData.deCujusDomicilio || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusDomicilio ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                {errors.deCujusDomicilio && <p className="text-red-700 text-xs mt-1">{errors.deCujusDomicilio}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Falecimento *</label>
                <input type="text" name="deCujusDataFalecimento" value={formData.deCujusDataFalecimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusDataFalecimento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.deCujusDataFalecimento && <p className="text-red-700 text-xs mt-1">{errors.deCujusDataFalecimento}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Local do Falecimento</label>
                <input type="text" name="deCujusLocalFalecimento" value={formData.deCujusLocalFalecimento || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Cidade/UF ou Hospital" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Causa da Morte</label>
                <input type="text" name="deCujusCausaMorte" value={formData.deCujusCausaMorte || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Conforme certidão" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Matrícula Certidão Óbito *</label>
                <input type="text" name="deCujusMatriculaObito" value={formData.deCujusMatriculaObito || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusMatriculaObito ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Número da matrícula" />
                {errors.deCujusMatriculaObito && <p className="text-red-700 text-xs mt-1">{errors.deCujusMatriculaObito}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cartório *</label>
                <input type="text" name="deCujusCartorio" value={formData.deCujusCartorio || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusCartorio ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do cartório" />
                {errors.deCujusCartorio && <p className="text-red-700 text-xs mt-1">{errors.deCujusCartorio}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Deixou Testamento? *</label>
                <select name="deCujusDeixouTestamento" value={formData.deCujusDeixouTestamento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.deCujusDeixouTestamento ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
                {errors.deCujusDeixouTestamento && <p className="text-red-700 text-xs mt-1">{errors.deCujusDeixouTestamento}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Casamento/União Estável</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há cônjuge/companheiro sobrevivente? *</label>
                <select name="temConjuge" value={formData.temConjuge || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.temConjuge ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.temConjuge && <p className="text-red-700 text-xs mt-1">{errors.temConjuge}</p>}
              </div>
              {formData.temConjuge === 'sim' && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Cônjuge/Companheiro</label>
                    <input type="text" name="conjugeNome" value={formData.conjugeNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.conjugeNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                    {errors.conjugeNome && <p className="text-red-700 text-xs mt-1">{errors.conjugeNome}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de União</label>
                    <select name="tipoUniao" value={formData.tipoUniao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoUniao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="casamento">Casamento</option>
                      <option value="uniao_estavel">União Estável</option>
                    </select>
                    {errors.tipoUniao && <p className="text-red-700 text-xs mt-1">{errors.tipoUniao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Regime de Bens</label>
                    <select name="regimeBensInventario" value={formData.regimeBensInventario || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.regimeBensInventario ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="comunhao_parcial">Comunhão Parcial</option>
                      <option value="comunhao_universal">Comunhão Universal</option>
                      <option value="separacao_total">Separação Total</option>
                      <option value="participacao_final">Participação Final</option>
                    </select>
                    {errors.regimeBensInventario && <p className="text-red-700 text-xs mt-1">{errors.regimeBensInventario}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Casamento/União</label>
                    <input type="text" name="dataUniao" value={formData.dataUniao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataUniao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataUniao && <p className="text-red-700 text-xs mt-1">{errors.dataUniao}</p>}
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Herdeiros</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Detalhes dos Herdeiros</label>
                  <textarea
                    name="herdeirosLista"
                    value={formData.herdeirosLista || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.herdeirosLista ? 'border-red-600 focus:ring-red-600' : ''}`}
                    placeholder={"Ex.: Herdeiro 1: Nome completo; Parentesco; RG; CPF; Maior/Menor\nHerdeiro 2: Nome completo; Parentesco; RG; CPF; Maior/Menor"}
                  />
                  {errors.herdeirosLista && <p className="text-red-700 text-xs mt-1">{errors.herdeirosLista}</p>}
                </div>
              </div>
              {herdeiros.map((h, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" value={h.nome} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], nome: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome completo" />
                  <select value={h.parentesco} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], parentesco: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Parentesco</option>
                    <option value="conjuge">Cônjuge</option>
                    <option value="filho">Filho(a)</option>
                    <option value="neto">Neto(a)</option>
                    <option value="pai">Pai</option>
                    <option value="mae">Mãe</option>
                    <option value="irmao">Irmão(ã)</option>
                    <option value="outro">Outro</option>
                  </select>
                  <select value={h.maiorCapaz} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], maiorCapaz: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Maior e capaz?</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                  <input type="text" value={h.nacionalidade} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], nacionalidade: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Brasileiro(a)" />
                  <select value={h.estadoCivil} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], estadoCivil: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Estado Civil</option>
                    <option value="solteiro">Solteiro</option>
                    <option value="casado">Casado</option>
                    <option value="divorciado">Divorciado</option>
                    <option value="viuvo">Viúvo</option>
                    <option value="uniao_estavel">União Estável</option>
                  </select>
                  <input type="text" value={h.profissao} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], profissao: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ocupação" />
                  <input type="text" value={h.rg} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], rg: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="00.000.000-0" />
                  <input type="text" value={h.cpf} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], cpf: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="000.000.000-00" />
                  <input type="text" value={h.endereco} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], endereco: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço completo" />
                  <input type="email" value={h.email} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], email: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email@exemplo.com" />
                  <input type="text" value={h.telefone} onChange={(e) => { const val = e.target.value; setHerdeiros(prev => { const next = [...prev]; next[idx] = { ...next[idx], telefone: val }; const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
                  <div className="flex items-center">
                    <button type="button" onClick={() => { setHerdeiros(prev => { const next = prev.filter((_,i) => i !== idx); const texto = next.map((x,i) => `Herdeiro ${i+1}: ${x.nome}; ${x.parentesco}; RG ${x.rg}; CPF ${x.cpf}; ${x.maiorCapaz === 'sim' ? 'Maior' : x.maiorCapaz === 'nao' ? 'Menor' : ''}`).join('\n'); setFormData(fd => ({ ...fd, herdeirosLista: texto })); return next; }); }} className="text-red-600 hover:text-red-700">Remover</button>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Inventariante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quem será o inventariante? *</label>
                {herdeiros.length > 0 ? (
                  <select name="inventarianteNome" value={formData.inventarianteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.inventarianteNome ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    {herdeiros.map((h,i) => (
                      <option key={i} value={h.nome}>{h.nome || `Herdeiro ${i+1}`}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" name="inventarianteNome" value={formData.inventarianteNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.inventarianteNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome do inventariante" />
                )}
                {errors.inventarianteNome && <p className="text-red-700 text-xs mt-1">{errors.inventarianteNome}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Bens a Inventariar</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há imóveis? *</label>
                  <select name="temImoveis" value={formData.temImoveis || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.temImoveis ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                  {errors.temImoveis && <p className="text-red-700 text-xs mt-1">{errors.temImoveis}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Imóveis</label>
                  <textarea name="imoveisDetalhes" value={formData.imoveisDetalhes || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.imoveisDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Tipo, Endereço, Matrícula, Cartório, Áreas, Valor, Observações" />
                  {errors.imoveisDetalhes && <p className="text-red-700 text-xs mt-1">{errors.imoveisDetalhes}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há veículos? *</label>
                  <select name="temVeiculos" value={formData.temVeiculos || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.temVeiculos ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                  {errors.temVeiculos && <p className="text-red-700 text-xs mt-1">{errors.temVeiculos}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Veículos</label>
                  <textarea name="veiculosDetalhes" value={formData.veiculosDetalhes || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.veiculosDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Tipo, Marca/Modelo, Ano, Cor, Placa, Renavam, Chassi, Valor FIPE" />
                  {errors.veiculosDetalhes && <p className="text-red-700 text-xs mt-1">{errors.veiculosDetalhes}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há valores em conta? *</label>
                  <select name="temContas" value={formData.temContas || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.temContas ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                  {errors.temContas && <p className="text-red-700 text-xs mt-1">{errors.temContas}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valores em Conta</label>
                  <textarea name="contasDetalhes" value={formData.contasDetalhes || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.contasDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Banco, Agência, Conta, Tipo, Saldo" />
                  {errors.contasDetalhes && <p className="text-red-700 text-xs mt-1">{errors.contasDetalhes}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há outros bens? *</label>
                  <select name="temOutrosBens" value={formData.temOutrosBens || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.temOutrosBens ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                  {errors.temOutrosBens && <p className="text-red-700 text-xs mt-1">{errors.temOutrosBens}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outros Bens</label>
                  <textarea name="outrosBensDetalhes" value={formData.outrosBensDetalhes || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.outrosBensDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Joias, ações, quotas, etc., com valor atribuído" />
                  {errors.outrosBensDetalhes && <p className="text-red-700 text-xs mt-1">{errors.outrosBensDetalhes}</p>}
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dívidas e Obrigações</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há dívidas conhecidas? *</label>
                <select name="temDividas" value={formData.temDividas || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.temDividas ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                  <option value="desconhecidas">Desconhecidas</option>
                </select>
                {errors.temDividas && <p className="text-red-700 text-xs mt-1">{errors.temDividas}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Dívidas</label>
                <textarea name="dividasDetalhes" value={formData.dividasDetalhes || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dividasDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Credor, Natureza, Valor" />
                {errors.dividasDetalhes && <p className="text-red-700 text-xs mt-1">{errors.dividasDetalhes}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Proposta de Partilha</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Como será a partilha? *</label>
                <textarea name="propostaPartilha" value={formData.propostaPartilha || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.propostaPartilha ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva o acordo" />
                {errors.propostaPartilha && <p className="text-red-700 text-xs mt-1">{errors.propostaPartilha}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há renúncia de herança?</label>
                  <select name="renunciaHeranca" value={formData.renunciaHeranca || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há cessão de direitos?</label>
                  <select name="cessaoDireitos" value={formData.cessaoDireitos || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outros Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Justiça Gratuita? *</label>
                <select name="requerJusticaGratuita" value={formData.requerJusticaGratuita || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerJusticaGratuita ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.requerJusticaGratuita && <p className="text-red-700 text-xs mt-1">{errors.requerJusticaGratuita}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara Competente *</label>
                <input type="text" name="varaCompetente" value={formData.varaCompetente || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaCompetente ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Vara de Família e Sucessões" />
                {errors.varaCompetente && <p className="text-red-700 text-xs mt-1">{errors.varaCompetente}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Comarca *</label>
                <input type="text" name="comarca" value={formData.comarca || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.comarca ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Cidade/UF" />
                {errors.comarca && <p className="text-red-700 text-xs mt-1">{errors.comarca}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acao_indenizatoria' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ação Indenizatória</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Problema e Dano</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Dano *</label>
                <select
                  name="tipoDano"
                  value={formData.tipoDano || ''}
                  onChange={handleInputChange}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoDano ? 'border-red-600 focus:ring-red-600' : ''}`}
                >
                  <option value="">Selecione</option>
                  <option value="danos_morais">Danos Morais</option>
                  <option value="danos_materiais">Danos Materiais</option>
                  <option value="danos_morais_materiais">Morais e Materiais</option>
                </select>
                {errors.tipoDano && <p className="text-red-700 text-xs mt-1">{errors.tipoDano}</p>}
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Problemas enfrentados *</label>
                <textarea
                  name="tipoProblema"
                  value={formData.tipoProblema || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoProblema ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="Descreva os problemas enfrentados (ex.: negativação indevida, cobrança indevida etc.)"
                />
                {errors.tipoProblema && <p className="text-red-700 text-xs mt-1">{errors.tipoProblema}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Fato *</label>
                <input
                  type="text"
                  name="dataFato"
                  value={formData.dataFato || ''}
                  onChange={handleInputChange}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataFato ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="dd/mm/aaaa"
                />
                {errors.dataFato && <p className="text-red-700 text-xs mt-1">{errors.dataFato}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição dos Fatos *</label>
              <textarea
                name="descricaoFatos"
                value={formData.descricaoFatos || ''}
                onChange={handleInputChange}
                rows={4}
                className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.descricaoFatos ? 'border-red-600 focus:ring-red-600' : ''}`}
                placeholder="Descreva detalhadamente o ocorrido"
              />
              {errors.descricaoFatos && <p className="text-red-700 text-xs mt-1">{errors.descricaoFatos}</p>}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Autor</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Autor *</label>
                <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="autorCpf" value={formData.autorCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.autorCpf && <p className="text-red-700 text-xs mt-1">{errors.autorCpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="autorRg" value={formData.autorRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.autorRg && <p className="text-red-700 text-xs mt-1">{errors.autorRg}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Réu</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Réu *</label>
                <select name="reuTipoPessoa" value={formData.reuTipoPessoa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuTipoPessoa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.reuTipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.reuTipoPessoa}</p>}
              </div>
            </div>
            {formData.reuTipoPessoa === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                  <input type="text" name="reuNome" value={formData.reuNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.reuNome && <p className="text-red-700 text-xs mt-1">{errors.reuNome}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                  <input type="text" name="reuCpf" value={formData.reuCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                  {errors.reuCpf && <p className="text-red-700 text-xs mt-1">{errors.reuCpf}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
                </div>
              </div>
            )}
            {formData.reuTipoPessoa === 'juridica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social *</label>
                  <input type="text" name="reuRazaoSocial" value={formData.reuRazaoSocial || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuRazaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão Social" />
                  {errors.reuRazaoSocial && <p className="text-red-700 text-xs mt-1">{errors.reuRazaoSocial}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                  <input type="text" name="reuCnpj" value={formData.reuCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                  {errors.reuCnpj && <p className="text-red-700 text-xs mt-1">{errors.reuCnpj}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email@empresa.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="indenizatoria-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="indenizatoria-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadError && (
                <p className="text-red-700 text-xs mt-2">{uploadError}</p>
              )}
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acao_plano_saude' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ação contra Plano de Saúde</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tipo de Negativa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">O que foi negado *</label>
                <textarea
                  name="itensNegados"
                  value={formData.itensNegados || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.itensNegados ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="Descreva o que foi negado"
                />
                {errors.itensNegados && <p className="text-red-700 text-xs mt-1">{errors.itensNegados}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo alegado pelo plano *</label>
                <textarea
                  name="motivosNegativa"
                  value={formData.motivosNegativa || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.motivosNegativa ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="Descreva o motivo alegado"
                />
                {errors.motivosNegativa && <p className="text-red-700 text-xs mt-1">{errors.motivosNegativa}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da negativa *</label>
                <input type="text" name="negativaData" value={formData.negativaData || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.negativaData ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.negativaData && <p className="text-red-700 text-xs mt-1">{errors.negativaData}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Protocolo</label>
                <input type="text" name="negativaProtocolo" value={formData.negativaProtocolo || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Número do protocolo" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Autor</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Autor *</label>
                <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="autorCpf" value={formData.autorCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.autorCpf && <p className="text-red-700 text-xs mt-1">{errors.autorCpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="autorRg" value={formData.autorRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.autorRg && <p className="text-red-700 text-xs mt-1">{errors.autorRg}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Plano de Saúde</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Plano *</label>
                <input type="text" name="planoSaudeNome" value={formData.planoSaudeNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.planoSaudeNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão social/Marca" />
                {errors.planoSaudeNome && <p className="text-red-700 text-xs mt-1">{errors.planoSaudeNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                <input type="text" name="planoSaudeCnpj" value={formData.planoSaudeCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.planoSaudeCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                {errors.planoSaudeCnpj && <p className="text-red-700 text-xs mt-1">{errors.planoSaudeCnpj}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Registro ANS *</label>
                <input type="text" name="planoSaudeRegistroAns" value={formData.planoSaudeRegistroAns || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.planoSaudeRegistroAns ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Número do registro" />
                {errors.planoSaudeRegistroAns && <p className="text-red-700 text-xs mt-1">{errors.planoSaudeRegistroAns}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nº da Carteirinha *</label>
                <input type="text" name="planoSaudeCarteirinha" value={formData.planoSaudeCarteirinha || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.planoSaudeCarteirinha ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Número de identificação" />
                {errors.planoSaudeCarteirinha && <p className="text-red-700 text-xs mt-1">{errors.planoSaudeCarteirinha}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Contratação *</label>
                <select name="planoSaudeTipoContratacao" value={formData.planoSaudeTipoContratacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.planoSaudeTipoContratacao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="individual">Individual/Familiar</option>
                  <option value="coletivo_empresarial">Coletivo Empresarial</option>
                  <option value="coletivo_adesao">Coletivo por Adesão</option>
                </select>
                {errors.planoSaudeTipoContratacao && <p className="text-red-700 text-xs mt-1">{errors.planoSaudeTipoContratacao}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados Médicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CID</label>
                <input type="text" name="cid" value={formData.cid || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: C50.1" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Médico</label>
                <input type="text" name="medicoNome" value={formData.medicoNome || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CRM</label>
                <input type="text" name="medicoCrm" value={formData.medicoCrm || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="CRM/UF" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Prescrição/Solicitação Médica</label>
                <textarea name="medicoPrescricao" value={formData.medicoPrescricao || ''} onChange={handleInputChange} rows={4} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva a indicação médica" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Hospital/Clínica</label>
                <input type="text" name="hospitalClinica" value={formData.hospitalClinica || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Local do procedimento/tratamento" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">É urgente?</label>
                <select name="urgencia" value={formData.urgencia || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Vara e Comarca</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vara *</label>
                <input type="text" name="varaCivel" value={formData.varaCivel || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.varaCivel ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Vara Cível/Consumidor" />
                {errors.varaCivel && <p className="text-red-700 text-xs mt-1">{errors.varaCivel}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Comarca *</label>
                <input type="text" name="comarca" value={formData.comarca || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.comarca ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Cidade/UF" />
                {errors.comarca && <p className="text-red-700 text-xs mt-1">{errors.comarca}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Escritório</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="ps-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="ps-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acao_cobranca' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ação de Cobrança no Cível</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados das Partes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Autor *</label>
                <select name="autorTipoPessoa" value={formData.autorTipoPessoa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTipoPessoa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.autorTipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.autorTipoPessoa}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Réu *</label>
                <select name="reuTipoPessoa" value={formData.reuTipoPessoa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuTipoPessoa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.reuTipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.reuTipoPessoa}</p>}
              </div>
            </div>

            {formData.autorTipoPessoa === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                  <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade *</label>
                  <input type="text" name="autorNacionalidade" value={formData.autorNacionalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNacionalidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Brasileiro(a)" />
                  {errors.autorNacionalidade && <p className="text-red-700 text-xs mt-1">{errors.autorNacionalidade}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil *</label>
                  <select name="autorEstadoCivil" value={formData.autorEstadoCivil || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEstadoCivil ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="uniao_estavel">União Estável</option>
                  </select>
                  {errors.autorEstadoCivil && <p className="text-red-700 text-xs mt-1">{errors.autorEstadoCivil}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão *</label>
                  <input type="text" name="autorProfissao" value={formData.autorProfissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorProfissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Profissão" />
                  {errors.autorProfissao && <p className="text-red-700 text-xs mt-1">{errors.autorProfissao}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                  <input type="text" name="autorRg" value={formData.autorRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                  {errors.autorRg && <p className="text-red-700 text-xs mt-1">{errors.autorRg}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                  <input type="text" name="autorCpf" value={formData.autorCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                  {errors.autorCpf && <p className="text-red-700 text-xs mt-1">{errors.autorCpf}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                  {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                  <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                  {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                  <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                  {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
                </div>
              </div>
            )}

            {formData.autorTipoPessoa === 'juridica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social *</label>
                  <input type="text" name="autorRazaoSocial" value={formData.autorRazaoSocial || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRazaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão Social" />
                  {errors.autorRazaoSocial && <p className="text-red-700 text-xs mt-1">{errors.autorRazaoSocial}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                  <input type="text" name="autorCnpj" value={formData.autorCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                  {errors.autorCnpj && <p className="text-red-700 text-xs mt-1">{errors.autorCnpj}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço da Sede *</label>
                  <input type="text" name="autorEnderecoSede" value={formData.autorEnderecoSede || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEnderecoSede ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                  {errors.autorEnderecoSede && <p className="text-red-700 text-xs mt-1">{errors.autorEnderecoSede}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Representante Legal *</label>
                  <input type="text" name="autorRepresentanteLegal" value={formData.autorRepresentanteLegal || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRepresentanteLegal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.autorRepresentanteLegal && <p className="text-red-700 text-xs mt-1">{errors.autorRepresentanteLegal}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                  <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@empresa.com" />
                  {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                  <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                  {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
                </div>
              </div>
            )}

            {formData.reuTipoPessoa === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                  <input type="text" name="reuNome" value={formData.reuNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.reuNome && <p className="text-red-700 text-xs mt-1">{errors.reuNome}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                  <input type="text" name="reuCpf" value={formData.reuCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                  {errors.reuCpf && <p className="text-red-700 text-xs mt-1">{errors.reuCpf}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
                </div>
              </div>
            )}

            {formData.reuTipoPessoa === 'juridica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social *</label>
                  <input type="text" name="reuRazaoSocial" value={formData.reuRazaoSocial || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuRazaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão Social" />
                  {errors.reuRazaoSocial && <p className="text-red-700 text-xs mt-1">{errors.reuRazaoSocial}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                  <input type="text" name="reuCnpj" value={formData.reuCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                  {errors.reuCnpj && <p className="text-red-700 text-xs mt-1">{errors.reuCnpj}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Rua, nº, bairro, cidade/UF, CEP" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email@empresa.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Origem da Dívida</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Relação *</label>
                  <input type="text" name="tipoRelacaoCobranca" value={formData.tipoRelacaoCobranca || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoRelacaoCobranca ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: Prestação de serviços, compra e venda" />
                  {errors.tipoRelacaoCobranca && <p className="text-red-700 text-xs mt-1">{errors.tipoRelacaoCobranca}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da Contratação *</label>
                  <input type="text" name="dataContratacao" value={formData.dataContratacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataContratacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                  {errors.dataContratacao && <p className="text-red-700 text-xs mt-1">{errors.dataContratacao}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Vencimento *</label>
                  <input type="text" name="dataVencimento" value={formData.dataVencimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataVencimento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                  {errors.dataVencimento && <p className="text-red-700 text-xs mt-1">{errors.dataVencimento}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição da Origem *</label>
                <textarea name="descricaoOrigemDivida" value={formData.descricaoOrigemDivida || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.descricaoOrigemDivida ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Explique a origem da dívida" />
                {errors.descricaoOrigemDivida && <p className="text-red-700 text-xs mt-1">{errors.descricaoOrigemDivida}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Objeto do Contrato *</label>
                  <input type="text" name="objetoContrato" value={formData.objetoContrato || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.objetoContrato ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Objeto do contrato" />
                  {errors.objetoContrato && <p className="text-red-700 text-xs mt-1">{errors.objetoContrato}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Original *</label>
                  <input type="text" name="valorOriginal" value={formData.valorOriginal || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorOriginal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 0,00" />
                  {errors.valorOriginal && <p className="text-red-700 text-xs mt-1">{errors.valorOriginal}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Forma de Pagamento</label>
                  <input type="text" name="formaPagamentoDivida" value={formData.formaPagamentoDivida || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="À vista/Parcelado" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Houve pagamento parcial?</label>
                  <select name="houvePagamentoParcial" value={formData.houvePagamentoParcial || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
                {formData.houvePagamentoParcial === 'sim' && (
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Pago</label>
                    <input type="text" name="valorPago" value={formData.valorPago || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="R$ 0,00" />
                  </div>
                )}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Saldo Devedor Original *</label>
                  <input type="text" name="saldoDevedorOriginal" value={formData.saldoDevedorOriginal || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.saldoDevedorOriginal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 0,00" />
                  {errors.saldoDevedorOriginal && <p className="text-red-700 text-xs mt-1">{errors.saldoDevedorOriginal}</p>}
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Documentação da Dívida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Contrato escrito</label>
                <select name="haContratoEscrito" value={formData.haContratoEscrito || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nota fiscal/Recibo</label>
                <select name="haNotaFiscalRecibo" value={formData.haNotaFiscalRecibo || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nota promissória</label>
                <select name="haNotaPromissoria" value={formData.haNotaPromissoria || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cheque</label>
                <select name="haCheque" value={formData.haCheque || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mails/Mensagens</label>
                <select name="haEmailsMensagens" value={formData.haEmailsMensagens || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Confissão de dívida</label>
                <select name="haConfissaoDivida" value={formData.haConfissaoDivida || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outras provas</label>
                <textarea name="outrasProvas" value={formData.outrasProvas || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva outras provas" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tentativas de Cobrança</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tentativa amigável</label>
                <select name="houveTentativaAmigavel" value={formData.houveTentativaAmigavel || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Como foi</label>
                <input type="text" name="comoTentativa" value={formData.comoTentativa || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Telefonema, e-mail, visita" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da última tentativa</label>
                <input type="text" name="dataUltimaTentativa" value={formData.dataUltimaTentativa || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Notificação enviada</label>
                <select name="foiEnviadaNotificacao" value={formData.foiEnviadaNotificacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da notificação</label>
                <input type="text" name="dataNotificacao" value={formData.dataNotificacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Houve resposta do devedor?</label>
                <select name="houveRespostaDevedor" value={formData.houveRespostaDevedor || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resposta do devedor</label>
                <textarea name="respostaDevedor" value={formData.respostaDevedor || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva a resposta" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cálculo da Dívida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor principal *</label>
                <input type="text" name="valorPrincipal" value={formData.valorPrincipal || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorPrincipal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 0,00" />
                {errors.valorPrincipal && <p className="text-red-700 text-xs mt-1">{errors.valorPrincipal}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data inicial do cálculo *</label>
                <input type="text" name="dataInicialCalculo" value={formData.dataInicialCalculo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataInicialCalculo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataInicialCalculo && <p className="text-red-700 text-xs mt-1">{errors.dataInicialCalculo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Índice de correção *</label>
                <select name="indiceCorrecao" value={formData.indiceCorrecao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.indiceCorrecao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="inpc">INPC</option>
                  <option value="igpm">IGP-M</option>
                  <option value="ipca">IPCA</option>
                  <option value="conforme_contrato">Conforme contrato</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.indiceCorrecao && <p className="text-red-700 text-xs mt-1">{errors.indiceCorrecao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Taxa de juros *</label>
                <input type="text" name="taxaJuros" value={formData.taxaJuros || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.taxaJuros ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 1% ao mês" />
                {errors.taxaJuros && <p className="text-red-700 text-xs mt-1">{errors.taxaJuros}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há multa contratual?</label>
                <select name="haMultaContratual" value={formData.haMultaContratual || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haMultaContratual === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Percentual da multa</label>
                  <input type="text" name="percentualMulta" value={formData.percentualMulta || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: 10%" />
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há cláusula penal?</label>
                <select name="haClausulaPenal" value={formData.haClausulaPenal || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haClausulaPenal === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor/Percentual da cláusula penal</label>
                  <input type="text" name="valorPercentualClausulaPenal" value={formData.valorPercentualClausulaPenal || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: R$ 500,00 ou 10%" />
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor total atualizado *</label>
                <input
                  type="text"
                  name="valorTotalAtualizado"
                  value={formData.valorTotalAtualizado || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                    setFormData(prev => ({ ...prev, valorTotalAtualizado: value }));
                  }}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorTotalAtualizado ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="R$ 0,00"
                />
                {errors.valorTotalAtualizado && <p className="text-red-700 text-xs mt-1">{errors.valorTotalAtualizado}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do cálculo *</label>
                <input type="text" name="dataCalculo" value={formData.dataCalculo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataCalculo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataCalculo && <p className="text-red-700 text-xs mt-1">{errors.dataCalculo}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Pedidos Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Audiência de conciliação</label>
                <select name="requerAudienciaConciliacao" value={formData.requerAudienciaConciliacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Prova testemunhal</label>
                <select name="requerProvaTestemunhal" value={formData.requerProvaTestemunhal || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Justiça Gratuita *</label>
                <select name="requerJusticaGratuita" value={formData.requerJusticaGratuita || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerJusticaGratuita ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.requerJusticaGratuita && <p className="text-red-700 text-xs mt-1">{errors.requerJusticaGratuita}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Advogado *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="cobranca-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="cobranca-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'acao_despejo' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ação de Despejo</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tipo de Locação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Locação *</label>
                <select name="tipoLocacao" value={formData.tipoLocacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoLocacao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="residencial">Residencial</option>
                  <option value="nao_residencial">Não Residencial</option>
                  <option value="temporada">Temporada</option>
                </select>
                {errors.tipoLocacao && <p className="text-red-700 text-xs mt-1">{errors.tipoLocacao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Contrato *</label>
                <select name="tipoContratoLocacao" value={formData.tipoContratoLocacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoContratoLocacao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="prazo_determinado">Prazo Determinado</option>
                  <option value="prazo_indeterminado">Prazo Indeterminado</option>
                </select>
                {errors.tipoContratoLocacao && <p className="text-red-700 text-xs mt-1">{errors.tipoContratoLocacao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de início *</label>
                <input type="text" name="dataInicioLocacao" value={formData.dataInicioLocacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataInicioLocacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataInicioLocacao && <p className="text-red-700 text-xs mt-1">{errors.dataInicioLocacao}</p>}
              </div>
            </div>
            {formData.tipoContratoLocacao === 'prazo_determinado' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de término *</label>
                  <input type="text" name="dataTerminoLocacao" value={formData.dataTerminoLocacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataTerminoLocacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                  {errors.dataTerminoLocacao && <p className="text-red-700 text-xs mt-1">{errors.dataTerminoLocacao}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Prazo (meses/anos) *</label>
                  <input type="text" name="prazoContratual" value={formData.prazoContratual || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.prazoContratual ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 30 meses" />
                  {errors.prazoContratual && <p className="text-red-700 text-xs mt-1">{errors.prazoContratual}</p>}
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Causa do Despejo</h3>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo do Despejo *</label>
              <select name="motivoDespejo" value={formData.motivoDespejo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.motivoDespejo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                <option value="">Selecione</option>
                <option value="falta_pagamento">Falta de pagamento</option>
                <option value="infracao_contratual">Infração contratual</option>
                <option value="termino_prazo">Término do prazo</option>
                <option value="denuncia_vazia">Denúncia vazia</option>
                <option value="uso_proprio">Uso próprio</option>
                <option value="uso_ascendente_descendente">Uso ascendente/descendente</option>
                <option value="demolicao_reforma">Demolição/reforma</option>
                <option value="sublocacao_nao_autorizada">Sublocação não autorizada</option>
                <option value="outro">Outro</option>
              </select>
              {errors.motivoDespejo && <p className="text-red-700 text-xs mt-1">{errors.motivoDespejo}</p>}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Autor (Locador)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Autor *</label>
                <select name="autorTipoPessoa" value={formData.autorTipoPessoa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTipoPessoa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.autorTipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.autorTipoPessoa}</p>}
              </div>
            </div>
            {formData.autorTipoPessoa === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                  <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                  <input type="text" name="autorCpf" value={formData.autorCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                  {errors.autorCpf && <p className="text-red-700 text-xs mt-1">{errors.autorCpf}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                  {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                  <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                  {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                  <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                  {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
                </div>
              </div>
            )}
            {formData.autorTipoPessoa === 'juridica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social *</label>
                  <input type="text" name="autorRazaoSocial" value={formData.autorRazaoSocial || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRazaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão Social" />
                  {errors.autorRazaoSocial && <p className="text-red-700 text-xs mt-1">{errors.autorRazaoSocial}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                  <input type="text" name="autorCnpj" value={formData.autorCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                  {errors.autorCnpj && <p className="text-red-700 text-xs mt-1">{errors.autorCnpj}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="autorEnderecoSede" value={formData.autorEnderecoSede || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEnderecoSede ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo da sede" />
                  {errors.autorEnderecoSede && <p className="text-red-700 text-xs mt-1">{errors.autorEnderecoSede}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                  <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@empresa.com" />
                  {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                  <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                  {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Réu (Locatário)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Réu *</label>
                <select name="reuTipoPessoa" value={formData.reuTipoPessoa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuTipoPessoa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.reuTipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.reuTipoPessoa}</p>}
              </div>
            </div>
            {formData.reuTipoPessoa === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                  <input type="text" name="reuNome" value={formData.reuNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.reuNome && <p className="text-red-700 text-xs mt-1">{errors.reuNome}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                  <input type="text" name="reuCpf" value={formData.reuCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                  {errors.reuCpf && <p className="text-red-700 text-xs mt-1">{errors.reuCpf}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço do imóvel locado" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
                </div>
              </div>
            )}
            {formData.reuTipoPessoa === 'juridica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social *</label>
                  <input type="text" name="reuRazaoSocial" value={formData.reuRazaoSocial || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuRazaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão Social" />
                  {errors.reuRazaoSocial && <p className="text-red-700 text-xs mt-1">{errors.reuRazaoSocial}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                  <input type="text" name="reuCnpj" value={formData.reuCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                  {errors.reuCnpj && <p className="text-red-700 text-xs mt-1">{errors.reuCnpj}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço do imóvel locado" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="email@empresa.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Imóvel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço Completo *</label>
                <input type="text" name="imovelEnderecoCompleto" value={formData.imovelEnderecoCompleto || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.imovelEnderecoCompleto ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo do imóvel" />
                {errors.imovelEnderecoCompleto && <p className="text-red-700 text-xs mt-1">{errors.imovelEnderecoCompleto}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Imóvel *</label>
                <select name="imovelTipo" value={formData.imovelTipo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.imovelTipo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="sala">Sala</option>
                  <option value="loja">Loja</option>
                  <option value="galpao">Galpão</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.imovelTipo && <p className="text-red-700 text-xs mt-1">{errors.imovelTipo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Inscrição IPTU</label>
                <input type="text" name="imovelInscricaoIptu" value={formData.imovelInscricaoIptu || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se souber" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Matrícula</label>
                <input type="text" name="imovelMatricula" value={formData.imovelMatricula || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se souber" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor do Aluguel *</label>
                <input
                  type="text"
                  name="valorAluguel"
                  value={formData.valorAluguel || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                    setFormData(prev => ({ ...prev, valorAluguel: value }));
                  }}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorAluguel ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="R$ 0.000,00"
                />
                {errors.valorAluguel && <p className="text-red-700 text-xs mt-1">{errors.valorAluguel}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Dia do Vencimento *</label>
                <input type="text" name="diaVencimento" value={formData.diaVencimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.diaVencimento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1-31" />
                {errors.diaVencimento && <p className="text-red-700 text-xs mt-1">{errors.diaVencimento}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Índice de Reajuste *</label>
                <select name="indiceReajuste" value={formData.indiceReajuste || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.indiceReajuste ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="igpm">IGPM</option>
                  <option value="ipca">IPCA</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.indiceReajuste && <p className="text-red-700 text-xs mt-1">{errors.indiceReajuste}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Atual do Aluguel</label>
                <input
                  type="text"
                  name="valorAtualAluguel"
                  value={formData.valorAtualAluguel || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                    setFormData(prev => ({ ...prev, valorAtualAluguel: value }));
                  }}
                  className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Após reajuste"
                />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Garantia Locatícia</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Garantia</label>
                <select name="tipoGarantia" value={formData.tipoGarantia || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="caucao">Caução</option>
                  <option value="fianca">Fiança</option>
                  <option value="seguro_fianca">Seguro Fiança</option>
                  <option value="nenhuma">Nenhuma</option>
                </select>
              </div>
              {formData.tipoGarantia === 'caucao' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor da Caução</label>
                  <input
                    type="text"
                    name="valorCaucao"
                    value={formData.valorCaucao || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9a-zA-ZÀ-ÿ.,R$\s%]/g, '');
                      setFormData(prev => ({ ...prev, valorCaucao: value }));
                    }}
                    className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="R$ 0,00"
                  />
                </div>
              )}
              {formData.tipoGarantia === 'fianca' && (
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do Fiador</label>
                    <input type="text" name="fiadorNome" value={formData.fiadorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fiadorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                    {errors.fiadorNome && <p className="text-red-700 text-xs mt-1">{errors.fiadorNome}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do Fiador</label>
                    <input type="text" name="fiadorCpf" value={formData.fiadorCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fiadorCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                    {errors.fiadorCpf && <p className="text-red-700 text-xs mt-1">{errors.fiadorCpf}</p>}
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do Fiador</label>
                    <input type="text" name="fiadorEndereco" value={formData.fiadorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fiadorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                    {errors.fiadorEndereco && <p className="text-red-700 text-xs mt-1">{errors.fiadorEndereco}</p>}
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Encargos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há condomínio?</label>
                <select name="haCondominio" value={formData.haCondominio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haCondominio === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor do Condomínio</label>
                  <input
                    type="text"
                    name="valorCondominio"
                    value={formData.valorCondominio || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                      setFormData(prev => ({ ...prev, valorCondominio: value }));
                    }}
                    className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="R$ 0,00"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há IPTU?</label>
                <select name="haIptu" value={formData.haIptu || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haIptu === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor do IPTU</label>
                  <input
                    type="text"
                    name="valorIptu"
                    value={formData.valorIptu || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                      setFormData(prev => ({ ...prev, valorIptu: value }));
                    }}
                    className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="R$ 0,00 (anual)"
                  />
                </div>
              )}
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outros encargos</label>
                <input type="text" name="outrosEncargos" value={formData.outrosEncargos || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Água, luz, gás, etc." />
              </div>
            </div>

            {formData.motivoDespejo === 'falta_pagamento' && (
              <>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Débito (se falta de pagamento)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Meses em atraso *</label>
                    <input type="text" name="mesesEmAtraso" value={formData.mesesEmAtraso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.mesesEmAtraso ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="jan/24, fev/24, mar/24..." />
                    {errors.mesesEmAtraso && <p className="text-red-700 text-xs mt-1">{errors.mesesEmAtraso}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor total aluguéis *</label>
                    <input
                      type="text"
                      name="valorTotalAlugueis"
                      value={formData.valorTotalAlugueis || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                        setFormData(prev => ({ ...prev, valorTotalAlugueis: value }));
                      }}
                      className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorTotalAlugueis ? 'border-red-600 focus:ring-red-600' : ''}`}
                      placeholder="R$ 0,00"
                    />
                    {errors.valorTotalAlugueis && <p className="text-red-700 text-xs mt-1">{errors.valorTotalAlugueis}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Condomínios em atraso</label>
                    <input
                      type="text"
                      name="condominiosEmAtraso"
                      value={formData.condominiosEmAtraso || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                        setFormData(prev => ({ ...prev, condominiosEmAtraso: value }));
                      }}
                      className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">IPTU em atraso</label>
                    <input
                      type="text"
                      name="iptuEmAtraso"
                      value={formData.iptuEmAtraso || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                        setFormData(prev => ({ ...prev, iptuEmAtraso: value }));
                      }}
                      className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outros encargos</label>
                    <input
                      type="text"
                      name="outrosEncargosEmAtraso"
                      value={formData.outrosEncargosEmAtraso || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                        setFormData(prev => ({ ...prev, outrosEncargosEmAtraso: value }));
                      }}
                      className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Multa moratória (%)</label>
                    <input type="text" name="multaMoratoriaPercentual" value={formData.multaMoratoriaPercentual || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: 10%" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Juros moratórios (%/mês)</label>
                    <input type="text" name="jurosMoratoriosPercentualMes" value={formData.jurosMoratoriosPercentualMes || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: 1%" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Total Débito *</label>
                    <input
                      type="text"
                      name="valorTotalDebito"
                      value={formData.valorTotalDebito || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                        setFormData(prev => ({ ...prev, valorTotalDebito: value }));
                      }}
                      className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorTotalDebito ? 'border-red-600 focus:ring-red-600' : ''}`}
                      placeholder="R$ 0,00"
                    />
                    {errors.valorTotalDebito && <p className="text-red-700 text-xs mt-1">{errors.valorTotalDebito}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do cálculo *</label>
                    <input type="text" name="dataCalculoDebito" value={formData.dataCalculoDebito || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataCalculoDebito ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataCalculoDebito && <p className="text-red-700 text-xs mt-1">{errors.dataCalculoDebito}</p>}
                  </div>
                </div>
              </>
            )}

            {formData.motivoDespejo === 'infracao_contratual' && (
              <>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Infração Contratual (se aplicável)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Qual infração?</label>
                    <textarea name="qualInfracao" value={formData.qualInfracao || ''} onChange={handleInputChange} rows={4} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.qualInfracao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva" />
                    {errors.qualInfracao && <p className="text-red-700 text-xs mt-1">{errors.qualInfracao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cláusula violada *</label>
                    <input type="text" name="clausulaViolada" value={formData.clausulaViolada || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.clausulaViolada ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nº da cláusula" />
                    {errors.clausulaViolada && <p className="text-red-700 text-xs mt-1">{errors.clausulaViolada}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da infração *</label>
                    <input type="text" name="dataInfracao" value={formData.dataInfracao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataInfracao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataInfracao && <p className="text-red-700 text-xs mt-1">{errors.dataInfracao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Foi notificado?</label>
                    <select name="foiNotificado" value={formData.foiNotificado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.foiNotificado ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                    {errors.foiNotificado && <p className="text-red-700 text-xs mt-1">{errors.foiNotificado}</p>}
                  </div>
                  {formData.foiNotificado === 'sim' && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da notificação</label>
                      <input type="text" name="dataNotificacaoInfracao" value={formData.dataNotificacaoInfracao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataNotificacaoInfracao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                      {errors.dataNotificacaoInfracao && <p className="text-red-700 text-xs mt-1">{errors.dataNotificacaoInfracao}</p>}
                    </div>
                  )}
                </div>
              </>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notificação Prévia</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Enviou notificação prévia?</label>
                <select name="enviouNotificacaoPrevia" value={formData.enviouNotificacaoPrevia || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.enviouNotificacaoPrevia === 'sim' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de notificação *</label>
                    <select name="tipoNotificacaoPrevia" value={formData.tipoNotificacaoPrevia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoNotificacaoPrevia ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="cartorio">Cartório</option>
                      <option value="carta_ar">Carta AR</option>
                      <option value="email">E-mail</option>
                    </select>
                    {errors.tipoNotificacaoPrevia && <p className="text-red-700 text-xs mt-1">{errors.tipoNotificacaoPrevia}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da notificação *</label>
                    <input type="text" name="dataNotificacaoPrevia" value={formData.dataNotificacaoPrevia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataNotificacaoPrevia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataNotificacaoPrevia && <p className="text-red-700 text-xs mt-1">{errors.dataNotificacaoPrevia}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Prazo concedido *</label>
                    <input type="text" name="prazoConcedidoNotificacao" value={formData.prazoConcedidoNotificacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.prazoConcedidoNotificacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 15 dias" />
                    {errors.prazoConcedidoNotificacao && <p className="text-red-700 text-xs mt-1">{errors.prazoConcedidoNotificacao}</p>}
                  </div>
                </>
              )}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Houve resposta?</label>
                  <select name="houveRespostaNotificacao" value={formData.houveRespostaNotificacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
                {formData.houveRespostaNotificacao === 'sim' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Qual?</label>
                    <textarea name="respostaNotificacaoDetalhe" value={formData.respostaNotificacaoDetalhe || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.respostaNotificacaoDetalhe ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva a resposta" />
                    {errors.respostaNotificacaoDetalhe && <p className="text-red-700 text-xs mt-1">{errors.respostaNotificacaoDetalhe}</p>}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Liminar de Despejo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer liminar? *</label>
                <select name="requerLiminarDespejo" value={formData.requerLiminarDespejo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerLiminarDespejo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.requerLiminarDespejo && <p className="text-red-700 text-xs mt-1">{errors.requerLiminarDespejo}</p>}
              </div>
              {formData.requerLiminarDespejo === 'sim' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fundamento (art. 59, § 1º) *</label>
                    <select name="fundamentoArt59Inciso" value={formData.fundamentoArt59Inciso || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fundamentoArt59Inciso ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="i">Inciso I</option>
                      <option value="ii">Inciso II</option>
                      <option value="iii">Inciso III</option>
                      <option value="iv">Inciso IV</option>
                      <option value="v">Inciso V</option>
                      <option value="vi">Inciso VI</option>
                      <option value="vii">Inciso VII</option>
                      <option value="viii">Inciso VIII</option>
                      <option value="ix">Inciso IX</option>
                    </select>
                    {errors.fundamentoArt59Inciso && <p className="text-red-700 text-xs mt-1">{errors.fundamentoArt59Inciso}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Oferece caução?</label>
                    <select name="ofereceCaucao" value={formData.ofereceCaucao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.ofereceCaucao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                    {errors.ofereceCaucao && <p className="text-red-700 text-xs mt-1">{errors.ofereceCaucao}</p>}
                  </div>
                  {formData.ofereceCaucao === 'sim' && (
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor da caução</label>
                      <input
                        type="text"
                        name="valorCaucaoLiminar"
                        value={formData.valorCaucaoLiminar || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9a-zA-ZÀ-ÿ.,R$\s%]/g, '');
                          setFormData(prev => ({ ...prev, valorCaucaoLiminar: value }));
                        }}
                        className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Ex: 3 aluguéis"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Pedidos Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer cobrança?</label>
                <select name="requerCobranca" value={formData.requerCobranca || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer multa contratual?</label>
                <select name="requerMultaContratual" value={formData.requerMultaContratual || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.requerMultaContratual === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor da multa</label>
                  <input
                    type="text"
                    name="valorMultaContratual"
                    value={formData.valorMultaContratual || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                      setFormData(prev => ({ ...prev, valorMultaContratual: value }));
                    }}
                    className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="R$ 0,00 ou %"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer danos morais?</label>
                <select name="requerDanosMorais" value={formData.requerDanosMorais || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.requerDanosMorais === 'sim' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor danos morais</label>
                    <input
                      type="text"
                      name="valorDanosMorais"
                      value={formData.valorDanosMorais || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                        setFormData(prev => ({ ...prev, valorDanosMorais: value }));
                      }}
                      className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição danos morais</label>
                    <textarea name="descricaoDanosMorais" value={formData.descricaoDanosMorais || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Descreva" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Incluir fiador no polo passivo?</label>
                <select name="incluirFiadorPoloPassivo" value={formData.incluirFiadorPoloPassivo || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer audiência conciliação?</label>
                <select name="requerAudienciaConciliacaoDespejo" value={formData.requerAudienciaConciliacaoDespejo || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outros Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Justiça Gratuita *</label>
                <select name="requerJusticaGratuita" value={formData.requerJusticaGratuita || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerJusticaGratuita ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.requerJusticaGratuita && <p className="text-red-700 text-xs mt-1">{errors.requerJusticaGratuita}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do escritório" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="despejo-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="despejo-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'execucao_titulo' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Execução de Título</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tipo de Título</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Título *</label>
                <select name="tipoTitulo" value={formData.tipoTitulo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoTitulo ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="cheque">Cheque</option>
                  <option value="nota_promissoria">Nota promissória</option>
                  <option value="duplicata">Duplicata</option>
                  <option value="contrato_duas_testemunhas">Contrato com 2 testemunhas</option>
                  <option value="confissao_divida">Confissão de dívida</option>
                  <option value="cedula_credito_bancario">Cédula de crédito bancário</option>
                  <option value="contrato_locacao">Contrato de locação (aluguéis)</option>
                  <option value="escritura_publica">Escritura pública</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.tipoTitulo && <p className="text-red-700 text-xs mt-1">{errors.tipoTitulo}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Título</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do título</label>
                <input type="text" name="numeroTitulo" value={formData.numeroTitulo || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se houver" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de emissão *</label>
                <input type="text" name="dataEmissaoTitulo" value={formData.dataEmissaoTitulo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataEmissaoTitulo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataEmissaoTitulo && <p className="text-red-700 text-xs mt-1">{errors.dataEmissaoTitulo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de vencimento *</label>
                <input type="text" name="dataVencimentoTitulo" value={formData.dataVencimentoTitulo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataVencimentoTitulo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataVencimentoTitulo && <p className="text-red-700 text-xs mt-1">{errors.dataVencimentoTitulo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor nominal *</label>
                <input
                  type="text"
                  name="valorNominalTitulo"
                  value={formData.valorNominalTitulo || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                    setFormData(prev => ({ ...prev, valorNominalTitulo: value }));
                  }}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorNominalTitulo ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="R$ 0.000,00"
                />
                {errors.valorNominalTitulo && <p className="text-red-700 text-xs mt-1">{errors.valorNominalTitulo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Local de emissão</label>
                <input type="text" name="localEmissao" value={formData.localEmissao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Cidade/UF" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Local de pagamento</label>
                <input type="text" name="localPagamento" value={formData.localPagamento || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se houver" />
              </div>
              {formData.tipoTitulo === 'cheque' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Banco sacado *</label>
                    <input type="text" name="bancoSacado" value={formData.bancoSacado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bancoSacado ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Banco" />
                    {errors.bancoSacado && <p className="text-red-700 text-xs mt-1">{errors.bancoSacado}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Agência/Conta *</label>
                    <input type="text" name="agenciaConta" value={formData.agenciaConta || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.agenciaConta ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Se cheque" />
                    {errors.agenciaConta && <p className="text-red-700 text-xs mt-1">{errors.agenciaConta}</p>}
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Foi protestado?</label>
                <select name="foiProtestado" value={formData.foiProtestado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.foiProtestado ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.foiProtestado && <p className="text-red-700 text-xs mt-1">{errors.foiProtestado}</p>}
              </div>
              {formData.foiProtestado === 'sim' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do protesto *</label>
                    <input type="text" name="dataProtesto" value={formData.dataProtesto || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataProtesto ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataProtesto && <p className="text-red-700 text-xs mt-1">{errors.dataProtesto}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Cartório do protesto *</label>
                    <input type="text" name="cartorioProtesto" value={formData.cartorioProtesto || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cartorioProtesto ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Cartório" />
                    {errors.cartorioProtesto && <p className="text-red-700 text-xs mt-1">{errors.cartorioProtesto}</p>}
                  </div>
                </>
              )}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Exequente (Credor)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Exequente *</label>
                <select name="autorTipoPessoa" value={formData.autorTipoPessoa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTipoPessoa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.autorTipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.autorTipoPessoa}</p>}
              </div>
            </div>
            {formData.autorTipoPessoa === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                  <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                  <input type="text" name="autorCpf" value={formData.autorCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                  {errors.autorCpf && <p className="text-red-700 text-xs mt-1">{errors.autorCpf}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                  {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                  <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                  {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                  <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                  {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
                </div>
              </div>
            )}
            {formData.autorTipoPessoa === 'juridica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social *</label>
                  <input type="text" name="autorRazaoSocial" value={formData.autorRazaoSocial || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRazaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão Social" />
                  {errors.autorRazaoSocial && <p className="text-red-700 text-xs mt-1">{errors.autorRazaoSocial}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                  <input type="text" name="autorCnpj" value={formData.autorCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                  {errors.autorCnpj && <p className="text-red-700 text-xs mt-1">{errors.autorCnpj}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="autorEnderecoSede" value={formData.autorEnderecoSede || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEnderecoSede ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo da sede" />
                  {errors.autorEnderecoSede && <p className="text-red-700 text-xs mt-1">{errors.autorEnderecoSede}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                  <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@empresa.com" />
                  {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                  <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                  {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Executado (Devedor)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de Executado *</label>
                <select name="reuTipoPessoa" value={formData.reuTipoPessoa || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuTipoPessoa ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                {errors.reuTipoPessoa && <p className="text-red-700 text-xs mt-1">{errors.reuTipoPessoa}</p>}
              </div>
            </div>
            {formData.reuTipoPessoa === 'fisica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                  <input type="text" name="reuNome" value={formData.reuNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                  {errors.reuNome && <p className="text-red-700 text-xs mt-1">{errors.reuNome}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                  <input type="text" name="reuCpf" value={formData.reuCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                  {errors.reuCpf && <p className="text-red-700 text-xs mt-1">{errors.reuCpf}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se souber" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se souber" />
                </div>
              </div>
            )}
            {formData.reuTipoPessoa === 'juridica' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Razão Social *</label>
                  <input type="text" name="reuRazaoSocial" value={formData.reuRazaoSocial || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuRazaoSocial ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Razão Social" />
                  {errors.reuRazaoSocial && <p className="text-red-700 text-xs mt-1">{errors.reuRazaoSocial}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CNPJ *</label>
                  <input type="text" name="reuCnpj" value={formData.reuCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000/0000-00" />
                  {errors.reuCnpj && <p className="text-red-700 text-xs mt-1">{errors.reuCnpj}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                  <input type="text" name="reuEndereco" value={formData.reuEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.reuEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                  {errors.reuEndereco && <p className="text-red-700 text-xs mt-1">{errors.reuEndereco}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                  <input type="email" name="reuEmail" value={formData.reuEmail || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se souber" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                  <input type="text" name="reuTelefone" value={formData.reuTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Se souber" />
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Avalista/Coobrigado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há avalista/coobrigado?</label>
                <select name="haAvalistaCoobrigado" value={formData.haAvalistaCoobrigado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haAvalistaCoobrigado === 'sim' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do avalista *</label>
                    <input type="text" name="avalistaNome" value={formData.avalistaNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.avalistaNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                    {errors.avalistaNome && <p className="text-red-700 text-xs mt-1">{errors.avalistaNome}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF/CNPJ do avalista *</label>
                    <input type="text" name="avalistaCpfCnpj" value={formData.avalistaCpfCnpj || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.avalistaCpfCnpj ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Documento" />
                    {errors.avalistaCpfCnpj && <p className="text-red-700 text-xs mt-1">{errors.avalistaCpfCnpj}</p>}
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço do avalista *</label>
                    <input type="text" name="avalistaEndereco" value={formData.avalistaEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.avalistaEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                    {errors.avalistaEndereco && <p className="text-red-700 text-xs mt-1">{errors.avalistaEndereco}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Incluir no polo passivo?</label>
                    <select name="incluirAvalistaPoloPassivo" value={formData.incluirAvalistaPoloPassivo || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Origem da Dívida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição da origem</label>
                <textarea name="descricaoOrigemDivida" value={formData.descricaoOrigemDivida || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="O que gerou o título?" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do negócio</label>
                <input type="text" name="dataContratacao" value={formData.dataContratacao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="dd/mm/aaaa" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Objeto</label>
                <textarea name="objetoContrato" value={formData.objetoContrato || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="O que foi contratado" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Constituição em Mora</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Como foi constituído em mora? *</label>
                <select name="constituicaoMora" value={formData.constituicaoMora || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.constituicaoMora ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="protesto">Protesto</option>
                  <option value="notificacao_extrajudicial">Notificação extrajudicial</option>
                  <option value="vencimento">Vencimento (mora ex re)</option>
                </select>
                {errors.constituicaoMora && <p className="text-red-700 text-xs mt-1">{errors.constituicaoMora}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da constituição</label>
                <input type="text" name="dataConstituicao" value={formData.dataConstituicao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="dd/mm/aaaa" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cálculo do Débito</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor principal *</label>
                <input
                  type="text"
                  name="valorPrincipal"
                  value={formData.valorPrincipal || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                    setFormData(prev => ({ ...prev, valorPrincipal: value }));
                  }}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorPrincipal ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="R$ 0.000,00"
                />
                {errors.valorPrincipal && <p className="text-red-700 text-xs mt-1">{errors.valorPrincipal}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data inicial cálculo *</label>
                <input type="text" name="dataInicialCalculo" value={formData.dataInicialCalculo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataInicialCalculo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataInicialCalculo && <p className="text-red-700 text-xs mt-1">{errors.dataInicialCalculo}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Índice de correção *</label>
                <select name="indiceCorrecao" value={formData.indiceCorrecao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.indiceCorrecao ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="inpc">INPC</option>
                  <option value="igpm">IGPM</option>
                  <option value="ipca">IPCA</option>
                  <option value="tabela_tj">Tabela TJ</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.indiceCorrecao && <p className="text-red-700 text-xs mt-1">{errors.indiceCorrecao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Taxa de juros *</label>
                <input type="text" name="taxaJuros" value={formData.taxaJuros || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.taxaJuros ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="1% ao mês ou conforme título" />
                {errors.taxaJuros && <p className="text-red-700 text-xs mt-1">{errors.taxaJuros}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há multa?</label>
                <select name="haMultaContratual" value={formData.haMultaContratual || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haMultaContratual === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Percentual da multa *</label>
                  <input type="text" name="percentualMulta" value={formData.percentualMulta || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.percentualMulta ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 10%" />
                  {errors.percentualMulta && <p className="text-red-700 text-xs mt-1">{errors.percentualMulta}</p>}
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Há honorários contratuais?</label>
                <select name="haHonorariosContratuais" value={formData.haHonorariosContratuais || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.haHonorariosContratuais === 'sim' && (
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Percentual honorários *</label>
                  <input type="text" name="percentualHonorarios" value={formData.percentualHonorarios || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.percentualHonorarios ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 10%" />
                  {errors.percentualHonorarios && <p className="text-red-700 text-xs mt-1">{errors.percentualHonorarios}</p>}
                </div>
              )}
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Outras despesas</label>
                <input type="text" name="outrasDespesas" value={formData.outrasDespesas || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Protesto, etc." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Valor Total Atualizado *</label>
                <input
                  type="text"
                  name="valorTotalAtualizado"
                  value={formData.valorTotalAtualizado || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,R$\s%]/g, '');
                    setFormData(prev => ({ ...prev, valorTotalAtualizado: value }));
                  }}
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.valorTotalAtualizado ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="R$ 0.000,00"
                />
                {errors.valorTotalAtualizado && <p className="text-red-700 text-xs mt-1">{errors.valorTotalAtualizado}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do cálculo *</label>
                <input type="text" name="dataCalculo" value={formData.dataCalculo || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataCalculo ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.dataCalculo && <p className="text-red-700 text-xs mt-1">{errors.dataCalculo}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Indicação de Bens / Medidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Conhece bens do executado?</label>
                <select name="conheceBensExecutado" value={formData.conheceBensExecutado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.conheceBensExecutado === 'sim' && (
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quais bens?</label>
                    <input
                      type="text"
                      name="bensConhecidosTipos"
                      value={formData.bensConhecidosTipos || ''}
                      onChange={handleInputChange}
                      className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Imóveis, veículos, contas, outros"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição dos bens</label>
                    <textarea name="descricaoBens" value={formData.descricaoBens || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Matrícula, placa, banco" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer SISBAJUD?</label>
                <select name="requerSisbaJud" value={formData.requerSisbaJud || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer RENAJUD?</label>
                <select name="requerRenajud" value={formData.requerRenajud || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer INFOJUD?</label>
                <select name="requerInfojud" value={formData.requerInfojud || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer averbação premonitória?</label>
                <select name="requerAverbacaoPremonitoria" value={formData.requerAverbacaoPremonitoria || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer inclusão cadastros?</label>
                <select name="requerInclusaoCadastros" value={formData.requerInclusaoCadastros || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outros Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Justiça Gratuita *</label>
                <select name="requerJusticaGratuita" value={formData.requerJusticaGratuita || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerJusticaGratuita ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.requerJusticaGratuita && <p className="text-red-700 text-xs mt-1">{errors.requerJusticaGratuita}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do escritório" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="execucao-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="execucao-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType === 'concessao_beneficio' && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Concessão de Benefício</h2>
          <form className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tipo de Benefício</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Benefício Pleiteado *</label>
                <select name="beneficioPleiteado" value={formData.beneficioPleiteado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.beneficioPleiteado ? 'border-red-600 focus:ring-red-600' : ''}`}>
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
                {errors.beneficioPleiteado && <p className="text-red-700 text-xs mt-1">{errors.beneficioPleiteado}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Situação *</label>
                <select name="situacaoBeneficio" value={formData.situacaoBeneficio || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.situacaoBeneficio ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="concessao_negado">Concessão (negado)</option>
                  <option value="restabelecimento_cessado">Restabelecimento (cessado)</option>
                  <option value="revisao_valor_incorreto">Revisão (valor incorreto)</option>
                </select>
                {errors.situacaoBeneficio && <p className="text-red-700 text-xs mt-1">{errors.situacaoBeneficio}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Autor (Segurado)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome Completo *</label>
                <input type="text" name="autorNome" value={formData.autorNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.autorNome && <p className="text-red-700 text-xs mt-1">{errors.autorNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nacionalidade *</label>
                <input type="text" name="autorNacionalidade" value={formData.autorNacionalidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNacionalidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Brasileiro(a)" />
                {errors.autorNacionalidade && <p className="text-red-700 text-xs mt-1">{errors.autorNacionalidade}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Estado Civil *</label>
                <select name="autorEstadoCivil" value={formData.autorEstadoCivil || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEstadoCivil ? 'border-red-600 focus:ring-red-600' : ''}`}> 
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="uniao_estavel">União estável</option>
                </select>
                {errors.autorEstadoCivil && <p className="text-red-700 text-xs mt-1">{errors.autorEstadoCivil}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data de Nascimento *</label>
                <input type="text" name="autorNascimento" value={formData.autorNascimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorNascimento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                {errors.autorNascimento && <p className="text-red-700 text-xs mt-1">{errors.autorNascimento}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Idade</label>
                <input type="text" value={idadeCalculada} readOnly className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Calculado" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Profissão *</label>
                <input type="text" name="autorProfissao" value={formData.autorProfissao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorProfissao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ocupação" />
                {errors.autorProfissao && <p className="text-red-700 text-xs mt-1">{errors.autorProfissao}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">RG *</label>
                <input type="text" name="autorRg" value={formData.autorRg || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorRg ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="00.000.000-0" />
                {errors.autorRg && <p className="text-red-700 text-xs mt-1">{errors.autorRg}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF *</label>
                <input type="text" name="autorCpf" value={formData.autorCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                {errors.autorCpf && <p className="text-red-700 text-xs mt-1">{errors.autorCpf}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">NIT/PIS *</label>
                <input type="text" name="pisPasep" value={formData.pisPasep || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.pisPasep ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.00000.00-0" />
                {errors.pisPasep && <p className="text-red-700 text-xs mt-1">{errors.pisPasep}</p>}
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço *</label>
                <input type="text" name="autorEndereco" value={formData.autorEndereco || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEndereco ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Endereço completo" />
                {errors.autorEndereco && <p className="text-red-700 text-xs mt-1">{errors.autorEndereco}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail *</label>
                <input type="email" name="autorEmail" value={formData.autorEmail || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorEmail ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="email@exemplo.com" />
                {errors.autorEmail && <p className="text-red-700 text-xs mt-1">{errors.autorEmail}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone *</label>
                <input type="text" name="autorTelefone" value={formData.autorTelefone || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.autorTelefone ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="(00) 00000-0000" />
                {errors.autorTelefone && <p className="text-red-700 text-xs mt-1">{errors.autorTelefone}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Requerimento Administrativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Fez requerimento administrativo? *</label>
                <select name="fezRequerimentoAdm" value={formData.fezRequerimentoAdm || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fezRequerimentoAdm ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.fezRequerimentoAdm && <p className="text-red-700 text-xs mt-1">{errors.fezRequerimentoAdm}</p>}
              </div>
            </div>
            {formData.fezRequerimentoAdm === 'sim' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do Requerimento (DER) *</label>
                  <input type="text" name="dataDER" value={formData.dataDER || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataDER ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                  {errors.dataDER && <p className="text-red-700 text-xs mt-1">{errors.dataDER}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número do Benefício (NB) *</label>
                  <input type="text" name="nbNumero" value={formData.nbNumero || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.nbNumero ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-0" />
                  {errors.nbNumero && <p className="text-red-700 text-xs mt-1">{errors.nbNumero}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Espécie *</label>
                  <input type="text" name="especie" value={formData.especie || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.especie ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: 31, 41, 87" />
                  {errors.especie && <p className="text-red-700 text-xs mt-1">{errors.especie}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Resultado *</label>
                  <select name="resultadoRequerimento" value={formData.resultadoRequerimento || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.resultadoRequerimento ? 'border-red-600 focus:ring-red-600' : ''}`}>
                    <option value="">Selecione</option>
                    <option value="indeferido">Indeferido</option>
                    <option value="cessado">Cessado</option>
                    <option value="valor_incorreto">Valor incorreto</option>
                  </select>
                  {errors.resultadoRequerimento && <p className="text-red-700 text-xs mt-1">{errors.resultadoRequerimento}</p>}
                </div>
                {(formData.resultadoRequerimento === 'indeferido' || formData.resultadoRequerimento === 'cessado') && (
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data da decisão/cessação *</label>
                    <input type="text" name="dataDecisaoCessacao" value={formData.dataDecisaoCessacao || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataDecisaoCessacao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataDecisaoCessacao && <p className="text-red-700 text-xs mt-1">{errors.dataDecisaoCessacao}</p>}
                  </div>
                )}
                {formData.resultadoRequerimento === 'indeferido' && (
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da negativa *</label>
                    <textarea name="motivoNegativa" value={formData.motivoNegativa || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.motivoNegativa ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Conforme carta INSS" />
                    {errors.motivoNegativa && <p className="text-red-700 text-xs mt-1">{errors.motivoNegativa}</p>}
                  </div>
                )}
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Possui processo administrativo?</label>
                  <select name="possuiProcessoAdministrativo" value={formData.possuiProcessoAdministrativo || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              </div>
            )}

            {(formData.beneficioPleiteado === 'auxilio_doenca' || formData.beneficioPleiteado === 'aposentadoria_invalidez') && (
              <>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de Incapacidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Diagnóstico/CID-10 *</label>
                    <input type="text" name="cid10Diagnostico" value={formData.cid10Diagnostico || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cid10Diagnostico ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Ex: M54.5" />
                    {errors.cid10Diagnostico && <p className="text-red-700 text-xs mt-1">{errors.cid10Diagnostico}</p>}
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição da doença *</label>
                    <textarea name="doencaDescricao" value={formData.doencaDescricao || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.doencaDescricao ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva a doença" />
                    {errors.doencaDescricao && <p className="text-red-700 text-xs mt-1">{errors.doencaDescricao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data início incapacidade *</label>
                    <input type="text" name="dataInicioIncapacidade" value={formData.dataInicioIncapacidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dataInicioIncapacidade ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.dataInicioIncapacidade && <p className="text-red-700 text-xs mt-1">{errors.dataInicioIncapacidade}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de incapacidade *</label>
                    <select name="tipoIncapacidade" value={formData.tipoIncapacidade || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tipoIncapacidade ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="total_permanente">Total permanente</option>
                      <option value="total_temporaria">Total temporária</option>
                      <option value="parcial">Parcial</option>
                    </select>
                    {errors.tipoIncapacidade && <p className="text-red-700 text-xs mt-1">{errors.tipoIncapacidade}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Doença ocupacional?</label>
                    <select name="doencaOcupacional" value={formData.doencaOcupacional || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Última atividade</label>
                    <input type="text" name="ultimaAtividade" value={formData.ultimaAtividade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Função exercida" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Está em tratamento?</label>
                    <select name="estaEmTratamento" value={formData.estaEmTratamento || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  {formData.estaEmTratamento === 'sim' && (
                    <div className="md:col-span-3">
                      <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Qual tratamento? *</label>
                      <textarea name="qualTratamento" value={formData.qualTratamento || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.qualTratamento ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Se sim" />
                      {errors.qualTratamento && <p className="text-red-700 text-xs mt-1">{errors.qualTratamento}</p>}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do médico</label>
                    <input type="text" name="medicoNome" value={formData.medicoNome || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Dr(a)." />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CRM</label>
                    <input type="text" name="medicoCRM" value={formData.medicoCRM || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="CRM 00000" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Especialidade</label>
                    <input type="text" name="medicoEspecialidade" value={formData.medicoEspecialidade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Especialidade" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Especialidade perito desejada</label>
                    <input type="text" name="peritoEspecialidadeDesejada" value={formData.peritoEspecialidadeDesejada || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Para perícia judicial" />
                  </div>
                </div>
              </>
            )}

            {formData.beneficioPleiteado === 'pensao_morte' && (
              <>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de Pensão por Morte</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome do falecido *</label>
                    <input type="text" name="falecidoNome" value={formData.falecidoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.falecidoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                    {errors.falecidoNome && <p className="text-red-700 text-xs mt-1">{errors.falecidoNome}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data do óbito *</label>
                    <input type="text" name="falecidoDataObito" value={formData.falecidoDataObito || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.falecidoDataObito ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="dd/mm/aaaa" />
                    {errors.falecidoDataObito && <p className="text-red-700 text-xs mt-1">{errors.falecidoDataObito}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">CPF do falecido *</label>
                    <input type="text" name="falecidoCpf" value={formData.falecidoCpf || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.falecidoCpf ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="000.000.000-00" />
                    {errors.falecidoCpf && <p className="text-red-700 text-xs mt-1">{errors.falecidoCpf}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">NIT do falecido</label>
                    <input type="text" name="falecidoNit" value={formData.falecidoNit || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="000.00000.00-0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Falecido era segurado?</label>
                    <select name="falecidoEraSegurado" value={formData.falecidoEraSegurado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Selecione</option>
                      <option value="aposentado">Sim - aposentado</option>
                      <option value="contribuinte">Sim - contribuinte</option>
                      <option value="periodo_graca">Sim - período de graça</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Vínculo com falecido *</label>
                    <select name="vinculoFalecido" value={formData.vinculoFalecido || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.vinculoFalecido ? 'border-red-600 focus:ring-red-600' : ''}`}>
                      <option value="">Selecione</option>
                      <option value="conjuge">Cônjuge</option>
                      <option value="companheiro">Companheiro</option>
                      <option value="filho_menor">Filho menor</option>
                      <option value="filho_invalido">Filho inválido</option>
                      <option value="pais">Pais</option>
                      <option value="irmao">Irmão</option>
                    </select>
                    {errors.vinculoFalecido && <p className="text-red-700 text-xs mt-1">{errors.vinculoFalecido}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Duração casamento/união</label>
                    <input type="text" name="duracaoUniao" value={formData.duracaoUniao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="X anos" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número de dependentes</label>
                    <input type="text" name="numeroDependentes" value={formData.numeroDependentes || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
              </>
            )}

            {formData.beneficioPleiteado === 'bpc_loas' && (
              <>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados de BPC/LOAS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Idade (se idoso)</label>
                    <input type="text" name="bpcIdade" value={formData.bpcIdade || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="65+ anos" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">É pessoa com deficiência?</label>
                    <select name="bpcPcD" value={formData.bpcPcD || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  {formData.bpcPcD === 'sim' && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tipo de deficiência *</label>
                        <select name="bpcTipoDeficiencia" value={formData.bpcTipoDeficiencia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bpcTipoDeficiencia ? 'border-red-600 focus:ring-red-600' : ''}`}>
                          <option value="">Selecione</option>
                          <option value="fisica">Física</option>
                          <option value="mental">Mental</option>
                          <option value="intelectual">Intelectual</option>
                          <option value="sensorial">Sensorial</option>
                        </select>
                        {errors.bpcTipoDeficiencia && <p className="text-red-700 text-xs mt-1">{errors.bpcTipoDeficiencia}</p>}
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Descrição deficiência *</label>
                        <textarea name="bpcDescricaoDeficiencia" value={formData.bpcDescricaoDeficiencia || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bpcDescricaoDeficiencia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Descreva" />
                        {errors.bpcDescricaoDeficiencia && <p className="text-red-700 text-xs mt-1">{errors.bpcDescricaoDeficiencia}</p>}
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda familiar mensal *</label>
                    <input type="text" name="bpcRendaFamiliarMensal" value={formData.bpcRendaFamiliarMensal || ''} onChange={(e) => { const value = e.target.value.replace(/[^0-9.,R$\s%]/g, ''); handleInputChange({ ...e, target: { ...e.target, value } }); }} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bpcRendaFamiliarMensal ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="R$ 0.000,00" />
                    {errors.bpcRendaFamiliarMensal && <p className="text-red-700 text-xs mt-1">{errors.bpcRendaFamiliarMensal}</p>}
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Composição familiar *</label>
                    <textarea name="bpcComposicaoFamiliar" value={formData.bpcComposicaoFamiliar || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bpcComposicaoFamiliar ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome, parentesco, renda" />
                    {errors.bpcComposicaoFamiliar && <p className="text-red-700 text-xs mt-1">{errors.bpcComposicaoFamiliar}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Número de membros *</label>
                    <input type="text" name="bpcNumeroMembros" value={formData.bpcNumeroMembros || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bpcNumeroMembros ? 'border-red-600 focus:ring-red-600' : ''}`} />
                    {errors.bpcNumeroMembros && <p className="text-red-700 text-xs mt-1">{errors.bpcNumeroMembros}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Renda per capita *</label>
                    <input type="text" value={rendaPerCapitaCalculada} readOnly className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Calculada" />
                  </div>
                </div>
              </>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Histórico Contributivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Categoria segurado *</label>
                <select name="categoriaSegurado" value={formData.categoriaSegurado || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.categoriaSegurado ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="empregado">Empregado</option>
                  <option value="contribuinte_individual">Contribuinte individual</option>
                  <option value="facultativo">Facultativo</option>
                  <option value="segurado_especial">Segurado especial</option>
                  <option value="domestico">Doméstico</option>
                </select>
                {errors.categoriaSegurado && <p className="text-red-700 text-xs mt-1">{errors.categoriaSegurado}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Tempo total contribuição</label>
                <input type="text" name="tempoTotalContribuicao" value={formData.tempoTotalContribuicao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="X anos, X meses" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Períodos de contribuição</label>
                <textarea name="periodosContribuicao" value={formData.periodosContribuicao || ''} onChange={handleInputChange} rows={3} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="De/até, empresa, função" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Períodos não registrados CNIS?</label>
                <select name="periodosNaoRegistradosCnis" value={formData.periodosNaoRegistradosCnis || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              {formData.periodosNaoRegistradosCnis === 'sim' && (
                <div className="md:col-span-3">
                  <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Quais períodos? *</label>
                  <textarea name="periodosNaoRegistradosDetalhes" value={formData.periodosNaoRegistradosDetalhes || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.periodosNaoRegistradosDetalhes ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Se sim" />
                  {errors.periodosNaoRegistradosDetalhes && <p className="text-red-700 text-xs mt-1">{errors.periodosNaoRegistradosDetalhes}</p>}
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Data última contribuição</label>
                <input type="text" name="dataUltimaContribuicao" value={formData.dataUltimaContribuicao || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="dd/mm/aaaa" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tutela de Urgência</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer tutela de urgência? *</label>
                <select name="tutelaUrgencia" value={formData.tutelaUrgencia || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tutelaUrgencia ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.tutelaUrgencia && <p className="text-red-700 text-xs mt-1">{errors.tutelaUrgencia}</p>}
              </div>
            </div>
            {formData.tutelaUrgencia === 'sim' && (
              <div className="md:col-span-3">
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Motivo da urgência *</label>
                <textarea name="motivoUrgencia" value={formData.motivoUrgencia || ''} onChange={handleInputChange} rows={3} className={`input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.motivoUrgencia ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Se sim" />
                {errors.motivoUrgencia && <p className="text-red-700 text-xs mt-1">{errors.motivoUrgencia}</p>}
              </div>
            )}

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outros Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Requer Justiça Gratuita *</label>
                <select name="requerJusticaGratuita" value={formData.requerJusticaGratuita || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.requerJusticaGratuita ? 'border-red-600 focus:ring-red-600' : ''}`}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
                {errors.requerJusticaGratuita && <p className="text-red-700 text-xs mt-1">{errors.requerJusticaGratuita}</p>}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Dados do Advogado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Nome *</label>
                <input type="text" name="advogadoNome" value={formData.advogadoNome || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoNome ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="Nome completo" />
                {errors.advogadoNome && <p className="text-red-700 text-xs mt-1">{errors.advogadoNome}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">OAB *</label>
                <input type="text" name="advogadoOab" value={formData.advogadoOab || ''} onChange={handleInputChange} className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.advogadoOab ? 'border-red-600 focus:ring-red-600' : ''}`} placeholder="OAB/UF 123456" />
                {errors.advogadoOab && <p className="text-red-700 text-xs mt-1">{errors.advogadoOab}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Telefone</label>
                <input type="text" name="advogadoTelefone" value={formData.advogadoTelefone || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Endereço</label>
                <input type="text" name="enderecoEscritorio" value={formData.enderecoEscritorio || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Endereço do escritório" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">E-mail</label>
                <input type="email" name="emailAdvogado" value={formData.emailAdvogado || ''} onChange={handleInputChange} className="input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="advogado@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">Documentos (Opcional - Máximo 10 PDFs)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input type="file" id="concessao-file-upload" multiple accept=".pdf" onChange={handleFileUploadMax10} className="hidden" />
                <label htmlFor="concessao-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Clique para selecionar arquivos ou arraste e solte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF (máx. 10MB cada)</p>
                </label>
              </div>
              {uploadedFiles && uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Arquivos selecionados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between space-x-3">
              <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Cancelar</button>
              <button type="button" onClick={generateDocument} disabled={isGenerating} className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isGenerating ? (
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
          </form>
        </div>
      ) : selectedType && newTypeIds.has(selectedType) && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{selectedLabel}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Configuração inicial. Em breve você poderá definir os campos necessários para este documento.</p>
          <div className="mt-4 flex justify-between">
            <button type="button" onClick={handleCancelSelection} className="btn-secondary px-6 py-3">Voltar</button>
            <button type="button" disabled className="btn-primary px-6 py-3 disabled:opacity-50">Configurar Campos</button>
          </div>
        </div>
      ) : selectedType && docCurrentStep === 0 ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Dados para {selectedLabel || documentTypes.find(t => t.id === selectedType)?.name}
          </h2>
          
          <form className="space-y-6">
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
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.title ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="Ex: Ação Trabalhista - João Silva"
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
                  className={`input-primary h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.clientName ? 'border-red-600 focus:ring-red-600' : ''}`}
                  placeholder="Nome completo do cliente"
                />
                {errors.clientName && <p className="text-red-700 text-xs mt-1">{errors.clientName}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
                <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
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
              <label className="block text-xs uppercase tracking-wide text-slate-900 dark:text-white font-medium mb-2">
                Documentos (Opcional - Máximo 10 arquivos)
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
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
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
          </form>
        </div>
      ) : null}

      {/* Documento Gerado */}
      {generatedDoc && docCurrentStep === 1 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{(selectedType === 'notificacao_extrajudicial' || selectedType === 'contrato_honorarios' || selectedType === 'substabelecimento' || selectedType === 'reclamacao_trabalhista' || selectedType === 'contestacao_trabalhista' || selectedType === 'acordo_extrajudicial_trabalhista' || selectedType === 'recurso_ordinario_trabalhista' || selectedType === 'habeas_corpus' || selectedType === 'resposta_acusacao' || selectedType === 'liberdade_provisoria' || selectedType === 'alegacoes_finais' || selectedType === 'divorcio_consensual' || selectedType === 'acao_alimentos' || selectedType === 'acao_guarda' || selectedType === 'acao_inventario' || selectedType === 'acao_indenizatoria' || selectedType === 'acao_plano_saude' || selectedType === 'acao_cobranca' || selectedType === 'acao_despejo' || selectedType === 'execucao_titulo' || selectedType === 'concessao_beneficio') ? 'Revisão de Documentos' : 'Documento Gerado'}</h2>
            {(selectedType === 'notificacao_extrajudicial' || selectedType === 'contrato_honorarios' || selectedType === 'substabelecimento' || selectedType === 'reclamacao_trabalhista' || selectedType === 'contestacao_trabalhista' || selectedType === 'acordo_extrajudicial_trabalhista' || selectedType === 'recurso_ordinario_trabalhista' || selectedType === 'habeas_corpus' || selectedType === 'resposta_acusacao' || selectedType === 'liberdade_provisoria' || selectedType === 'alegacoes_finais' || selectedType === 'divorcio_consensual' || selectedType === 'acao_alimentos' || selectedType === 'acao_guarda' || selectedType === 'acao_inventario' || selectedType === 'acao_indenizatoria' || selectedType === 'acao_plano_saude' || selectedType === 'acao_cobranca' || selectedType === 'acao_despejo' || selectedType === 'execucao_titulo' || selectedType === 'concessao_beneficio') ? (
              generatedDoc && (
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button onClick={handleSaveEdit} className="btn-primary text-sm px-4 py-2">Salvar</button>
                      <button onClick={handleCancelEdit} className="btn-secondary text-sm px-4 py-2">Cancelar</button>
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
              )
            ) : (
              <div className="flex space-x-2">
                <button className="btn-ghost" onClick={handleEditToggle}>
                  <Eye className="h-4 w-4 mr-2" />
                  Revisar
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors" onClick={downloadDocx}>
                  <Download className="h-4 w-4 mr-2" />
                  📄 Gerar Documento
                </button>
              </div>
            )}
          </div>
          {(selectedType === 'notificacao_extrajudicial' || selectedType === 'contrato_honorarios' || selectedType === 'substabelecimento' || selectedType === 'reclamacao_trabalhista' || selectedType === 'contestacao_trabalhista' || selectedType === 'acordo_extrajudicial_trabalhista' || selectedType === 'recurso_ordinario_trabalhista' || selectedType === 'habeas_corpus' || selectedType === 'resposta_acusacao' || selectedType === 'liberdade_provisoria' || selectedType === 'alegacoes_finais' || selectedType === 'divorcio_consensual' || selectedType === 'acao_alimentos' || selectedType === 'acao_guarda' || selectedType === 'acao_inventario' || selectedType === 'acao_indenizatoria' || selectedType === 'acao_plano_saude' || selectedType === 'acao_cobranca' || selectedType === 'acao_despejo' || selectedType === 'execucao_titulo' || selectedType === 'concessao_beneficio') ? (
            <>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-80 p-4 text-base text-slate-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-base text-slate-900 dark:text-white leading-relaxed">{editedContent || generatedDoc.content}</div>
                )}
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setDocCurrentStep(0)} className="btn-secondary px-6 py-3">Voltar</button>
                <button
                  onClick={downloadDocx}
                  disabled={!generatedDoc}
                  className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📄 Gerar Documento
                </button>
              </div>
              {docxError && (
                <div className="mt-2 text-red-700 text-xs text-right">{docxError}</div>
              )}
            </>
          ) : (
            <>
              {isEditing && (
                <div className="mb-4">
                  <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={10} className="input-primary resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Edite o conteúdo gerado" />
                  <div className="flex space-x-2 mt-2">
                    <button className="btn-primary px-4 py-2" onClick={handleSaveEdit}>Salvar alterações</button>
                    <button className="btn-secondary px-4 py-2" onClick={handleCancelEdit}>Cancelar</button>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 max-h-96 overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                  {isEditing ? editedContent : generatedDoc.content}
                </pre>
              </div>
              {docxError && (
                <div className="mt-2 text-red-700 text-xs">{docxError}</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
