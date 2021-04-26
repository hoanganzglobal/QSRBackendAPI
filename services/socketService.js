const socketIo = require('socket.io');

class SocketService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: 'http://localhost:7007',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 60000
    });
    this.io.on('connection', (socket) => {
      socket.on('userLoggedIn', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
      });
    });
  }

  emiter(event, body) {
    this.io.emit(event, body);
  }
}

module.exports = SocketService;
