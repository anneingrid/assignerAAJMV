import React from 'react';

function Documentos() {
  const documents = [
    { id: 1, name: 'Documento 1', signed: true },
    { id: 2, name: 'Documento 2', signed: false },
    // Mock de documentos
  ];

  return (
    <div>
      <h3>Documentos assinados</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            {doc.name} - {doc.signed ? 'Assinado' : 'Não Assinado'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Documentos;
