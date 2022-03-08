const Sequelize = require('sequelize');
const { sequelize } = require('../config/database');

class ContractModel extends Sequelize.Model {}

ContractModel.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('new', 'in_progress', 'terminated'),
    },
  },
  {
    sequelize,
    modelName: 'Contract',
  },
);

exports.Contract = ContractModel;