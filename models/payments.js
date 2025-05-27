'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payments.init({
    merchantRequestId: DataTypes.INTEGER,
    checkoutRequestID: DataTypes.INTEGER,
    resultCode: DataTypes.INTEGER,
    resultDesc: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    mpesaReceiptNumber: DataTypes.STRING,
    transactionDate: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payments',
  });
  return Payments;
};