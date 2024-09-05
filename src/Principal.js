import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../src/Provider';

import GerarChaves from './components/GerarChaves';
import Assinar from './components/Assinar';
import Documentos from './components/Documentos';
import Menu from './components/Menu';
import Navbar from './components/Navbar';

function Dashboard() {
  const { usuarioLogado } = useContext(AppContext);

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNavbar(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Navbar visible={showNavbar} /> 
      <Menu />
      <GerarChaves />
      <Assinar />
      <Documentos />
    </div>
  );
}

export default Dashboard;
