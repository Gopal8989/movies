
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            firstName: {
                type: DataTypes.STRING(50),
            },
            lastName: {
                type: DataTypes.STRING(50),
            },
            email: {
                type: DataTypes.STRING(100),
            },
            isEmailVerify: {
                type: DataTypes.TINYINT(1),
                defaultValue: 0,
            },
            password: {
                type: DataTypes.STRING(255),
            },
            token: {
                type: DataTypes.TEXT,
            },
            resetToken: {
                type: DataTypes.STRING,
            },
            userType: {
                type: DataTypes.ENUM('admin', 'user'),
                defaultValue: 'admin',
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


    User.loadScopes = () => {
        User.addScope('basic', {
            attributes: {
                exclude: ['password', 'token', 'resetToken'],
            },
        });
    };

    User.associate = (models) => {
        User.hasMany(models.UserLoginLog, {
            foreignKey: 'userId',
        });
        // User.hasOne(models.Movie, {
        //     foreignKey: 'createdById',
        // });
        // User.hasMany(models.PartOrder, {
        //     foreignKey: 'userId',
        // });
        // User.belongsTo(models.User, {
        //     foreignKey: 'createdById',
        //     as: 'createdByUser',
        // });
    };
    return User;
};