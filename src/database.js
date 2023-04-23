// Init code
const mongoose = require("mongoose");
const { db: { dbUrl } } = require('./config/index.js')

// Connection code
// function establishDbConnection() {
mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then((link) => {
        console.log("Database connected.");
    })
    .catch((error) => {
        console.log(error)
        console.log("Database not connected.");
    });

const db = mongoose.connection;
// }
module.exports = db;
module.exports 
