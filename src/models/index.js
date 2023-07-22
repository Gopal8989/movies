const fs = require('fs');
const Sequelize = require('sequelize');
const path = require('path');
const dbConfig = require('../config/database.js');

const db = {};
const sequelize = new Sequelize(
    dbConfig.db,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        timezone: dbConfig.timezone,
        logging: false,
        pool: {
            acquire: 60000,
        },
        // logging: (message) => {
        //   logger.infoLogger.info(message);
        //    console.log(message);
        // },
        dialect: 'mysql',
    }
);

fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
    if (db[modelName].seedData) {
        db[modelName].seedData(dbConfig);
    }
    if (db[modelName].loadScopes) {
        db[modelName].loadScopes(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
