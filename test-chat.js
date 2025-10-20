import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwbkjqjocjgiqextceug.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmtqcWpvY2pnaXFleHRjZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzE1MTYsImV4cCI6MjA2NzUwNzUxNn0.7ViiOCvmOey11RarzweKq8mSsjwd-L-UYacmPSu9x_k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testChatData() {
  try {
    console.log('Verificando dados na tabela chat...');
    
    const { data, error } = await supabase
      .from('chat')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar dados:', error);
      return;
    }

    console.log('Dados encontrados:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('Primeiros registros:');
      data.forEach((item, index) => {
        console.log(`${index + 1}. Session ID: ${item.session_id}`);
        console.log(`   Mensagem: ${JSON.stringify(item.message)}`);
        console.log(`   Data: ${item.created_at}`);
        console.log('---');
      });
    } else {
      console.log('Nenhum dado encontrado na tabela chat');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

testChatData();