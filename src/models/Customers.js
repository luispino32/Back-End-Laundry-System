const mongoose = require('mongoose');

Customers = mongoose.model(
    'Customers',
    new mongoose.Schema({
        name:{
            type:String, 
            required:true,
            unique: true
        },
        location:{
            type:String, 
            required:true
        },
        zone:{
            type: String,
            required: true,
            validate: {
                validator: async function (val) {
                  const Zone = mongoose.model('Zones');
                  const zoneExists = await Zone.exists({ name: val });
                  return zoneExists;
                },
                message: 'La Zona no existe en BD'
            },
            set: (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
        }
    }, {timestamp: true})
);

module.exports = Customers;