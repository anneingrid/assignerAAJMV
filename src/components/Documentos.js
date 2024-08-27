import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

function Documentos() {
  const documents = [
    { id: 1, name: 'Documento 1', signed: true },
    { id: 2, name: 'Documento 2', signed: false },
  ];

  return (
    <Container fluid style={styles.container}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={8} lg={6} style={styles.documentosBox}>
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
    backgroundColor: '#E3F2FD',
    width: '100vw',
  },
  documentosBox: {
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
  listGroup: {
    width: '100%',
  },
  listItemSigned: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
  listItemNotSigned: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
};

export default Documentos;
