const models = require('../models/index.js');
// const {
//     loggerErrorMessage,
//     loggerInfoMessage,
// } = require('../logMessages/index.js');

function establishDbConnection() {
    const { sequelize } = models;
    sequelize
        .authenticate()
        .then(async () => {
            // loggerInfoMessage('connection');
            console.log('Database connected successfully');
            await sequelize
                .sync()
                .then(() => {
                    // loggerInfoMessage('sync');
                })
                .catch((error) => {
                    // loggerErrorMessage('sync', { error });
                });
        })
        .catch((error) => {
            // loggerErrorMessage('connection', { error });
            console.log('Database connection error %s', error);
        });
}

module.exports = establishDbConnection;
