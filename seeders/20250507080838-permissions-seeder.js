'use strict';

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
     * 
    */
    // await queryInterface.bulkInsert('Permissions', [
    //   {
    //     action: 'add_inventory',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     action: 'update_inventory',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),

    //   },
    //   {
    //     action: 'delete_inventory',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   { action :  'view_users'  ,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),

    //   }


    // ], {});
    
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
