var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('contactList', ['contactList']);


//var book = require('./routes/book');
var app = express();

var MongoClient=require('Mongodb').MongoClient,format = require('util').format;
var dbUrl = 'mongodb://localhost:27017/contactList';

var mongoose = require('mongoose'), SchemaName = mongoose.SchemaName;
mongoose.Promise = require('bluebird');
mongoose.connect(dbUrl, {useNewUrlParser: true, promiseLibrary: require('bluebird') })
	.then(() =>  console.log('Connection Successful!!!'))
	.catch((err) => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, '/public')));
//app.use('/books', express.static(path.join(__dirname, 'dist')));
//app.use('/book', book);

app.get('/contactList',function(req, res){
	console.log("I received a GET request!")
	
	db.contactList.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
	
});

app.post('/contactList', function(req, res){
	console.log(req.body);
	db.contactList.insert(req.body, function(err,doc){
		res.json(doc);
	});
});

app.delete('/contactList/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.contactList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
		res.json(doc);		
	})
});

app.get('/contactList/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.contactList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
		res.json(doc);		
	})
});

app.put('/contactList/:id', function(req, res){
	var id = req.params.id;
	console.log(req.body.name);
	db.contactList.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
		new: true}, function(err, doc){
			res.json(doc);
		});
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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;