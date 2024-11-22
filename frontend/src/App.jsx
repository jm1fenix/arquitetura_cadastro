import React, { useEffect, useState } from 'react';
import Card from './components/Card';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isAddingTarefa, setIsAddingTarefa] = useState(false);
  const [isAddingCliente, setIsAddingCliente] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    status: 'A Fazer',  // valor padrão
    cliente_id: ''
  });
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: ''
  });

  // Função para filtrar tarefas por status
  const filtroTarefasPorStatus = (status) => tarefas.filter(tarefa => tarefa.status === status);

  // Função para adicionar nova tarefa
  function adicionarTarefa() {
    setIsAddingTarefa(true);
  }

  // Função para adicionar novo cliente
  function adicionarCliente() {
    setIsAddingCliente(true);
  }

  // Função para salvar cliente no backend
  const salvarCliente = async () => {
    try {
      await fetch('http://localhost:3131/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCliente),
      });
      setIsAddingCliente(false);
      setNovoCliente({ nome: '', email: '' });
      buscarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  // Função para salvar a tarefa no backend
  const salvarTarefa = async () => {
    try {
      await fetch('http://localhost:3131/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTarefa),
      });
      setIsAddingTarefa(false);
      setNovaTarefa({ titulo: '', descricao: '', status: 'A Fazer', cliente_id: '' });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  // Função para buscar tarefas
  const buscarTarefas = async () => {
    try {
      const response = await fetch('http://localhost:3131/tarefas');
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  // Função para buscar clientes
  const buscarClientes = async () => {
    try {
      const response = await fetch('http://localhost:3131/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  // UseEffect para buscar tarefas e clientes quando a página carregar
  useEffect(() => {
    buscarTarefas();
    buscarClientes();
  }, []);

  return (
    <div>
      <header>
        <h1>Kanban de Tarefas</h1>
        <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
        <button onClick={adicionarCliente}>Adicionar Cliente</button>
      </header>

      {/* Modal para adicionar cliente */}
      {isAddingCliente && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Cliente</h2>
            <input
              placeholder="Nome"
              value={novoCliente.nome}
              onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
            />
            <input
              placeholder="Email"
              value={novoCliente.email}
              onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
            />
            <button onClick={salvarCliente}>Salvar</button>
            <button onClick={() => setIsAddingCliente(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal para adicionar tarefa */}
      {isAddingTarefa && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Tarefa</h2>
            <input
              placeholder="Título"
              value={novaTarefa.titulo}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              value={novaTarefa.descricao}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
            />
            <select
              value={novaTarefa.status}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, status: e.target.value })}
            >
              <option value="A Fazer">A Fazer</option>
              <option value="Em Progresso">Em Progresso</option>
              <option value="Concluída">Concluída</option>
            </select>
            <select
              value={novaTarefa.cliente_id}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, cliente_id: e.target.value })}
            >
              <option value="">Selecione o Cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            <button onClick={salvarTarefa}>Salvar</button>
            <button onClick={() => setIsAddingTarefa(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Listar tarefas */}
      <div className="tarefas">
        <h2>A Fazer</h2>
        {filtroTarefasPorStatus('A Fazer').map((tarefa) => (
          <Card key={tarefa.id} tarefa={tarefa} />
        ))}
        <h2>Em Progresso</h2>
        {filtroTarefasPorStatus('Em Progresso').map((tarefa) => (
          <Card key={tarefa.id} tarefa={tarefa} />
        ))}
        <h2>Concluída</h2>
        {filtroTarefasPorStatus('Concluída').map((tarefa) => (
          <Card key={tarefa.id} tarefa={tarefa} />
        ))}
      </div>
    </div>
  );
}

export default App;
