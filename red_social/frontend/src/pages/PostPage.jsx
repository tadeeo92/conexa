import { useEffect, useState } from 'react'
import PostForm from '../components/PostForm'
import PostItem from '../components/PostItem'

const PostPage = ({ token }) => {
  const [posts, setPosts] = useState([])
  const [usuarioId, setUsuarioId] = useState(null)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [postAEditar, setPostAEditar] = useState(null)

  // Obtener usuario autenticado
  const obtenerUsuario = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/perfil', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('No autorizado')
      const data = await res.json()
      setUsuarioId(data._id)
    } catch (error) {
      console.error('Error al obtener usuario:', error)
    }
  }

  // Obtener posts del usuario autenticado
  const obtenerPosts = async () => {
    if (!usuarioId) return
    try {
      const res = await fetch(`http://localhost:5000/api/posts/usuario/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('Error al obtener posts')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Error al cargar posts:', error)
    }
  }

  useEffect(() => {
    if (token) {
      obtenerUsuario()
    }
  }, [token])

  useEffect(() => {
    if (usuarioId) {
      obtenerPosts()
    }
  }, [usuarioId])

  const handleEditar = (post) => {
    setModoEdicion(true)
    setPostAEditar(post)
  }

  const handleCancelEdit = () => {
    setModoEdicion(false)
    setPostAEditar(null)
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Mis Publicaciones</h1>

      <PostForm
        obtenerPosts={obtenerPosts}
        modoEdicion={modoEdicion}
        postAEditar={postAEditar}
        cancelarEdicion={handleCancelEdit}
      />

      <div className="mt-6 space-y-4">
        {posts.length === 0 && <p>No tienes publicaciones aún.</p>}
        {posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            obtenerPosts={obtenerPosts}
            onEditar={handleEditar}
          />
        ))}
      </div>
    </div>
  )
}

export default PostPage
