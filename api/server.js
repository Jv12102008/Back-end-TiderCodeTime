// api/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Configurações
const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB Atlas
if (!process.env.MONGO_DB) {
  throw new Error("⚠️ Variável de ambiente MONGO_DB não encontrada");
}

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  year: Number,
  location: String,
  country: String,
  sex: String,
  marital_status: String,
  description: String,
  img_url: String,
});

// Modelo
const User = mongoose.models.User || mongoose.model("User", userSchema);

// ROTAS

// GET - lista todos os usuários
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar usuários", details: err.message });
  }
});

// POST - cria novo usuário
app.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao salvar usuário", details: err.message });
  }
});

// PUT - atualiza usuário pelo ID
app.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "Usuário não encontrado" });
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar usuário", details: err.message });
  }
});

// DELETE - remove usuário pelo ID
app.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "Usuário não encontrado" });
    return res.status(200).json(deletedUser);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao deletar usuário", details: err.message });
  }
});

export default app;