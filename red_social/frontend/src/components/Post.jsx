import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Post({ post, usuarioActualId, onLikeToggle }) {
  const [likes, setLikes] = useState(post.likes || [])

  const yaDioLike = likes.some(id => id.toString() === usuarioActualId)

  const toggleLike = async () => {
    const nuevasLikes = await onLikeToggle(post._id)
    if (nuevasLikes) {
      setLikes(nuevasLikes)
    }
  }

  const containerStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }

  const contentStyle = {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '8px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  }

  const authorStyle = {
    fontSize: '0.85rem',
    color: '#555',
    marginBottom: '4px',
  }

  const linkStyle = {
    textDecoration: 'none',
    color: '#2563eb',
    fontWeight: '600',
  }

  const dateStyle = {
    fontSize: '0.75rem',
    color: '#999',
  }

  const buttonStyle = {
    cursor: 'pointer',
    backgroundColor: yaDioLike ? '#f87171' : '#60a5fa',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    marginTop: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  }

  return (
    <div style={containerStyle}>
      <p style={contentStyle}>{post.contenido}</p>
      <p style={authorStyle}>
        Publicado por{' '}
        <strong>
          <Link to={`/user/${post.autor._id}`} style={linkStyle}>
            {post.autor.nombre}
          </Link>
        </strong>
      </p>
      <p style={dateStyle}>{new Date(post.fechaCreacion).toLocaleString()}</p>

      <button
        onClick={toggleLike}
        style={buttonStyle}
        onMouseOver={e => {
          e.currentTarget.style.backgroundColor = yaDioLike ? '#dc6b6b' : '#3b82f6'
        }}
        onMouseOut={e => {
          e.currentTarget.style.backgroundColor = yaDioLike ? '#f87171' : '#60a5fa'
        }}
        aria-label={yaDioLike ? 'Quitar like' : 'Dar like'}
      >
        {yaDioLike ? '💔 Quitar Like' : '❤️ Dar Like'} ({likes.length})
      </button>
    </div>
  )
}
