import { DataTypes, Sequelize } from 'sequelize';
import index from '../server/index.js';

export default (sequelize, Sequelize) => {
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
}
