// Script simplificado para criar usuário no Supabase Auth
// Execute com: node create-user-simple.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wwbkjqjocjgiqextceug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmtqcWpvY2pnaXFleHRjZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzE1MTYsImV4cCI6MjA2NzUwNzUxNn0.7ViiOCvmOey11RarzweKq8mSsjwd-L-UYacmPSu9x_k";

// Cliente normal (sem privilégios administrativos)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createUserAndAdvogado() {
  try {
    console.log('🔄 Tentando fazer signup do usuário...');
    
    // 1. Tentar fazer signup (isso criará o usuário no Auth)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'thempreendedormilionario@gmail.com',
      password: '#Tvp0309',
      options: {
        data: {
          name: 'Advogado Teste'
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ Usuário já existe, tentando fazer login...');
        
        // Se já existe, vamos tentar fazer login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'thempreendedormilionario@gmail.com',
          password: '#Tvp0309'
        });

        if (signInError) {
          console.error('❌ Erro ao fazer login:', signInError);
          return;
        }

        console.log('✅ Login realizado com sucesso!');
        console.log('🆔 User ID:', signInData.user.id);
        
        // Verificar se já existe na tabela advogados
        await checkAndCreateAdvogado(signInData.user.id, signInData.user.email);
        
      } else {
        console.error('❌ Erro ao criar usuário:', signUpError);
        return;
      }
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('📧 Email:', signUpData.user.email);
      console.log('🆔 ID:', signUpData.user.id);
      
      // Criar registro na tabela advogados
      await checkAndCreateAdvogado(signUpData.user.id, signUpData.user.email);
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

async function checkAndCreateAdvogado(userId, email) {
  try {
    console.log('🔄 Verificando registro na tabela advogados...');
    
    // Verificar se já existe
    const { data: existingAdvogado, error: checkError } = await supabase
      .from('advogados')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Erro ao verificar advogado:', checkError);
      return;
    }

    if (existingAdvogado) {
      console.log('✅ Registro do advogado já existe!');
      console.log('👤 Dados:', existingAdvogado);
      return;
    }

    // Se não existe, tentar criar
    console.log('🔄 Criando registro na tabela advogados...');
    
    const { data: advogadoData, error: advogadoError } = await supabase
      .from('advogados')
      .insert({
        user_id: userId,
        nome: 'Advogado Teste',
        oab: '123456',
        uf: 'SP'
      })
      .select();

    if (advogadoError) {
      console.error('❌ Erro ao criar advogado:', advogadoError);
      
      // Se o erro for de coluna não existir, mostrar instruções
      if (advogadoError.message.includes('user_id')) {
        console.log('\n⚠️ A tabela advogados não tem o campo user_id!');
        console.log('📝 Execute este SQL no painel do Supabase:');
        console.log('ALTER TABLE public.advogados ADD COLUMN user_id UUID REFERENCES auth.users(id);');
        console.log('CREATE INDEX idx_advogados_user_id ON public.advogados(user_id);');
      }
      return;
    }

    console.log('✅ Registro do advogado criado com sucesso!');
    console.log('👤 Dados:', advogadoData[0]);

    console.log('\n🎉 Configuração concluída!');
    console.log('📧 Email: thempreendedormilionario@gmail.com');
    console.log('🔑 Senha: #Tvp0309');
    console.log('🆔 User ID:', userId);

  } catch (error) {
    console.error('💥 Erro ao processar advogado:', error);
  }
}

// Executar o script
createUserAndAdvogado();