import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AppContext } from '../Provider';

function Assinar({ atualizarDocumentos }) {
  const { gerarAssinatura, salvarDocumento, usuarioLogado } = useContext(AppContext);
  const [textoDocumento, setTextoDocumento] = useState('');
  const [documentoSalvo, setDocumentoSalvo] = useState(false);
  const [id_documento, setId_documento] = useState('');
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  const assinarDocumento = async () => {
    if (textoDocumento.trim() === '') {
      showErrorMessage('O texto do documento não pode estar vazio.');
      return;
    }
    try {
      await gerarAssinatura(id_documento, usuarioLogado.id_usuario, textoDocumento);
      showSuccessMessage('Documento assinado com sucesso!');
      atualizarDocumentos();
    } catch (error) {
      showErrorMessage('Erro ao assinar o documento.');
    }
  };

  const salvarDocumentoHandler = async () => {
    if (textoDocumento.trim() === '') {
      showErrorMessage('O texto do documento não pode estar vazio.');
      return;
    }
    try {
      const idDocumento = await salvarDocumento(usuarioLogado.id_usuario, textoDocumento);
      if (idDocumento) {
        setId_documento(idDocumento);
        setDocumentoSalvo(true);
        setIsDisabled(true);
        setIsTextAreaDisabled(true);
        showSuccessMessage('Documento salvo com sucesso!');
        atualizarDocumentos();
      } else {
        showErrorMessage('Erro ao salvar o documento.');
      }
    } catch (error) {
      showErrorMessage('Erro ao salvar o documento.');
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
              onClick={salvarDocumentoHandler}
              style={styles.viewButton}
              disabled={isDisabled}
            >
              Salvar Documento
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="primary"
                onClick={assinarDocumento}
                style={styles.signButton}
              >
                Assinar Documento
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
    fontFamily: "Poppins",
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
    marginBottom: "20px",
  },
  signButton: {
    backgroundColor: '#81D4FA',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
    width: 'auto',
    fontFamily: "Poppins",
  },
};

export default Assinar;
