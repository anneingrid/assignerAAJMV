import React, { useState, useEffect } from 'react';
import GerarChaves from './components/GerarChaves';
import Assinar from './components/Assinar';
import Documentos from './components/Documentos';
import Menu from './components/Menu';
import Navbar from './components/Navbar';

function Dashboard() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [activeScreen, setActiveScreen] = useState('GerarChaves'); // Estado para controlar a tela ativa

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNavbar(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Função para renderizar o conteúdo da tela com base na escolha
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'GerarChaves':
        return <GerarChaves />;
      case 'Assinar':
        return <Assinar />;
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
