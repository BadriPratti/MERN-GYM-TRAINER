const express = require('express');
const { getTrainers } = require('../controllers/dashController')
const { getTrainees } = require('../controllers/dashController')

const router = express.Router();

router.get('/trainers', getTrainers);

router.get('/trainees', getTrainees);

module.exports = router;
