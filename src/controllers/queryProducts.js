const Products = require('../models/Products');

const getProducts = async (req, res) => {
    try{
        const products = await Products.find({});

        return res.status(200).json(products);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

const postProduct = async (req, res) => {
    const { nameDevice, nameWeb } = req.body;

    try{
        if(!nameDevice || !nameWeb) return res.status(400).json({error: 'Faltan datos'});

        const product = await Products.create({nameDevice, nameWeb});

        return res.status(200).json(product);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

const putProduct = async (req, res) => {
    const { _id, nameDevice, nameWeb } = req.body;

    try{
        if(!_id || (!nameDevice && !nameWeb)) return res.status(400).json({error: 'Faltan datos'});
        delete req.body.idProduct;

        const product = await Products.findByIdAndUpdate(_id, req.body, {returnDocument:'after'});

        return res.status(200).json(product);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    getProducts,
    postProduct,
    putProduct
}