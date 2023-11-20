const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {
    const filePath = path.join(__dirname, request.url === '/' ? 'index.html' : request.url);
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    switch (ext) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        // Add more content types as needed
    }
    fs.readFile(filePath, function(error, content) {
        if (error) {
            response.writeHead(404);
            response.end('File not found');
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}).listen(8000);
