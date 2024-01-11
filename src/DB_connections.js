require('dotenv').config();
const mongoose = require("mongoose");
const {DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const options = {
    useNewUrlParser: true,
   //useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
};

const conn = () =>
    mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/MultiMaquinas`, options);

module.exports = conn;

