'use strict';
const tableName = 'trusts';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable(tableName);

    if (!tableDefinition['storage_expiry_date']) {
      await queryInterface.addColumn(tableName, 'storage_expiry_date', {
        type: Sequelize.DataTypes.DATE,
        defaultValue: new Date(),
        field: 'storage_expiry_date'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
