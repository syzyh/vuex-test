var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/mission';
var _db;
var http = require('http');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('dist'));

MongoClient.connect(mongoUrl, function (err, db) {
  if(err) {
    console.error(err);
    return;
  }

  console.log('connected to mongo');
  _db = db;
  app.listen(8888, function () {
    console.log('server is running...');
  });
});

app.all("*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.post('/create', function(req, res, next) {
    //接收前端发送的字段
  var mission = req.body;
  //选择一个表my_mission 此时没有没关系，也会自动创建
  var collection = _db.collection('my_mission');
    //如果我们需要的字段不存在，返回前端信息
  if(!mission.comment || !mission.totalTime || !mission.date) {
    res.send({errcode:-1,errmsg:"params missed"});
    return;
  }
    //如果存在就插入数据库，返回OK
  collection.insert({comment: mission.comment, totalTime: mission.totalTime,date:mission.date}, function (err, ret) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send(ret.ops[0]);
    }
  });
});

app.get('/plans', function(req, res, next) {
	var collection = _db.collection('my_mission');
	collection.find({}).toArray(function(err, docs) {
		res.send(docs);
	})
})

app.get('/test', function(req, res, next) {
  console.log('test');
  http.get('http://localhost:8080/#/time-entries', function (ress) {
    var html = '';
    ress.on('data', (data) => {
      html += data;
    })
    ress.on('end', () => {
      console.log(html);
    })
  }).on('error', (e) => {
    console.log(e.message);
  })
})

var ObjectID = require('mongodb').ObjectID
app.delete('/delete/:id', function (req, res, next) {
  var _id = req.params.id;
  var collection = _db.collection('my_mission');
  console.log(_id)
  //使用mongodb的唯一ObjectId字段查找出对应id删除记录
  collection.remove({_id: new ObjectID(_id)} ,function (err, result) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send({errcode:0,errmsg:"ok"});
    }
  });
});