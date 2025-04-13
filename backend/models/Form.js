const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [
    {
      label: { type: String, required: true },
      type: { 
        type: String, 
        required: true, 
        enum: ['text', 'email', 'number', 'radio', 'checkbox', 'date', 'time'] 
      },
      options: { type: [String], required: function() { return ['radio', 'checkbox'].includes(this.type); } } // Add options for specific types
    }
  ]
});

module.exports = mongoose.model('Form', formSchema);
