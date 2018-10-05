const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../config/auth');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) =>{

    const { email }  = req.body;

    try{

        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'Este e-mail já existe!' });

        const user = await User.create(req.body);

        // quando for efetuado o registro, não irá retornar a senha do usuário
        user.password = undefined;

        // Quando o usuário for criado, gera e retorna o token também
        return res.send({ 
            user,
            token: generateToken({ id: user.id }),
        });

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res) => {

    // Receberemos o email e senha do usuário através do req.body
    const { email, password } = req.body;

    // Como no campo senha do model setamos select:false
    // Precisaremos adicionar o password na pesquisa do e-mail
    const user = await User.findOne({ email }).select('+password');

    // Se o usuário não existir...
    if(!user)
        return res.status(400).send({ error: 'Usuário não existe!' });

    // Importamos a biblioteca do bcrypt para fazer a comparação
    // Da senha utilizou no campo com a senha cadastrada no banco
    // Fazemos uso do bcrypt pois quando o usuario cadastrou a senha, ela foi encriptada
    // É usado o await pois é uma função assincrona (promises)
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Senha inválida!' });

    user.password = undefined;

    // Token expira em 1 dia (recebe parâmetro em segundos)
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
    });

    // Se o login for efetuado com sucesso, retorna o usuário
    res.send({ 
        user,
        // Ao logar, gera o token para o usuário
        // E retorna o token 
        token: generateToken({ id: user.id }),
    });
});

// Definindo um prefixo. Sempre que o usuário acessar /auth, irá receber o restando do caminho declarado no router
module.exports = app => app.use('/auth', router);