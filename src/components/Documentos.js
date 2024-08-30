import React from 'react';
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap';

function Documentos() {
  const documents = [
    { id: 1, name: 'Documento 1', signed: true },
    { id: 2, name: 'Documento 2', signed: false },
  ];

  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const currentUser = "Usuário Exemplo"; // Substitua pelo nome real do usuário logado, se disponível
  const generatedHash = localStorage.getItem('generatedHash') || 'Chave não gerada'; // Obtém a chave gerada do localStorage

  return (
    <Container fluid style={styles.container}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={8} lg={6} style={styles.documentosBox}>
          <Card style={styles.card}>
            <Card.Body>
              <Card.Title style={styles.mainHeader}>Lista de Documentos</Card.Title>
              <Card.Text style={styles.infoText}><strong>Chave Gerada (Hash):</strong> {generatedHash}</Card.Text>
              <Card.Text style={styles.infoText}><strong>Usuário Logado:</strong> {currentUser}</Card.Text>
              <Card.Text style={styles.infoText}><strong>Data:</strong> {currentDate}</Card.Text>
            </Card.Body>
          </Card>

          {/* Lista de Documentos Assinados */}
          <h4 style={styles.header}>Documentos Assinados</h4>
          <ListGroup variant="flush" style={styles.listGroup}>
            {documents.filter(doc => doc.signed).map((doc) => (
              <ListGroup.Item key={doc.id} style={styles.listItemSigned}>
                {doc.name}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Lista de Documentos Não Assinados */}
          <h4 style={{ ...styles.header, marginTop: '30px' }}>Documentos Não Assinados</h4>
          <ListGroup variant="flush" style={styles.listGroup}>
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
    // alignItems: 'center',
    height: '100vh',
    backgroundColor: '#E3F2FD',
    width: '100vw',
    padding: '20px', // Adicionado padding para um melhor espaçamento
  },
  documentosBox: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  card: {
    marginBottom: '30px', // Margem inferior para separar o card da lista
  },
  mainHeader: {
    color: '#3282F6',
    fontSize: '1.75rem',
    marginBottom: '15px',
  },
  header: {
    color: '#3282F6',
    fontSize: '1.25rem',
    marginBottom: '15px',
  },
  infoText: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '10px',
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
    textAlign: 'left',
  },
  listItemNotSigned: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    textAlign: 'left',
  },
};

export default Documentos;
