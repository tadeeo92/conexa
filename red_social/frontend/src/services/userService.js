const API_URL = 'http://localhost:5000/api/user';

// Obtener el perfil del usuario autenticado
export async function getUserProfile(token) {
  const response = await fetch(`${API_URL}/perfil`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener perfil');
  }

  return await response.json();
}

// Obtener todos los usuarios excepto el actual
export async function getOtherUsers(token) {
  const response = await fetch(`${API_URL}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener usuarios');
  }

  return await response.json();
}

// Obtener perfil de otro usuario por ID (incluye si ya lo sigues)
export async function getUserById(id, token) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener el usuario');
  }

  return await response.json();
}

// Seguir o dejar de seguir a un usuario
export async function toggleFollow(id, token) {
  const response = await fetch(`${API_URL}/follow/${id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al seguir/dejar de seguir al usuario');
  }

  return await response.json();
}

// Obtener lista completa de seguidores (usuarios que siguen a este usuario)
export async function getFollowers(userId, token) {
  const response = await fetch(`${API_URL}/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener seguidores');
  }

  return (await response.json()).followers; // Ya incluye usuarios completos
}

// Obtener lista completa de seguidos (usuarios a los que sigue este usuario)
export async function getFollowing(userId, token) {
  const response = await fetch(`${API_URL}/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener seguidos');
  }

  return (await response.json()).following; // Ya incluye usuarios completos
}
