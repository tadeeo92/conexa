import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowing } from '../services/userService';

export default function FollowingPage() {
  const { userId } = useParams();
  const token = localStorage.getItem('token');

  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        setLoading(true);
        setError(null);

        // Ahora el backend devuelve directamente los usuarios seguidos con todos sus datos
        const followingData = await getFollowing(userId, token);
        setFollowing(followingData);
      } catch (err) {
        setError(err.message || 'Error al cargar usuarios seguidos');
      } finally {
        setLoading(false);
      }
    }

    fetchFollowing();
  }, [userId, token]);

  if (loading) return <p>Cargando usuarios seguidos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (following.length === 0) return <p>No sigue a ningún usuario aún.</p>;

  return (
    <div>
      <h2>Usuarios Seguidos</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {following.map(user => (
          <li
            key={user._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '8px'
            }}
          >
            <img
              src={user.fotoPerfil || '/default-profile.png'}
              alt={`Foto de ${user.nombre}`}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <span>{user.nombre}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
