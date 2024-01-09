'use strict';
const { hashPassword } = require('../dist/helpers/password-hasher');
const { usertypes, userStatus } = require('../dist/constants');

module.exports = {
  async up(queryInterface) {
    const { hash, salt } = hashPassword('Admin@123');
    return queryInterface.bulkInsert('users', [{
      id: 'fd22442a-d1b2-4780-9b83-dfea97a3c7ba',
      email: "admin@mindwaveventures.com",
      first_name: "Super",
      last_name: "Admin",
      password: hash,
      status: userStatus.active,
      salt,
      terms_and_conditions: true,
      usertype: usertypes.superAdmin,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', {
      id: {
        [Sequelize.Op.in]: ['fd22442a-d1b2-4780-9b83-dfea97a3c7ba']
      }
    }, {});
  }
};
