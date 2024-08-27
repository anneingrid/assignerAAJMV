import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

function Documentos() {
  const documents = [
    { id: 1, name: 'Documento 1', signed: true },
    { id: 2, name: 'Documento 2', signed: false },
    // Mock de documentos
  ];

  return (
    <Container style={styles.container}>
      <Row>
        <Col md={12} style={styles.documentosBox}>
          <h3 style={styles.header}>Documentos Assinados</h3>
          <ListGroup style={styles.listGroup}>
            {documents.filter(doc => doc.signed).map((doc) => (
              <ListGroup.Item key={doc.id} style={styles.listItemSigned}>
                {doc.name}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h3 style={{ ...styles.header, marginTop: '30px' }}>Documentos Não Assinados</h3>
          <ListGroup style={styles.listGroup}>
            {documents.filter(doc => !doc.signed).map((doc) => (
              <ListGroup.Item key={doc.id} style={styles.listItemNotSigned}>
                {doc.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
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
  documentosBox: {
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
  listGroup: {
    width: '100%',
  },
  listItemSigned: {
    backgroundColor: '#d4edda', // Verde claro
    borderColor: '#c3e6cb',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
  listItemNotSigned: {
    backgroundColor: '#f8d7da', // Vermelho claro
    borderColor: '#f5c6cb',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
};

export default Documentos;
