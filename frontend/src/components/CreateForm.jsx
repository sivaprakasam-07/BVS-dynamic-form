import React, { useState } from 'react';
import axios from 'axios';

const CreateForm = () => {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([{ label: '', type: 'text' }]);

  const handleFieldChange = (index, event) => {
    const newFields = [...fields];
    newFields[index][event.target.name] = event.target.value;
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { label: '', type: 'text' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forms', { title, fields });
      alert('Form Created!');
    } catch (err) {
      console.error('Error creating form:', err.response?.data?.message || err.message);
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
            <div key={index} className="flex space-x-4 items-center">
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
              </select>
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
    </div>
  );
};

export default CreateForm;
