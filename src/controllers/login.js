require('dotenv').config();

//const Customers = require('../models/Customers');
const Users = require('../models/Users');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { PASSWORD_TOKEN } = process.env;


const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        if(!email || !password)
            return res.status(400).json({error: 'Faltan datos'});

        const loggedUser = await Users.findOne({ email })
            .populate({
                path: 'devices.idDevice',
                select:'deviceId',
                populate:{
                    path: 'customer',
                    model: 'Customers',
                    select:'-__v -_id'
                }
            }).select('-__v -email -devices._id -viewChange._id').lean();

        if(!loggedUser)
            return res.status(404).json({error: 'Usuario no registrado'});

        if (bcrypt.compareSync(password, loggedUser.password)){
            const dataToken = {
                id: loggedUser._id, 
                name: loggedUser.name, 
                mode: loggedUser.mode,
            };

            const token = jwt.sign({ userData: dataToken }, `${PASSWORD_TOKEN}`, {
                expiresIn: 60 * 60 * 24 * 12
            }); 

            delete loggedUser._id;
            delete loggedUser.password;

            return res.status(200).json({
                token: token,
                user: loggedUser
            });
        }

        return res.status(401).json({error: 'Acceso denegado'});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
};

module.exports = login;