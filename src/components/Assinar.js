import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { AppContext } from '../Provider';

function Assinar() {
  const { gerarAssinatura } = useContext(AppContext);
  const [textoDocumento, setTextoDocumento] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const assinarDocumento = () => {
    alert(`Documento assinado com sucesso!\nTexto do documento: ${textoDocumento}`);
    gerarAssinatura(0, 1, textoDocumento);
     
    navigate('/Documentos');
  };

  const visualizarDocumento = () => {
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
  };

  const navigateToDocuments = () => {
    navigate('/Documentos');
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
              />
            </Form.Group>
            <div style={styles.buttonGroup}>
              <Button
                variant="secondary"
                onClick={visualizarDocumento}
                style={styles.viewButton}
              >
                Salvar
              </Button>
              <Button
                variant="primary"
                onClick={assinarDocumento}
                style={styles.signButton}
              >
                Assinar
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onClose={fecharModal}
        textoDocumento={textoDocumento}
        navigateToDocuments={navigateToDocuments}
      />
    </Container>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    height: '100vh',
    backgroundColor: '#E3F2FD',
    width: '100vw',
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
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  viewButton: {
    backgroundColor: '#A5D6A7',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
    width: 150
  },
  signButton: {
    backgroundColor: '#81D4FA',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
    width: 150
  },
};

export default Assinar;
