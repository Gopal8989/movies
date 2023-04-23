const app = require("./app");
const { app: { port } } = require('./config/index.js')
const database = require("./database");
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    database;
});

module.exports = app;
