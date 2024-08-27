import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Cadastro from './Cadastro';
import Principal from './Principal';
import Documentos from './components/Documentos'; // Importe o componente Documentos
import GerarChaves from './components/GerarChaves'; // Importe o componente GerarChaves
import Assinar from './components/Assinar'; // Importe o componente Assinar

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/Principal" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route
            path="/Principal"
            element={isAuthenticated ? <Principal /> : <Navigate to="/" />}
          />
          <Route
            path="/Documentos"
            element={isAuthenticated ? <Documentos /> : <Navigate to="/" />}  // Rota para Documentos
          />
          <Route
            path="/GerarChaves"
            element={isAuthenticated ? <GerarChaves /> : <Navigate to="/" />}  // Rota para GerarChaves
          />
          <Route
            path="/Assinar"
            element={isAuthenticated ? <Assinar /> : <Navigate to="/" />}  // Rota para Assinar
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
