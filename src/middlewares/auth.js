const jwt = require('jsonwebtoken');
// Importo o segredo do token de dentro da pasta config
const authConfig = require('../config/auth');

// Recebemos agora como parâmetro  o next
// Quando chamarmos o next(), é porque o usuário
// Está pronto para ir para o próximo passo (projectController)
module.exports = (req, res, next) => {
    // Aqui buscamos o header de autorização na requisição (Token)
    const authHeader = req.headers.authorization;

    // Se não vier o Token (caso authHeader esteja vazio)
    if(!authHeader)
        return res.status(401).send({ error: 'Token não encontrado!' });

    // Separo o token em 2 partes (Bearer Juy67hT4hsuIj892)
    const parts = authHeader.split(' ');

    // Verifico se o token está separado em 2
    if(!parts.lenght == 2)
        return res.status(401).send({ error: 'Erro no token!' });

    // Recebo o token dividio (scheme recebe o "Bearer" e o token recebe o Hash)
    const [scheme, token] = parts;

    // Utilizo a seguinte expressão regular e a função test() para verificar se 
    // Scheme recebeu somente o "Bearer"
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token mal formatado!' });

    // Verifico se o token bate com o segredo e recebo o callback (err, decoded)
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        // Se der erro...
        if(err)
            return res.status(401).send({ error : 'Token inválido!' })

        // Se estiver tudo ok, armazeno o id do usuário
        // Nas próximas requisições para o controller
        // Consigo acessar o id no decoded pois ele está incluido nos params
        // Da função generateToken
        // O req.userId poderá ser usado em qualquer função do controller após a autenticação
        req.userId = decoded.id;

        // E autorizo o usuário a ir para o próximo passo (projectController)
        return next();
    });

};