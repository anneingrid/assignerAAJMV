import React, { useState, useContext, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaKey } from 'react-icons/fa';
import { AppContext } from '../Provider';

function GerarChaves() {
  const { gerarChaves, usuarioLogado } = useContext(AppContext);
  const [chaveGerada, setChaveGerada] = useState(false); 

  useEffect(() => {
    const verificarChave = async () => {

      if (usuarioLogado && usuarioLogado.id_usuario) {
        const retorno = await gerarChaves(usuarioLogado.id_usuario);
        console.log(usuarioLogado);
  
        if (retorno === 'erro') {
          setChaveGerada(true);
        }
      } else {
        console.error("Usuário não logado ou id_usuario não disponível.");

      
      }
    };
  
    verificarChave();
  }, [gerarChaves, usuarioLogado]);
  


  const handleGerarChaves = async () => {
    const retorno = await gerarChaves(usuarioLogado.id_usuario);

    if (retorno === 'erro') {
      setChaveGerada(true); 
    } else {
      alert('Chaves Geradas com sucesso!');
    }
  };

  return (
    <Container fluid style={styles.container}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6} lg={4} style={styles.gerarChavesBox}>
          <h3 style={styles.title}><FaKey style={styles.icon} /> Gerar Chaves</h3>
          
          {chaveGerada ? (
            <p>Chave já gerada para o usuário.</p> 
          ) : (
            <Button
              onClick={handleGerarChaves}
              variant="primary"
              style={styles.gerarButton}>
              Gerar
            </Button>
          )}
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
    fontFamily: "Poppins"
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
    fontFamily: "Poppins",
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