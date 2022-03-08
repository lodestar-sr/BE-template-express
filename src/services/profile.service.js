const { to } = require('../shared/helper');
const { Profile } = require('../models');
const { sequelize } = require('../config/database');

const depositBalances = async (authUser, depositingUser, depositAmount) => {
  return await to(sequelize.transaction(async (transaction) => {
    const [error] = await to(Promise.all([
      Profile.update(
        { balance: authUser.balance - depositAmount },
        {
          where: { id: authUser.id },
          transaction,
        },
      ),
      Profile.update(
        { balance: depositingUser.balance + depositAmount },
        {
          where: { id: depositingUser.id },
          transaction,
        },
      ),
    ]));

    if (error) {
      throw new Error(error);
    }
  }));
};

const findBestProfessions = async (bonusQuery) => {
  const [error, [users]] = await to(sequelize.query(`
    SELECT sum(Paid.price) as paid, sum(Unpaid.price) as unpaid, Profiles.* from Profiles
    LEFT JOIN Contracts ON Contracts.ContractorId = Profiles.id
    Left JOIN (SELECT PaidJobs.ContractId, PaidJobs.price FROM Jobs as PaidJobs WHERE PaidJobs.paid > 0 ${bonusQuery} GROUP BY PaidJobs.ContractId) as Paid ON Paid.ContractId = Contracts.id
    Left JOIN (SELECT UnpaidJobs.ContractId, UnpaidJobs.price FROM Jobs as UnpaidJobs WHERE UnpaidJobs.paid IS NOT 1 ${bonusQuery} GROUP BY UnpaidJobs.ContractId) as Unpaid ON Unpaid.ContractId = Contracts.id
    GROUP BY Profiles.id;
  `));

  if (error) {
    throw error;
  }

  return users.reduce((prev, { paid, unpaid, ...user }) => {
    if (Number(paid) > 0 && Number(unpaid) < Number(paid) / 5) {
      return [...prev, {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        paid: Number(paid),
        unpaid: Number(unpaid),
      }];
    }
    return prev;
  }, []);
};

const findBestClients = async (bonusQuery, limit = 2) => {
  const [error, [users]] = await to(sequelize.query(`
    SELECT sum(Paid.price) as paid, sum(Unpaid.price) as unpaid, Profiles.* from Profiles
    LEFT JOIN Contracts ON Contracts.ClientId = Profiles.id
    Left JOIN (SELECT PaidJobs.ContractId, PaidJobs.price FROM Jobs as PaidJobs WHERE PaidJobs.paid > 0 ${bonusQuery} GROUP BY PaidJobs.ContractId) as Paid ON Paid.ContractId = Contracts.id
    Left JOIN (SELECT UnpaidJobs.ContractId, UnpaidJobs.price FROM Jobs as UnpaidJobs WHERE UnpaidJobs.paid IS NOT 1 ${bonusQuery} GROUP BY UnpaidJobs.ContractId) as Unpaid ON Unpaid.ContractId = Contracts.id
    GROUP BY Profiles.id;
  `));

  if (error) {
    console.error(error);
    throw error;
  }

  return users.reduce((prev, { paid, unpaid, ...user }) => {
    if (limit > prev.length && Number(paid) > 0 && Number(unpaid) < Number(paid) / 5) {
      return [...prev, {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        paid: Number(paid),
        unpaid: Number(unpaid),
      }];
    }
    return prev;
  }, []);
};

module.exports = {
  depositBalances,
  findBestProfessions,
  findBestClients,
};
