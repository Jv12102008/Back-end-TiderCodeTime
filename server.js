require('dotenv').config(); // para ler o .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3500;

// Conexão com MongoDB Atlas
mongoose.connect(process.env.mongo_db)
    .then(() => console.log(' Conectado ao MongoDB Atlas'))
    .catch((err) => {
        console.error(' Erro ao conectar ao MongoDB:', err);
        process.exit(1); // encerra se não conseguir conectar
    });

// Definição do Schema
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

// Modelo do usuário
const User = mongoose.model('User', userSchema);

// Middlewares
app.use(cors());
app.use(express.json());

// Rota GET
app.get('/', async (req, res) => { 
    const users = await User.find()
    res.status(200).send(users);
});

// Rota POST
app.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar usuário', details: err.message });
    }
});

// Rota DELETE
app.delete('/:id', async (req, res)=>{
    const user = await User.findByIdAndDelete(req.params.id)
    return res.send(user)
})

//Rota UPDATE
app.put('/:id', async (req, res) => {
    try {
        // O terceiro parâmetro { new: true } faz retornar o usuário já atualizado
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: err.message });
    }
});


// Inicia o servidor
app.listen(port, () => {
    console.log(` Servidor rodando na porta ${port}`);
});