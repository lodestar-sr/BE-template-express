const { Op } = require('sequelize');

const { sequelize } = require('../config/database');
const { Job, Contract, Profile } = require('../models');
const { to } = require('../shared/helper');


const findUnpaid = async (profile) => {
  return to(Job.findAll({
    where: { paid: { [Op.not]: true } },
    include: {
      model: Contract,
      where: {
        status: 'in_progress',
        [Op.or]: [
          { ContractorId: profile.id },
          { ClientId: profile.id },
        ],
      },
    },
  }));
};

const payForJob = async (job, jobId) => {
  return to(sequelize.transaction(async (transaction) => {
    const { Contractor, ContractorId, Client, ClientId } = job.Contract;

    const [error] = await to(Promise.all([
      Job.update(
        { paid: true, paymentDate: new Date() },
        {
          where: { id: jobId },
          transaction,
        },
      ),
      Profile.update(
        { balance: Client.balance - job.price },
        {
          where: { id: ClientId },
          transaction,
        },
      ),
      Profile.update(
        { balance: Contractor.balance + job.price },
        {
          where: { id: ContractorId },
          transaction,
        },
      ),
    ]));

    if (error) {
      throw new Error(error);
    }
  }));
};

module.exports = {
  findUnpaid,
  payForJob,
};
