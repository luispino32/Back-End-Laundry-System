const {mongoose} = require('mongoose');

const schemaUser = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    
    password:{
        type:String,
        required:true
    },

    mode:{
        type:String,
        required: true,
        enum: {
            values: ['SuperUser', 'ZoneUser', 'SingleUser'],
            message: 'El tipo no es valido'
        }
    },
    
    devices:{type:[{
        idDevice:{type: mongoose.ObjectId, ref: 'DevicesDatas'},
        restriction:{type: [String]}
    }], default: []},

    viewChange:{
        type: [{
            idField:{type: String},
            name:{type: String},
            type:{type: String},
            fields:[{}],
            change:{type: Boolean, default: false}
        }], default: []
    }
});

const Users = mongoose.model('Users', schemaUser);

module.exports = Users;
