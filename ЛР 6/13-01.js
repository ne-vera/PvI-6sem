const net = require('net');

let HOST = '0.0.0.0'
let PORT = 40000;

net.createServer((socket) => {
  console.log(`Server CONNECT to client at: ${socket.remoteAddress}:${socket.remotePort}\n`);

  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Received message from client: "${message}"`);

    const response = `ECHO: ${message}`;
    socket.write(response);
    console.log(`Sent response to client: "${response}"\n`);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
}).listen(PORT, () => {
  console.log(`TCP-сервер ${HOST}:${PORT}\n`);
});
