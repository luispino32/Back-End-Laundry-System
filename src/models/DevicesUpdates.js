const { model, Schema } = require('mongoose');

DevicesUpdate = model(
    `DevicesUpdates`,
    new Schema({
        customersId:{
            type: 'UUID', 
            required: [true]
        },
        deviceId:{
            type: String, 
            required: [true]
        },
        date:{
            type: Date,
            default: Date.now
        },
        update:{any:{}}
    })
);

module.exports = DevicesUpdate;