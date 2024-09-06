import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppContext } from './Provider';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Principal from './pages/Principal';
import MeusDocumentos from './components/Documentos'; 
import GerarChaves from './components/GerarChaves'; 
import Assinar from './components/Assinar'; 
import Documentos from './components/Documentos';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 




function App() {
  const { usuarioLogado, logout } = useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(!!usuarioLogado);

  useEffect(() => {
    setIsAuthenticated(!!usuarioLogado);
  }, [usuarioLogado]);

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
        <ToastContainer /> {/* Coloque o ToastContainer aqui */}

      </div>
    </Router>
  );
}

export default App;
