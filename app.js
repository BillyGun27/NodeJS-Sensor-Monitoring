var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var index = require('./routes/index');
var users = require('./routes/users');


var app = express();


// call socket.io to the app
app.io = require('socket.io')();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


var mysql = require('mysql');


var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "273109",
  database: "learndb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");    
  });

var sensor ;
var status;


/* GET home page. */
app.get('/sensor', function(req, res, next) {
    sensor = req.param('val');
    if (sensor <= 150) {
        status = "Fresh";
    }else if(sensor == 1023){
        status = "No Gas";
    }else {
        status = "Not Fresh";
    }
   
    
     //var sql = "UPDATE mq135 SET sensor_value =10,status ='of' "//+status;// WHERE address = 'Valley 345'";
     var sql = "UPDATE mq135 SET mqsensor=?,status=?";
     var answer = [sensor,status];
    con.query(sql, answer , function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      
    });
       
    //con.end();

    app.io.emit('new data', {sensor:sensor,status:status});
    res.send(sensor);
 // res.render('index', { title: 'Express'  , data:'yo' ,"books": ["A", "B", "C"]  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

//  res.io = io;
 // next();

  // render the error page
  res.status(err.status || 500);
  res.render('error',{
    message:err.message,
    error:{}
  });
});

// start listen with socket.io
app.io.on('connection', function(socket){  
  console.log('a user connected');

  /*
  socket.on('new message', function(msg){
    console.log('new message: ' + msg);
    app.io.emit('chat message', msg);
  });
  */
  
});

module.exports = app;
//module.exports = {app: app, server: server};