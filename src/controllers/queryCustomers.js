const Customers = require('../models/Customers');

const postCustomer = async (req, res) => {
    const { name, location, zone } = req.body;

    try{
        if(!name || !location || !zone)
            return res.status(400).json({error: 'Faltan datos'});

        const customerCreate = await Customers.create({
            name,
            location,
            zone
        });

        return res.status(200).json({ customerCreate });
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    postCustomer
}