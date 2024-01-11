const DevicesDatas = require('../models/DevicesDatas');

/*const getTypeField = (fieldSchema) => (
    fieldSchema.instance === 'Array' ? 'Array-' + getTypeField(fieldSchema.caster) :
        fieldSchema.instance
);

const getFields = (fieldSchema) => {
    const fields = Object.keys(fieldSchema.paths).filter(field => 
        field != 'customer' && field != 'users' && field != '_id' && field != '__v');

    const ojectFields = fields.map(field => ({
        name: field,
        type: getTypeField(fieldSchema.paths[field]),
        fields: fieldSchema.paths[field].hasOwnProperty('schema') ?
            getFields(fieldSchema.paths[field].schema) : []
    }));

    return ojectFields;
}*/


const getDevice = async (req, res) => {
    const { deviceId } = req.params;

    try{
        if(!deviceId) return res.status(400).json({error: 'Faltan datos'});

        const device = await DevicesDatas.findOne({deviceId})
        .select('-__v -Formulas._id -Machines._id -Products._id')
        .lean();

        delete device.customer;
        delete device.users; // validar que usuarios se le pueden enviar
        
        //const fields = getFields(DevicesDatas.schema);

        return res.status(200).json(device);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

const postDevice = async (req, res) => {
    const { deviceId, customer } = req.body;

    try{
        if(!deviceId || !customer)
            return res.status(400).json({error: 'Faltan datos'});

        const deviceCreate = await DevicesDatas.create({
            deviceId,
            customer
        });

        return res.status(200).json({ 
            deviceId: deviceCreate.deviceId,
            customer: deviceCreate.customer
         });
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

const putDevice = async (req, res) => {
    const { deviceId, values } = req.body;

    //console.log(`deviceId: ${deviceId}`);
    //console.log(values);

    try{
        if(!deviceId || !values)
                return res.status(400).json({ error: 'Datos incorrectos' });
        
        /*const fieldsUpdate = await findById(idUser, 'viewChange');

        if(!fieldsUpdate || fieldsUpdate.length === 0)
            return res.status(403).json({error: 'Sin acceso'});

        const updateValues = {};*/

        const deviceUpdate = await DevicesDatas.findByIdAndUpdate(
            deviceId,
            {$set: values},
            {lean: true, new: true})
            .select('-__v -Formulas._id -Machines._id -Products._id')
            .lean();
        
        if(!deviceUpdate)
            return res.status(400).json({ error: 'Datos incorrectos' });
    
            delete deviceUpdate.customer;
            delete deviceUpdate.users;
        
        console.log(deviceUpdate);
        return res.status(200).json(deviceUpdate);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    getDevice,
    putDevice,
    postDevice,
}

// values = [{
//    name: "Products",
//    index: '' || '2',
//    fields: {
//      {property: 'nameWeb', value: 'SuperClean'},
//      {property: 'nameDevice', value: 'SuperClean'},
//      {property: 'state', value: false},
//      {property: 'calibration', value: {Ml: 100, time:12, rv: 1300},
//      {property: 'typeControl', value: 1}
//    }
//}];

