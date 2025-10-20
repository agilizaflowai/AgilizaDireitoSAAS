import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step2PerguntasIA({ data, updateForm, nextStep, prevStep, isGenerating }) {
  const [errors, setErrors] = useState({});
  const [perguntasIA, setPerguntasIA] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Perguntas padrão caso não venham da IA
  const perguntasPadrao = [
    {
      id: 'pergunta1',
      texto: 'Qual o valor mensal estimado das despesas atuais de Pedro Henrique da Silva, discriminando-as (ex: alimentação, escola, saúde, lazer)?',
      placeholder: 'As despesas mensais do menor giram em torno de R$ 2.100,00, sendo aproximadamente: alimentação (R$ 600,00), escola e material escolar (R$ 800,00), transporte escolar (R$ 300,00), saúde e medicamentos (R$ 200,00) e lazer/vestuário (R$ 200,00).'
    },
    {
      id: 'pergunta2',
      texto: 'O genitor João Marcos da Silva possui alguma fonte de renda formal ou informal? Se sim, qual o valor aproximado?',
      placeholder: 'O genitor exerce atividade como motorista de aplicativo, com renda média mensal aproximada de R$ 3.500,00.'
    },
    {
      id: 'pergunta3',
      texto: 'Ana Luiza Costa possui condições financeiras de arcar integralmente com as despesas de Pedro Henrique da Silva?',
      placeholder: 'A genitora trabalha como auxiliar administrativa, com rendimento mensal de R$ 2.000,00, o que não é suficiente para arcar sozinha com todas as despesas do menor, já que seu salário cobre apenas parte dos custos básicos da família.'
    },
    {
      id: 'pergunta4',
      texto: 'O autor possui alguma necessidade especial de saúde ou educação que demande gastos extras?',
      placeholder: 'Atualmente, o menor não apresenta necessidades especiais de saúde. No entanto, possui acompanhamento extracurricular de reforço escolar em matemática, com custo mensal de R$ 250,00, considerado essencial para o seu desenvolvimento educacional.'
    },
    {
      id: 'pergunta5',
      texto: 'Houve alguma tentativa de acordo extrajudicial com João Marcos da Silva para o pagamento da pensão alimentícia? Em caso positivo, qual foi o resultado?',
      placeholder: 'Sim. A genitora tentou acordo verbal com o genitor para retomar os depósitos mensais no valor de R$ 1.000,00, mas ele se recusou a efetivar o pagamento, alegando dificuldades financeiras. Diante da negativa, tornou-se necessária a presente ação para formalizar judicialmente o pagamento da pensão.'
    }
  ];

  useEffect(() => {
    // Verifica se existem perguntas da IA no contexto
    if (data.perguntasIA && Array.isArray(data.perguntasIA)) {
      // Mapeia as perguntas da IA para o formato esperado
      const perguntasFormatadas = data.perguntasIA.map((pergunta, index) => ({
        id: `pergunta${index + 1}`,
        texto: pergunta.pergunta || pergunta.texto || pergunta,
        placeholder: pergunta.placeholder || ''
      }));
      setPerguntasIA(perguntasFormatadas);
    } else if (data.perguntasIA && typeof data.perguntasIA === 'object') {
      // Se for um objeto, tenta extrair as perguntas
      const perguntas = data.perguntasIA.perguntas || data.perguntasIA.questions || [];
      if (Array.isArray(perguntas)) {
        const perguntasFormatadas = perguntas.map((pergunta, index) => ({
          id: `pergunta${index + 1}`,
          texto: pergunta.pergunta || pergunta.texto || pergunta,
          placeholder: pergunta.placeholder || ''
        }));
        setPerguntasIA(perguntasFormatadas);
      } else {
        setPerguntasIA(perguntasPadrao);
      }
    } else {
      // Usa perguntas padrão se não houver perguntas da IA
      setPerguntasIA(perguntasPadrao);
    }
  }, [data.perguntasIA]);

  const sendRespostasToWebhook = async (respostas) => {
    try {
      const webhookData = {
        pergunta1: respostas.pergunta1 || '',
        pergunta2: respostas.pergunta2 || '',
        pergunta3: respostas.pergunta3 || '',
        pergunta4: respostas.pergunta4 || '',
        pergunta5: respostas.pergunta5 || '',
        fatosCaso: data.fatosCaso || '',
        parteRepresentada: data.parteRepresentada || '',
        parteContraria: data.parteContraria || '',
        tipoAcao: data.tipoAcao || '',
        jurisdicao: data.jurisdicao || '',
        objetivosCliente: data.objetivosCliente || ''
      };

      const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/peticao-inicial/gerar-peticao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Respostas enviadas com sucesso para o webhook:', result);
      return result;
    } catch (error) {
      console.error('Erro ao enviar respostas para o webhook:', error);
      return null;
    }
  };

  const fetchDocumentoIA = async () => {
    try {
      // Busca a linha mais recente da tabela documentos_ia
      const { data: documentosIA, error } = await supabase
        .from('documentos_ia')
        .select('documento_gerado')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erro ao buscar documento IA:', error);
        return null;
      }

      if (documentosIA && documentosIA.length > 0 && documentosIA[0].documento_gerado) {
        return documentosIA[0].documento_gerado;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar documento IA:', error);
      return null;
    }
  };

  const handleChange = (perguntaId, value) => {
    updateForm({ [perguntaId]: value });
    setErrors(prev => ({ ...prev, [perguntaId]: '' }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Coletar todas as respostas
      const respostas = {
        pergunta1: data.pergunta1 || '',
        pergunta2: data.pergunta2 || '',
        pergunta3: data.pergunta3 || '',
        pergunta4: data.pergunta4 || '',
        pergunta5: data.pergunta5 || ''
      };
      
      // Enviar respostas para o webhook
      await sendRespostasToWebhook(respostas);
      
      // Aguardar 60 segundos para o processamento
      console.log('⏳ Aguardando 60 segundos para processar as informações...');
      await new Promise(resolve => setTimeout(resolve, 60000));
      
      // Buscar documento gerado da tabela
      const documentoGerado = await fetchDocumentoIA();
      
      // Adicionar documento ao contexto do formulário
      if (documentoGerado) {
        updateForm({ documentoGerado });
      }
      
      // Continuar para o próximo step
      nextStep();
    } catch (error) {
      console.error('Erro no processo:', error);
      // Mesmo com erro, continua para o próximo step
      nextStep();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = e => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-slate-900 dark:text-white text-lg">✨</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-slate-900 dark:text-white">
              Antes de seguir, vou te fazer algumas perguntas para entender melhor o caso - isso me ajuda a cobrir pontos 
              que ainda não ficaram totalmente claros. Por favor, responda nos campos abaixo:
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-8">
        {perguntasIA.map((pergunta, index) => (
          <div key={pergunta.id} className="space-y-3">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              {index + 1}. {pergunta.texto} (Opcional)
            </label>
            <textarea
              name={pergunta.id}
              rows={4}
              className="input-primary resize-none dark:bg-gray-800 dark:text-white dark:border-gray-700 placeholder:dark:text-gray-400"
              value={data[pergunta.id] || ''}
              onChange={(e) => handleChange(pergunta.id, e.target.value)}
              placeholder={pergunta.placeholder}
            />
          </div>
        ))}

        <div className="flex justify-between pt-6">
          <button 
            type="button" 
            onClick={handlePrev}
            className="btn-secondary px-6 py-3"
          >
            ← Voltar
          </button>
          <button 
            type="submit" 
            className="btn-primary px-6 py-3 flex items-center justify-center" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando (60s)...
              </>
            ) : (
              'Avançar →'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}