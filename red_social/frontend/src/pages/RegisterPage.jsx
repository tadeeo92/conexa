import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/authService'

export default function RegisterPage({ onLogin }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!nombre || !correo || !password) {
      setError('Todos los campos son obligatorios')
      return
    }

    setLoading(true)

    try {
      const data = await registerUser({ nombre, correo, password })
      localStorage.setItem('token', data.token)

      onLogin(data.token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Error en el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>Registro</h1>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Enviando...</p>}

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="name"
        />

        <label htmlFor="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          autoComplete="username"
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <button type="submit" disabled={loading}>
          Registrarse
        </button>
      </form>

      <p className="bottom-text">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  )
}
