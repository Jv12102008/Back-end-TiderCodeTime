require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Porta definida pela Render ou localmente 3500
const port = process.env.PORT || 3500;

// Configuração do CORS para aceitar seu frontend
app.use(cors({
  origin: "*", // ou coloque a URL do seu frontend ex: "https://seufrontend.com"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Middleware para JSON
app.use(express.json());

// Conexão com MongoDB Atlas
mongoose.connect(process.env.mongo_db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB Atlas'))
.catch((err) => {
  console.error('❌ Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// Schema do usuário
const userSchema = new mongoose.Schema({
  name: String,
  year: Number,
  location: String,
  country: String,
  sex: String,
  marital_status: String,
  description: String,
  img_url: String
});

// Modelo
const User = mongoose.model('User', userSchema);

// =================== ROTAS ===================

// GET - listar todos
app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: err.message });
  }
});

// GET - buscar por ID
app.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário', details: err.message });
  }
});

// POST - criar usuário
app.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar usuário", details: err.message });
  }
});

// DELETE - remover usuário
app.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário', details: err.message });
  }
});

// PUT - atualizar usuário
app.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário', details: err.message });
  }
});

// =================== INICIAR SERVIDOR ===================
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});