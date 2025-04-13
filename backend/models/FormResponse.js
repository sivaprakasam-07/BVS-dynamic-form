const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  responses: [
    {
      label: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FormResponse', formResponseSchema);
