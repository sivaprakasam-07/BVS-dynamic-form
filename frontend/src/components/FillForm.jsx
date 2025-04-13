import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FillForm = () => {
  const { formId } = useParams();  // Grab formId from the URL
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Fetch the form details from the backend using the formId from the URL
    axios.get(`http://localhost:5000/api/forms/${formId}`)
      .then((res) => {
        console.log('Form data fetched successfully:', res.data); // Log successful fetch
        setForm(res.data);
        setResponses(res.data.fields.map(() => '')); // Initialize responses for each field
      })
      .catch((err) => {
        console.error('Error fetching form:', err.response?.data || err.message); // Log error
        console.error('Error details:', err); // Log detailed error object
        alert(`Error fetching form: ${err.response?.data?.error || 'Unknown error'}`);
      });
  }, [formId]);

  const handleChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      responses: form.fields.map((field, index) => ({
        label: field.label,
        answer: responses[index],
      })),
    };

    axios.post(`http://localhost:5000/api/forms/${formId}/submit`, payload)
      .then(() => {
        alert('Form submitted successfully!');
      })
      .catch((err) => {
        console.error('Error submitting form:', err.response?.data || err.message);
        alert(`Error: ${err.response?.data?.message || 'Failed to submit form'}`);
      });
  };

  if (!form) return <div className="text-center mt-10">Loading form...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type}
              value={responses[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FillForm;
