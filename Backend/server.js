const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const path = require('path'); // <--- agregar path para servir archivos estáticos
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Cambiar por dominio frontend en producción
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// SERVIR ARCHIVOS ESTÁTICOS DE uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas base
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts.routes');
const messageRoutes = require('./routes/message.routes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

// Ruta prueba
app.get('/', (req, res) => {
  res.send('🚀 Servidor funcionando');
});

// Map para usuarios online: userId -> socketId
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🟢 Usuario conectado: ', socket.id);

  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ Usuario ${userId} registrado con socketId ${socket.id}`);
  });

  socket.on('private_message', ({ senderId, recipientId, content }) => {
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('private_message', {
        senderId,
        content,
        timestamp: new Date(),
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Usuario desconectado:', socket.id);
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Conectar a MongoDB y levantar servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  });
