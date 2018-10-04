const mongoose = require('mongoose');

// Criando conexão com o banco de dados Mongo // Definindo o uso do mongoClient (exemplo: mysqli, pdo)
// useMongoClient: true foi descontinuado na nova versão do mongodb
// mongoose.connect('mongodb://localhost/noderest', {useMongoClient: true});
mongoose.connect('mongodb://localhost/noderest', {useNewUrlParser: true});
// collection.ensureIndex foi descontinuado também... Será necessário setar a linha a seguir
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

module.exports = mongoose;