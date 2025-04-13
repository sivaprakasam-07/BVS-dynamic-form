// const mongoose = require('mongoose');

// const responseSchema = new mongoose.Schema({
//   questionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'FormField',
//   },
//   answer: {
//     type: mongoose.Schema.Types.Mixed, // <-- allows string, number, array, etc.
//     required: true,
//   },
// });

// const formResponseSchema = new mongoose.Schema({
//   formId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'Form',
//   },
//   responses: [responseSchema],
// });

// module.exports = mongoose.model('FormResponse', formResponseSchema);

const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Form',
  },
  responses: [responseSchema],
});

module.exports = mongoose.model('FormResponse', formResponseSchema);
