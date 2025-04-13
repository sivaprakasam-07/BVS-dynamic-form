const express = require('express');
const router = express.Router();
const { createForm, getForms } = require('../controllers/formController');

router.post('/', createForm);
router.get('/', getForms);

module.exports = router;
