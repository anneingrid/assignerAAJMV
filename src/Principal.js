import React from 'react';

import GerarChaves from './components/GerarChaves';
import Assinar from './components/Assinar';
import Documentos from './components/Documentos';

function Dashboard() {
  return (
    <div>
      <h2>Principal</h2>
      <GerarChaves />
      <Assinar />
      <Documentos />
    </div>
  );
}

export default Dashboard;
