// Script para criar usuário no Supabase Auth
// Execute com: node create-user-supabase.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Chave de service role (não a anon key)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.log('Certifique-se de ter VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  process.exit(1);
}

// Cliente com privilégios administrativos
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUserAndAdvogado() {
  try {
    console.log('🔄 Criando usuário no Supabase Auth...');
    
    // 1. Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'thempreendedormilionario@gmail.com',
      password: '#Tvp0309',
      email_confirm: true,
      user_metadata: {
        name: 'Advogado Teste'
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError);
      return;
    }

    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', authData.user.email);
    console.log('🆔 ID:', authData.user.id);

    // 2. Verificar se a tabela advogados tem o campo user_id
    console.log('🔄 Verificando estrutura da tabela advogados...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'advogados')
      .eq('column_name', 'user_id');

    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError);
      return;
    }

    if (!tableInfo || tableInfo.length === 0) {
      console.log('⚠️ Campo user_id não existe na tabela advogados');
      console.log('📝 Execute o SQL para adicionar o campo:');
      console.log('ALTER TABLE public.advogados ADD COLUMN user_id UUID REFERENCES auth.users(id);');
      return;
    }

    // 3. Inserir registro na tabela advogados
    console.log('🔄 Criando registro na tabela advogados...');
    
    const { data: advogadoData, error: advogadoError } = await supabase
      .from('advogados')
      .upsert({
        user_id: authData.user.id,
        nome: 'Advogado Teste',
        email: 'thempreendedormilionario@gmail.com',
        oab: '123456',
        uf: 'SP'
      })
      .select();

    if (advogadoError) {
      console.error('❌ Erro ao criar advogado:', advogadoError);
      return;
    }

    console.log('✅ Registro do advogado criado com sucesso!');
    console.log('👤 Dados:', advogadoData[0]);

    console.log('\n🎉 Configuração concluída!');
    console.log('📧 Email: thempreendedormilionario@gmail.com');
    console.log('🔑 Senha: #Tvp0309');
    console.log('🆔 User ID:', authData.user.id);

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

// Executar o script
createUserAndAdvogado();