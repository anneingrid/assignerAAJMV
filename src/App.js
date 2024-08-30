import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Cadastro from './Cadastro';
import Principal from './Principal';
import Documentos from './components/Documentos'; 
import GerarChaves from './components/GerarChaves'; 
import Assinar from './components/Assinar'; 





function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota para Login, redireciona para Principal se autenticado */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/Principal" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          {/* Rota para Cadastro */}
          <Route path="/Cadastro" element={<Cadastro />} />
          {/* Rota para Principal, redireciona para Login se não autenticado */}
          <Route
            path="/Principal"
            element={isAuthenticated ? <Principal /> : <Navigate to="/" />}
          />
          {/* Rota para Documentos, redireciona para Login se não autenticado */}
          <Route
            path="/Documentos"
            element={isAuthenticated ? <Documentos /> : <Navigate to="/" />}
          />
          {/* Rota para GerarChaves, redireciona para Login se não autenticado */}
          <Route
            path="/GerarChaves"
            element={isAuthenticated ? <GerarChaves /> : <Navigate to="/" />}
          />
          {/* Rota para Assinar, redireciona para Login se não autenticado */}
          <Route
            path="/Assinar"
            element={isAuthenticated ? <Assinar /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
