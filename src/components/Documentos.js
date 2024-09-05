import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Provider';
import { FaFileSignature, FaPen, FaEye } from 'react-icons/fa';
import { Button, Tab, Tabs } from 'react-bootstrap';

function Documentos() {
  const { usuarioLogado, listarDocumentosAssinados, listarDocumentosNaoAssinados, verificarAssinatura } = useContext(AppContext);
  const [documentosAssinados, setDocumentosAssinados] = useState([]);
  const [documentosNaoAssinados, setDocumentosNaoAssinados] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    if (usuarioLogado) {
      async function fetchDocumentos() {
        const assinados = await listarDocumentosAssinados(usuarioLogado.id_usuario);
        const naoAssinados = await listarDocumentosNaoAssinados(usuarioLogado.id_usuario);

        setDocumentosAssinados(assinados);
        setDocumentosNaoAssinados(naoAssinados);
        setNeedsUpdate(false);
      }

      fetchDocumentos();
    }
  }, [usuarioLogado, documentosNaoAssinados]);

  const handleEmptyField = (field) => {
    return field && field.trim() !== '' ? field : 'Campo vazio';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Todos os documentos</h1>
      <Tabs defaultActiveKey="assinados" id="documentos-tabs">
        <Tab eventKey="assinados" title="Assinados">
          <h2 style={styles.title}>Assinados</h2>
          {documentosAssinados.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Texto do Documento</th>
                    <th>Assinado em</th>
                    <th>Status</th>
                    <th>Proprietário</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {documentosAssinados.map((documento) => (
                    <tr key={documento.id_documento} style={styles.tableRow}>
                      <td style={styles.textoDocumento}>{handleEmptyField(documento.documentos.mensagem_documento)}</td>
                      <td>{new Date(documento.assinado_em).toLocaleString()}</td>
                      <td>
                        <span style={{ ...styles.status, backgroundColor: '#A5D6A7' }}>Assinado</span>
                      </td>
                      <td>{usuarioLogado.nome_usuario}</td>
                      <td>
                        <Button
                          style={styles.actionButton}
                          onClick={async () => {
                            const isValid = await verificarAssinatura(documento.id_documento, usuarioLogado.id_usuario);
                            setNeedsUpdate(true);
                            alert(isValid ? "Assinatura válida!" : "Assinatura inválida!");
                          }}
                        >
                          <FaFileSignature style={styles.icon} /> Verificar Assinatura
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.emptyMessage}>Nenhum documento assinado encontrado.</p>
          )}
        </Tab>
        
        <Tab eventKey="nao-assinados" title="Não Assinados">
          <h2 style={styles.title}>Não Assinados</h2>
          {documentosNaoAssinados.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Texto do Documento</th>
                    <th>Data de criação</th>
                    <th>Status</th>
                    <th>Proprietário</th>
                  </tr>
                </thead>
                <tbody>
                  {documentosNaoAssinados.map((documento) => (
                    <tr key={documento.id_documento} style={styles.tableRow}>
                      <td style={styles.textoDocumento}>{handleEmptyField(documento.mensagem_documento)}</td>
                      <td>{new Date(documento.criado_em).toLocaleString()}</td>
                      <td>
                        <span style={{ ...styles.status, backgroundColor: '#e74c3c' }}>Pendente</span>
                      </td>
                      <td>{usuarioLogado.nome_usuario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.emptyMessage}>Nenhum documento não assinado encontrado.</p>
          )}
        </Tab>
      </Tabs>
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
    fontFamily: "Poppins",
  },
  header: {
    backgroundColor: "rgb(227, 242, 253)",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    borderRadius: 20,
    textAlign: 'center',
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
    marginBottom: '40px'
  },
  textoDocumento: {
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#81D4FA',
    borderRadius: '20px',
    padding: '5px 10px',
    fontSize: '14px',
    border: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: '2px',
  },
  emptyMessage: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default Documentos;
