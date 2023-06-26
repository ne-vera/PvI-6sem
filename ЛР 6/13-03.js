const net = require('net');

const PORT1 = 40000;
const PORT2 = 50000;

const server1 = net.createServer((socket) => {
    console.log(`Клиент ${socket.remoteAddress}:${socket.remotePort} подключился к порту ${PORT1}`);
    let sum = 0;
    socket.on('data', (data) => {
        const num = data.readInt32BE();
        console.log(`Получено число ${num} от клиента ${socket.remoteAddress}:${socket.remotePort}`);
        sum += num;
    });
    setInterval(() => {
        const subtotal = sum;
        console.log(`Отправка промежуточнрй суммы ${subtotal} клиенту ${socket.remoteAddress}:${socket.remotePort}`);
        socket.write(subtotal.toString());
    }, 5000);
    socket.on('end', () => {
        console.log(`Клиент ${socket.remoteAddress}:${socket.remotePort} отключился от порта ${PORT1}`);
    });
});

const server2 = net.createServer((socket) => {
    console.log(`Клиент ${socket.remoteAddress}:${socket.remotePort} подключился к порту ${PORT2}`);
    let sum = 0;
    socket.on('data', (data) => {
        const num = data.readInt32BE();
        console.log(`Получено число ${num} от клиента ${socket.remoteAddress}:${socket.remotePort}`);
        sum += num;
    });
    setInterval(() => {
        const subtotal = sum;
        console.log(`Отправка промежуточной суммы ${subtotal} клиенту ${socket.remoteAddress}:${socket.remotePort}`);
        socket.write(subtotal.toString());
    }, 5000);
    socket.on('end', () => {
        console.log(`Клиент ${socket.remoteAddress}:${socket.remotePort} отключился от порта ${PORT2}`);
    });
});

server1.listen(PORT1, () => {console.log(`Сервер №1 прослушивает порт ${PORT1}`);});
server2.listen(PORT2, () => {console.log(`Сервер №2 прослушивает порт ${PORT2}`);});