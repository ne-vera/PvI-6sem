const http = require('http');
const url = require('url');
const fs = require('fs');

var factorial = function(n) {
   return (n > 1) ? n * factorial(n - 1) : 1;
}

function Factor(n, cb) {
    this.fact=factorial;
    this.calc= ()=>{setImmediate(()=>{cb(null, this.fact(n));});}
}

const server = http.createServer(function (request, response) {
    let rc = JSON.stringify({ k : 0 , fact:0});
    if (url.parse(request.url).pathname === '/fact') {
        console.log(request.url);
        var k = url.parse(request.url, true).query.k;
        if (k.toString() == "x") {
            fs.readFile("./03-03.html", (err, data) => {
                response.end(data);
            });
        }
        else if (typeof url.parse(request.url, true).query.k != 'undefined') {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, {'Content-Type' : 'application/json'});
                let f=new Factor(k,(err,result)=>{response.end(JSON.stringify({ k:k , fact : result}));});
                f.calc();
            }
        }
    }
    else {response.end(rc);}
}).listen(5000)

console.log('server.listen(http://localhost:5000/fact?k=x)');