import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Provider';
import { FaFileAlt, FaFileSignature, FaEye } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Tab, Tabs } from 'react-bootstrap';
import DocumentoModal from './DocumentoModal';

function Documentos() {
  const { usuarioLogado, listarTodosDocumentosAssinados, listarTodosDocumentosNaoAssinados, verificarAssinatura, gerarAssinatura } = useContext(AppContext);
  const [todosDocumentosAssinados, setTodosDocumentosAssinados] = useState([]);
  const [todosDocumentosNaoAssinados, setTodosDocumentosNaoAssinados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);

  const fetchDocumentos = async () => {
    try {
      const assinados = await listarTodosDocumentosAssinados(usuarioLogado.id_usuario);
      const naoAssinados = await listarTodosDocumentosNaoAssinados(usuarioLogado.id_usuario);

      setTodosDocumentosAssinados(assinados);
      setTodosDocumentosNaoAssinados(naoAssinados);
    } catch (error) {
      console.error("Erro ao buscar os documentos:", error);
    }
  };

  useEffect(() => {
    if (usuarioLogado) {
      fetchDocumentos();
    }
  }, [usuarioLogado, todosDocumentosAssinados,todosDocumentosNaoAssinados]);

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

  const verificarAssinaturaDocumento = async (documento) => {
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
  };

  const visualizarDocumento = (documento) => {
    setDocumentoSelecionado(documento);
    setShowModal(true);
  };

  const handleAssinarDocumento = async (documento) => {
    try {
      await gerarAssinatura(documento.id_documento, usuarioLogado.id_usuario, documento.mensagem_documento);
      showSuccessMessage(`Documento assinado com sucesso!\nTexto do documento: ${documento.mensagem_documento}`);

      await fetchDocumentos();
    } catch (error) {
      showErrorMessage("Erro ao assinar o documento.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Todos os documentos</h1>
      <Tabs defaultActiveKey="assinados" id="documentos-tabs">
        <Tab eventKey="assinados" title="Assinados">
          <h2 style={styles.title}>Assinados</h2>
          {todosDocumentosAssinados.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Texto do Documento</th>
                    <th>Assinado em</th>
                    <th>Status</th>
                    <th>Proprietário</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {todosDocumentosAssinados.map((documento) => (
                    <tr key={documento.id_documento} style={styles.tableRow}>
                      <td style={styles.textoDocumento}>
                        <FaFileAlt style={styles.documentIcon} />
                        {handleEmptyField(documento.mensagem_documento || documento.documentos?.mensagem_documento)}
                      </td>
                      <td>{new Date(documento.assinado_em).toLocaleString()}</td>
                      <td>
                        <span style={{ ...styles.status, backgroundColor: '#A5D6A7' }}>Assinado</span>
                      </td>
                      <td>{documento.usuarios.nome_usuario}</td>
                      <td>
                        <Button
                          style={styles.actionButton}
                          onClick={() => verificarAssinaturaDocumento(documento)}
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
          {todosDocumentosNaoAssinados.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Texto do Documento</th>
                    <th>Data de criação</th>
                    <th>Status</th>
                    <th>Proprietário</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {todosDocumentosNaoAssinados.map((documento) => (
                    <tr key={documento.id_documento} style={styles.tableRow}>
                      <td style={styles.textoDocumento}>
                        <FaFileAlt style={styles.documentIcon} />
                        {handleEmptyField(documento.mensagem_documento)}
                      </td>
                      <td>{new Date(documento.criado_em).toLocaleString()}</td>
                      <td>
                        <span style={{ ...styles.status, backgroundColor: '#e74c3c' }}>Pendente</span>
                      </td>
                      <td>{documento.usuarios.nome_usuario}</td>
                      <td>
                        {/* Se o documento não for assinado, renderiza o botão de assinar */}
                        <Button
                          style={styles.actionButton}
                          onClick={() => handleAssinarDocumento(documento)}
                        >
                          <FaFileSignature style={styles.icon} /> Assinar
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
            <p style={styles.emptyMessage}>Nenhum documento não assinado encontrado.</p>
          )}
        </Tab>
      </Tabs>

      <DocumentoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        documento={documentoSelecionado}
      />

      <ToastContainer />
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
  documentIcon: {
    marginRight: '8px',  
    color: '#3498db',    
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
    marginBottom: '40px',
    height: '50px', 
  },
  textoDocumento: {
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '10px',
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
