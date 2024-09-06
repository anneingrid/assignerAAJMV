import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Provider';
import { FaFileSignature, FaPen, FaEye } from 'react-icons/fa';
import Assinar from './Assinar';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DocumentoModal from './DocumentoModal';

function MeusDocumentos() {
  const { usuarioLogado, listarDocumentosAssinados, listarDocumentosNaoAssinados, verificarAssinatura, gerarAssinatura } = useContext(AppContext);
  const [documentosAssinados, setDocumentosAssinados] = useState([]);
  const [documentosNaoAssinados, setDocumentosNaoAssinados] = useState([]);
  const [documentosAssinadosIds, setDocumentosAssinadosIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);

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

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const visualizarDocumento = (documento) => {
    setDocumentoSelecionado(documento);
    setShowModal(true);
  };

  const handleAssinarDocumento = async (documento) => {
    try {
      await gerarAssinatura(documento.id_documento, usuarioLogado.id_usuario, documento.mensagem_documento);
      showSuccessMessage(`Documento assinado com sucesso!\nTexto do documento: ${documento.mensagem_documento}`);
      
      // Adiciona o ID do documento assinado no estado
      setDocumentosAssinadosIds((prev) => [...prev, documento.id_documento]);
    } catch (error) {
      showErrorMessage("Erro ao assinar o documento.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Meus Documentos</h1>
      <Assinar />

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
                      <td>
                        <Button
                          style={styles.actionButton}
                          onClick={async () => {
                            try {
                              const isValid = await verificarAssinatura(documento.id_documento, usuarioLogado.id_usuario);
                              if (isValid) {
                                showSuccessMessage("Assinatura válida!");
                              } else {
                                showErrorMessage("Assinatura inválida!");
                              }
                            } catch (error) {
                              showErrorMessage("Erro ao verificar a assinatura.");
                            }
                          }}
                        >
                          <FaFileSignature style={styles.icon} /> Verificar Assinatura
                        </Button>
                        <Button
                          style={styles.actionButton}
                          onClick={() => visualizarDocumento(documento)}
                        >
                          <FaEye style={styles.icon} /> Visualizar
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
                    <th>Ação</th>
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
                      <td style={{ alignItems: 'center' }}>
                        {!documentosAssinadosIds.includes(documento.id_documento) && (
                          <Button
                            style={styles.actionButton}
                            onClick={() => handleAssinarDocumento(documento)}
                          >
                            <FaPen style={styles.icon} /> Assinar
                          </Button>
                        )}
                        <Button
                          style={styles.actionButton}
                          onClick={() => visualizarDocumento(documento)}
                        >
                          <FaEye style={styles.icon} /> Visualizar
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
        </Tab>
      </Tabs>

      <DocumentoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        documento={documentoSelecionado}
      />
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

export default MeusDocumentos;
