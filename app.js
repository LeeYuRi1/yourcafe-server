var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// 카페 목록 가져오기 : 위도, 경도, 확대정도, 필터 조건들을 url query에 전송할 것을 예상
app.get('/cafes', (req, res) => {
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
  var query = `SELECT ${latitude}, ${longitude} FROM cafes`;   

  pool.query(query, (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.status(200).json({
        message: "get cafes"
    });

    }
  });

});

// 카페 상세 정보 가져오기
app.get('/cafe/:id', (req, res) => {
  var id = req.params.id;
  var query = `SELECT * FROM cafes WHERE id = ${id}`;

  pool.query(query, (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {

    }
  });
});

// 카페 생성하기
app.post('/cafe', (req, res) => {
  //var query = `INSERT INTO cafes  `;
  pool.query(query, (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {

    }
  });

});

// 카페 수정하기
app.put('/cafes', (req, res) => {

});

// 카페 삭제하기  
app.delete('/cafes', (req, res) => {

});
module.exports = app;
