const mongoose = require('mongoose');

const Products = mongoose.model(
    'Products',
    new mongoose.Schema({
        nameDevice:{
            type: String,
            required: true,
            unique: true,
            validate:{
                validator: (value) => value.length <= 10,
                message: 'El nombre no debe superar los 10 caracteres'
            }
        },

        nameWeb:{
            type: String,
            required: true,
            unique: true
        }
    })
);

module.exports = Products;