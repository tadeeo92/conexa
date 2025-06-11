import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserById, toggleFollow } from '../services/userService'

const OtherUserProfile = () => {
  const { id } = useParams() // id del usuario a visitar
  const token = localStorage.getItem('token')

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [siguiendo, setSiguiendo] = useState(false)

  const cargarUsuario = async () => {
    try {
      const data = await getUserById(id, token)
      setUser(data)
      setSiguiendo(data.teSigo || false) // el backend debe devolver esto
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFollow = async () => {
    try {
      await toggleFollow(id, token)
      setSiguiendo(!siguiendo)
    } catch (err) {
      alert('Error al seguir/dejar de seguir usuario')
    }
  }

  useEffect(() => {
    cargarUsuario()
  }, [id])

  if (loading) return <p>Cargando perfil...</p>
  if (error) return <p>Error: {error}</p>
  if (!user) return null

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{user.nombre}</h2>
      <p className="text-gray-600 mb-4">Email: {user.correo}</p>

      <button
        onClick={handleToggleFollow}
        className={`px-4 py-2 rounded text-white ${siguiendo ? 'bg-red-500' : 'bg-green-500'}`}
      >
        {siguiendo ? 'Dejar de seguir' : 'Seguir'}
      </button>
    </div>
  )
}

export default OtherUserProfile
