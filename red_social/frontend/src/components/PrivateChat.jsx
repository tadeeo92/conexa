import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const PrivateChat = ({ currentUserId, otherUserId, otherUserName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    // Registrar usuario actual para recibir mensajes
    socketRef.current.emit('register', currentUserId);

    // Escuchar mensajes entrantes
    socketRef.current.on('private_message', (message) => {
      setMessages((prev) => {
        // Evitar duplicados por timestamp y contenido
        if (prev.find(m => m.timestamp === message.timestamp && m.content === message.content)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    // Cargar historial de mensajes
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${SOCKET_SERVER_URL}/api/messages/${currentUserId}/${otherUserId}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      }
    };

    fetchMessages();

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUserId, otherUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: currentUserId,
      recipientId: otherUserId,
      content: newMessage,
    };

    // Enviar mensaje por socket
    socketRef.current.emit('private_message', messageData);

    try {
      // Guardar mensaje en backend
      await axios.post(`${SOCKET_SERVER_URL}/api/messages`, messageData);
      setMessages((prev) => [
        ...prev,
        { ...messageData, timestamp: new Date().toISOString() }
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', width: '400px' }}>
      <h3>Chat privado con {otherUserName || otherUserId}</h3>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '8px', marginBottom: '8px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.senderId === currentUserId ? 'right' : 'left', marginBottom: '6px' }}>
            <p style={{ margin: 0 }}>
              <b>{msg.senderId === currentUserId ? 'Tú' : otherUserName || 'Ellos'}:</b> {msg.content}
            </p>
            <small style={{ fontSize: '0.7rem', color: '#555' }}>
              {new Date(msg.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: '8px' }}
      />
      <button onClick={sendMessage} style={{ padding: '8px 12px', marginLeft: '8px' }}>Enviar</button>
    </div>
  );
};

export default PrivateChat;
