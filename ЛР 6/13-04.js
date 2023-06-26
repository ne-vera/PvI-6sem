const net = require('net');

const HOST = 'localhost';
const PORT = parseInt(process.argv[2]);

const x = parseInt(process.argv[3]);

const client = new net.Socket();
let subtotal = 0;

client.connect(PORT, HOST, () => {
    console.log(`Подключен к серверу ${HOST}:${PORT}`);
    
    setInterval(() => {
        console.log(`Отправка серверу числа ${x}`);
        client.write(Buffer.alloc(4, x)); // 4-байтный буфер для 32-битного числа
    }, 1000);
});

client.on('data', (data) => {subtotal = parseInt(data); console.log(`Полученная от сервера промежуточная сумма: ${subtotal}`);});
client.on('close', () => {console.log('Закрыто соединение с сервером');});
