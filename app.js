// check if environment variable is set
if(typeof process.env.NODE_ENV === 'undefined'){
        console.log('"\n"'
                + 'set environment mode NODE_ENV to development, '
                + 'testing or production mode (export NODE_ENV=[MODE])"\n"'
        );
        process.exit(1);
}

var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var expressJwt = require('express-jwt');
var CONFIG = require('config');

// create configuration object for runtime environment
var config = CONFIG[process.env.NODE_ENV];

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

if(process.env.NODE_ENV!='production') {
        app.use(logger(config.app.logger));
}

// app setup
app.set('port', config.app.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Cross Domain Requests
app.use(cors());
app.options('*', cors());

// API authentication
app.use('/api', expressJwt({secret: config.app.secret}).unless({path:['/api/authenticate']}));
app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
                res.status(401).json({ msg: 'invalid token...' });
        }
});

// create express http server
var server = http.createServer(app).listen(app.get('port'));
console.log('\n'
        + ldt(new Date()) 
        + ' - Node.js server on Port ' + app.get('port')
        + ' - Application: '+ config.app.name
        + ' - Mode: ' + config.app.mode
);
