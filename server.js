var express = require('express');

var app = express();
var port = 8080;

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
})

app.post("/upload", function(req, res){
    console.log(req.url);
    res.header('Access-Control-Allow-Origin', null);
    res.sendStatus(200)
});

app.get("/test", function(req, res){
    console.log(req.url);
    res.header('Access-Control-Allow-Origin', '*');
    res.json(new Date());
});

app.listen(port);

console.log("App listening on port " + port);
