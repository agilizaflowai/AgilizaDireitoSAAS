export const mockMetrics = {
  totalClients: 47,
  documentsAnalyzed: 12,
  upcomingDeadlines: 3,
  conversionRate: 87,
};

export const mockChartData = [
  { month: 'Jan', clients: 28 },
  { month: 'Fev', clients: 35 },
  { month: 'Mar', clients: 42 },
  { month: 'Abr', clients: 38 },
  { month: 'Mai', clients: 47 },
  { month: 'Jun', clients: 52 },
];

export const mockAlerts = [
  {
    id: 1,
    title: 'Prazo Recurso - Proc. 1234567',
    description: 'Vence em 2 dias',
    priority: 'high',
    daysLeft: 2,
  },
  {
    id: 2,
    title: 'Audiência - Silva vs. Santos',
    description: 'Vence em 5 dias',
    priority: 'medium',
    daysLeft: 5,
  },
  {
    id: 3,
    title: 'Prazo Contestação - Proc. 9876543',
    description: 'Vence em 7 dias',
    priority: 'low',
    daysLeft: 7,
  },
];

export const mockUser = {
  id: '1',
  name: 'Dra. Julia Rabello',
  email: 'roberto@almeidaassociados.com',
  company: 'Almeida & Associados',
};

export const mockClients = [
  {
    id: 1,
    name: 'João Silva',
    phone: '(11) 99999-1111',
    email: 'joao.silva@email.com',
    area: 'Trabalhista',
    description: 'Demissão sem justa causa, busca direitos trabalhistas',
    estimatedValue: 50000,
    urgency: 'Alta',
    score: 95,
    status: 'Qualificado',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Maria Santos',
    phone: '(11) 99999-2222',
    email: 'maria.santos@email.com',
    area: 'Família',
    description: 'Processo de divórcio consensual com partilha de bens',
    estimatedValue: 80000,
    urgency: 'Média',
    score: 87,
    status: 'Qualificado',
    createdAt: '2024-01-18'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    phone: '(11) 99999-3333',
    email: 'pedro.oliveira@email.com',
    area: 'Consulta',
    description: 'Dúvidas sobre contrato de aluguel',
    estimatedValue: 2000,
    urgency: 'Baixa',
    score: 23,
    status: 'Não Qualificado',
    createdAt: '2024-01-20'
  },
  {
    id: 4,
    name: 'Ana Costa',
    phone: '(11) 99999-4444',
    email: 'ana.costa@email.com',
    area: 'Empresarial',
    description: 'Constituição de empresa e contratos societários',
    estimatedValue: 120000,
    urgency: 'Alta',
    score: 91,
    status: 'Qualificado',
    createdAt: '2024-01-22'
  }
];

export const legalAreas = [
  'Trabalhista',
  'Família',
  'Criminal',
  'Empresarial',
  'Cível',
  'Consulta'
];

export const urgencyLevels = [
  'Alta',
  'Média',
  'Baixa'
];

export const documentTypes = [
  // Existentes
  { id: 'peticao_simples', name: 'Petição Simples' },
  { id: 'peticao', name: 'Petição Inicial' },
  { id: 'contestacao', name: 'Contestação' },
  { id: 'replica', name: 'Réplica' },
  { id: 'recurso', name: 'Recurso' },
  { id: 'contrato', name: 'Contrato' },
  { id: 'procuracao', name: 'Procuração' },
  // GERAL (últimos)
  { id: 'notificacao_extrajudicial', name: 'Notificação Extrajudicial' },
  { id: 'contrato_honorarios', name: 'Contrato de Honorários' },
  { id: 'substabelecimento', name: 'Substabelecimento' },
];

