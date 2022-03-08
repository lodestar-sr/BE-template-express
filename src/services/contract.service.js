const { Op } = require('sequelize');
const { to } = require('../shared/helper');
const { Contract } = require('../models');

const findAll = async (userId) => {
  const [error, contract] = await to(Contract.findAll({
    where: {
      ClientId: userId,
      status: { [Op.not]: 'terminated' },
    },
  }));

  if (error) {
    throw error;
  }

  return contract;
};

const findOne = async (userId, contractId) => {
  const [error, contract] = await to(Contract.findOne({
    where: {
      ClientId: userId,
      id: contractId,
    },
  }));

  if (error) {
    throw error;
  }

  return contract;
};

module.exports = {
  findAll,
  findOne,
};
