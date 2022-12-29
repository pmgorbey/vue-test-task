const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}, {timestamps: true});

const User = model('User', userSchema)

module.exports = User;