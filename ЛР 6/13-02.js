const net = require('net');

let PORT = 40000;
let HOST = '127.0.0.1';

var client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log(`Client CONNECT to server at ${HOST}:${PORT}\n`);

  const message = 'Hello from client';
  client.write(message);
  console.log(`Sent message to server: "${message}"\n`);
});

client.on('data', (data) => {
  const response = data.toString().trim();
  console.log(`Received response from server: "${response}"\n`);
  client.end();
});

client.on('end', () => {
  console.log('Disconnected from server\n');
});
