import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Principal from './pages/Principal';
import MeusDocumentos from './components/Documentos'; 
import GerarChaves from './components/GerarChaves'; 
import Assinar from './components/Assinar'; 
import Documentos from './components/Documentos';





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
            path="/MeusDocumentos"
            element={isAuthenticated ? <MeusDocumentos /> : <Navigate to="/" />}
          />
          <Route
            path="/GerarChaves"
            element={isAuthenticated ? <GerarChaves /> : <Navigate to="/" />}
          />
          <Route
            path="/Assinar"
            element={isAuthenticated ? <Assinar /> : <Navigate to="/" />}
          />
          <Route
            path="/Documentos"
            element={isAuthenticated ? <Documentos /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
