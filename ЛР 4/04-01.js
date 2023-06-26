var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./db.js');
var db = new data.DB();

let countRequest = 0, countCommit = 0;
let timerSd = null, timerSc = null, timerSs = null;
let startTime = null, endTime = null;

process.stdin.unref();
db.on('GET', (request, response) => {
    console.log('GET');
    response.end(JSON.stringify(db.get()));
});
db.on('POST', (request, response) => {
    console.log('POST');
    request.on('data', data => 
    {
        let row = JSON.parse(data);
        db.post(row);
        response.end(JSON.stringify(row));
    });
});
db.on('DELETE', (request, response) => {
    console.log('DELETE');
    if (typeof url.parse(request.url, true).query.id != "undefined")
    {
        id = parseInt(url.parse(request.url, true).query.id);
        console.log("ID = " + id);
        if (Number.isInteger(id))
            response.end(JSON.stringify(db.delete(id)));
        else 
            response.end("Error! Id parameter is not a number");
    }
    else{
        request.on('data', data => 
        {
            let row = JSON.parse(data);
            db.delete(row.id);
            console.log(row);
            response.end(JSON.stringify(row));
        });
    } //response.end("Error! The Id parameter is missing");
});
db.on('PUT', (request, response) => {
    console.log('PUT');
    request.on('data', data => 
    {
        let row = JSON.parse(data);
        db.put(row);
        console.log(row);
        response.end(JSON.stringify(row));
    });
});
db.on('COMMIT',(request, response) => {
    console.log('COMMIT');
    countCommit++;
    db.commit();
});

let server = http.createServer(function (request, response) {
    if (url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./04-02.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    else if (url.parse(request.url).pathname === '/api/db')
    {
        countRequest++;
        db.emit(request.method, request, response);
    }
}).listen(5000);

console.log('http://localhost:5000\n'+'http://localhost:5000/api/db\n');
