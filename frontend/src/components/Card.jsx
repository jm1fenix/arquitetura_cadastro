import React, { useState } from 'react';

function Card({ tarefa, buscarTarefas }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTarefa, setEditedTarefa] = useState({ ...tarefa });
  
  // Função para alterar o status da tarefa
  const alterarStatus = async (novoStatus) => {
    await atualizarTarefa(novoStatus);
  };

  // Função para atualizar a tarefa no backend
  const atualizarTarefa = async (novoStatus) => {
    const body = { ...tarefa, status: novoStatus };
    await fetch(`http://localhost:3131/tarefas/${tarefa.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    buscarTarefas(); // Atualiza a lista de tarefas
  };

  // Função para editar os dados da tarefa
  const editarTarefa = async () => {
    await fetch(`http://localhost:3131/tarefas/${tarefa.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedTarefa)
    });
    buscarTarefas();
    setIsEditing(false);
  };

  // Função para deletar a tarefa
  const deletarTarefa = async () => {
    const confirmed = window.confirm("Tem certeza de que deseja deletar esta tarefa?");
    if (confirmed) {
      await fetch(`http://localhost:3131/tarefas/${tarefa.id}`, { method: 'DELETE' });
      buscarTarefas();
    }
  };

  return (
    <div className="card">
      <h3>{tarefa.titulo}</h3>
      <p>Descrição: {tarefa.descricao}</p>
      <p>Status: {tarefa.status}</p>
      
      {/* Botões para alterar o status */}
      {tarefa.status === 'A Fazer' && (
        <>
          <button onClick={() => alterarStatus('Em Progresso')}>Iniciar</button>
          <button onClick={() => alterarStatus('Concluído')}>Concluir</button>
        </>
      )}
      
      {tarefa.status === 'Em Progresso' && (
        <button onClick={() => alterarStatus('Concluído')}>Concluir</button>
      )}
      
      {tarefa.status === 'Concluído' && (
        <button onClick={() => alterarStatus('A Fazer')}>Reverter</button>
      )}

      {/* Editar tarefa */}
      {isEditing && (
        <div>
          <input
            value={editedTarefa.titulo}
            onChange={(e) => setEditedTarefa({ ...editedTarefa, titulo: e.target.value })}
          />
          <textarea
            value={editedTarefa.descricao}
            onChange={(e) => setEditedTarefa({ ...editedTarefa, descricao: e.target.value })}
          />
          <button onClick={editarTarefa}>Salvar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      )}

      {/* Se não estiver editando, mostrar botões de edição e deleção */}
      {!isEditing && (
        <>
          <button onClick={() => setIsEditing(true)}>Editar</button>
          <button onClick={deletarTarefa}>Deletar</button>
        </>
      )}
    </div>
  );
}

export default Card;
