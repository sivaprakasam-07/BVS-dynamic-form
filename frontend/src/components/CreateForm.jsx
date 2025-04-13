import React, { useState } from 'react';
import axios from 'axios';

const CreateForm = () => {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([{ label: '', type: 'text', options: [] }]);
  const [shareLink, setShareLink] = useState('');

  const handleFieldChange = (index, event) => {
    const newFields = [...fields];
    newFields[index][event.target.name] = event.target.value;
    setFields(newFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    setFields(newFields);
  };

  const addOption = (fieldIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.push('');
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { label: '', type: 'text', options: [] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    for (const field of fields) {
      if (!field.label.trim()) {
        alert('All fields must have a label.');
        return;
      }
      if (!field.type) {
        alert('All fields must have a type.');
        return;
      }
      if (['radio', 'checkbox'].includes(field.type) && field.options.length === 0) {
        alert('Fields of type "radio" or "checkbox" must have at least one option.');
        return;
      }
    }

    try {
      const res = await axios.post('http://localhost:5000/api/forms', { title, fields });
      const formId = res.data._id;
      const link = `http://localhost:5173/fill-form/${formId}`;
      setShareLink(link);
      alert('Form Created!');
    } catch (err) {
      console.error('Error creating form:', err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || 'Failed to create form'}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Create a Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Form Title"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <div className="flex space-x-4 items-center">
                <input
                  type="text"
                  name="label"
                  value={field.label}
                  onChange={(e) => handleFieldChange(index, e)}
                  placeholder="Field Label"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select
                  name="type"
                  value={field.type}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="radio">Radio</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                </select>
              </div>
              {['radio', 'checkbox'].includes(field.type) && (
                <div className="space-y-2">
                  {field.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex space-x-2 items-center">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        placeholder="Option"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addField}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Field
        </button>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md w-full"
        >
          Create Form
        </button>
      </form>

      {shareLink && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded">
          <p><strong>Share this form link:</strong></p>
          <a href={shareLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default CreateForm;
