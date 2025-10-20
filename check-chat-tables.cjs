const { createClient } = require('@supabase/supabase-js');

// Credenciais do Supabase
const supabaseUrl = "https://wwbkjqjocjgiqextceug.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmtqcWpvY2pnaXFleHRjZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzE1MTYsImV4cCI6MjA2NzUwNzUxNn0.7ViiOCvmOey11RarzweKq8mSsjwd-L-UYacmPSu9x_k";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    // Buscar dados da tabela chat
    const { data: chatData, error: chatError } = await supabase
      .from('chat')
      .select('*')
      .order('id', { ascending: false })
      .limit(10);
    
    if (!chatError) {
      console.log('Tabela chat encontrada!');
      console.log('Total de registros encontrados:', chatData.length);
      console.log('\nPrimeiras mensagens:');
      chatData.forEach((msg, index) => {
        console.log(`${index + 1}. ID: ${msg.id}, Session: ${msg.session_id}`);
        console.log(`   Tipo: ${msg.message?.type || 'N/A'}`);
        console.log(`   Conteúdo: ${msg.message?.content || 'N/A'}`);
        console.log('   ---');
      });
    } else {
      console.log('Erro ao acessar tabela chat:', chatError.message);
    }

  } catch (error) {
    console.log('Erro geral:', error.message);
  }
}

checkTables();