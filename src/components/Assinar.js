import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';

function Assinar() {
  const [documentText, setDocumentText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSignDocument = () => {
    alert(`Documento assinado com sucesso!\nTexto do documento: ${documentText}`);
  };

  const handleViewDocument = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container style={styles.container}>
      <Row>
        <Col md={12} style={styles.assinarBox}>
          <h3 style={styles.header}>Assinar Documento</h3>
          <Form>
            <Form.Group controlId="documentText" style={styles.formGroup}>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Digite o texto do documento aqui"
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                style={styles.textArea}
              />
            </Form.Group>
            <div style={styles.buttonGroup}>
              <Button
                variant="secondary"
                onClick={handleViewDocument}
                style={styles.viewButton}
              >
                Visualizar Documento
              </Button>
              <Button
                variant="primary"
                onClick={handleSignDocument}
                style={styles.signButton}
              >
                Assinar Documento
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Modal para visualização do documento */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>Pré-visualização do Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <p>{documentText}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} style={styles.closeButton}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#E3F2FD', // Fundo azul claro
  },
  assinarBox: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    textAlign: 'center',
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
    resize: 'none', // Desabilita o redimensionamento da textarea
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  viewButton: {
    backgroundColor: '#A5D6A7', // Cor suave verde claro
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
  },
  signButton: {
    backgroundColor: '#81D4FA', // Cor suave azul claro
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
  },
  modalHeader: {
    borderBottom: 'none',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: '20px',
    color: '#3282F6',
  },
  modalBody: {
    textAlign: 'center',
    padding: '20px',
  },
  closeButton: {
    backgroundColor: '#FFCDD2', // Cor suave vermelho claro
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
  },
};

export default Assinar;
