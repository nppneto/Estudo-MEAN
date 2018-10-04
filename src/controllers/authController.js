const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) =>{

    const { email }  = req.body;

    try{

        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'Este e-mail já existe!' });

        const user = await User.create(req.body);

        // quando for efetuado o registro, não irá retornar a senha do usuário
        user.password = undefined;

        return res.send({ user });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

// Definindo um prefixo. Sempre que o usuário acessar /auth, irá receber o restando do caminho declarado no router
module.exports = app => app.use('/auth', router);