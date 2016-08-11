var config = require("./serverConfig");

var express = require('express'),
    app = express(),
    port = config.frontendConfig.port;

app.use(express.static("./public"));
app.listen(port);