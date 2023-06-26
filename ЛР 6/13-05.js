const udp = require('dgram');
const PORT = 4000;

let server = udp.createSocket('udp4');

server.on('error', error => {console.log('Ошибка: ' + error.message); server.close();});

server.on('message', (msg, info) => {

    console.log(`Server: от клиента получено: "${msg.toString()}"`);
    console.log(`Server: получено ${msg.length} байт(а) от ${info.address}:${info.port}`);
    
    server.send(`ECHO: ${msg.toString()}`, info.port, info.address, error => {
        if (error) {
            console.log('Ошибка: ' + error.message);
            server.close();
        }
        else
            console.log('Server: Данные отправлены клиенту\n');
    })
})

server.on('listening', () => {
    console.log(`Server: слушает порт        ${server.address().port}`);
    console.log(`Server: IP сервера          ${server.address().address}`);
    console.log(`Server: семейство(IP4/IP6)  ${server.address().family}\n`);
});

server.on('close', () => { console.log('Server: сокет закрыт'); });

server.bind(PORT);