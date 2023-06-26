const udp = require('dgram');
const HOST = 'localhost';
const PORT = 4000;

let client = udp.createSocket('udp4');

client.on('error', error => {console.log('Ошибка: ' + error.message); client.close();});

let message = process.argv[2] ? process.argv[2] : 'Hello from client';

client.on('message', msg => {
    console.log(`Client: от сервера получено "${msg.toString()}"`);
    console.log(`Client: получено ${msg.length} байт(а)`);
});

client.send(message, PORT, HOST, error => {
    if (error) {
        console.log('Ошибка: ' + error.message);
        client.close();
    }
    else
        console.log('\nClient: сообщение отправлено серверу');
});

client.on('close', () => { console.log('Closed'); });