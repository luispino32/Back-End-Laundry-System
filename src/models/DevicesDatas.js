const mongoose = require('mongoose');

const DevicesData = mongoose.model(
    'DevicesDatas',
    new mongoose.Schema({
        deviceId:{
            type: String, 
            required: true,
            unique: true
        },
        customer:{
            type: mongoose.ObjectId,
            ref: 'Customers',
            required: true,
            validate:{
                validator: async function (val) {
                  const Customer = mongoose.model('Customers');
                  const CustomerExists = await Customer.exists({ _id: val });
                  return CustomerExists;
                },
                message: 'El cliente no existe en BD'
            }
        },
        Machines:{type:{
            amount:{type: Number, default:0, 
                validate:{
                    validator: (value) => (Number.isInteger(value) && value >= 0 && value <=10),
                    message: "El valor debbe ser entre 1 y 10"
                }
            },
            kg:{type: [Number], default:Array.from({length: 10}, () => 0),
                validate:[
                    {validator: (array) => array.every(value => (Number.isInteger(value) && value >= 0 && value <= 300)),
                    message: "El valor debe ser un entero entre 0 y 300"},
                    {validator: (array) => array.length <= 10,
                    message: "El arreglo debe ser de maximo 10 posiciones"}
                ]
            },
            timeFlush:{type:[Number], default: Array.from({length:10}, () => 0),
                validate:[
                    {validator: (array) => array.length <= 10,
                    message: "El arreglo debe ser de maximo 10 posiciones"},
                    {validator: (array) => array.every(value => (Number.isInteger(value) && value >= 0 && value <= 300)),
                    message: "El valor debe ser un entero entre 0 y 300"}
                ]
            },
            state:{type: [Boolean], default:Array.from({length: 10}, () => false),
                validate:{
                    validator: (array) => array.length <= 10,
                    message: "El arreglo debe ser de maximo 10 posiciones"
                }
            },
            formulas:{type: [[{type: Boolean, default:false}]], 
                default: Array.from({length:10}, () => Array.from({length:20}, () => false)),
                validate:[
                    {validator: (array) => array.length <= 10,
                    message: "El arreglo debe ser de maximo 10 posiciones"},
                    {validator: (array) => array.every(array2 => array2.length <= 20),
                    message: "La segunda dimension del arreglo debe ser de maximo 20 posiciones"}
                ]
            }
        }, default: {}},
        Products:{type:[{
                product:{
                    type: mongoose.ObjectId,
                    ref: 'Products',
                    validate:{
                        validator: async function (val) {
                            const Products = mongoose.model('Products');
                            const ProductsExists = await Products.exists({ _id: val });
                            return ProductsExists || val == null;
                        },
                        message: 'El producto no existe en BD'
                    }, default: null
                },
                state:{type: Boolean, default: false},
                calibration:{type:{
                    Ml:{type: Number},
                    time:{type: Number},
                    rv:{type: Number}
                }, default:{Ml:0, time:0, rv:0}},
                typeControl:{type:Number, default:3,
                    validate:{
                        validator: (value) => (Number.isInteger(value) && value >= 1 && value <= 3),
                        message: "El valor debe estar entre 1 y 3"
                    }
                }
            }], 
            default: Array.from({length:6}, (value) => ({state: false})),
            validate:{
                validator: (array) => array.length <= 6,
                message: "El tamaño del arreglo debe ser de maximo 6 posiciones"
            }
        },
        Formulas:{type:[{
            nameWeb:{type: String, required: true},
            nameDevice:{type: String, require: true,
                validate:{
                    validator: (string) => string.length <= 10,
                    message: "El tamaño del string debe ser de maximo 10 caracteres"
                }
            },
            state:{type: Boolean, default: false},
            steps:{type:[{
                step:{type: String, 
                    unique:true,
                    enum:['Pre-Lavado', 'Lavado', 'Rinse 1', 'Rinse 2', 'Rinse 3', 'Suavizado']}, 
                    
                products:[{
                    product:{type: Number, required:true, unique:true, 
                        validate:{
                            validator: (value) => (Number.isInteger(value) && value>0 && value<=6),
                            message:"El valor debe ser entre 1 y 6"
                        }
                    },
                    amount:{type: Number, require:true,
                        validate:{
                            validator: (value) => (Number.isInteger(value) && value>=0 && value<=20),
                            message: "El valor debe ser un entero positivo entre 0 y 20"
                        }
                    },
                    extraAmount:{type: Number, default:0,
                        validate:{
                            validator: (value) => (Number.isInteger(value) && value>= -127 && value <= 127),
                            message: "El valor debe ser un entero entre -127 y 127"
                        }
                    }
                }],
            }], default:[]},
        }], default: Array.from({length:20}, (_,index) => ({nameWeb:`Formula ${index+1}`,
                                                            nameDevice:`Formula ${index+1}`})),
            validate:{
                validator: (array) => array.length <= 20,
                message: "El array debe tener maximo 20 posiciones"
            }
        },
        flowSensor:{type: Boolean, default: true},
        repeatStep:{type: Boolean, default: true}
    }, {timestamp: true})
);

module.exports = DevicesData;