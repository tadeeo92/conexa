import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowers } from '../services/userService';

export default function FollowersPage() {
  const { userId } = useParams();
  const token = localStorage.getItem('token');

  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFollowers() {
      try {
        setLoading(true);
        setError(null);

        // El backend ya devuelve un arreglo de usuarios completos
        const followersData = await getFollowers(userId, token);
        setFollowers(followersData);
      } catch (err) {
        setError(err.message || 'Error al cargar seguidores');
      } finally {
        setLoading(false);
      }
    }

    fetchFollowers();
  }, [userId, token]);

  if (loading) return <p>Cargando seguidores...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (followers.length === 0) return <p>No tiene seguidores aún.</p>;

  return (
    <div>
      <h2>Seguidores</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {followers.map(user => (
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
