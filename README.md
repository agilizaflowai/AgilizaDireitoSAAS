# Agiliza Direito

Uma plataforma SaaS completa para advogados e escritórios jurídicos que facilita a gestão de clientes, processos e documentos jurídicos com recursos avançados de IA.

## Funcionalidades

- **Dashboard Intuitivo**: Visão geral de métricas e atividades do escritório
- **Gestão de Clientes**: Cadastro e acompanhamento completo de clientes
- **Gestão de Leads**: Acompanhamento de potenciais clientes e conversões
- **Filtro de Processos**: Organização e busca avançada de processos jurídicos
- **Documentos com IA**: Geração automatizada de petições e documentos jurídicos
- **Análise de Contratos**: Verificação e análise de contratos com suporte de IA
- **Agenda Jurídica**: Controle de prazos e compromissos
- **Cálculo de Honorários**: Ferramenta para cálculo de honorários advocatícios
- **Validador de CPF**: Verificação automática de documentos
- **Suporte de IA**: Assistente inteligente para tarefas jurídicas

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Autenticação, Storage)
- **Build/Dev**: Vite, ESLint
- **Integração IA**: OpenAI API
- **Estilização**: TailwindCSS com tema claro/escuro

## Instalação e Configuração

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/AgilizaDireito-SAAS.git
cd AgilizaDireito-SAAS

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env.local com as configurações:
# VITE_SUPABASE_URL=sua-url-do-supabase
# VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
# VITE_OPENAI_API_KEY=sua-chave-da-api-openai (opcional)

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Estrutura do Projeto

```
/src
  /components      # Componentes React reutilizáveis
  /contexts        # Contextos para gerenciamento de estado
  /data            # Dados mockados e constantes
  /hooks           # Custom hooks React
  /services        # Serviços e integrações com APIs
  /types           # Definições de tipos TypeScript
```

## Autenticação Supabase

O sistema utiliza Supabase para autenticação e armazenamento de dados. Para configurar:

1. Crie um projeto no Supabase (https://supabase.com)
2. Configure as tabelas necessárias conforme os scripts SQL incluídos
3. Ative autenticação por email/senha
4. Configure as variáveis de ambiente com suas credenciais

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Todos os direitos reservados. © AgilizaDireito 2024