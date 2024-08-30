import React from 'react';

import GerarChaves from './components/GerarChaves';
import Assinar from './components/Assinar';
import Documentos from './components/Documentos';

function Dashboard() {
  return (
    <div>

      <GerarChaves />
      <Assinar/>
      <Documentos></Documentos>
    </div>
  );
}

export default Dashboard;
