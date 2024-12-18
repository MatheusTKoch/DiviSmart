import { DataTypes } from 'sequelize';
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
        })
    
    return User;

    export default User;
