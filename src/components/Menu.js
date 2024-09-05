// Menu.js
import React, { useState } from 'react';
import Navbar from './Navbar'; // Importe o novo componente Navbar

function Menu() {
  const [showDocuments, setShowDocuments] = useState(false);

  const toggleDocuments = () => {
    setShowDocuments(!showDocuments);
  };

  return (
    <div style={styles.dashboardContainer}>
      <Navbar /> {/* Use o componente Navbar aqui */}

      <div style={styles.sidebar}>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarItem}>
            <a href="#home" style={styles.sidebarLink}>Home</a>
          </li>
          <li style={styles.sidebarItem}>
            <a href="#gerar-chaves" style={styles.sidebarLink} onClick={toggleDocuments}>
              Lista de Documentos
            </a>
            {showDocuments && (
              <ul style={styles.documentList}>
                <li style={styles.documentItem}>Documentos Assinados</li>
                <li style={styles.documentItem}>Documentos Não Assinados</li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      <div style={styles.mainContent}>
        {/* Conteúdo principal aqui */}
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    height: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f0f4f8',
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #4B9CE2 0%, #6FC3E9 100%)',
    paddingTop: '70px',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.15)',
    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
  },
  sidebarList: {
    listStyleType: 'none',
    padding: '30px 20px',
    margin: 0,
  },
  sidebarItem: {
    margin: '15px 0',
  },
  sidebarLink: {
    textDecoration: 'none',
    color: '#ffffff',
    display: 'block',
    fontWeight: 'bold',
    padding: '15px 20px',
    borderRadius: '10px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    cursor: 'pointer',
  },
  sidebarLinkHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.05)',
  },
  documentList: {
    listStyleType: 'none',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  documentItem: {
    padding: '12px 20px',
    borderBottom: '1px solid #ddd',
    color: '#333',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  mainContent: {
    marginLeft: '260px',
    padding: '20px',
    paddingTop: '80px',
    width: 'calc(100% - 260px)',
    backgroundColor: '#ffffff',
    transition: 'margin-left 0.3s ease',
  },
};

export default Menu;
