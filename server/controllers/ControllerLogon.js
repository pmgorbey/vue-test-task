const User = require('../models/ModelLogon');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const {secret} = require('../config');

const generateAccessToken = (id) => {
    const payload = {
        id
    }

    return jwt.sign(payload, secret, {expiresIn: '24h'});
}

class Controller {
    //REGISTRATION
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Error during regidtration ...', errors});
            }

            const {name, password} = req.body;   
            console.log(name);         
            console.log(password);         
            const candidate = await User.findOne({name: name});
            if (candidate) {
                return res.status(400).json({message: "Користувач з таким іменем вже зареєстрований ... "});
            }

            const hashPassword = bcrypt.hashSync(password, 5);
            const user = new User({name: name, password: hashPassword});
            await user.save();
            // return res.json({message: "Користувач успішно зареєстрований ..."});
            res.redirect('/');

        } catch (err) {
            console.log(err);
            res.status(400).json({message: 'Registration error'});
        }
    };


    //Login
    async login(req, res) {
        try {
            const {name, password} = req.body;
            console.log(req.body); 
            const user = await User.findOne({name: name});
            if (!user) {
                return res.status(400).json({message: `User with name ${name} is notfound ...`});
            }

            //Чи валідний пароль
            const validPassword = bcrypt.compareSync(password, user.password);
            
            if (!validPassword) {
                return res.status(400).json({message: `Password is incorrect ...`});
            }

            //JWT 
            const token = generateAccessToken(user._id);
            res.json(`Bearer ${token}`);
            // res.status(200).json({token});
            // res.redirect('/');

            

        } catch (err) {
            console.log(err);
            res.status(400).json({message: 'Login error'});
            
        }
    };
};

module.exports = new Controller();