'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      firstName: {
        type: Sequelize.STRING,
        field: 'first_name'
      },
      lastName: {
        type: Sequelize.STRING,
        field: 'last_name'
      },
      trustId: {
        type: Sequelize.UUID,
        field: 'trust_id'
      },
      accessToken: {
        type: Sequelize.STRING(1024),
        field: 'access_token'
      },
      authEmail: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'auth_email'
      },
      authSMS: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'auth_sms'
      },
      otp: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      usertype: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      otpExpiryDate: {
        type: Sequelize.DATE,
        defaultValue: null,
        field: 'otp_expiry_date'
      },
      termsAndConditions: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'terms_and_conditions'
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      mobileNo: {
        type: Sequelize.STRING,
        field: 'mobile_no',
        defaultValue: ''
      },
      password: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      salt: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};