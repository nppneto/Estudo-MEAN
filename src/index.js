// Importando bibliotecas
const express = require('express');
const bodyParser = require('body-parser');

// Criando a aplicação chamando a função Express
const app = express();

// Utilizando a função do body-parser Json() para que ele entenda quando eu enviar informações para minha api em json.
app.use(bodyParser.json());
// Esta é para minha api entender quando eu passar parametros via url
app.use(bodyParser.urlencoded({ extended: false }));

// Fazendo um get na url raíz do projeto. 
// req = dados da requisição (parâmetros, token de autenticação e etc)
// res = objeto para enviar resposta para o usuario quando a rota for acessada
// app.get('/', (req, res) => {
//     res.send('OK');
// });

// Referenciando o authController junto com app para que não seja necessário instanciar o app recebendo express novamente
// Caso fizessemos assim, estaríamos rodando duas aplicações na mesma plataforma do node
require('./controllers/authController')(app);
require('./controllers/projectController')(app);

// Ouvindo a api na porta 3000
app.listen(3000);