export const mockDocuments = [
  {
    id: 1,
    type: 'Petição Inicial',
    title: 'Ação Trabalhista - João Silva',
    createdAt: '2024-01-25 14:30',
    status: 'Concluído'
  },
  {
    id: 2,
    type: 'Contestação',
    title: 'Defesa - Processo 1234567',
    createdAt: '2024-01-24 16:45',
    status: 'Concluído'
  },
  {
    id: 3,
    type: 'Contrato',
    title: 'Contrato Societário - Ana Costa',
    createdAt: '2024-01-23 10:15',
    status: 'Em Revisão'
  },
  {
    id: 4,
    type: 'Procuração',
    title: 'Procuração Ad Judicia',
    createdAt: '2024-01-22 09:20',
    status: 'Concluído'
  },
  {
    id: 5,
    type: 'Recurso',
    title: 'Apelação Cível',
    createdAt: '2024-01-21 11:30',
    status: 'Concluído'
  },
  {
    id: 6,
    type: 'Petição Inicial',
    title: 'Ação de Cobrança - Maria Santos',
    createdAt: '2024-01-20 15:45',
    status: 'Concluído'
  },
  {
    id: 7,
    type: 'Contestação',
    title: 'Defesa - Processo 7891011',
    createdAt: '2024-01-19 13:20',
    status: 'Concluído'
  },
  {
    id: 8,
    type: 'Contrato',
    title: 'Contrato de Prestação de Serviços',
    createdAt: '2024-01-18 09:15',
    status: 'Concluído'
  },
  {
    id: 9,
    type: 'Procuração',
    title: 'Procuração Específica - Pedro Oliveira',
    createdAt: '2024-01-17 16:30',
    status: 'Concluído'
  },
  {
    id: 10,
    type: 'Recurso',
    title: 'Agravo de Instrumento',
    createdAt: '2024-01-16 11:45',
    status: 'Concluído'
  },
  {
    id: 11,
    type: 'Petição Inicial',
    title: 'Divórcio Consensual - Carlos Silva',
    createdAt: '2024-01-15 14:20',
    status: 'Em Revisão'
  },
  {
    id: 12,
    type: 'Contestação',
    title: 'Defesa - Processo 1122334',
    createdAt: '2024-01-14 10:30',
    status: 'Concluído'
  },
  {
    id: 13,
    type: 'Contrato',
    title: 'Contrato de Locação Comercial',
    createdAt: '2024-01-13 08:45',
    status: 'Concluído'
  },
  {
    id: 14,
    type: 'Procuração',
    title: 'Procuração Geral - Ana Ferreira',
    createdAt: '2024-01-12 17:15',
    status: 'Concluído'
  },
  {
    id: 15,
    type: 'Recurso',
    title: 'Recurso Especial',
    createdAt: '2024-01-11 12:00',
    status: 'Concluído'
  },
  {
    id: 16,
    type: 'Petição Inicial',
    title: 'Ação de Indenização - Roberto Lima',
    createdAt: '2024-01-10 15:30',
    status: 'Em Revisão'
  },
  {
    id: 17,
    type: 'Contestação',
    title: 'Defesa - Processo 5566778',
    createdAt: '2024-01-09 14:45',
    status: 'Concluído'
  },
  {
    id: 18,
    type: 'Contrato',
    title: 'Contrato de Compra e Venda',
    createdAt: '2024-01-08 11:20',
    status: 'Concluído'
  },
  {
    id: 19,
    type: 'Procuração',
    title: 'Procuração para Inventário',
    createdAt: '2024-01-07 16:10',
    status: 'Concluído'
  },
  {
    id: 20,
    type: 'Recurso',
    title: 'Embargos de Declaração',
    createdAt: '2024-01-06 13:25',
    status: 'Concluído'
  }
];

