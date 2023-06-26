const http = require("http");
var fs = require("fs");

http.createServer(function(request,response){
    let html = fs.readFileSync('./index.html');
    if(request.url === '/html'){ 
        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        response.end(html);}
    else {response.end();}
}).listen(5000, "127.0.0.1",function(){
    console.log("Сервер начал прослушивание запросов на порту 5000");
});