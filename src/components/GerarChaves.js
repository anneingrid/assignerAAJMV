import React, { useState, useContext } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaKey } from 'react-icons/fa';
import { AppContext } from '../Provider';

function GerarChaves() {
  const navigate = useNavigate();
  const { gerarChaves, usuarioLogado } = useContext(AppContext);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleGerarChaves = () => {

    gerarChaves(usuarioLogado.id_usuario);
    alert(`Chaves Geradad com sucesso!`);
    setIsDisabled(true);
  };

  return (
    <Container fluid style={styles.container}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6} lg={4} style={styles.gerarChavesBox}>
          <h3 style={styles.title}><FaKey style={styles.icon} /> Gerar Chaves</h3>
          <Button
            onClick={handleGerarChaves}
            variant="primary"
            style={styles.gerarButton}
            disabled={isDisabled}
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
    display: 'flex',
    justifyContent: 'center',
  },
  gerarChavesBox: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    transition: 'transform 0.3s',
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
    marginRight: '10px',
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
    transition: 'background-color 0.3s, transform 0.3s',
  },
};

export default GerarChaves;
