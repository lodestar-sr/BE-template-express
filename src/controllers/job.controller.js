const { Job, Contract } = require('../models');
const { to, errorResponse, successResponse } = require('../shared/helper');
const { payForJob, findUnpaid } = require('../services/job.service');

const findUnpaidJobs = async (req, res) => {
  const { profile } = req;
  const [error, contract] = await findUnpaid(profile);

  if (error) {
    return res.status(500).json(errorResponse('Something\'s wrong'));
  }

  res.json(successResponse(contract));
};

const payJob = async (req, res) => {
  const { profile } = req;
  const { job_id: jobId } = req.params;
  const [error, job] = await to(Job.findOne({
    where: { id: jobId },
    include: { model: Contract, include: ['Client', 'Contractor'] },
  }));

  if (error) {
    return res.status(500).json(errorResponse(error.message));
  }

  if (!job) {
    return res.status(404).json(errorResponse('Job is not found!'));
  }

  if (job.paid) {
    return res.status(500).json(errorResponse('You already paid for this job!'));
  }

  if (job.price > profile.balance) {
    return res.status(500).json(errorResponse('Your balance is not enough to pay!'));
  }

  if (job?.Contract?.ClientId !== profile.id) {
    return res.status(403).json(errorResponse('You have no right to pay for this job!'));
  }

  const [updateError] = await payForJob(job, jobId);

  if (updateError) {
    return res.status(500).json(errorResponse('Error occurred while paying'));
  }

  res.json(successResponse('You have paid successfully!'));
};

module.exports = {
  findUnpaidJobs,
  payJob,
};
