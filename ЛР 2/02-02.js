const http = require("http");
var fs = require("fs");

http.createServer(function(request,response){
    let pic = fs.readFileSync('./pic.jpg');
    if(request.url === '/png'){ 
        response.end(pic);}
    else {response.end();}
}).listen(5000, "127.0.0.1",function(){
    console.log("Сервер начал прослушивание запросов на порту 5000");
});