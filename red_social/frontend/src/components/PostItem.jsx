import { Link } from 'react-router-dom'

const PostItem = ({ post, obtenerPosts, onEditar }) => {
  const token = localStorage.getItem('token')

  const handleEliminar = async () => {
    const confirmar = confirm('¿Seguro que quieres eliminar este post?')
    if (!confirmar) return

    try {
      await fetch(`http://localhost:5000/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      obtenerPosts()
    } catch (error) {
      console.error('Error al eliminar post:', error)
    }
  }

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <div className="mb-2 text-sm text-gray-600">
        <Link
          to={`/user/${post.autor?._id}`}
          className="text-blue-500 hover:underline"
        >
          {post.autor?.nombre || 'Usuario'}
        </Link>
      </div>

      <p className="mb-2">{post.contenido}</p>

      <div className="flex justify-end space-x-2 text-sm text-blue-500">
        <button onClick={() => onEditar(post)} className="hover:underline">
          Editar
        </button>
        <button
          onClick={handleEliminar}
          className="text-red-500 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default PostItem
