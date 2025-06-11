import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Si decides crear un archivo CSS aparte, importa aquí:
// import './ProfilePage.css';

export default function ProfilePage({ onLogout }) {
  const [perfil, setPerfil] = useState(null);
  const [imagen, setImagen] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Error al obtener perfil');
        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        console.error('Error al obtener perfil:', err);
      }
    };

    fetchPerfil();
  }, [token]);

  const handleImagenChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imagen) return;

    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
      const res = await fetch('http://localhost:5000/api/user/upload-profile-pic', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      alert(data.message);

      setPerfil((prev) => ({ ...prev, fotoPerfil: data.fotoPerfil }));
    } catch (err) {
      console.error('Error al subir la imagen:', err);
    }
  };

  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      <div className="profile-info">
        <p><strong>Nombre:</strong> {perfil.nombre}</p>
        <p><strong>Correo:</strong> {perfil.correo}</p>
      </div>

      {perfil.fotoPerfil && (
        <img
          src={`http://localhost:5000${perfil.fotoPerfil}`}
          alt="Foto de perfil"
          className="profile-picture"
        />
      )}

      <div className="follow-links">
        <Link to={`/followers/${perfil._id}`}>
          Seguidores ({perfil.followers?.length ?? 0})
        </Link>
        <Link to={`/following/${perfil._id}`}>
          Siguiendo ({perfil.following?.length ?? 0})
        </Link>
      </div>

      <form onSubmit={handleUpload} className="upload-form">
        <input type="file" accept="image/*" onChange={handleImagenChange} />
        <button type="submit">Subir nueva foto</button>
      </form>

      <button onClick={onLogout} className="logout-button">Cerrar sesión</button>
    </div>
  );
}
