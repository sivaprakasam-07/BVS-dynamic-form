import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FillForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BASE_URL = 'https://bvs-dynamic-form.onrender.com'; // ✅ Always use production backend

  useEffect(() => {
    axios.get(`${BASE_URL}/api/forms/${formId}`)
      .then((res) => {
        console.log('Form data fetched successfully:', res.data);
        setForm(res.data);
        setResponses(res.data.fields.map(() => ''));
      })
      .catch((err) => {
        console.error('Error fetching form:', err.response?.data || err.message);
        toast.error(`Error fetching form: ${err.response?.data?.error || 'Unknown error'}`);
      })
      .finally(() => setLoading(false));
  }, [formId]);

  const handleChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleCheckboxChange = (index, option) => {
    const newResponses = [...responses];
    const currentValues = newResponses[index] || [];
    if (currentValues.includes(option)) {
      newResponses[index] = currentValues.filter((val) => val !== option);
    } else {
      newResponses[index] = [...currentValues, option];
    }
    setResponses(newResponses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    for (let i = 0; i < form.fields.length; i++) {
      const field = form.fields[i];
      const response = responses[i];

      if (['text', 'email', 'number', 'date', 'time', 'radio'].includes(field.type) && !response) {
        toast.warn(`Please fill out the field: "${field.label}"`);
        return;
      }

      if (field.type === 'checkbox' && (!response || response.length === 0)) {
        toast.warn(`Please select at least one option for: "${field.label}"`);
        return;
      }
    }

    const payload = {
      responses: form.fields.map((field, index) => ({
        label: field.label,
        answer: Array.isArray(responses[index]) ? responses[index] : responses[index] || '',
      })),
    };

    axios.post(`${BASE_URL}/api/forms/${formId}/submit`, payload)
      .then(() => {
        toast.success('Form submitted successfully!');
        setSubmitted(true);
        setTimeout(() => navigate('/'), 3000);
      })
      .catch((err) => {
        console.error('Error submitting form:', err.response?.data || err.message);
        toast.error('Error submitting form. Please try again.');
      });
  };

  if (loading) {
    return <div className="text-center mt-10">Loading form...</div>;
  }

  if (!form) {
    return <div className="text-center mt-10 text-red-500">Form not found or failed to load.</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {submitted ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-500">Thank you for submitting the form!</h1>
            <p className="mt-2 text-lg">You will be redirected shortly.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
            <form onSubmit={handleSubmit}>
              {form.fields.map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 mb-1">{field.label}</label>

                  {field.type === 'checkbox' && field.options && (
                    <div>
                      {field.options.map((option, i) => (
                        <div key={i} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            value={option}
                            checked={responses[index]?.includes(option) || false}
                            onChange={() => handleCheckboxChange(index, option)}
                            className="mr-2"
                          />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {field.type === 'radio' && field.options && (
                    <div>
                      {field.options.map((option, i) => (
                        <div key={i} className="flex items-center mb-2">
                          <input
                            type="radio"
                            name={`field-${index}`}
                            value={option}
                            checked={responses[index] === option}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="mr-2"
                          />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {['text', 'email', 'number', 'date', 'time'].includes(field.type) && (
                    <input
                      type={field.type}
                      value={responses[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default FillForm;
