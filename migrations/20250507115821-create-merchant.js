// 'use strict';

// const { Model } = require('sequelize');

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Merchants', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       userId: {
//         type: Sequelize.INTEGER,
//         references : {
//           model: 'Users',
//           key: 'id'
//         },
//         allowNull:false
//       },
//       shortcode: {
//         type: Sequelize.STRING
//       },
//       consumer_key: {
//         type: Sequelize.STRING
//       },
//       consumer_secret: {
//         type: Sequelize.STRING
//       },
//       passkey: {
//         type: Sequelize.STRING
//       },
//       callback_url: {
//         type: Sequelize.STRING
//       },
//       is_active: {
//         type: Sequelize.BOOLEAN
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         default : new Date(),
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Merchants');
//   }
// };