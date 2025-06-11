import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/authService'

export default function LoginPage({ onLogin }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!correo) {
      setError('El correo es obligatorio')
      return
    }
    if (!password) {
      setError('La contraseña es obligatoria')
      return
    }

    setLoading(true)

    try {
      const data = await loginUser({ correo, password })
      localStorage.setItem('token', data.token)

      onLogin(data.token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Error en el login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>Iniciar sesión</h1>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Enviando...</p>}

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          autoComplete="username"
          disabled={loading}
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p>
        ¿No tienes una cuenta?{' '}
        <Link to="/register">
          Regístrate aquí
        </Link>
      </p>
    </div>
  )
}
