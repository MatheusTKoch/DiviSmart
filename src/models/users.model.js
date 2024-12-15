import index from '../server/index.js';

    const User = index.sequelize.define("users", {
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        }
        });


export default User(sequelize, Sequelize);