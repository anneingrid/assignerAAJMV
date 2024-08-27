import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaKey } from 'react-icons/fa'; // Ícone para um toque visual

function GerarChaves() {
  const navigate = useNavigate();

  const handleGerarChaves = () => {
    alert('Chaves geradas com sucesso!');
    navigate('/Assinar');
  };

  return (
    <Container fluid style={styles.container}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6} lg={4} style={styles.gerarChavesBox}>
          {/* Título estilizado com ícone */}
          <h3 style={styles.title}><FaKey style={styles.icon} /> Gerar Chaves</h3>
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
    backgroundColor: '#E3F2FD',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gerarChavesBox: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    transition: 'transform 0.3s', // Adiciona uma animação suave
  },
  title: {
    color: '#3282F6',
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: '10px', // Espaçamento entre o ícone e o texto
  },
  gerarButton: {
    backgroundColor: '#55a6ed',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    marginTop: '20px',
    color: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s, transform 0.3s', // Transição suave para hover
  },
};

export default GerarChaves;
