import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ onLogout }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogoutClick = () => {
    onLogout()
    navigate('/login')
  }

  const styles = {
    navbar: {
      padding: '10px 20px',
      backgroundColor: '#111',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 100,
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
    },
    logoImage: {
      height: '36px',
      cursor: 'pointer',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '16px',
      padding: '8px 12px',
      borderRadius: '4px',
      transition: 'background-color 0.3s, color 0.3s',
      cursor: 'pointer',
    },
    button: {
      backgroundColor: '#e74c3c',
      border: 'none',
      padding: '6px 14px',
      color: 'white',
      cursor: 'pointer',
      borderRadius: '4px',
      fontWeight: 'bold',
      fontSize: '14px',
      marginTop: '8px',
      transition: 'background-color 0.3s',
      flexShrink: 0,
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '28px',
      cursor: 'pointer',
      display: 'none', // visible solo en móvil por media query abajo
      padding: 0,
      marginLeft: 'auto',
    },
    mobileMenu: {
      display: menuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      position: 'absolute',
      top: '60px',
      left: 0,
      right: 0,
      backgroundColor: '#111',
      padding: '10px 20px',
      gap: '10px',
      borderBottom: '2px solid #e74c3c',
      zIndex: 99,
    },
  }

  return (
    <>
      <style>{`
        /* Media Queries para responsividad */
        @media (max-width: 767px) {
          .menu-desktop {
            display: none !important;
          }
          .menu-button {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-menu {
            display: none !important;
          }
        }
        /* Hover para links */
        a:hover {
          background-color: #e74c3c;
          color: white;
        }
        button.logout:hover {
          background-color: #c0392b !important;
        }
      `}</style>

      <nav style={styles.navbar}>
        <div style={styles.leftSection} className="menu-desktop">
          <Link to="/">
            <img src="/logo.png" alt="QConexa Logo" style={styles.logoImage} />
          </Link>
          <Link to="/" style={styles.link}>Feed</Link>
          <Link to="/messages" style={styles.link}>Mensajes</Link>
          <Link to="/profile" style={styles.link}>Perfil</Link>
          <Link to="/posts" style={styles.link}>Crear Post</Link>
        </div>

        {/* Botón hamburguesa solo visible en móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={styles.menuBtn}
          className="menu-button"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Menú móvil */}
        <div style={styles.mobileMenu} className="mobile-menu">
          <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>Feed</Link>
          <Link to="/messages" style={styles.link} onClick={() => setMenuOpen(false)}>Mensajes</Link>
          <Link to="/profile" style={styles.link} onClick={() => setMenuOpen(false)}>Perfil</Link>
          <Link to="/posts" style={styles.link} onClick={() => setMenuOpen(false)}>Crear Post</Link>
          <button
            onClick={() => {
              setMenuOpen(false)
              handleLogoutClick()
            }}
            style={styles.button}
            className="logout"
          >
            Logout
          </button>
        </div>

        {/* Botón logout visible solo en desktop */}
        <button
          onClick={handleLogoutClick}
          style={{ ...styles.button, marginTop: 0 }}
          className="menu-desktop logout"
        >
          Logout
        </button>
      </nav>
    </>
  )
}
