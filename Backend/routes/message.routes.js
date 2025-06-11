const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Guardar un nuevo mensaje
router.post('/', async (req, res) => {
  const { senderId, recipientId, content } = req.body;

  try {
    const newMessage = new Message({ senderId, recipientId, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error guardando mensaje:', error);
    res.status(500).json({ message: 'Error guardando mensaje' });
  }
});

// Obtener mensajes entre dos usuarios
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, recipientId: user2 },
        { senderId: user2, recipientId: user1 }
      ]
    }).sort({ timestamp: 1 }); // orden cronológico ascendente

    res.json(messages);
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ message: 'Error obteniendo mensajes' });
  }
});

module.exports = router;
