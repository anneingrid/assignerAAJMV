import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Provider';
import { FaFileSignature, FaPen } from 'react-icons/fa';
import Assinar from './Assinar';
import { Button } from 'react-bootstrap';

function Documentos() {
  const { usuarioLogado, listarDocumentosAssinados, listarDocumentosNaoAssinados, verificarAssinatura } = useContext(AppContext);
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
  }, [usuarioLogado]);

  const handleEmptyField = (field) => {
    return field && field.trim() !== '' ? field : 'Campo vazio';
  };

  return (
    <div style={styles.container}>
      <Assinar />
      <h2 style={styles.title}>Documentos Assinados</h2>
      {documentosAssinados.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nome do Documento</th>
                <th>Assinado em</th>
                <th>Status</th>
                <th>Dono</th> 
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {documentosAssinados.map((documento) => (
                <tr key={documento.id_documento} style={styles.tableRow}>
                  <td>{handleEmptyField(documento.documentos.mensagem_documento)}</td>
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
                        if (isValid) {
                          alert("Assinatura válida!");
                        } else {
                          alert("Assinatura inválida!");
                        }
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

      <h2 style={styles.title}>Documentos Não Assinados</h2>
      {documentosNaoAssinados.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nome do Documento</th>
                <th>Data de criação</th>
                <th>Status</th>
                <th>Dono</th> 
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {documentosNaoAssinados.map((documento) => (
                <tr key={documento.id_documento} style={styles.tableRow}>
                  <td>{handleEmptyField(documento.mensagem_documento)}</td>
                  <td>{new Date(documento.criado_em).toLocaleString()}</td>
                  <td>
                    <span style={{ ...styles.status, backgroundColor: '#e74c3c' }}>Pendente</span>
                  </td>
                  <td>{usuarioLogado.nome_usuario}</td> {/* Mostrando o nome do dono, que é o usuário logado */}
                  <td style={{ alignItems: 'center' }}>
                    <Button style={styles.actionButton}>
                      <FaPen style={styles.icon} /> Assinar
                    </Button>
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
    margin: '0 5px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: '8px',
  },
  emptyMessage: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default Documentos;
