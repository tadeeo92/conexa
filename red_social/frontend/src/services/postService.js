// src/services/postService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function fetchPosts(token) {
  const res = await fetch(`${API_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    throw new Error('Error al obtener publicaciones')
  }
  return res.json()
}

export async function toggleLikePost(postId, token) {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    throw new Error('Error al dar o quitar like')
  }
  const data = await res.json()
  return data.likes
}
