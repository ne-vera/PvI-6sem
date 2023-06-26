const http = require("http");
const url = require("url");
const fs = require("fs");
const nodemailer = require("nodemailer");
const {parse} =require('querystring');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const server = http.createServer().listen(5000);
console.log("http://localhost:5000/");


server.on("request", (req, res) => {
    const path = url.parse(req.url).pathname;

    if (path === "/" && req.method === "GET") {
        fs.readFile("06-02.html", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else if (path === "/" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        
        req.on("end", () => {
            let params = parse(body);
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: params.sender,
                    pass: params.password,
                },
            });
            
            const options = {
                from: params.sender,
                to: params.receiver,
                subject: "Lab №5 task-2",
                text: params.message,
            };
            
            transporter.sendMail(options, (err, info) => {
                err ? console.log(err):console.log('Email sent')
            })
            
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<h1>${params.message}</h1>`);
        })
    }
});