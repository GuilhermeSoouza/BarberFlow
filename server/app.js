const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const barbeiroRoutes = require('./routes/barbeiroRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const barbeiroPainelRoutes = require('./routes/barbeiroPainelRoutes');
const adminRoutes = require('./routes/adminRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const filaRoutes = require('./routes/filaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do BarberFlow rodando!' });
});

app.use('/', usuarioRoutes);
app.use('/', authRoutes);
app.use('/', servicoRoutes);
app.use('/', barbeiroRoutes);
app.use('/', agendamentoRoutes);
app.use('/', barbeiroPainelRoutes);
app.use('/', adminRoutes);
app.use('/', avaliacaoRoutes);
app.use('/', filaRoutes);

module.exports = app;