const http = require("http");

http.createServer(function(request,response){
    if(request.url === '/api/name'){ 
        response.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
        response.end("Пригодич Вера Валерьевна");}
    else {response.end();}
}).listen(5000, "127.0.0.1",function(){
    console.log("Сервер начал прослушивание запросов на порту 5000");
});