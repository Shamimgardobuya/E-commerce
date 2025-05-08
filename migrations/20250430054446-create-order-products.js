'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model: 'Orders',
          key: 'id',
        }
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model: 'Products',
          key: 'id',
        }
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      price_at_order_time : {
        type:  Sequelize.DECIMAL
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
    await queryInterface.dropTable('orderProducts');
  }
};