import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DocumentoModal = ({ show, onHide, documento }) => {
  const handleEmptyField = (field) => {
    return field && field.trim() !== '' ? field : 'Campo vazio';
  };

  const formatDate = (date) => {
    if (!date) return 'Data indisponível';
    return new Date(date).toLocaleString();
  };


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Visualizar Documento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {documento ? (
          <div>
            <p><strong>Id do Documento:</strong> {documento.id_documento}</p>
            <p>
              <strong>Texto do Documento:</strong> 
              {handleEmptyField(documento.mensagem_documento || documento.documentos?.mensagem_documento || 'Não contém texto')}
            </p>
            <p><strong>Proprietário:</strong> {documento.usuarios?.nome_usuario || 'Desconhecido'}</p>
            <p><strong>Status:</strong> {documento.assinatura_hash ? 'Assinado' : 'Pendente'}</p>
            <p><strong>Data Assinado:</strong> {documento.assinado_em ? formatDate(documento.assinado_em) : 'Documento não assinado'}</p>
            <p>
              <strong>Data de Criação:</strong> 
              {documento.documentos?.criado_em ? formatDate(documento.documentos.criado_em) : formatDate(documento.criado_em)}
            </p>
          </div>
        ) : (
          <p>Erro ao carregar o documento.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentoModal;
