import React from 'react'
import Navbar from './NavBar'

const Layout = ({ children, showNavbar = true, onLogout }) => {
  return (
    <>
      {showNavbar && <Navbar onLogout={onLogout} />}
      <main className={showNavbar ? 'layout-main' : 'layout-center'}>
        {children}
      </main>
    </>
  )
}

export default Layout
