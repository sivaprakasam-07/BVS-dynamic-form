const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [
    {
      label: { type: String, required: true }, // Ensure label is required
      type: { type: String, required: true, enum: ['text', 'email', 'number'] } // Validate field type
    }
  ]
});

module.exports = mongoose.model('Form', formSchema);
