'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Merchants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Merchants.belongsTo(models.User, { foreignKey : 'userId', as: 'merchantUser'})
    }
  }
  Merchants.init({
    userId: DataTypes.INTEGER,
    shortcode: DataTypes.STRING,
    consumer_key: DataTypes.STRING,
    consumer_secret: DataTypes.STRING,
    passkey: DataTypes.STRING,
    callback_url: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Merchants',
  });
  return Merchants;
};