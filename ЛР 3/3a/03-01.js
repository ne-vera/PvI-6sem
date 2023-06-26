var http = require("http");

const server = http.createServer(function(request,response){
process.stdin.setEncoding('utf-8');
response.write('<h1>norm</h1>');
var result = "norm";
process.stdin.on("readable", () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        if(chunk.trim() == 'norm') {
            process.stdout.write(`${result} -> norm\n`);
            result = "norm";
            response.write('<h1>norm</h1>');
        }
        else if(chunk.trim() == 'stop') {
            process.stdout.write(`${result} -> stop\n`);
            result = "stop";
            response.write('<h1>stop</h1>');
        }
        else if(chunk.trim() == 'test') {
            process.stdout.write(`${result} -> test\n`);
            result = "test";
            response.write('<h1>test</h1>');
        }
        else if(chunk.trim() == 'idle') {
            process.stdout.write(`${result} -> idle\n`);
            result = "idle";
            response.write('<h1>idle</h1>');
        }
        else if (chunk.trim() == 'exit') {
            process.exit(0);
        }
        else process.stdout.write("Wrong command\n");
    }
});
}).listen(5000);
console.log('server.listen(http://localhost:5000)');