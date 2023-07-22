
module.exports = (sequelize, DataTypes) => {
    const UserLoginLog = sequelize.define(
        'UserLoginLog',
        {
            userId: {
                type: DataTypes.INTEGER,
            },
            ipV4: {
                type: DataTypes.STRING,
            },
            ipV6: {
                type: DataTypes.STRING,
            }
        },
        {
            underscored: true,
        }
    );


    UserLoginLog.associate = (models) => {
        UserLoginLog.belongsTo(models.User, {
            foreignKey: 'userId',
        });
    };
    return UserLoginLog;
};