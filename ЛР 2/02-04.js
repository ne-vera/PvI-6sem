const http = require("http");
var fs = require("fs");

http.createServer(function(request,response){
    let xmlhttp = fs.readFileSync('./xmlhttprequest.html');
    if(request.url === '/xmlhttprequest'){ 
        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        response.end(xmlhttp);}
    else if(request.url === '/api/name'){ 
        response.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
        response.end("Пригодич Вера Валерьевна");}
    else {response.end();}
}).listen(5000, "127.0.0.1", function(){
    console.log("Сервер начал прослушивание запросов на порту 5000");
});