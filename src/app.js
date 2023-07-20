const express = require("express");
const helmet = require('helmet');
const cors = require("cors");
const router = require("./routes/index.js");
const { app: { baseUrl } } = require('./config/index.js')

const app = express();
app.use(cors());
// Request size limit
// app.use(express.urlencoded());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use((req, res, next) => {
    // req.headers['content-type'] = req.headers['content-type'] || 'text/plain';
    res.header("Access-Control-Allow-Origin", `${baseUrl}`);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Contect-Type"), next();
});

router(app);

module.exports = app;