export const mockContractAnalysis = {
  securityScore: 78,
  riskClauses: [
    {
      id: 1,
      clause: 'Cláusula 5.2 - Limitação de Responsabilidade',
      risk: 'Alto',
      description: 'Limitação excessiva que pode prejudicar direitos do contratante',
      suggestion: 'Revisar os limites de responsabilidade para equilibrar os riscos'
    },
    {
      id: 2,
      clause: 'Cláusula 8.1 - Rescisão Unilateral',
      risk: 'Médio',
      description: 'Permite rescisão sem justa causa com prazo muito curto',
      suggestion: 'Aumentar prazo de aviso prévio para 60 dias'
    },
    {
      id: 3,
      clause: 'Cláusula 12.3 - Foro de Eleição',
      risk: 'Baixo',
      description: 'Foro eleito pode gerar custos adicionais desnecessários',
      suggestion: 'Considerar foro do domicílio do contratante'
    }
  ],
  improvements: [
    {
      id: 1,
      title: 'Incluir Cláusula de Força Maior',
      description: 'Adicionar proteção contra eventos extraordinários',
      priority: 'Alta'
    },
    {
      id: 2,
      title: 'Definir Penalidades por Atraso',
      description: 'Estabelecer multas e juros por inadimplemento',
      priority: 'Alta'
    },
    {
      id: 3,
      title: 'Especificar Forma de Comunicação',
      description: 'Definir canais oficiais para notificações',
      priority: 'Média'
    },
    {
      id: 4,
      title: 'Incluir Cláusula de Confidencialidade',
      description: 'Proteger informações sensíveis das partes',
      priority: 'Média'
    }
  ],
  compliance: [
    { item: 'Conformidade com Código Civil', status: true },
    { item: 'Adequação à Lei Geral de Proteção de Dados', status: true },
    { item: 'Conformidade com Código de Defesa do Consumidor', status: false },
    { item: 'Adequação às normas trabalhistas', status: true },
    { item: 'Conformidade com legislação tributária', status: true }
  ]
};

export const mockContractHistory = [
  {
    id: 1,
    name: 'Contrato_Prestacao_Servicos.pdf',
    uploadDate: '2024-01-25 14:30',
    score: 78,
    status: 'Analisado'
  },
  {
    id: 2,
    name: 'Contrato_Sociedade_Limitada.pdf',
    uploadDate: '2024-01-24 10:15',
    score: 92,
    status: 'Analisado'
  },
  {
    id: 3,
    name: 'Contrato_Locacao_Comercial.pdf',
    uploadDate: '2024-01-23 16:45',
    score: 65,
    status: 'Analisado'
  },
  {
    id: 4,
    name: 'Contrato_Compra_Venda.pdf',
    uploadDate: '2024-01-22 09:20',
    score: 84,
    status: 'Analisado'
  }
];

export const tribunals = [
  'Todos',
  'STF - Supremo Tribunal Federal',
  'STJ - Superior Tribunal de Justiça',
  'TJ-SP - Tribunal de Justiça de São Paulo',
  'TJ-RJ - Tribunal de Justiça do Rio de Janeiro',
  'TRT-2 - Tribunal Regional do Trabalho 2ª Região'
];

