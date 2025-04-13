const Form = require('../models/Form');

exports.createForm = async (req, res) => {
  const { title, fields } = req.body;

  // Validate request body
  if (!title || !fields || !Array.isArray(fields)) {
    return res.status(400).json({ message: 'Invalid request body. Title and fields are required.' });
  }

  try {
    const newForm = new Form({ title, fields });
    await newForm.save();
    res.status(200).json(newForm);
  } catch (err) {
    console.error('Error saving form:', err.message, err.stack); // Log detailed error
    res.status(500).json({ message: 'Error saving form', error: err.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forms', error: err });
  }
};
