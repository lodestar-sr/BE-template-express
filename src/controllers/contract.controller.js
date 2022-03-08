const { to, errorResponse, successResponse } = require('../shared/helper');
const { findAll, findOne } = require('../services/contract.service');

const findContracts = async (req, res) => {
  const { profile } = req;
  const [error, contract] = await to(findAll(profile.id));

  if (error) {
    return res.status(500).json(errorResponse('Something\'s wrong while search contracts'));
  }

  res.json(successResponse(contract));
};

const findOneContract = async (req, res) => {
  const { profile } = req;
  const { id } = req.params;
  const [error, contract] = await to(findOne(profile.id, id));

  if (error) {
    console.error(error.message);
    return res.status(500).json(errorResponse('Somethings wrong while search contract!'));
  }

  if (!contract) {
    return res.status(404).json(errorResponse('Contract is not found!'));
  }

  res.json(successResponse(contract));
};

module.exports = {
  findContracts,
  findOneContract,
};
