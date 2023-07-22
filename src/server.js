const app = require("./app");
const { app: { port } } = require('./config/index.js')
const database = require("./service/database.service.js");
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    database();
});

module.exports = app;
