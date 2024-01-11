const DevicesDatas = require('../models/DevicesDatas');
const Users = require('../models/Users');
const bcrypt = require("bcrypt");

const getTypeField = (fieldSchema) => (
    fieldSchema.instance === 'Array' ? 'Array-' + getTypeField(fieldSchema.caster) :
        fieldSchema.instance
);

const getFields = (fieldSchema, index = '0') => {
    const fields = Object.keys(fieldSchema.paths).filter(field => 
        field != 'customer' && field != '_id' && field != '__v');

    const ojectFields = fields.map((field, index2) => ({
        idField: `${index}${index2}`,
        name: field,
        type: getTypeField(fieldSchema.paths[field]),
        fields: fieldSchema.paths[field].hasOwnProperty('schema') ?
            getFields(fieldSchema.paths[field].schema, `${index}${index2}`) : []
    }));

    return ojectFields;
}

const register = async (req, res) => {
    const { name, email, password, mode } = req.body;

    try{
        if(!name || !email || !password)
            return res.status(400).json({error: 'Faltan datos'});

        const userEmail = await Users.findOne({ email });

        if(userEmail) 
            return res.status(409).json({error: 'El ususario ya existe'});

        const userCreate = await Users.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            mode
        });

        if(mode === 'SuperUser'){
            const viewChange = getFields(DevicesDatas.schema);
            await Users.updateOne({email}, {viewChange});
        }

        return res.status(201).json({user: userCreate.name, email: userCreate.email});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
};

module.exports = register;