const DevicesDatas = require('../models/DevicesDatas');
const Users = require('../models/Users');
const bcrypt = require("bcrypt");

const getTypeField = (fieldSchema) => (
    fieldSchema.instance === 'Array' ? 'Array-' + getTypeField(fieldSchema.caster) :
        fieldSchema.instance
);

const getFieldsArray = (fieldSchema, index = '0') => {
    const fields = Object.keys(fieldSchema.paths).filter(field => 
        field != 'customer' && field != '_id' && field != '__v');

    let arrayReturn = [];
    for(const [index2, field] of fields.entries()){
        if(fieldSchema.paths[field].hasOwnProperty('schema')){
            arrayReturn = [...arrayReturn, 
                ...getFieldsArray(fieldSchema.paths[field].schema, `${index}${index2}`)];
            
            arrayReturn.push(`${index}${index2}`);
        }else arrayReturn.push(`${index}${index2}`);
    }

    return arrayReturn;
};

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

const validatorNoRepeatFields = (array, fields = getFields(DevicesDatas.schema)) => 
(array.every((value, index) => {
    if(!fields.some(field => {
        return field.name === value.name && field.type === value.type
    })) return false;

    const noRepeat = new Set();
    return value.fields.length > 0 ? 
        validatorNoRepeatFields(value.fields, fields[index].fields) : 
        !noRepeat.has(value.name);
}));

//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------

const getUser = async (req, res) => {
    try{
        const id = req.userData.id;

        const user = await Users.findById(id)
            .populate({
                path: 'devices.idDevice',
                select:'deviceId',
                populate:{
                    path: 'customer',
                    model: 'Customers',
                    select:'-__v -_id'
                }
            }).select('-__v -email -devices._id -viewChange._id').lean();

        delete user.password;
        delete user._id;

        return res.status(200).json({user: user});
    }catch(error){
        return res.status(401).json({error: error.message});
    }
}

const putUser = async (req, res) => {
    const { name, email, email2, password, mode, devices, viewChange } = req.body;

    try{
        if(!email && (!name || !password || !mode || !email2 || !devices || !viewChange))
            return res.status(409).json({error: 'Faltan datos'});

        if(viewChange) if(!validatorNoRepeatFields(viewChange))
            return res.status(409).json({
                error: 'Algun campo de viewChange puede estar repetido o tener un valor invalido'
            });

        if(devices){
            if(!Array.isArray(devices)) 
                return res.status(409).json({
                    error: 'El campo devices de ser un arreglo'
                });

            const fieldDevices = getFieldsArray(DevicesDatas.schema);
            const DeviceIds = (await DevicesDatas.find({}, '_id').lean()).map(id => id._id.toString());

            if(!devices.every(device => {
                return device.restriction.every(field => fieldDevices.includes(field)) &&
                            DeviceIds.includes(device.idDevice);
            })) return res.status(409).json({
                    error: 'El campo restriction ó idDevice no pocee un valor valido'
                });
        }

        if(password) req.body.password = bcrypt.hashSync(password, 10);
        req.body.email = req.body.email2;
        delete req.body.email2;

        const userUpdate = await Users.updateOne({email}, req.body);

        if(userUpdate) delete userUpdate.password;

        return res.status(200).json({user: userUpdate})
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const deleteUser = async (req, res) => {
    const { email } = req.body;

    try{
        if(!email) return res.status(409).json({error: 'Faltan datos'});

        const userId = await Users.findOne({ email });

        if(!userId) return res.status(404).json({error: 'El usuario no existe'});

        const deviceUpdates = await DevicesDatas.updateMany(
            {users: {$in: [userId._id]} },
            {$pull: {users: userId._id}});

        const userDelete = await Users.deleteOne({ email });

        return res.status(200).json({deviceUpdates, userDelete});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    getUser,
    putUser,
    deleteUser
};