import React, { useEffect, useState } from 'react';
import { getUserProfile, getOtherUsers } from '../services/userService';
import PrivateChat from '../components/PrivateChat';

const MessagesPage = ({ token }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getUserProfile(token);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getOtherUsers(token);
        const filtered = currentUser
          ? allUsers.filter(u => u._id !== currentUser._id)
          : allUsers;
        setUsers(filtered);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [token, currentUser]);

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
        <h3>Usuarios</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map(user => (
            <li
              key={user._id}
              style={{
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: selectedUser?._id === user._id ? '#e0e0e0' : 'transparent'
              }}
              onClick={() => setSelectedUser(user)}
            >
              {user.nombre || user.correo}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '70%', paddingLeft: '10px' }}>
        {selectedUser ? (
          <PrivateChat
            currentUserId={currentUser?._id}
            otherUserId={selectedUser._id}
            otherUserName={selectedUser.nombre || selectedUser.correo}
          />
        ) : (
          <p>Selecciona un usuario para chatear</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
