
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InmueblesList from './components/InmueblesList';
import InmuebleDetalle from './components/InmuebleDetalle';
import './App.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#1976d2' }}>
        <Link to="/" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>🏠 Inmuebles</Link>
      </nav>
      <Routes>
        <Route path="/" element={<InmueblesList />} />
        <Route path="/inmueble/:id" element={<InmuebleDetalle />} />
      </Routes>
    </Router>
  );
}

export default App;
