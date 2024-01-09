'use strict';
const tableName = 'users';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable(tableName);

    if (!tableDefinition['password_attempt']) {
      await queryInterface.addColumn(tableName, 'password_attempt', {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 3,
        field: 'password_attempt'
      });
    }

    if (!tableDefinition['password_attempt_expired']) {
      await queryInterface.addColumn(tableName, 'password_attempt_expired', {
        type: Sequelize.DataTypes.DATE,
        defaultValue: new Date(),
        field: 'password_attempt_expired'
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
