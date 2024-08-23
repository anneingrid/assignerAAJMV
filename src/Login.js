import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de autenticação aqui
        setIsAuthenticated(true);
        navigate('/Principal');
    };
    const registrar = (e) => {
        e.preventDefault();
        // Lógica de autenticação aqui
        setIsAuthenticated(true);
        navigate('/Cadastro');
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Usuário:</Form.Label>
                    <Form.Control size="lg" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Senha:</Form.Label>
                    <Form.Control size="lg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit">Entrar</Button>

            </Form>
            <Button onClick={registrar}>Registrar</Button>
        </Container>

    );
};
