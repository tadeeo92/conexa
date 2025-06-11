import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function UserList({ currentUserId, token, onSelectUser }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const filteredUsers = res.data.filter(user => user._id !== currentUserId)
        setUsers(filteredUsers)
      } catch (error) {
        console.error('Error al obtener usuarios:', error)
      }
    }
    if (token) fetchUsers()
  }, [currentUserId, token])

  const containerStyle = {
    width: '260px',
    borderRight: '1px solid #ccc',
    padding: '12px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#fafafa',
    height: '100vh',
    boxSizing: 'border-box',
    overflowY: 'auto',
  }

  const headingStyle = {
    marginBottom: '12px',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  }

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }

  const itemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  }

  const itemHover = e => (e.currentTarget.style.backgroundColor = '#e0e7ff')
  const itemUnhover = e => (e.currentTarget.style.backgroundColor = 'transparent')

  return (
    <aside style={containerStyle}>
      <h3 style={headingStyle}>Usuarios</h3>
      <ul style={listStyle}>
        {users.map(user => (
          <li
            key={user._id}
            style={itemStyle}
            onClick={() => onSelectUser(user)}
            onMouseOver={itemHover}
            onMouseOut={itemUnhover}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter') onSelectUser(user)
            }}
          >
            {user.nombre}
          </li>
        ))}
      </ul>
    </aside>
  )
}
