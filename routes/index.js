const express = require('express');
const index_controller = require('../controllers/index.controller');

const router = express.Router();

router.get('/', index_controller.hello);

module.exports = router;
