var express = require('express');
var router = express.Router();

var app = express();

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

var Output

con.query("SELECT * FROM mq135", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
 // Output = result[0].mqsensor;
 // Status = result[0].status;
  //Time = result[0].time;
  Output = result
  console.log(Output);

});

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Sensor Gas'  , data: Output});//Output , status: Status, time: Time});
// res.sendfile(  './views/index.html');

});


module.exports = router;
