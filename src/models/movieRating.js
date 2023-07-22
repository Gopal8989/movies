const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const MovieRating = sequelize.define(
        'MovieRating',
        {
            review: {
                type: DataTypes.TEXT,
            },
            rating: {
                type: DataTypes.DECIMAL(10, 4),
            },
            movieId: {
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
            },
        },
        {
            underscored: true,
        }
    );

    return MovieRating;
};