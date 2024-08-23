import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de registro aqui
    navigate('/');
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Usuário:</Form.Label>
          <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Senha:</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button type="submit">Entrar</Button>
        
      </Form>
    </div>
  );
}