export const mockJurisprudence = [
  {
    id: 1,
    title: 'REsp 1.234.567/SP - Responsabilidade Civil em Contratos de Prestação de Serviços',
    court: 'STJ',
    date: '2024-01-20',
    relator: 'Min. João Silva',
    area: 'Cível',
    relevance: 95,
    summary: 'Estabelece critérios para responsabilização em contratos de prestação de serviços. Define limites de responsabilidade objetiva.',
    highlights: [
      'A responsabilidade do prestador de serviços é objetiva quando há relação de consumo',
      'Cláusulas limitativas de responsabilidade devem ser expressas e equilibradas'
    ],
    fullText: 'RECURSO ESPECIAL. RESPONSABILIDADE CIVIL. PRESTAÇÃO DE SERVIÇOS...'
  },
  {
    id: 2,
    title: 'AI 987.654/RJ - Direitos Trabalhistas e Terceirização',
    court: 'TST',
    date: '2024-01-18',
    relator: 'Min. Maria Santos',
    area: 'Trabalhista',
    relevance: 89,
    summary: 'Define parâmetros para terceirização lícita. Estabelece responsabilidade subsidiária da empresa contratante.',
    highlights: [
      'Terceirização é permitida em atividades-meio e atividades-fim',
      'Empresa contratante responde subsidiariamente por débitos trabalhistas'
    ],
    fullText: 'AGRAVO DE INSTRUMENTO. DIREITO DO TRABALHO. TERCEIRIZAÇÃO...'
  },
  {
    id: 3,
    title: 'HC 456.789/MG - Prisão Preventiva e Fundamentação',
    court: 'STF',
    date: '2024-01-15',
    relator: 'Min. Carlos Oliveira',
    area: 'Criminal',
    relevance: 76,
    summary: 'Requisitos para decretação de prisão preventiva. Necessidade de fundamentação concreta e específica.',
    highlights: [
      'Prisão preventiva exige fundamentação concreta dos requisitos legais',
      'Mera referência aos artigos da lei não constitui fundamentação adequada'
    ],
    fullText: 'HABEAS CORPUS. PRISÃO PREVENTIVA. FUNDAMENTAÇÃO...'
  },
  {
    id: 4,
    title: 'REsp 789.123/PR - Divórcio e Partilha de Bens',
    court: 'STJ',
    date: '2024-01-12',
    relator: 'Min. Ana Costa',
    area: 'Família',
    relevance: 82,
    summary: 'Critérios para partilha de bens em divórcio. Valoração de empresa constituída durante o casamento.',
    highlights: [
      'Empresa constituída na constância do casamento integra patrimônio comum',
      'Valoração deve considerar patrimônio líquido na data da separação'
    ],
    fullText: 'RECURSO ESPECIAL. DIREITO DE FAMÍLIA. DIVÓRCIO...'
  },
  {
    id: 5,
    title: 'AgRg no AREsp 321.654/SC - Danos Morais e Quantum Indenizatório',
    court: 'STJ',
    date: '2024-01-10',
    relator: 'Min. Pedro Almeida',
    area: 'Cível',
    relevance: 71,
    summary: 'Parâmetros para fixação de danos morais. Princípios da proporcionalidade e razoabilidade.',
    highlights: [
      'Valor de danos morais deve observar proporcionalidade e razoabilidade',
      'Consideração da capacidade econômica das partes é fundamental'
    ],
    fullText: 'AGRAVO REGIMENTAL. DANOS MORAIS. QUANTUM INDENIZATÓRIO...'
  }
];

export const searchSuggestions = [
  'responsabilidade civil médica',
  'danos morais valor',
  'terceirização atividade fim',
  'prisão preventiva fundamentação',
  'divórcio partilha bens',
  'contrato prestação serviços',
  'direitos trabalhistas',
  'união estável requisitos',
  'execução fiscal prescrição',
  'mandado segurança cabimento'
];

// Dados para Gestão de Prazos
export const mockDeadlines = [
  {
    id: 1,
    processNumber: '1234567-89.2024.8.26.0001',
    type: 'Contestação',
    dueDate: '2024-01-28',
    daysLeft: 2,
    status: 'URGENTE',
    responsible: 'Dr. Roberto Almeida',
    client: 'João Silva',
    description: 'Prazo para apresentação de contestação em ação trabalhista'
  },
  {
    id: 2,
    processNumber: '9876543-21.2024.5.02.0001',
    type: 'Audiência',
    dueDate: '2024-01-31',
    daysLeft: 5,
    status: 'ATENÇÃO',
    responsible: 'Dra. Maria Santos',
    client: 'Ana Costa',
    description: 'Audiência de conciliação no TRT-2'
  },
  {
    id: 3,
    processNumber: '5555555-55.2024.8.26.0100',
    type: 'Recurso',
    dueDate: '2024-02-10',
    daysLeft: 15,
    status: 'OK',
    responsible: 'Dr. Roberto Almeida',
    client: 'Maria Santos',
    description: 'Prazo para interposição de recurso de apelação'
  },
  {
    id: 4,
    processNumber: '1111111-11.2024.8.26.0002',
    type: 'Manifestação',
    dueDate: '2024-02-05',
    daysLeft: 10,
    status: 'OK',
    responsible: 'Dra. Maria Santos',
    client: 'Pedro Oliveira',
    description: 'Manifestação sobre laudo pericial'
  },
  {
    id: 5,
    processNumber: '7777777-77.2024.8.26.0003',
    type: 'Petição',
    dueDate: '2024-01-29',
    daysLeft: 3,
    status: 'URGENTE',
    responsible: 'Dr. Roberto Almeida',
    client: 'João Silva',
    description: 'Petição de juntada de documentos'
  }
];

