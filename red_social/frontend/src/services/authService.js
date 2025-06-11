const API_URL = 'http://localhost:5000/api/auth'

// Iniciar sesión
export async function loginUser({ correo, password }) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.msg || 'Error en login')
  }

  return data // { msg, token }
}

// Registrar usuario
export async function registerUser({ nombre, correo, password }) {
  const response = await fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, correo, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.msg || 'Error en registro')
  }

  return data // Puede incluir { msg, token }
}
