import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Provider';
import { FaDownload, FaEye } from 'react-icons/fa';

function Documentos() {
  const { usuarioLogado, listarDocumentosAssinados, listarDocumentosNaoAssinados } = useContext(AppContext);
  const [documentosAssinados, setDocumentosAssinados] = useState([]);
  const [documentosNaoAssinados, setDocumentosNaoAssinados] = useState([]);

  useEffect(() => {
    if (usuarioLogado) {
      async function fetchDocumentos() {
        const assinados = await listarDocumentosAssinados(usuarioLogado.id_usuario);
        const naoAssinados = await listarDocumentosNaoAssinados(usuarioLogado.id_usuario);

        setDocumentosAssinados(assinados);
        setDocumentosNaoAssinados(naoAssinados);
      }

      fetchDocumentos();
    }
  }, [usuarioLogado, listarDocumentosAssinados, listarDocumentosNaoAssinados]);

  const handleDownload = (documento) => {
    console.log(`Baixando o documento: ${documento.documentos.mensagem_documento}`);
  };

  const handleView = (documento) => {
    console.log(`Visualizando o documento: ${documento.documentos.mensagem_documento}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Documentos Assinados</h2>
      {documentosAssinados.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nome do Documento</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documentosAssinados.map((documento) => (
                <tr key={documento.id_documento} style={styles.tableRow}>
                  <td>{documento.documentos.mensagem_documento}</td>
                  <td>{new Date(documento.documentos.criado_em).toLocaleDateString()}</td>
                  <td>
                    <span style={{ ...styles.status, backgroundColor: '#2ecc71' }}>Assinado</span>
                  </td>
                  <td>
                    <button style={styles.actionButton} onClick={() => handleView(documento)}>
                      <FaEye style={styles.icon} /> Visualizar
                    </button>
                    <button style={styles.actionButton} onClick={() => handleDownload(documento)}>
                      <FaDownload style={styles.icon} /> Baixar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={styles.emptyMessage}>Nenhum documento assinado encontrado.</p>
      )}

      <h2 style={styles.title}>Documentos Não Assinados</h2>
      {documentosNaoAssinados.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nome do Documento</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documentosNaoAssinados.map((documento) => (
                <tr key={documento.id_documento} style={styles.tableRow}>
                  <td>{documento.mensagem_documento}</td>
                  <td>{new Date(documento.criado_em).toLocaleDateString()}</td>
                  <td>
                    <span style={{ ...styles.status, backgroundColor: '#e74c3c' }}>Pendente</span>
                  </td>
                  <td>
                    <button style={styles.actionButton} onClick={() => handleView(documento)}>
                      <FaEye style={styles.icon} /> Visualizar
                    </button>
                    <button style={styles.actionButton} onClick={() => handleDownload(documento)}>
                      <FaDownload style={styles.icon} /> Baixar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={styles.emptyMessage}>Nenhum documento não assinado encontrado.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    marginLeft: '270px',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '40px',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'transparent',
  },
  tableRow: {
    borderBottom: '1px solid #bdc3c7',
  },
  th: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: '#fff',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '1rem',
    color: '#34495e',
  },
  status: {
    padding: '6px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    marginRight: '10px',
    padding: '8px 16px',
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background-color 0.3s ease',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: '8px',
  },
  actionButtonHover: {
    backgroundColor: '#3498db',
  },
  emptyMessage: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default Documentos;
