const express = require('express');

const { findContracts, findOneContract } = require('../controllers/contract.controller');

const router = express.Router();

router.get('/', findContracts);
router.get('/:id', findOneContract);

module.exports = router;
