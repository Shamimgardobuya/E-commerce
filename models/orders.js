'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Orders.hasMany(models.orderProducts, { foreignKey: 'orderId' , as :'hugeOrder'})
      Orders.belongsTo(models.User, {foreignKey: 'userId'})
      
    }
  }
  Orders.init({
    userId: DataTypes.INTEGER,
    total: DataTypes.DECIMAL,
    orderDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};