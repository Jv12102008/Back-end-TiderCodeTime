const express = require('express');
const cors = require('cors');
const app = express();
const port = 3500;

// Simula dados vindos de um arquivo externo chamado "api.js"
/* const api = require("./api");
 */
// Middlewares
app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.status(200).send('Hello Word');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});