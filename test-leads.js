import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wwbkjqjocjgiqextceug.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmtqcWpvY2pnaXFleHRjZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzE1MTYsImV4cCI6MjA2NzUwNzUxNn0.7ViiOCvmOey11RarzweKq8mSsjwd-L-UYacmPSu9x_k";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testLeadsTable() {
  console.log('=== TESTANDO TABELA LEADS ===');
  
  try {
    // Testar se a tabela leads existe
    console.log('Tentando acessar tabela leads...');
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
    
    if (leadsError) {
      console.error('Erro ao acessar tabela leads:', leadsError);
      console.log('A tabela leads provavelmente não existe.');
      
      // Vamos verificar quais tabelas existem
      console.log('\nVerificando tabelas existentes...');
      
      // Testar tabela contratos
      const { data: contratosData, error: contratosError } = await supabase
        .from('contratos')
        .select('*')
        .limit(1);
      
      if (!contratosError) {
        console.log('✅ Tabela contratos existe');
      }
      
      // Testar tabela clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .limit(1);
      
      if (!clientesError) {
        console.log('✅ Tabela clientes existe');
      }
      
      return;
    }
    
    console.log('✅ Tabela leads existe!');
    console.log('Dados da tabela leads:', leadsData);
    
    // Verificar estrutura da tabela
    const { data: allLeads, error: allError } = await supabase
      .from('leads')
      .select('*');
    
    if (allError) {
      console.error('Erro ao buscar todos os leads:', allError);
    } else {
      console.log('Total de leads na tabela:', allLeads?.length || 0);
      if (allLeads && allLeads.length > 0) {
        console.log('Estrutura do primeiro lead:', Object.keys(allLeads[0]));
        console.log('Primeiro lead completo:', allLeads[0]);
      }
    }
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

testLeadsTable();