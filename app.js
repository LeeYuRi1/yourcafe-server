var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/config/awsconfig.json');
var s3 = new AWS.S3();
var multer = require('multer');
var multerS3 = require('multer-s3');
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-cafe',
    key: function (req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension)
    },
    acl: 'public-read'
  })
})
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
      if(['lat', 'lng', 'radius'].includes(prop)) {
        continue;
      } else {
        columns.push(prop);
        values.push(req.query[prop]);
      }
  }

  var lat = req.query.lat;  //위도
  var lng = req.query.lng;  //경도
  var radius = req.query.radius;  //반경

  var wherequery = ""
  if(columns.length > 0) {
    wherequery += `WHERE ${columns.join(' = ? AND ')}= ?`;
  }

  var query = `SELECT *, (
    3959 * acos (
      cos ( radians( ? ) )  
      * cos( radians( latitude ) )
      * cos( radians( longitude ) - radians( ? ) )
      + sin ( radians( ? ) )
      * sin( radians( latitude ) )
    )
  ) AS distance
  FROM cafes
  ${wherequery}
  HAVING distance < ?
  ORDER BY distance
  LIMIT 0 , 20;`

  pool.getConnection(function(err, connection) {  
    if (err) throw err; 

    connection.query(query, [lat, lng, lat, ...values, radius], function (error, results, fields) { 
      connection.release(); 
      if (error) throw error;
      console.log(results);
      res.status(200).json(results); 
    });
  });
});



app.post('/container/upload', upload.single('cafeImage'), (req, res) => {
  let image = req.file;
  res.status(200).json({
    location: image.location
  }); 
})


// 카페 상세 정보 가져오기
app.get('/cafe/:id', (req, res) => {
  var id = req.params.id;
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    var query = `SELECT * FROM cafes where id = ?`;
    
    connection.query(query, [id], function (error, results, fields) {
      query = `SELECT * FROM review where cafeid = ?`;

      connection.query(query, [id], function (error, result_review, fields) {
        query = `SELECT * FROM menu where cafeid = ?`;

        connection.query(query, [id], function (error, result_menu, fields) {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (error) throw error; 

          var reviews = [];
          var menus = [];

          for(var i=0; i < result_review.length; i++){
            reviews.push(result_review[i].review);
          }
          for(var i=0; i < result_menu.length; i++){
            menus[i] = {
              "menu_name": result_menu[i].menu_name,
              "menu_price": result_menu[i].menu_price
            }
          }
          results[0].reviews = reviews;
          results[0].menus = menus;

          res.status(200).send(
            results[0]
          );

        });
      });
    });
  });
});

// 카페 생성하기
app.post('/cafe', (req, res) => {
  let columns = [];
  let values = [];
  for(let prop in req.body) {
      if(prop === 'menus') continue;
      columns.push(prop);
      values.push(req.body[prop]);
  }

  values.push(new Date());
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    let query = `INSERT INTO cafes (${columns.join(',')},create_date) VALUES (${values.map(value => '?').join(',')})`;
    connection.query(query, [...values], function (error, result, fields) {
      if(req.body.menus) {
        values = JSON.parse(req.body.menus).map(menu => {
          return [result.insertId, menu.menu_name, menu.menu_price];
        })
        query = `INSERT INTO menu (cafeid, menu_name, menu_price) VALUES ?`
        connection.query(query, [values], function (error, result, fields) {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (error) throw error;
          
          res.status(200).send();
        });
      } else {
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        
        res.status(200).send();
      }
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


app.post('/cafe/review/:id', (req, res) => {
  let id = req.params.id;
    
  pool.getConnection(function(err, connection) {
    if(err) throw error;
    let query = `INSERT INTO review (cafeid, review) VALUES (?, ?)`;

    connection.query(query, [id, req.body.review], function(error, result, fields) {
      // When done with the connection, release it.
      connection.release();
      // Handle error after the release.
      if (error) throw error;
      
      res.status(200).send();
    });
  });
});


module.exports = app;
