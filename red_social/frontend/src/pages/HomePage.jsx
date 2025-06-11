// src/pages/HomePage.jsx
import { useEffect, useState } from 'react'
import { fetchPosts, toggleLikePost } from '../services/postService'
import Post from '../components/Post'

export default function HomePage({ token, usuarioActualId }) {
  const [posts, setPosts] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const obtenerPosts = async () => {
      setCargando(true)
      setError(null)

      try {
        const datos = await fetchPosts(token)
        setPosts(datos)
      } catch (err) {
        setError('Error al cargar publicaciones')
      } finally {
        setCargando(false)
      }
    }

    if (token) {
      obtenerPosts()
    } else {
      setCargando(false)
      setPosts([])
    }
  }, [token])

  const manejarLikeToggle = async (postId) => {
    try {
      const nuevasLikes = await toggleLikePost(postId, token)
      if (nuevasLikes) {
        setPosts(posts.map(post =>
          post._id === postId ? { ...post, likes: nuevasLikes } : post
        ))
        return nuevasLikes
      }
    } catch (error) {
      console.error('Error al dar/quitar like:', error)
    }
    return null
  }

  if (cargando) return <p>Cargando publicaciones...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Feed de Publicaciones</h1>
      {posts.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        posts.map(post => (
          <Post
            key={post._id}
            post={post}
            usuarioActualId={usuarioActualId}
            onLikeToggle={manejarLikeToggle}
            token={token}
          />
        ))
      )}
    </div>
  )
}