export const responsibleLawyers = [
  'Todos',
  'Dr. Roberto Almeida',
  'Dra. Maria Santos',
  'Dr. Carlos Oliveira'
];

// Dados para Atendimento IA
export const mockChatConversations = [
  {
    id: 1,
    clientName: 'João Silva',
    clientPhone: '(11) 99999-1111',
    lastMessage: 'Gostaria de saber o status do meu processo',
    lastMessageTime: '14:30',
    unreadCount: 2,
    status: 'online',
    messages: [
      {
        id: 1,
        sender: 'client',
        message: 'Boa tarde! Gostaria de saber sobre meu processo trabalhista.',
        timestamp: '14:25',
        date: '2024-01-26'
      },
      {
        id: 2,
        sender: 'ai',
        message: 'Olá João! Estou aqui para ajudá-lo. Vou verificar o status do seu processo 1234567-89.2024.',
        timestamp: '14:26',
        date: '2024-01-26'
      },
      {
        id: 3,
        sender: 'ai',
        message: 'Seu processo está na fase de contestação. O prazo para a empresa apresentar defesa vence em 2 dias. Após isso, o processo seguirá para a fase de instrução.',
        timestamp: '14:27',
        date: '2024-01-26'
      },
      {
        id: 4,
        sender: 'client',
        message: 'Gostaria de saber o status do meu processo',
        timestamp: '14:30',
        date: '2024-01-26'
      }
    ]
  },
  {
    id: 2,
    clientName: 'Maria Santos',
    clientPhone: '(11) 99999-2222',
    lastMessage: 'Preciso agendar uma reunião',
    lastMessageTime: '13:45',
    unreadCount: 1,
    status: 'away',
    messages: [
      {
        id: 1,
        sender: 'client',
        message: 'Olá, preciso agendar uma reunião para discutir meu divórcio.',
        timestamp: '13:40',
        date: '2024-01-26'
      },
      {
        id: 2,
        sender: 'ai',
        message: 'Claro, Maria! Vou verificar a agenda do Dr. Roberto. Que tal na próxima terça-feira às 15h?',
        timestamp: '13:42',
        date: '2024-01-26'
      },
      {
        id: 3,
        sender: 'client',
        message: 'Preciso agendar uma reunião',
        timestamp: '13:45',
        date: '2024-01-26'
      }
    ]
  },
  {
    id: 3,
    clientName: 'Ana Costa',
    clientPhone: '(11) 99999-4444',
    lastMessage: 'Qual o valor dos honorários?',
    lastMessageTime: '12:20',
    unreadCount: 0,
    status: 'offline',
    messages: [
      {
        id: 1,
        sender: 'client',
        message: 'Boa tarde! Gostaria de saber sobre os honorários para constituição de empresa.',
        timestamp: '12:15',
        date: '2024-01-26'
      },
      {
        id: 2,
        sender: 'ai',
        message: 'Olá Ana! Para constituição de empresa, nossos honorários variam de R$ 2.500 a R$ 5.000, dependendo da complexidade. Posso agendar uma consulta para avaliarmos seu caso específico?',
        timestamp: '12:18',
        date: '2024-01-26'
      },
      {
        id: 3,
        sender: 'client',
        message: 'Qual o valor dos honorários?',
        timestamp: '12:20',
        date: '2024-01-26'
      }
    ]
  }
];

export const aiResponses = {
  'status processo': 'Seu processo está em andamento normal. A última movimentação foi a juntada de documentos em 20/01/2024. O próximo passo é aguardar a manifestação da parte contrária.',
  'agendar': 'Posso agendar uma reunião para você. Temos disponibilidade na próxima semana: terça-feira às 14h, quarta-feira às 10h ou sexta-feira às 16h. Qual horário prefere?',
  'valor': 'Nossos honorários variam conforme a complexidade do caso. Para uma consulta inicial, cobramos R$ 200. Para processos, trabalhamos com percentual sobre o êxito (20-30%) ou valor fixo. Gostaria de agendar uma avaliação gratuita?',
  'default': 'Entendi sua solicitação. Vou transferir você para um de nossos advogados que poderá ajudá-lo melhor. Em breve você receberá um retorno.'
};
