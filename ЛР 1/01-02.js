const http = require("http");
http.createServer(function(request,response){
     
    let b = '';
    request.on('data',str=>{b += str; console.log('data', b);});
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.on('end', ()=> response.end (
        '<!DOCTYPE html><html><head></head>'+
        '<body>' + 
        '<h1>Структура запроса</h1>'+
        '<h2>' + 'Метод: ' + request.method + '</h2>' + 
        '<h2>' + 'Uri: ' + request.url + '</h2>' +
        '<h2>' + 'Версия: ' + request.httpVersion + '</h2>' + 
        '<h2>' + 'Заголовки: ' + '</h2>' + JSON.stringify(request.headers) + 
        '<h2>' + 'Тело: ' + b + '</h2>' +
        '</body>' + 
        '</html>'
    ));

}).listen(3001, "127.0.0.1",function(){
    console.log("Сервер начал прослушивание запросов на порту 3000");
});