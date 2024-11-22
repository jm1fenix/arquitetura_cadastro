const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

// Configuração do PostgreSQL
const pool = new Pool({
    user: 'postgres', // Substitua pelo seu usuário do PostgreSQL
    host: 'localhost',
    database: 'kanban', // Nome da sua database
    password: 'senai', // Substitua pela sua senha
    port: 5432, // Porta padrão do PostgreSQL
});

// Habilitar CORS para todas as rotas
app.use(cors());
app.use(express.json());

// Rota para criar um novo cliente
app.post('/clientes', async (req, res) => {
    const { nome, email } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING *',
            [nome, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
});

// Rota para buscar todos os clientes
app.get('/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

// Rota para buscar todas as tarefas
app.get('/tarefas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tarefas');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

// Rota para buscar tarefas por cliente
app.get('/tarefas/cliente/:cliente_id', async (req, res) => {
    const { cliente_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tarefas WHERE cliente_id = $1', [cliente_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar tarefas do cliente' });
    }
});

// Rota para buscar uma tarefa por ID
app.get('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});

// Rota para adicionar uma nova tarefa
app.post('/tarefas', async (req, res) => {
    const { titulo, descricao, status, cliente_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tarefas (titulo, descricao, status, cliente_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, descricao, status, cliente_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar tarefa' });
    }
});

// Rota para atualizar uma tarefa
app.put('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status, cliente_id, data_conclusao } = req.body;
    try {
        const updateResult = await pool.query(
            'UPDATE tarefas SET titulo = $1, descricao = $2, status = $3, cliente_id = $4, data_conclusao = $5 WHERE id = $6 RETURNING *',
            [titulo, descricao, status, cliente_id, data_conclusao, id]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

// Rota para deletar uma tarefa
app.delete('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
});

// Configuração da porta
const PORT = process.env.PORT || 3131;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    } else {
        console.log(`Servidor rodando na porta ${PORT}`);
    }
});
