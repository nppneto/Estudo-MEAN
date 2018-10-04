const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,   
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// ".pre" é uma função do mongoose para quando quisermos que algo seja feito antes de ser realizada a operação no banco
UserSchema.pre('save', async function(next) {
    // encriptando password através da biblioteca bcryptjs
    // parametro 10 = quantos rounds para ter um hash mais forte
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;