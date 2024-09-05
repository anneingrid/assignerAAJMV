import React from 'react';

import GerarChaves from './components/GerarChaves';
import Assinar from './components/Assinar';
import Documentos from './components/Documentos';
import Menu from './components/Menu';
import Navbar from './components/Navbar';

function Dashboard() {
  return (
    <div>

      <GerarChaves />
      <Assinar/>
      <Documentos></Documentos>
      <Menu />
      <Navbar/>
    </div>
  );
}

export default Dashboard;
