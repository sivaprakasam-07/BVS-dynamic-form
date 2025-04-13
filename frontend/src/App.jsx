import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateForm from './components/CreateForm';
import FillForm from './components/FillForm';
import SingleForm from './components/SingleForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/create-form" />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/fill-form/:formId" element={<FillForm />} />
        <Route path="/fill-form/:id" element={<SingleForm />} /> {/* Dynamic */}
      </Routes>
    </Router>
  );
}

export default App;
