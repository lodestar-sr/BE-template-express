const moment = require('moment');
const { Op } = require('sequelize');

const { Job, Contract, Profile } = require('../models');
const { to, errorResponse, successResponse } = require('../shared/helper');
const { depositBalances, findBestProfessions, findBestClients } = require('../services/profile.service');

const depositBalance = async (req, res) => {
  const { profile } = req;
  const { userId } = req.params;
  const { depositAmount } = req.body;

  if (!depositAmount && depositAmount < 0) {
    return res.status(400).json(errorResponse('Deposit amount is not valid value!'));
  }

  if (profile.type !== 'client') {
    return res.status(403).json(errorResponse('You have no right to deposit!'));
  }

  if (Number(profile.id) === Number(userId)) {
    return res.status(400).json(errorResponse('You can\'t deposit yourself!'));
  }

  const [, authUser] = await to(Profile.findOne({
    where: { id: profile.id },
    include: {
      model: Contract, as: 'Client', include: { model: Job, where: { paid: { [Op.not]: true } } },
    },
  }));

  const payAmount = authUser.Client
    .reduce((prev, contract) => [...prev, ...contract.Jobs], [])
    .reduce((prev, job) => prev + (job.price || 0), 0);

  if (payAmount / 4 < depositAmount) {
    return res.status(400)
      .json(errorResponse(`A client can't deposit more than 25% his total of jobs to pay! Your pay amount is ${payAmount}.`));
  }

  const [error, depositingUser] = await to(Profile.findOne({ where: { id: userId } }));

  if (error) {
    return res.status(500).json(error.message);
  }

  if (depositingUser.type !== 'client') {
    return res.status(400).json(errorResponse('You can\'t deposit to person who is non client!'));
  }

  const [updateError] = await depositBalances(authUser, depositingUser, depositAmount);

  if (updateError) {
    return res.status(500).json(errorResponse('Error occurred while depositing!'));
  }

  res.json(successResponse('You have deposited successfully!'));
};

const getBestProfessions = async (req, res) => {
  const { start, end } = req.query;
  let bonusQuery = '';

  if (start) {
    bonusQuery = `and createdAt >= '${moment(start).format('YYYY-MM-DD')}'`;
  }
  if (end) {
    bonusQuery += `and createdAt <= '${moment(end).format('YYYY-MM-DD')}'`;
  }

  const [error, users] = await to(findBestProfessions(bonusQuery));

  if (error) {
    return res.status(500).json(errorResponse('Somethings while finding best profession!'));
  }

  res.json(successResponse(users));
};

const getBestClients = async (req, res) => {
  const { start, end, limit = 2 } = req.query;
  let bonusQuery = '';

  if (start) {
    bonusQuery = `and createdAt >= '${moment(start).format('YYYY-MM-DD')}'`;
  }
  if (end) {
    bonusQuery += `and createdAt <= '${moment(end).format('YYYY-MM-DD')}'`;
  }

  const [error, users] = await to(findBestClients(bonusQuery, limit));

  if (error) {
    return res.status(500).json(errorResponse('Somethings while finding best client!'));
  }

  res.json(successResponse(users));
};

module.exports = {
  depositBalance,
  getBestProfessions,
  getBestClients,
};
