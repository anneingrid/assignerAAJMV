import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function Cadastro() {
    return (
        <Container fluid style={styles.container}>
            <Row>
                <Col md={12} style={styles.registerBox}>
                    <h2 className="text-center mb-4" style={styles.title}>Por favor, preencha o formulário para se cadastrar!</h2>
                    <Form>
                        <Form.Group controlId="formFullName">
                            <Form.Label>Nome Completo:</Form.Label>
                            <Form.Control type="text" placeholder="Digite seu nome completo" style={styles.input} />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" placeholder="Digite seu email" style={styles.input} />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Senha:</Form.Label>
                            <Form.Control type="password" placeholder="Digite sua senha" style={styles.input} />
                        </Form.Group>

                        <Form.Group controlId="formConfirmPassword" className="mt-3">
                            <Form.Label>Confirmar Senha:</Form.Label>
                            <Form.Control type="password" placeholder="Confirme sua senha" style={styles.input} />
                        </Form.Group>

                        <Button type="submit" style={styles.submitButton}>
                            Cadastrar
                        </Button>

                        <div style={styles.loginContainer}>
                            <span>Já tem uma conta? </span>
                            <a href="/" style={styles.loginLink}>Entrar</a> {/* Texto "Entrar" em negrito */}
                        </div>

                        <div style={styles.socialIconsContainer}>
                            {/* Placeholder para ícones de redes sociais */}
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
        color: '#333', // Cor de texto principal padronizada
    },
    input: {
        borderRadius: '30px',
        padding: '10px',
        border: '1px solid #B0C4DE', // Cor de borda padronizada
        marginBottom: '10px',
    },
    submitButton: {
        marginTop: '20px',
        width: '100%',
        backgroundColor: '#55a6ed', // Cor do botão padronizada
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
        color: '#55a6ed', // Cor do link padronizada
        textDecoration: 'none',
        fontWeight: 'bold', // Texto "Entrar" em negrito
    },
    socialIconsContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    socialIcon: {
        fontSize: '1.5rem',
        color: '#5B83F1', // Cor dos ícones padronizada
        cursor: 'pointer',
    },
};

export default Cadastro;
