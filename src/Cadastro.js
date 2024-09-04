import bcrypt from 'bcryptjs';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from './ConexaoBd';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const hashPassword = async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return { salt, hash };
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

        try {
            const { hash } = await hashPassword(formData.senha);

            const { data, error: insertError } = await supabase
                .from('usuarios')
                .insert([
                    {
                        nome_usuario: formData.nome,
                        email: formData.email,
                        senha: hash
                    }
                ]);

            if (insertError) {
                console.error(insertError);
                setError('Erro ao cadastrar. Tente novamente.');
            } else {
                setSuccess('Usuário cadastrado com sucesso! Redirecionando para a página de login...');
                
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao cadastrar o usuário.');
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

                        <div style={styles.socialIconsContainer}>
                            <i className="fab fa-facebook" style={styles.socialIcon}></i>
                            <i className="fab fa-whatsapp" style={styles.socialIcon}></i>
                            <i className="fab fa-telegram" style={styles.socialIcon}></i>
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
        backgroundColor: '#E3F2FD', // Cor de fundo padronizada
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
        transition: 'background-color 0.3s ease',
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
    socialIconsContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    socialIcon: {
        fontSize: '1.5rem',
        color: '#5B83F1',
        cursor: 'pointer',
    },
};

export default Cadastro;
