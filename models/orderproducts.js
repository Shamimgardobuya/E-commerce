'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orderProducts.belongsTo(models.Orders, {foreignKey: 'orderId', as:'order_item'});
      orderProducts.belongsTo(models.Product, {foreignKey: 'productId', as:'item'});

    }
  }
  orderProducts.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price_at_order_time: DataTypes.DECIMAL,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'orderProducts',
  });
  return orderProducts;
};