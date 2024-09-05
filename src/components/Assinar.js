import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { AppContext } from '../Provider';

function Assinar() {
  const { gerarAssinatura, salvarDocumento, usuarioLogado } = useContext(AppContext);
  const [textoDocumento, setTextoDocumento] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para controlar a exibição do formulário
  const [documentoSalvo, setDocumentoSalvo] = useState(false); // Estado para controlar se o documento foi salvo
  const navigate = useNavigate();
  const [id_documento, setId_documento] = useState('');

  const assinarDocumento = () => {
    alert(`Documento assinado com sucesso!\nTexto do documento: ${textoDocumento}`);
    gerarAssinatura(id_documento, usuarioLogado.id_usuario, textoDocumento);
  };

  const salvarDocumentos = async () => {
    try {
      alert(`Documento salvo com sucesso!\nTexto do documento: ${textoDocumento}`);
      const idDocumento = await salvarDocumento(usuarioLogado.id_usuario, textoDocumento);

      if (idDocumento) {
        setId_documento(idDocumento);
        setDocumentoSalvo(true); // Documento salvo com sucesso
        setIsDisabled(true); // Desabilita o botão "Salvar"
        setIsTextAreaDisabled(true); // Desabilita o campo de texto
        setMostrarFormulario(false); // Oculta o formulário após salvar
      } else {
        console.error('Erro ao obter ID do documento.');
      }
    } catch (error) {
      console.error('Erro ao salvar documento:', error.message || error);
    }
  };

  const inserirNovoArquivo = () => {
    setTextoDocumento(''); // Limpa o campo de texto
    setIsDisabled(false);  // Reabilita o botão "Salvar"
    setIsTextAreaDisabled(false); // Reabilita o campo de texto
    setMostrarFormulario(true); // Exibe o formulário novamente
    setDocumentoSalvo(false); // Reseta o estado de documento salvo
  };

  return (
    <Container style={styles.container}>
      <div style={styles.assinarBox}>
        <h2 style={styles.title}>Adicionar Documento</h2>

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
                disabled={isTextAreaDisabled} // Desabilita o campo de texto quando necessário
              />
            </Form.Group>
            <Button
              variant="secondary"
              onClick={salvarDocumentos}
              style={styles.viewButton}
              disabled={isDisabled} // Desabilita o botão de salvar
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
            <span style={{ fontWeight:'bold' }}>Id:</span> {id_documento}
            </p>
            <p style={{ marginTop: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight:'bold' }}>Texto:</span> {textoDocumento}
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

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        textoDocumento={textoDocumento}
        navigateToDocuments={() => navigate('/Documentos')}
      />
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
  },
  signButton: {
    backgroundColor: '#81D4FA',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    margin: '0 5px',
    width: 'auto',
  },
};

export default Assinar;
