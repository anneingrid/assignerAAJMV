import React, { useContext, useState } from 'react';
import { AppContext } from '../Provider';
import Navbar from './Navbar';
import { FaHome, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';

function Menu() {
  const [showDocuments, setShowDocuments] = useState(false);
  const { usuarioLogado } = useContext(AppContext);

  const toggleDocuments = () => {
    setShowDocuments(!showDocuments);
  };

  const getFirstAndLastName = (nomeCompleto) => {
    const nomeArray = nomeCompleto.split(' ');
    if (nomeArray.length > 1) {
      return `${nomeArray[0]} ${nomeArray[nomeArray.length - 1]}`;
    }
    return nomeCompleto;
  };

  return (
    <div style={styles.dashboardContainer}>
      <Navbar />

      <div style={styles.sidebar}>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarItem}>
            <a href="#home" style={styles.sidebarLink}>
              <FaHome style={styles.icon} /> Home
            </a>
          </li>
          <li style={styles.sidebarItem}>
            <a href="#documents" style={styles.sidebarLink} onClick={toggleDocuments}>
              <FaFileAlt style={styles.icon} /> Documentos
            </a>
            {showDocuments && (
              <ul style={styles.documentList}>
                <li style={styles.documentItem}>Documentos Assinados</li>
                <li style={styles.documentItem}>Documentos Não Assinados</li>
              </ul>
            )}
          </li>
          <li style={styles.sidebarItem}>
            <a href="#logout" style={styles.sidebarLink}>
              <FaSignOutAlt style={styles.icon} /> Sair
            </a>
          </li>
        </ul>

        <div style={styles.userInfo}>
          <img
            src="/Avatar.png"  // URL para o avatar genérico. Substitua pela URL do avatar real.
            alt="Avatar"
            style={styles.avatar}
          />
          <h3 style={styles.userName}>
            {usuarioLogado ? getFirstAndLastName(usuarioLogado.nome_usuario) : 'Usuário'}
          </h3>
          <span style={styles.userRole}>Admin</span>
        </div>
      </div>

      <div style={styles.mainContent}>
        <h2 style={styles.pageTitle}>Dashboard Principal</h2>
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    height: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f4f7fc',
  },
  sidebar: {
    width: '250px',
    background: 'linear-gradient(180deg, #4B9CE2 0%, #6FC3E9 100%)',
    color: '#ecf0f1',
    padding: '20px',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  userName: {
    fontSize: '1.5rem',
    marginBottom: '5px',
  },
  userRole: {
    fontSize: '0.9rem',
    color: '#bdc3c7',
  },
  sidebarList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    marginBottom: '20px',
  },
  sidebarLink: {
    textDecoration: 'none',
    color: '#ecf0f1',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
    padding: '10px 15px',
    borderRadius: '10px',
    transition: 'background-color 0.3s ease',
  },
  icon: {
    marginRight: '10px',
  },
  documentList: {
    listStyleType: 'none',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#34495e',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  documentItem: {
    padding: '10px 20px',
    color: '#ecf0f1',
    cursor: 'pointer',
    borderBottom: '1px solid #7f8c8d',
  },
  mainContent: {
    marginLeft: '250px',
    padding: '40px',
    width: 'calc(100% - 250px)',
    backgroundColor: '#E3F2FD',
    height: '100vh',
    overflowY: 'scroll',
  },
  pageTitle: {
    fontSize: '2rem',
    color: '#2c3e50',
  },
};

export default Menu;
