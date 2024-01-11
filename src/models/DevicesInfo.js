const { mongoose } = require('mongoose');

DevicesInfo = (devicesId) => {
    if(mongoose.models[`InfoLav_${devicesId}`])
        return mongoose.models[`InfoLav_${devicesId}`];

    return mongoose.model(
        `InfoLav_${devicesId}`,
        new mongoose.Schema({
            washId:{
                type:Number,
                required: true,
                validate:{
                    validator: (value) => Number.isInteger(value) && value >= 0,
                    messege: "El numero debe ser un entero mayor o igua a cero"
                }
            },
            repeat:{type:Boolean, default: false},
            machine:{
                type:Number, 
                required: true,
                validate:{
                    validator: (value) => Number.isInteger(value) && value > 0 && value <= 10,
                    messege: "El valor debe ser un entero entre 1 y 10"
                }
            },
            formula:{
                type:Number,
                required: true,
                validate:{
                    validator: (value) => Number.isInteger(value) && value > 0 && value <= 20,
                    messege: "El valor debe ser un entero entre 1 y 20"
                }
            },
            steps:{
                type: [{
                    step:{
                        type:Number, 
                        unique:true,
                        validate:{
                            validator: (value) => Number.isInteger(value) && value > 0 && value <= 6,
                            messege: "El valor debe ser un entero entre 1 y 6"
                        }
                    },
                    products:{
                        type:[{
                            product:{
                                type: Number,
                                unique: true,
                                default: 0,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value > 0 && value <= 6,
                                    messege: "El valor debe ser un entero entre 1 y 6"
                                }
                            },
                            amount:{
                                type: Number,
                                default: 0,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value >= 0,
                                    messege: "El valor debe ser un entero mayor o igual a 0"
                                }
                            },
                            pumpTime:{
                                type: Number,
                                default: 0,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value >= 0,
                                    messege: "El valor debe ser un entero mayo o igual a 0"
                                }
                            },
                            sensorRv:{
                                type: Number,
                                default: 0,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value >= 0,
                                    messege: "El valor debe ser un entero mayo o igual a 0"
                                }
                            },
                            others:{}
                        }], validate:{
                            validator: (array) => array.length <= 6,
                            messege: "El arreglo puede terner maximo 6 posiciones"
                        }
                    },
                    dateServer:{
                        type: Date,
                        default: Date.now
                    },
                    dateDevice:{type: Date}
                }], validate:{
                    validator: (array) => array.length <= 6,
                    messege: "El arreglo puede terner maximo 6 posiciones"
                }, default: []
            },
            err:{
                type:[{
                    typeError:{
                        type: String,
                        enum:['LowFLowProduct', 'LowFlowWater', 'cycleCancel', 'repeatStep', 'timeOver', 'noSteps']
                    },
                    step:{
                        type:Number, 
                        validate:{
                            validator: (value) => Number.isInteger(value) && value > 0 && value <= 6,
                            messege: "El valor debe ser un entero entre 1 y 6"
                        }
                    },
                    products:{
                        type:[{
                            product:{
                                type: Number,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value > 0 && value <= 6,
                                    messege: "El valor debe ser un entero entre 1 y 6"
                                }
                            },
                            amount:{
                                type: Number,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value >= 0,
                                    messege: "El valor debe ser un entero mayor o igual a 0"
                                }
                            },
                            pumpTime:{
                                type: Number,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value >= 0,
                                    messege: "El valor debe ser un entero mayo o igual a 0"
                                }
                            },
                            sensorRv:{
                                type: Number,
                                validate:{
                                    validator: (value) => Number.isInteger(value) && value >= 0,
                                    messege: "El valor debe ser un entero mayo o igual a 0"
                                }
                            },
                            others:{}
                        }], validate:{
                            validator: (array) => array.length <= 6,
                            messege: "El arreglo puede terner maximo 6 posiciones"
                        }
                    },
                    dateServer:{
                        type: Date,
                        default: Date.now()
                    },
                    dateDevice:{type: Date}
                }], default: []
            }            
        }, {timestamps: true})
    );
};

module.exports = DevicesInfo;