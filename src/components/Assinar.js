import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { AppContext } from '../Provider';

function Assinar() {
  const { gerarAssinatura, salvarDocumento, usuarioLogado } = useContext(AppContext);
  const [textoDocumento, setTextoDocumento] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); 
  const [documentoSalvo, setDocumentoSalvo] = useState(false); 
  const navigate = useNavigate();
  const [id_documento, setId_documento] = useState('');
  const [donoDocumento, setDonoDocumento] = useState(''); 

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const assinarDocumento = () => {
    if (textoDocumento.trim() === '') {
      showErrorMessage('O texto do documento não pode estar vazio.');
      return;
    }
    showSuccessMessage(`Documento assinado com sucesso!\nTexto do documento: ${textoDocumento}`);
    gerarAssinatura(id_documento, usuarioLogado.id_usuario, textoDocumento);
  };

  const salvarDocumentos = async () => {
    if (textoDocumento.trim() === '') {
      showErrorMessage('O texto do documento não pode estar vazio.');
      return;
    }
    try {
      const idDocumento = await salvarDocumento(usuarioLogado.id_usuario, textoDocumento);

      if (idDocumento) {
        setId_documento(idDocumento);
        setDonoDocumento(usuarioLogado.nome_usuario || usuarioLogado.id_usuario); 
        setDocumentoSalvo(true);
        setIsDisabled(true);
        setIsTextAreaDisabled(true);
        setMostrarFormulario(false);
        showSuccessMessage(`Documento salvo com sucesso!\nTexto do documento: ${textoDocumento}`);
      } else {
        console.error('Erro ao obter ID do documento.');
      }
    } catch (error) {
      console.error('Erro ao salvar documento:', error.message || error);
      showErrorMessage('Erro ao salvar documento.');
    }
  };

  const inserirNovoArquivo = () => {
    setTextoDocumento('');
    setIsDisabled(false);
    setIsTextAreaDisabled(false);
    setMostrarFormulario(true);
    setDocumentoSalvo(false);
  };

  return (
    <Container style={styles.container}>
      <div style={styles.assinarBox}>
        <h2 style={styles.title}>Novo Documento</h2>

        {!mostrarFormulario && !documentoSalvo && (
          <Button
            variant="secondary"
            onClick={inserirNovoArquivo}
            style={styles.viewButton}
          >
            Adicionar Arquivo
          </Button>
        )}

        {mostrarFormulario && (
          <Form>
            <Form.Group controlId="textoDocumento" style={styles.formGroup}>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Digite o texto do documento aqui"
                value={textoDocumento}
                onChange={(e) => setTextoDocumento(e.target.value)}
                style={styles.textArea}
                disabled={isTextAreaDisabled}
              />
            </Form.Group>
            <Button
              variant="secondary"
              onClick={salvarDocumentos}
              style={styles.viewButton}
              disabled={isDisabled}
            >
              Salvar
            </Button>
          </Form>
        )}

        {documentoSalvo && (
          <div>
            <p style={{ marginTop: '10px', marginBottom: '10px' }}>
              Documento salvo:
            </p>
            <p style={{ marginTop: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Id:</span> {id_documento}
            </p>
            <p style={{ marginTop: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Texto:</span> {textoDocumento}
            </p>
            <p style={{ marginTop: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Dono do Documento:</span> {donoDocumento}
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="primary"
                onClick={assinarDocumento}
                style={styles.signButton}
              >
                Assinar
              </Button>
              <Button
                variant="secondary"
                onClick={inserirNovoArquivo}
                style={styles.viewButton}
              >
                Novo Documento
              </Button>
            </div>
          </div>
        )}
      </div>

    </Container>
  );
}

const styles = {
  title: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    fontFamily: "Poppins"
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
    width: 'auto',
    fontFamily: "Poppins",
    marginBottom: "20px"
  },
  signButton: {
    backgroundColor: '#81D4FA',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
    width: 'auto',
    fontFamily: "Poppins"
  },
};

export default Assinar;
