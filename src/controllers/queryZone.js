const Zones = require('../models/Zones');

const postZone = async (req, res) => {
    const { name } = req.body;

    try{
        if(!name || name.trim().length === 0) 
            return res.status(400).json({error: 'Faltan Datos'});

        const zoneCreate = await Zones.create({ name });

        return res.status(200).json({zone: zoneCreate});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    postZone
};