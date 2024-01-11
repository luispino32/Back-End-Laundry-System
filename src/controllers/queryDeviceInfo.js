//const mongoose = require('mongoose');
const DevicesInfo = require("../models/DevicesInfo");
const DevicesDatas = require("../models/DevicesDatas");

const putDeviceInfo = async (req, res) => {
    const { deviceId, washId, machine, formula, steps, err } = req.body;

    try{
        if(!deviceId || !washId || !machine || !formula)
            return res.status(406).json({error: 'Faltan datos'});

        const deviceExists = await DevicesDatas.findOne({deviceId}, 'deviceId');
        const err_s = [];

        if(deviceExists){
            const DeviceInfo = DevicesInfo(deviceId);
            const infoDevice = await DeviceInfo.findOne({washId, machine}).lean();
            
            if(err) err_s.push(err);
            if(!steps) err_s.push({typeError: 'noSteps'});

            const deviceInfo = infoDevice ? 
                infoDevice.formula === formula ?
                    infoDevice.steps.some(step => step.step === steps.step) ?
                        await DeviceInfo.updateOne({washId, machine, formula, err:[...infoDevice.err, {...steps, typeError:'repeatStep'}]}) :
                        await DeviceInfo.updateOne({washId, machine, formula, steps:[...infoDevice.steps, steps], err:[...infoDevice.err, ...err_s]}) : 
                    await DeviceInfo.updateOne({washId, machine, formula, steps:[...infoDevice.steps, steps], err:[...infoDevice.err, ...err_s], repeat:true}) :
                await DeviceInfo.create({washId, machine, formula, steps:steps?[steps]:[], err: err_s});

            return res.status(200).json(deviceInfo);
        }
        
        return res.status(404).json({error: 'Dispositivo no encontrado'});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

const getDeviceInfo = async (req, res) => {
    const {deviceId, dateStart, dateEnd} = req.query;

    try{
        if(!deviceId || !dateStart || ! dateEnd)
            return res.status(406).json({error: 'Faltan datos'});

        const deviceExists = await DevicesDatas.findOne({deviceId}, 'Machines');

        if(deviceExists){
            const DeviceInfo = DevicesInfo(deviceId);
            const infoDevice = await DeviceInfo.find({
                createdAt: {
                    $gte: new Date(dateStart), 
                    $lte: new Date(dateEnd)    
                }
            }).select('-__v -_id').lean();

            return res.status(200).json(infoDevice);
        }

        return res.status(404).json({error: 'Dispositivo no encontrado'});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    putDeviceInfo,
    getDeviceInfo
};