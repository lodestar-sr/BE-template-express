const express = require('express');

const { payJob, findUnpaidJobs } = require('../controllers/job.controller');

const router = express.Router();

router.get('/unpaid', findUnpaidJobs);
router.post('/:job_id/pay', payJob);

module.exports = router;
