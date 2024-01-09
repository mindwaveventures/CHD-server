'use strict';
const tableName = 'trusts';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable(tableName);

    if (!tableDefinition['storage_account_name']) {
      await queryInterface.addColumn(tableName, 'storage_account_name', {
        type: Sequelize.DataTypes.STRING,
        defaultValue: '',
        field: 'storage_account_name'
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
