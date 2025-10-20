import React, { useState } from 'react';

export default function Step6Revisao({ data, updateForm, prevStep, onSubmit }) {
  // Estados para controlar qual seção está sendo editada
  const [editingSection, setEditingSection] = useState(null);
  const [editData, setEditData] = useState({});

  // Função para verificar se um campo está preenchido
  const isFieldFilled = (value) => {
    if (Array.isArray(value)) {
      return value && value.length > 0;
    }
    return value && value.toString().trim() !== '';
  };

  // Função para renderizar um campo apenas se estiver preenchido
  const renderField = (label, value, transform = null) => {
    if (!isFieldFilled(value)) return null;
    
    const displayValue = transform ? transform(value) : value;
    return (
      <div><b>{label}:</b> {displayValue}</div>
    );
  };

  // Função para iniciar edição de uma seção
  const handleEdit = (section) => {
    setEditingSection(section);
    setEditData({ ...data });
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditData({});
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    updateForm(editData);
    setEditingSection(null);
    setEditData({});
  };

  // Função para atualizar dados durante edição
  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Verificar se uma seção tem pelo menos um campo preenchido
  const hasDadosAcao = isFieldFilled(data.fatosCaso) || isFieldFilled(data.parteRepresentada) || 
                      isFieldFilled(data.parteContraria) || isFieldFilled(data.tipoAcao) || 
                      isFieldFilled(data.jurisdicao) || isFieldFilled(data.objetivosCliente) ||
                      (data.uploadedFiles && data.uploadedFiles.length > 0);

  const hasPerguntasIA = isFieldFilled(data.pergunta1) || isFieldFilled(data.pergunta2) || 
                        isFieldFilled(data.pergunta3) || isFieldFilled(data.pergunta4) || 
                        isFieldFilled(data.pergunta5);

  const hasDosFatos = isFieldFilled(data.dosFatos);

  const hasFundamentosJuridicos = isFieldFilled(data.fundamentosJuridicos);

  const hasPedidos = isFieldFilled(data.pedidos) || isFieldFilled(data.danosMateriais) || 
                    isFieldFilled(data.danosMorais) || isFieldFilled(data.tutelaUrgencia) || 
                    isFieldFilled(data.outrosPedidos) || isFieldFilled(data.audienciaConciliacao) || 
                    isFieldFilled(data.honorariosPercentual) || isFieldFilled(data.interesseProvas);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4">Revisão Final</h2>
      
      {/* Dados da Ação */}
      {hasDadosAcao && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-black">Dados da Ação</h3>
            {editingSection !== 'dadosAcao' && (
              <button type="button" className="text-blue-600 underline text-xs hover:text-blue-800" onClick={() => handleEdit('dadosAcao')}>Editar</button>
            )}
          </div>
          
          {editingSection === 'dadosAcao' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fatos do caso:</label>
                <textarea
                  value={editData.fatosCaso || ''}
                  onChange={(e) => handleEditChange('fatosCaso', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parte representada:</label>
                <input
                  type="text"
                  value={editData.parteRepresentada || ''}
                  onChange={(e) => handleEditChange('parteRepresentada', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parte contrária:</label>
                <input
                  type="text"
                  value={editData.parteContraria || ''}
                  onChange={(e) => handleEditChange('parteContraria', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de ação:</label>
                <input
                  type="text"
                  value={editData.tipoAcao || ''}
                  onChange={(e) => handleEditChange('tipoAcao', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdição:</label>
                <input
                  type="text"
                  value={editData.jurisdicao || ''}
                  onChange={(e) => handleEditChange('jurisdicao', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos do cliente:</label>
                <textarea
                  value={editData.objetivosCliente || ''}
                  onChange={(e) => handleEditChange('objetivosCliente', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="2"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm px-4 py-2" onClick={handleSaveEdit}>Salvar</button>
                <button type="button" className="btn-secondary text-sm px-4 py-2" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 space-y-2">
              {renderField('Fatos do caso', data.fatosCaso)}
              {renderField('Parte representada', data.parteRepresentada)}
              {renderField('Parte contrária', data.parteContraria)}
              {renderField('Tipo de ação', data.tipoAcao)}
              {renderField('Jurisdição', data.jurisdicao)}
              {renderField('Objetivos do cliente', data.objetivosCliente)}
              {data.uploadedFiles && data.uploadedFiles.length > 0 && (
                <div>
                  <b>Documentos anexados:</b>
                  <ul className="ml-4 mt-1">
                    {data.uploadedFiles.map((file, index) => (
                      <li key={index} className="text-xs text-gray-600">• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Perguntas da IA */}
      {hasPerguntasIA && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-black">Perguntas da IA</h3>
            {editingSection !== 'perguntasIA' && (
              <button type="button" className="text-blue-600 underline text-xs hover:text-blue-800" onClick={() => handleEdit('perguntasIA')}>Editar</button>
            )}
          </div>
          
          {editingSection === 'perguntasIA' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">1. Qual o valor mensal estimado das despesas atuais de Pedro Henrique da Silva, discriminando-as?</label>
                <textarea
                  value={editData.pergunta1 || ''}
                  onChange={(e) => handleEditChange('pergunta1', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">2. O genitor João Marcos da Silva possui alguma fonte de renda formal ou informal?</label>
                <textarea
                  value={editData.pergunta2 || ''}
                  onChange={(e) => handleEditChange('pergunta2', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">3. Ana Luiza Costa possui condições financeiras de arcar integralmente com as despesas?</label>
                <textarea
                  value={editData.pergunta3 || ''}
                  onChange={(e) => handleEditChange('pergunta3', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">4. O autor possui alguma necessidade especial de saúde ou educação?</label>
                <textarea
                  value={editData.pergunta4 || ''}
                  onChange={(e) => handleEditChange('pergunta4', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">5. Houve alguma tentativa de acordo extrajudicial com João Marcos da Silva?</label>
                <textarea
                  value={editData.pergunta5 || ''}
                  onChange={(e) => handleEditChange('pergunta5', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm px-4 py-2" onClick={handleSaveEdit}>Salvar</button>
                <button type="button" className="btn-secondary text-sm px-4 py-2" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 space-y-4">
              {isFieldFilled(data.pergunta1) && (
                <div>
                  <div className="font-medium text-gray-800 mb-1">1. Qual o valor mensal estimado das despesas atuais de Pedro Henrique da Silva, discriminando-as?</div>
                  <div className="text-gray-600 pl-4 border-l-2 border-blue-200">{data.pergunta1}</div>
                </div>
              )}
              {isFieldFilled(data.pergunta2) && (
                <div>
                  <div className="font-medium text-gray-800 mb-1">2. O genitor João Marcos da Silva possui alguma fonte de renda formal ou informal?</div>
                  <div className="text-gray-600 pl-4 border-l-2 border-blue-200">{data.pergunta2}</div>
                </div>
              )}
              {isFieldFilled(data.pergunta3) && (
                <div>
                  <div className="font-medium text-gray-800 mb-1">3. Ana Luiza Costa possui condições financeiras de arcar integralmente com as despesas?</div>
                  <div className="text-gray-600 pl-4 border-l-2 border-blue-200">{data.pergunta3}</div>
                </div>
              )}
              {isFieldFilled(data.pergunta4) && (
                <div>
                  <div className="font-medium text-gray-800 mb-1">4. O autor possui alguma necessidade especial de saúde ou educação?</div>
                  <div className="text-gray-600 pl-4 border-l-2 border-blue-200">{data.pergunta4}</div>
                </div>
              )}
              {isFieldFilled(data.pergunta5) && (
                <div>
                  <div className="font-medium text-gray-800 mb-1">5. Houve alguma tentativa de acordo extrajudicial com João Marcos da Silva?</div>
                  <div className="text-gray-600 pl-4 border-l-2 border-blue-200">{data.pergunta5}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dos Fatos */}
      {hasDosFatos && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-black">Dos Fatos</h3>
            {editingSection !== 'dosFatos' && (
              <button type="button" className="text-blue-600 underline text-xs hover:text-blue-800" onClick={() => handleEdit('dosFatos')}>Editar</button>
            )}
          </div>
          
          {editingSection === 'dosFatos' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dos Fatos:</label>
                <textarea
                  value={editData.dosFatos || ''}
                  onChange={(e) => handleEditChange('dosFatos', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="8"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm px-4 py-2" onClick={handleSaveEdit}>Salvar</button>
                <button type="button" className="btn-secondary text-sm px-4 py-2" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              <div className="whitespace-pre-wrap">{data.dosFatos}</div>
            </div>
          )}
        </div>
      )}

      {/* Fundamentos Jurídicos */}
      {hasFundamentosJuridicos && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-black">Fundamentos Jurídicos</h3>
            {editingSection !== 'fundamentosJuridicos' && (
              <button type="button" className="text-blue-600 underline text-xs hover:text-blue-800" onClick={() => handleEdit('fundamentosJuridicos')}>Editar</button>
            )}
          </div>
          
          {editingSection === 'fundamentosJuridicos' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fundamentos Jurídicos:</label>
                <textarea
                  value={editData.fundamentosJuridicos || ''}
                  onChange={(e) => handleEditChange('fundamentosJuridicos', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="8"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm px-4 py-2" onClick={handleSaveEdit}>Salvar</button>
                <button type="button" className="btn-secondary text-sm px-4 py-2" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              <div className="whitespace-pre-wrap">{data.fundamentosJuridicos}</div>
            </div>
          )}
        </div>
      )}

      {/* Pedidos */}
      {hasPedidos && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-black">Pedidos</h3>
            {editingSection !== 'pedidos' && (
              <button type="button" className="text-blue-600 underline text-xs hover:text-blue-800" onClick={() => handleEdit('pedidos')}>Editar</button>
            )}
          </div>
          
          {editingSection === 'pedidos' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pedidos principais:</label>
                <textarea
                  value={editData.pedidos || ''}
                  onChange={(e) => handleEditChange('pedidos', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor dos danos materiais:</label>
                <input
                  type="text"
                  value={editData.danosMateriais || ''}
                  onChange={(e) => handleEditChange('danosMateriais', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor dos danos morais:</label>
                <input
                  type="text"
                  value={editData.danosMorais || ''}
                  onChange={(e) => handleEditChange('danosMorais', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tutela de urgência:</label>
                <select
                  value={editData.tutelaUrgencia || ''}
                  onChange={(e) => handleEditChange('tutelaUrgencia', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              {editData.tutelaUrgencia === 'Sim' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Justificativa da urgência:</label>
                  <textarea
                    value={editData.justificativaUrgencia || ''}
                    onChange={(e) => handleEditChange('justificativaUrgencia', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outros pedidos:</label>
                <textarea
                  value={editData.outrosPedidos || ''}
                  onChange={(e) => handleEditChange('outrosPedidos', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audiência de conciliação:</label>
                <select
                  value={editData.audienciaConciliacao || ''}
                  onChange={(e) => handleEditChange('audienciaConciliacao', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Honorários advocatícios (percentual):</label>
                <input
                  type="text"
                  value={editData.honorariosPercentual || ''}
                  onChange={(e) => handleEditChange('honorariosPercentual', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm px-4 py-2" onClick={handleSaveEdit}>Salvar</button>
                <button type="button" className="btn-secondary text-sm px-4 py-2" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              {isFieldFilled(data.pedidos) && (
                <>
                  <div><b>Pedidos principais:</b></div>
                  <div className="whitespace-pre-wrap mb-2">{data.pedidos}</div>
                </>
              )}
              {renderField('Valor dos danos materiais', data.danosMateriais)}
              {renderField('Valor dos danos morais', data.danosMorais)}
              {renderField('Tutela de urgência', data.tutelaUrgencia)}
              {data.tutelaUrgencia === 'Sim' && renderField('Justificativa da urgência', data.justificativaUrgencia)}
              {renderField('Outros pedidos', data.outrosPedidos)}
              {renderField('Audiência de conciliação', data.audienciaConciliacao)}
              {renderField('Honorários advocatícios (percentual)', data.honorariosPercentual)}
              {renderField('Interesse em produção de provas', data.interesseProvas, (value) => value.join(', '))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button type="button" className="btn-secondary" onClick={prevStep}>Voltar</button>
        <button 
          type="button" 
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          onClick={onSubmit}
        >
          📄 Gerar Documento
        </button>
      </div>
    </div>
  );
}