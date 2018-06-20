var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
//WEBSOCKET
var WebSocketServer = require('ws').Server;
var wsport = 8087;
var wss = new WebSocketServer({port: wsport});
var messages = [];


//AMQP
var amqp = require('amqplib/callback_api');



var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


//DATABASE
var configDB = require('./config/database.js');
const mongoOptions ={
    useMongoClient: true
};
mongoose.connect(configDB.url,mongoOptions); // connect to our database

require('./config/passport').passport(passport); // pass passport for configuration


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'progettoreti',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport, path, express, amqp); // load our routes and pass in our app and fully configured passport



// websocket ===================================================================

wss.on('connection', function (ws) {
    messages.forEach(function(message){
        ws.send(message);
    });
    ws.on('message', function (message) {
        messages.push(message);
        wss.clients.forEach(function (conn) {
            conn.send(message);
        });
    });
});

// launch ======================================================================
app.listen(port);
console.log('Il server ascolta sulla porta: ' + port);





