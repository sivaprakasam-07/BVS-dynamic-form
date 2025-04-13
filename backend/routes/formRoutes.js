const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const { createForm, getForms, submitForm } = require('../controllers/formController');

router.post('/', createForm);
router.get('/', getForms);

router.post('/:formId/submit', submitForm);

router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id); 
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form); 
  } catch (err) {
    console.error('Error fetching form:', err.message); 
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

module.exports = router;
