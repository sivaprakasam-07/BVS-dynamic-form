import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/forms/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error('Error fetching form', err));
  }, [id]);

  if (!form) return <p>Loading form...</p>;

  return (
    <div>
      <h2>{form.title}</h2>
      <form>
        {form.fields.map((field, index) => (
          <div key={index}>
            <label>{field.label}</label>
            <input type={field.type} />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SingleForm;
