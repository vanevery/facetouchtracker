var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});

var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser);

app.get('/', function (req, res) {
  //res.send('Hello World!')
  //res.render("form.ejs",{});
  res.redirect("/display");
});

app.get('/search', function(req, res) {

	var searchterm = req.query.search;
	var searchregex = new RegExp(searchterm);

	db.find({description: searchregex}).sort({ timestamp: 1 }).exec(function (err, docs) {

	//db.find({description: searchregex}).sort({ timestamp: 1 }).exec(function (err, docs) {
		//db.find({}, function(err, docs) {
		  //console.log(docs);
		  //res.send(docs);

		  var datatopass = {data:docs, category: "Search " + searchterm};
		  res.render("display.ejs",datatopass);
    });
});

/*
Title: <input type="text" name="title"><br />
    	Category: <select name="category">
    				<option value="personal">Personal</option>
    				<option value="school">School</option>
    			  </select>
    	<br />
    	Description: <textarea name="description"></textarea>
*/

app.post('/submit', function (req, res) {

  var data = {
	title: req.body.title,
	category: req.body.category,
	description: req.body.description,
	timestamp: Date.now()
  };

  console.log(data);

  db.insert(data, function (err, newDocs) {
	console.log("err: " + err);
	console.log("newDocs: " + newDocs);
  });

//   res.send("Thanks");
	res.redirect("/display");
});

app.get("/individual", function(req, res) {
  var id = req.query.id;
  db.find({_id: id}, function(err, docs) {
    console.log(docs);
    
    var datatopass = {data: docs};
    res.render("individual.ejs",datatopass);
    
    // Should go to an EJS
    //res.send(docs);
  });
});

app.get('/display', function(req, res) {
	// req.query.


    db.find({}).sort({ timestamp: 1 }).exec(function (err, docs) {
    //db.find({}, function(err, docs) {
      console.log(docs);
      //res.send(docs);

      var datatopass = {data:docs, category: "All"};
      res.render("display.ejs",datatopass);
    });
});

app.get('/category', function(req, res) {
	// req.query.category

    db.find({category: req.query.category}).sort({ timestamp: 1 }).exec(function (err, docs) {
    //db.find({}, function(err, docs) {
      console.log(docs);
      //res.send(docs);

      var datatopass = {data:docs, category: req.query.category};
      res.render("display.ejs",datatopass);
    });
});


app.listen(80, function () {
  console.log('Example app listening on port 80!')
});
