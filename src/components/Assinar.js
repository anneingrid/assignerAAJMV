import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { AppContext } from '../Provider';

function Assinar() {
  const { gerarAssinatura, salvarDocumento, usuarioLogado } = useContext(AppContext);
  const [textoDocumento, setTextoDocumento] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(false); 
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDisabledState = localStorage.getItem('isDisabled');
    if (savedDisabledState !== null) {
      setIsDisabled(JSON.parse(savedDisabledState));
    } else {
      setIsDisabled(false);
    }
    const savedTextAreaState = localStorage.getItem('isTextAreaDisabled');
    if (savedTextAreaState !== null) {
      setIsTextAreaDisabled(JSON.parse(savedTextAreaState));
    } else {
      setIsTextAreaDisabled(false);
    }
  }, [usuarioLogado]);

  const assinarDocumento = () => {
    alert(`Documento assinado com sucesso!\nTexto do documento: ${textoDocumento}`);
    gerarAssinatura(usuarioLogado.id_usuario, textoDocumento);
    navigate('/Documentos');
  };

  const salvarDocumentos = async () => {
    
    try {
      alert(`Documento salvo com sucesso!\nTexto do documento: ${textoDocumento}`);
      const idDocumento = await salvarDocumento(usuarioLogado.id_usuario, textoDocumento);
      
      if (idDocumento) {
        console.log('Documento salvo com ID:', idDocumento);
        setIsDisabled(true); // Desabilita o botão "Salvar"
        setIsTextAreaDisabled(true); // Desabilita o campo de texto
        
      } else {
        console.error('Erro ao obter ID do documento.');
      }
    } catch (error) {
      console.error('Erro ao salvar documento:', error.message || error);
    }
  };
  

  const visualizarDocumento = () => {
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
  };

  const inserirNovoArquivo = () => {
  setTextoDocumento(''); // Limpa o campo de texto
  setIsDisabled(false);  // Reabilita o botão "Salvar"
  setIsTextAreaDisabled(false); // Reabilita o campo de texto
  };

  return (
    <Container fluid style={styles.container}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6} lg={4} style={styles.assinarBox}>
          <h3 style={styles.header}>Assinar Documento</h3>
          <Form>
            <Form.Group controlId="textoDocumento" style={styles.formGroup}>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Digite o texto do documento aqui"
                value={textoDocumento}
                onChange={(e) => setTextoDocumento(e.target.value)}
                style={styles.textArea}
                disabled={isTextAreaDisabled} // Desabilita o campo de texto quando necessário
              />
            </Form.Group>
            <div>
              {isDisabled ? (
                <div>
                  <div>
                    <Badge pill bg="success" style={{ marginTop: '10px', marginBottom: '10px' }}>
                      Documento salvo
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                      <Button
                        variant="primary"
                        onClick={assinarDocumento}
                        style={styles.signButton}
                      >
                        Assinar
                      </Button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <Button
                        variant="secondary"
                        onClick={inserirNovoArquivo}
                        style={styles.viewButton}
                      >
                        Novo Arquivo
                      </Button>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <Button
                    variant="secondary"
                    onClick={salvarDocumentos}
                    style={styles.viewButton}
                  >
                    Salvar
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onClose={fecharModal}
        textoDocumento={textoDocumento}
        navigateToDocuments={() => navigate('/Documentos')}
      />
    </Container>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#E3F2FD',
  },
  assinarBox: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '600px',
  },
  header: {
    color: '#3282F6',
    fontSize: '24px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  textArea: {
    borderRadius: '12px',
    padding: '10px',
    fontSize: '16px',
    resize: 'none',
  },
  viewButton: {
    backgroundColor: '#A5D6A7',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
    width: 150,
  },
  signButton: {
    backgroundColor: '#81D4FA',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
    width: 150,
  },
};

export default Assinar;
