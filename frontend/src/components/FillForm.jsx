import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FillForm = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/forms')
      .then((response) => {
        setForms(response.data);
      })
      .catch((err) => console.log('Error fetching forms', err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Fill a Form</h1>
      {forms.map((form) => (
        <div key={form._id} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{form.title}</h2>
          <form>
            {form.fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  className="w-full p-2 border border-gray-300 rounded-md"
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
      ))}
    </div>
  );
};

export default FillForm;
