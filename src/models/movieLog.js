module.exports = (sequelize, DataTypes) => {
    const MovieLog = sequelize.define(
        'MovieLog',
        {
            movieId: {
                type: DataTypes.INTEGER,
            },
            updateData: {
                type: DataTypes.STRING(50),
            },
            oldData: {
                type: DataTypes.STRING(50),
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

    return MovieLog;
};