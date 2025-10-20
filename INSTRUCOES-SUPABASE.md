# Instruções para Criar a Tabela filtro_de_processos no Supabase

## Passo a Passo

### 1. Acesse o Painel do Supabase
- Vá para [https://supabase.com](https://supabase.com)
- Faça login na sua conta
- Selecione o projeto do seu SaaS Advogado

### 2. Abra o Editor SQL
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova consulta

### 3. Execute o Script SQL
- Copie todo o conteúdo do arquivo `create-filtro-processos-table.sql`
- Cole no editor SQL do Supabase
- Clique em **"Run"** para executar o script

### 4. Verifique a Criação da Tabela
- Vá para **"Table Editor"** no menu lateral
- Você deve ver a nova tabela `filtro_de_processos` na lista
- Clique na tabela para ver sua estrutura

## Estrutura da Tabela Criada

A tabela `filtro_de_processos` contém os seguintes campos:

### Campos Básicos
- `id` - Chave primária (auto-incremento)
- `created_at` - Data de criação (automática)
- `updated_at` - Data de atualização (automática)

### Número do Processo
- `numero_processo` - Número do processo (obrigatório)
- `numero_cnj` - Número CNJ padronizado (opcional)

### Classificação
- `classe` - Classe processual
- `assunto` - Assunto do processo
- `area_direito` - Área do direito

### Localização
- `tribunal` - Tribunal responsável
- `comarca` - Comarca do processo
- `estado` - Estado/UF

### Status
- `situacao` - Situação atual do processo
- `segredo` - Se o processo corre em segredo de justiça (boolean)
- `arquivado` - Se o processo está arquivado (boolean)
- `movimentacoes` - Histórico de movimentações (JSON)

### Datas Principais
- `data_inicio` - Data de início/distribuição
- `ultima_movimentacao` - Data da última movimentação
- `tempo_tramitacao` - Tempo de tramitação em dias

### Partes e Advogados
- `partes` - Informações das partes (JSON)
- `advogados` - Informações dos advogados (JSON)

### Campos Adicionais
- `valor_causa` - Valor da causa (decimal)
- `prioridade` - Prioridade do processo
- `observacoes` - Observações gerais

## Recursos Criados

### Índices para Performance
- Índice no `numero_processo`
- Índice no `numero_cnj`
- Índice no `tribunal`
- Índice na `situacao`
- Índice na `area_direito`
- Índice no `created_at`

### Trigger Automático
- Trigger para atualizar automaticamente o campo `updated_at`

### Segurança (RLS)
- Row Level Security habilitado
- Política básica para usuários autenticados

## Uso no Código

Após criar a tabela, você pode usar o hook personalizado criado:

```typescript
import { useFiltroProcessos } from '../hooks/useFiltroProcessos';

// No seu componente
const { processos, loading, error, addProcesso, updateProcesso, deleteProcesso } = useFiltroProcessos();
```

## Exemplo de Inserção de Dados

```typescript
const novoProcesso = {
  numero_processo: "1234567-89.2024.8.26.0001",
  numero_cnj: "1234567-89.2024.8.26.0001",
  classe: "Ação de Cobrança",
  assunto: "Cobrança de Honorários",
  area_direito: "Direito Civil",
  tribunal: "TJSP",
  comarca: "São Paulo",
  estado: "SP",
  situacao: "Em andamento",
  data_inicio: "2024-01-15",
  partes: {
    ativas: ["João Silva"],
    passivas: ["Maria Santos"]
  },
  advogados: [
    {
      nome: "Dr. Carlos Oliveira",
      oab: "123456/SP",
      tipo: "Autor"
    }
  ]
};

await addProcesso(novoProcesso);
```

## Troubleshooting

### Erro de Permissão
Se você receber erro de permissão, verifique se:
- Você tem acesso de administrador ao projeto
- As políticas RLS estão configuradas corretamente

### Erro de Sintaxe
- Certifique-se de copiar todo o conteúdo do arquivo SQL
- Verifique se não há caracteres especiais corrompidos

### Tabela Não Aparece
- Atualize a página do Supabase
- Verifique se o script foi executado sem erros
- Vá para "Table Editor" e procure por "filtro_de_processos"