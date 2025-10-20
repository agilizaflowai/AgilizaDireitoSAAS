import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwbkjqjocjgiqextceug.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmtqcWpvY2pnaXFleHRjZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzE1MTYsImV4cCI6MjA2NzUwNzUxNn0.7ViiOCvmOey11RarzweKq8mSsjwd-L-UYacmPSu9x_k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentMessages() {
  try {
    console.log('🔍 Verificando as 5 mensagens mais recentes...\n');
    
    const { data, error } = await supabase
      .from('chat')
      .select('*')
      .order('id', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Erro:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Nenhuma mensagem encontrada');
      return;
    }

    console.log(`📊 Encontradas ${data.length} mensagens recentes:\n`);
    
    data.forEach((msg, index) => {
      console.log(`${index + 1}. ID: ${msg.id}`);
      console.log(`   Session: ${msg.session_id}`);
      console.log(`   Tipo: ${msg.message?.type || 'N/A'}`);
      console.log(`   Conteúdo: ${(msg.message?.content || '').substring(0, 50)}...`);
      console.log(`   Created At: ${msg.created_at || 'NULL'}`);
      console.log(`   Data formatada: ${msg.created_at ? new Date(msg.created_at).toLocaleString('pt-BR') : 'N/A'}`);
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Erro ao verificar mensagens:', error);
  }
}

checkRecentMessages();