import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';

function Modal({ show, onClose, documentText, navigateToDocuments }) {
  return (
    <BootstrapModal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Pré-visualização do Documento</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p>{documentText}</p>
      </BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button
          variant="secondary"
          style={styles.viewButton}
          onClick={onClose}
        >
          Fechar
        </Button>
        <Button
          variant="primary"
          style={styles.signButton}
          onClick={() => {
            onClose();
            navigateToDocuments();
          }}
        >
          Entendido
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
}

const styles = {
  viewButton: {
    backgroundColor: '#A5D6A7', 
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
  },
  signButton: {
    backgroundColor: '#81D4FA', 
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
  },
};

export default Modal;
