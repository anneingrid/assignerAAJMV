import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

function GerarChaves() {
  const handleGerarChaves = () => {
    // Aqui você incluiria a lógica para gerar as chaves
    alert('Chaves geradas com sucesso!');
  };

  return (
    <Container style={styles.container}>
      <Row>
        <Col md={12} style={styles.gerarChavesBox}>
          <h3>Gerar Chaves</h3>
          <Button
            onClick={handleGerarChaves}
            variant="primary"
            style={styles.gerarButton}
          >
            Gerar
          </Button>
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
  gerarChavesBox: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    textAlign: 'center',
  },
  gerarButton: {
    backgroundColor: '#55a6ed',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    marginTop: '20px',
  },
};

export default GerarChaves;
