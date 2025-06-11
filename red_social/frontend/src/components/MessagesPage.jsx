import React from 'react';
import UserList from '../components/UserList';

const MessagesPage = ({ currentUserId }) => {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Mensajes Privados</h1>
      <UserList currentUserId={currentUserId} />
    </div>
  );
};

export default MessagesPage;
