const { Op } = require('sequelize');

const config = require('../config/index.js');
const utility = require('../utils/common.js');
module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define(
        'Movie',
        {
            title: {
                type: DataTypes.STRING(250),
            },
            director: {
                type: DataTypes.STRING(100),
            },
            year: {
                type: DataTypes.INTEGER(10),
            },
            duration: {
                type: DataTypes.DECIMAL(10, 2),
            },
            description: {
                type: DataTypes.TEXT,
            },
            genere: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'deleted'),
                defaultValue: 'active',
            },
            type: {
                type: DataTypes.ENUM('movie', 'series'),
                defaultValue: 'movie',
            },
            coverImage: {
                type: DataTypes.STRING(250),
            },
            coverImageUrl: {
                type: DataTypes.VIRTUAL,
                get() {
                    const str = this.get('coverImage');
                    return utility.getImage(str, false);
                },
            },
            fileUrl: {
                type: DataTypes.VIRTUAL,
                get() {
                    const str = this.get('file');
                    return utility.getImage(str, false);
                },
            },
            file: {
                type: DataTypes.STRING(250),
            },
            createdById: {
                type: DataTypes.INTEGER,
            },
            updatedById: {
                type: DataTypes.INTEGER,
            },
            deletedById: {
                type: DataTypes.INTEGER,
            },
        },
        {
            underscored: true,
        }
    );


    Movie.loadScopes = () => {
        Movie.addScope('activeMovie', {
            where: {
                status: 'active',
            },
            attributes: {
                exclude: ['createdById', 'updatedById', 'deletedById'],
            },
        });

        Movie.addScope('notDeletedMovie', {
            where: {
                status: { [Op.ne]: 'deleted' },
            },
            attributes: {
                exclude: ['createdById', 'updatedById', 'deletedById'],
            },
        });
        Movie.addScope('inactive', {
            where: {
                status: 'inactive',
            },
            attributes: {
                exclude: ['createdById', 'updatedById', 'deletedById'],
            },
        });

    };

    Movie.associate = (models) => {
        Movie.hasMany(models.MovieLog, {
            foreignKey: 'movieId',
        });
        Movie.hasMany(models.MovieRating, {
            foreignKey: 'movieId',
        });
        Movie.belongsTo(models.User, {
            foreignKey: 'createdById',
        });
    };
    return Movie;
};