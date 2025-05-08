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
    */
    // await queryInterface.bulkInsert('Products', [
    //   {  name: 'Vanilla cake', weight: '400g', quantity: 18, price: 600, batch_No: 'VANILLA_400', createdAt: new Date(), updatedAt: new Date()},
    //   {  name: 'Chocolate cake', weight: '400g', quantity: 12, price: 800, batch_No: 'CHOCOLATE_400', createdAt: new Date(), updatedAt: new Date()},
    //   {  name: 'Strawberry cake', weight: '400g', quantity: 25, price: 300, batch_No: 'STRAWBERRY_400', createdAt: new Date(), updatedAt: new Date()}
    


    // ])
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
