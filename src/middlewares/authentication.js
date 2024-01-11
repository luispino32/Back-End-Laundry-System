const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const { PASSWORD_TOKEN } = process.env;

const checkAuth = (req, res, next) => {
    if(req.path === '/Login' || req.path === '/Device/Info_Device'){
        next();
    }else{
        const bearer = req.get('Authorization');

        if(!bearer || !bearer.startsWith('bearer ')) 
            return res.status(401).json({error: 'Token fail'});

        const { token } = JSON.parse(bearer.substring(7));

        jwt.verify(token, `${PASSWORD_TOKEN}`, (err, decoded) => {
            if (err)
                return res.status(401).json({error: 'Token fail'});

            req.userData = decoded.userData;
            next();
        });
    }
};

module.exports = checkAuth;