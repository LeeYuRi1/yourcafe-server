var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerDefinition = {
  info: {
    title: 'Your cafe',
    version: '1.0.0',
  }
}
var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./app.js']
}
var swaggerSpec = swaggerJSDoc(options);
var swaggerUi = require('swagger-ui-express');

var dbConfig = require('./config/config.json');
var mysql = require('mysql');
var config = {
    host: dbConfig.server,
    password: dbConfig.password,
    user: dbConfig.user,
    database: dbConfig.database,
    connectionLimit: 10
};

var pool = mysql.createPool(config);
var s3 = require('s3');
var client = s3.createClient({
  maxAsyncS3: 20,     
  s3RetryCount: 3,    
  s3RetryDelay: 1000, 
  multipartUploadThreshold: 20971520,
  multipartUploadSize: 15728640,
  s3Options: {
    accessKeyId: dbConfig.accessKeyId,
    secretAccessKey: dbConfig.secretAccessKey,
    region: dbConfig.region
  }
});

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// 카페 목록 가져오기 : 위도, 경도, 확대정도, 필터 조건들을 url query에 전송할 것을 예상
app.get('/cafes', (req, res) => {
  let columns = [];
  let values = [];
  for(let prop in req.query) {
      if(['minLatitude', 'maxLatitude', 'minLongitude', 'maxLongitude'].includes(prop)) {
        continue;
      } else {
        columns.push(prop);
        values.push(req.query[prop]);
      }
  }
  var minLatitude = req.query.minLatitude;
  var maxLatitude = req.query.maxLatitude;
  var minLongitude = req.query.minLongitude;
  var maxLongitude = req.query.maxLongitude;

  var query = `SELECT * FROM cafes where latitude >= ? AND latitude <= ? AND longitude >= ? AND longitude <= ?`;
  console.log("TCL: columns", columns)
  if(columns.length > 0) {
    query += `AND ${columns.join(' = ? AND ')}= ?`;
  }
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query(query, [minLatitude, maxLatitude, minLongitude, maxLongitude, ...values], function (error, results, fields) {
      
      // When done with the connection, release it.
      connection.release();
      // Handle error after the release.
      if (error) throw error; 

      console.log(results);
      res.status(200).send(results);
    });
  });
});

// 카페 상세 정보 가져오기
app.get('/cafe/:id', (req, res) => {
  var id = req.params.id;
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    var query = `SELECT * FROM cafes where id = ?`;
    connection.query(query, [id], function (error, results, fields) {
      
      // When done with the connection, release it.
      connection.release();
      // Handle error after the release.
      if (error) throw error; 

      res.status(200).send(results[0]);
    });
  });
});

// 카페 생성하기
app.post('/cafe', (req, res) => {
  let columns = [];
  let values = [];
  for(let prop in req.body) {
      columns.push(prop);
      values.push(req.body[prop]);
  }
  values.push(new Date());
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    let query = `INSERT INTO cafes (${columns.join(',')},create_date) VALUES (${values.map(value => '?').join(',')})`;
    connection.query(query, [...values], function (error, result, fields) {
      
      // When done with the connection, release it.
      connection.release();
      // Handle error after the release.
      if (error) throw error;
      
      res.status(200).send();
    });
  });
});


// 카페 수정하기
app.put('/cafe/:id', (req, res) => {
  let id = req.params.id;
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    let query = `UPDATE cafes SET ? WHERE id = ?`;
    connection.query(query, [req.body, id], function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
      // Handle error after the release.
      if (error) throw error;
      
      res.status(200).send();
    });
  });


});
module.exports = app;
