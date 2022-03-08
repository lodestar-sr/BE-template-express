const express = require('express');

const { depositBalance, getBestProfessions, getBestClients } = require('../controllers/profile.controller');

const router = express.Router();

router.get('/admin/best-profession', getBestProfessions);
router.get('/admin/best-clients', getBestClients);
router.post('/balances/deposit/:userId', depositBalance);

module.exports = router;
