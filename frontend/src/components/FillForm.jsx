// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const FillForm = () => {
//   const { formId } = useParams();
//   const [form, setForm] = useState(null);
//   const [responses, setResponses] = useState([]);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/forms/${formId}`)
//       .then((res) => {
//         setForm(res.data);
//         setResponses(res.data.fields.map((field) =>
//           field.type === 'checkbox' ? [] : ''
//         ));
//       })
//       .catch((err) => {
//         alert(`Error fetching form: ${err.response?.data?.error || err.message}`);
//       });
//   }, [formId]);

//   const handleChange = (index, value) => {
//     const newResponses = [...responses];
//     newResponses[index] = value;
//     setResponses(newResponses);
//   };

//   const handleCheckboxChange = (index, option) => {
//     const updated = [...responses];
//     const current = updated[index] || [];

//     if (current.includes(option)) {
//       updated[index] = current.filter((val) => val !== option);
//     } else {
//       updated[index] = [...current, option];
//     }

//     setResponses(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       responses: form.fields.map((field, index) => ({
//         label: field.label,
//         answer: responses[index],
//       })),
//     };

//     try {
//       await axios.post(`http://localhost:5000/api/forms/${formId}/submit`, payload);
//       alert('Form submitted successfully!');
//     } catch (err) {
//       console.error('Error submitting form:', err);
//       alert(`Error: ${err.response?.data?.message || 'Failed to submit form'}`);
//     }
//   };

//   if (!form) return <div>Loading form...</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
//       <form onSubmit={handleSubmit}>
//         {form.fields.map((field, index) => (
//           <div key={index} className="mb-4">
//             <label className="block text-gray-700 mb-1">{field.label}</label>

//             {field.type === 'checkbox' && field.options && (
//               <div>
//                 {field.options.map((option, optIdx) => (
//                   <div key={optIdx} className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       value={option}
//                       checked={responses[index]?.includes(option)}
//                       onChange={() => handleCheckboxChange(index, option)}
//                       className="mr-2"
//                     />
//                     <span>{option}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {field.type === 'radio' && field.options && (
//               <div>
//                 {field.options.map((option, optIdx) => (
//                   <div key={optIdx} className="flex items-center mb-2">
//                     <input
//                       type="radio"
//                       name={`field-${index}`}
//                       value={option}
//                       checked={responses[index] === option}
//                       onChange={(e) => handleChange(index, e.target.value)}
//                       className="mr-2"
//                     />
//                     <span>{option}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {['text', 'email', 'number', 'date', 'time'].includes(field.type) && (
//               <input
//                 type={field.type}
//                 value={responses[index]}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//             )}
//           </div>
//         ))}
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FillForm;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const FillForm = () => {
  const { formId } = useParams(); // Grab formId from the URL
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false); // State to track if the form is submitted
  const navigate = useNavigate(); // Initialize useNavigate instead of useHistory

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

    // Validate responses
    for (let i = 0; i < form.fields.length; i++) {
      const field = form.fields[i];
      const response = responses[i];

      if (['text', 'email', 'number', 'date', 'time', 'radio'].includes(field.type) && !response) {
        alert(`Please fill out the field: "${field.label}"`);
        return;
      }

      if (field.type === 'checkbox' && (!response || response.length === 0)) {
        alert(`Please select at least one option for: "${field.label}"`);
        return;
      }
    }

    const payload = {
      responses: form.fields.map((field, index) => ({
        label: field.label,
        answer: Array.isArray(responses[index]) ? responses[index] : responses[index] || '', // Ensure correct format
      })),
    };

    axios.post(`http://localhost:5000/api/forms/${formId}/submit`, payload)
      .then(() => {
        setSubmitted(true); // Set the form as submitted
        setTimeout(() => {
          // Redirect the user after 3 seconds using navigate()
          navigate('/'); // Redirect to homepage or another page after submission
        }, 3000);
      })
      .catch((err) => {
        console.error('Error submitting form:', err.response?.data || err.message);
        alert(`Error: ${err.response?.data?.message || 'Failed to submit form'}`);
      });
  };

  if (!form) return <div className="text-center mt-10">Loading form...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {submitted ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-500">Thank you for submitting the form!</h1>
          <p className="mt-2 text-lg">We appreciate your response. You will be redirected shortly.</p>
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
                    {field.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
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
                    {field.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
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
  );
};

export default FillForm;
