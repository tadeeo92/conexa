// src/components/PostForm.jsx
import { useState, useEffect } from 'react';

const PostForm = ({ obtenerPosts, modoEdicion, postAEditar, cancelarEdicion }) => {
  const [contenido, setContenido] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (modoEdicion && postAEditar) {
      setContenido(postAEditar.contenido);
    } else {
      setContenido('');
    }
  }, [modoEdicion, postAEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = modoEdicion
      ? `http://localhost:5000/api/posts/${postAEditar._id}`
      : 'http://localhost:5000/api/posts';

    const metodo = modoEdicion ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido }),
      });

      setContenido('');
      obtenerPosts();
      if (modoEdicion) cancelarEdicion();
    } catch (error) {
      console.error('Error al guardar post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-md">
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows="3"
        placeholder="¿Qué estás pensando?"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        required
      ></textarea>
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {modoEdicion ? 'Actualizar' : 'Publicar'}
        </button>
        {modoEdicion && (
          <button
            type="button"
            onClick={cancelarEdicion}
            className="text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
