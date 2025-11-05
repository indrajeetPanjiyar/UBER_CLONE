const mongoose = require("mongoose");
require("dotenv").config();

function connectToDB() {
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.log(error);
        process.exit(1);
    })
}

module.exports = connectToDB;