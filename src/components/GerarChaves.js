import React from 'react';
import Button from 'react-bootstrap/Button';
function GerarChaves() {
  const handleGerarChaves = () => {
    // Lógica para gerar chaves
    alert('Chaves geradas com sucesso!');
  };

  return (
    <div>
      <h3>Gerar Chaves</h3>
      <Button onClick={handleGerarChaves} variant="primary">Gerar</Button>
    </div>
  );
}

export default GerarChaves;
