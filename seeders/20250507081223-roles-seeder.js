'use strict';
const model = require('../models')
const Roles = model.Roles
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
    let rolesData = await Roles.findAll();
    if (!rolesData) {
      await queryInterface.bulkInsert('Roles', [
        {
          role_name: 'Super Admin',
          createdAt: new Date(),
          updatedAt: new Date(), 
  
        },
        {
          role_name: 'Inventory Manager',
          createdAt: new Date(),
          updatedAt: new Date(), 
  
        },
        {
          role_name: 'Merchant',
          createdAt: new Date(),
          updatedAt: new Date(), 
        },
        
  
      ], {});

    }
 
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

  }
};
