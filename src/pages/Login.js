import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../Provider';

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AppContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (email.trim() !== '' && password.trim() !== '') {
            const result = await login(email, password);
            if (result.error) {
                setError(result.error);
            } else {
                setIsAuthenticated(true);
                navigate('/Principal');
            }
        } else {
            setError('Por favor, preencha todos os campos.');
        }
    };

    return (
        <Container fluid style={styles.container}>
            <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Col md={12} style={styles.loginBox}>
                    <h2 className="text-center mb-4" style={styles.title}>🔐 Bem-vindo ao Sistema</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="text-start">Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                style={styles.input}
                            />
                        </Form.Group>

                        <Button type="submit" style={styles.submitButton}>
                            Entrar
                        </Button>
                    </Form>

                    <div style={styles.registerContainer}>
                        <span>Não tem uma conta? </span>
                        <Link to="/Cadastro" style={styles.registerLink}>Registre-se</Link>
                    </div>
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
        width: '100vw',
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
        fontSize: '2.5rem',
        fontWeight: 'bold',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        marginBottom: '30px',
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
        color: '#fff',
    },
};

export default Login;
