const { Contract } = require('./contract.model');
const { Job } = require('./job.model');
const { Profile } = require('./profile.model');

Contract.belongsTo(Profile, { as: 'Contractor' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);
Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });

module.exports = {
  Profile,
  Contract,
  Job,
};

