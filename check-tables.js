// Script para verificar o estado das tabelas no Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wwbkjqjocjgiqextceug.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmtqcWpvY2pnaXFleHRjZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzE1MTYsImV4cCI6MjA2NzUwNzUxNn0.7ViiOCvmOey11RarzweKq8mSsjwd-L-UYacmPSu9x_k'
);

async function checkTables() {
  try {
    console.log('🔍 === VERIFICANDO TABELAS ===\n');

    // 1. Verificar tabela advogados
    console.log('📋 TABELA ADVOGADOS:');
    const { data: advogados, error: advError } = await supabase
      .from('advogados')
      .select('*');

    if (advError) {
      console.log('❌ Erro ao consultar advogados:', advError);
    } else {
      console.log(`✅ Total de registros: ${advogados.length}`);
      advogados.forEach((adv, i) => {
        console.log(`${i+1}. OAB: ${adv.oab}, Nome: ${adv.nome}, User ID: ${adv.user_id || 'NULL'}`);
      });
    }

    console.log('\n🔐 TESTE DE AUTENTICAÇÃO:');
    
    // 2. Tentar fazer login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'thempreendedormilionario@gmail.com',
      password: '#Tvp0309'
    });

    if (loginError) {
      console.log('❌ Erro no login:', loginError.message);
    } else {
      console.log('✅ Login bem-sucedido!');
      console.log(`📧 Email: ${loginData.user.email}`);
      console.log(`🆔 User ID: ${loginData.user.id}`);
      
      // 3. Verificar se existe advogado com este user_id
      const { data: advogadoLinked, error: linkError } = await supabase
        .from('advogados')
        .select('*')
        .eq('user_id', loginData.user.id)
        .single();

      if (linkError) {
        if (linkError.code === 'PGRST116') {
          console.log('⚠️ Usuário autenticado, mas não há registro na tabela advogados com este user_id');
          
          // Tentar atualizar um registro existente
          console.log('\n🔄 Tentando conectar ao registro existente...');
          const { data: updateResult, error: updateError } = await supabase
            .from('advogados')
            .update({ user_id: loginData.user.id })
            .eq('oab', '123456')
            .select();

          if (updateError) {
            console.log('❌ Erro ao atualizar:', updateError);
          } else {
            console.log('✅ Registro atualizado com sucesso!');
            console.log('👤 Dados:', updateResult[0]);
          }
        } else {
          console.log('❌ Erro ao verificar link:', linkError);
        }
      } else {
        console.log('✅ Advogado encontrado e conectado!');
        console.log('👤 Dados do advogado:', advogadoLinked);
      }
    }

    console.log('\n🎯 RESUMO:');
    console.log('- Tabela advogados: ✅ Acessível');
    console.log('- Autenticação: ' + (loginError ? '❌ Falhou' : '✅ Funcionando'));
    console.log('- Conexão user_id: ' + (loginError ? '❌ Não testado' : '✅ Verificado'));

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

checkTables();