import React from 'react';

function Navbar({ visible }) {
  return (
    <nav style={{ 
        ...styles.navbar, 
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out'
      }}>
      <h1 style={styles.navbarTitle}>🔐Bem-vindo ao Sistema</h1>
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '60px',
    backgroundColor: '#4B9CE2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  navbarTitle: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
};

export default Navbar;
