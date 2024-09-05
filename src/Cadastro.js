import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './Provider';

function Cadastro() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { cadastrarUsuario } = useContext(AppContext);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem.');
            return;
        }

        if (formData.senha.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        const result = await cadastrarUsuario(formData.nome, formData.email, formData.senha);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(result.success);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }
    };

    return (
        <Container fluid style={styles.container}>
            <Row>
                <Col md={12} style={styles.registerBox}>
                    <h2 className="text-center mb-4" style={styles.title}>Por favor, preencha o formulário para se cadastrar!</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFullName">
                            <Form.Label>Nome Completo:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite seu nome completo"
                                style={styles.input}
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Digite seu email"
                                style={styles.input}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Senha:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite sua senha"
                                style={styles.input}
                                name="senha"
                                value={formData.senha}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formConfirmPassword" className="mt-3">
                            <Form.Label>Confirmar Senha:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirme sua senha"
                                style={styles.input}
                                name="confirmarSenha"
                                value={formData.confirmarSenha}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Button type="submit" style={styles.submitButton}>
                            Cadastrar
                        </Button>

                        <div style={styles.loginContainer}>
                            <span>Já tem uma conta? </span>
                            <a href="/" style={styles.loginLink}>Entrar</a>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3F2FD',
    },
    registerBox: {
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        borderRadius: '30px',
        padding: '10px',
        border: '1px solid #B0C4DE',
        marginBottom: '10px',
    },
    submitButton: {
        marginTop: '20px',
        width: '100%',
        backgroundColor: '#55a6ed',
        borderRadius: '30px',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        color: '#ffffff',
    },
    loginContainer: {
        marginTop: '15px',
        fontSize: '0.9rem',
    },
    loginLink: {
        color: '#55a6ed',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Cadastro;
