const { model, Schema} = require('mongoose');

const Zones = model(
    "Zones",
    new Schema({
        name:{
            type: String,
            required: true,
            unique: true,
            validate:{
                validator: (val) => val.trim().length > 0,
                message: 'El nombre no puede estar vacio'
            },
            set: (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
        }
    })
);

module.exports = Zones;