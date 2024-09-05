import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../Provider';
import GerarChaves from '../components/GerarChaves';
import Assinar from '../components/Assinar';
import MeusDocumentos from '../components/MeusDocumentos';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import Documentos from '../components/Documentos';

function Dashboard() {
  const { usuarioLogado } = useContext(AppContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [activeScreen, setActiveScreen] = useState('GerarChaves'); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNavbar(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'GerarChaves':
        return <GerarChaves />;
      case 'Assinar':
        return <Assinar />;
      case 'MeusDocumentos':
        return <MeusDocumentos />;
      case 'Documentos':
        return <Documentos />;
      default:
        return <GerarChaves />;
    }
  };

  return (
    <div>
      <Navbar visible={showNavbar} />
      <Menu setActiveScreen={setActiveScreen} />
      <div style={{backgroundColor: '#E3F2FD', margin: '0', padding: '0'}}>
        {renderActiveScreen()} 
      </div> 
    </div>
  );
}

export default Dashboard;
