import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import PostPage from './pages/PostPage'
import MessagesPage from './pages/MessagesPage'
import OtherUserProfile from './pages/OtherUserProfile'
import FollowersPage from './pages/FollowersPage'
import FollowingPage from './pages/FollowingPage'
import Layout from './components/Layout' // 👈 nuevo

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [usuarioActualId, setUsuarioActualId] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUsuarioActualId(null)
  }

  useEffect(() => {
    const onStorageChange = () => {
      setToken(localStorage.getItem('token'))
    }
    window.addEventListener('storage', onStorageChange)
    return () => window.removeEventListener('storage', onStorageChange)
  }, [])

  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setUsuarioActualId(null)
        setLoadingAuth(false)
        return
      }
      try {
        const res = await fetch('http://localhost:5000/api/user/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Token inválido o expirado')
        const data = await res.json()
        setUsuarioActualId(data._id)
        setLoadingAuth(false)
      } catch (error) {
        localStorage.removeItem('token')
        setToken(null)
        setUsuarioActualId(null)
        setLoadingAuth(false)
      }
    }

    validarToken()
  }, [token])

  if (loadingAuth) return <p>Validando sesión...</p>

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Layout onLogout={handleLogout}>
                <HomePage token={token} usuarioActualId={usuarioActualId} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !token ? (
              <Layout showNavbar={false}>
                <LoginPage onLogin={setToken} />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/register"
          element={
            !token ? (
              <Layout showNavbar={false}>
                <RegisterPage onLogin={setToken} />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            token ? (
              <Layout onLogout={handleLogout}>
                <ProfilePage onLogout={handleLogout} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/posts"
          element={
            token ? (
              <Layout onLogout={handleLogout}>
                <PostPage token={token} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/messages"
          element={
            token ? (
              <Layout onLogout={handleLogout}>
                <MessagesPage token={token} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/user/:id"
          element={
            token ? (
              <Layout onLogout={handleLogout}>
                <OtherUserProfile token={token} usuarioActualId={usuarioActualId} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/followers/:userId"
          element={
            token ? (
              <Layout onLogout={handleLogout}>
                <FollowersPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/following/:userId"
          element={
            token ? (
              <Layout onLogout={handleLogout}>
                <FollowingPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
