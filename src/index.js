require('dotenv').config();
const server = require("./app");
const conn  = require("./DB_connections");

const { PORT_BACK } = process.env;

conn().then(() => {
    server.listen(PORT_BACK, () => {
        console.log(`Server is listening on port: ${PORT_BACK}`);
    });
}); 