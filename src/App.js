import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Cadastro from './Cadastro';
import Principal from './Principal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/Principal" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Principal" element={isAuthenticated ? <Principal /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
