'use strict';
const tableName = 'users';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn(tableName, 'reason',
      {
        type: Sequelize.DataTypes.STRING(1024),
        defaultValue: ''
      }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn(tableName, 'reason',
      {
        type: Sequelize.DataTypes.STRING,
        defaultValue: ''
      }
    );
  }
};
