import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === '1234') {
            setIsAuthenticated(true);
            navigate('/Principal');
        } else {
            setError('Usuário ou senha incorretos!');
        }
    };

    return (
        <Container style={styles.container}>
            <Row className="justify-content-center">
                <Col md={12} style={styles.loginBox}>
                    <h2 className="text-center mb-4" style={styles.title}>Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-start">Usuário</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mt-3">
                            <Form.Label className="text-start">Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </Form.Group>

                        <Button type="submit" style={styles.submitButton}>
                            Entrar
                        </Button>

                        <div style={styles.googleLoginContainer}>
                            <Button style={styles.googleButton}>
                                <img
                                    src="https://ajuda.fastcommerce.com.br/lojas/00000009/prod/fc15025-configurar-login-cliente-google.jpg"
                                    alt="Google Login"
                                    style={styles.googleIcon}
                                />
                                Entrar com o Google
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#E3F2FD',
    },
    loginBox: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        color: '#3282F6',
    },
    input: {
        borderRadius: '30px',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #ddd',
    },
    submitButton: {
        marginTop: '20px',
        width: '100%',
        backgroundColor: '#55a6ed',
        borderRadius: '30px',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
    },
    googleLoginContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
    },
    googleButton: {
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderRadius: '30px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        width: 'fit-content',
    },
    googleIcon: {
        width: '20px',
        marginRight: '10px',
    },
};

export default Login;
