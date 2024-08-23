import React, { useState } from 'react';

function Assinar() {
  const [documentId, setDocumentId] = useState('');

  const handleSignDocument = () => {
    // Lógica para assinar documento
    alert(`Documento ${documentId} assinado com sucesso!`);
  };

  return (
    <div>
      <h3>Sign Document</h3>
      <input
        type="text"
        placeholder="Document ID"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
      />
      <button onClick={handleSignDocument}>Sign Document</button>
    </div>
  );
}

export default Assinar;
