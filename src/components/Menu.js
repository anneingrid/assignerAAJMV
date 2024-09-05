import React, { useContext, useState } from 'react';
import { AppContext } from '../Provider';
import { FaFileAlt, FaSignOutAlt, FaKey, FaSignature } from 'react-icons/fa'; 

function Menu({ setActiveScreen }) {
  const { usuarioLogado } = useContext(AppContext);
  
  const getFirstAndLastName = (nomeCompleto) => {
    const nomeArray = nomeCompleto.split(' ');
    if (nomeArray.length > 1) {
      return `${nomeArray[0]} ${nomeArray[nomeArray.length - 1]}`;
    }
    return nomeCompleto;
  };

  return (
    <div style={styles.sidebar}>
      <ul style={styles.sidebarList}>
        <li style={styles.sidebarItem} onClick={() => setActiveScreen('GerarChaves')}>
          <a href="#gerar-chaves" style={styles.sidebarLink}>
            <FaKey style={styles.icon} /> Gerar Chaves
          </a>
        </li>
        <li style={styles.sidebarItem} onClick={() => setActiveScreen('Assinar')}>
          <a href="#assinar" style={styles.sidebarLink}>
            <FaSignature style={styles.icon} /> Assinar
          </a>
        </li>
        <li style={styles.sidebarItem} onClick={() => setActiveScreen('Documentos')}>
          <a href="#documentos" style={styles.sidebarLink}>
            <FaFileAlt style={styles.icon} /> Documentos
          </a>
        </li>

        <li style={styles.sidebarItem}>
          <a href="#logout" style={styles.sidebarLink}>
            <FaSignOutAlt style={styles.icon} /> Sair
          </a>
        </li>
      </ul>

      <div style={styles.userInfo}>
          <img
            src="/avatar.png" 
            alt="Avatar"
            style={styles.avatar}
          />
          <h3 style={styles.userName}>
            {usuarioLogado ? getFirstAndLastName(usuarioLogado.nome_usuario) : 'Usuário'}
          </h3>
          <span style={styles.userRole}>Admin</span>
        </div>
    </div>
  );
}

const styles = {
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
    cursor: 'pointer',
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

};

export default Menu;
