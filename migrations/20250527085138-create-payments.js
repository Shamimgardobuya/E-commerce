'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      merchantRequestId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      checkoutRequestID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resultCode: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resultDesc: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mpesaReceiptNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transactionDate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};