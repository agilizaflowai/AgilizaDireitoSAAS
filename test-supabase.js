import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwbkjqjocjgiqextceug.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmtqcWpvY2pnaXFleHRjZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzE1MTYsImV4cCI6MjA2NzUwNzUxNn0.7ViiOCvmOey11RarzweKq8mSsjwd-L-UYacmPSu9x_k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('=== TESTANDO CONEXÃO COM SUPABASE ===');
  
  try {
    // Testar conexão básica
    const { data: tables, error: tablesError } = await supabase
      .from('contratos')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('Erro ao acessar tabela contratos:', tablesError);
      return;
    }
    
    console.log('Conexão com Supabase OK!');
    console.log('Dados da tabela contratos:', tables);
    
    // Verificar estrutura da tabela
    const { data: allData, error: allError } = await supabase
      .from('contratos')
      .select('*');
    
    if (allError) {
      console.error('Erro ao buscar todos os dados:', allError);
    } else {
      console.log('Total de registros na tabela:', allData?.length || 0);
      if (allData && allData.length > 0) {
        console.log('Estrutura do primeiro registro:', Object.keys(allData[0]));
        console.log('Primeiro registro completo:', allData[0]);
      }
    }
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

testSupabase();