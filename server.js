var express = require("express");
var app = express();
var port = 8080;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static('./static/'));
app.set('view engine', 'pug');
app.set('views','./views');

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/w7-demo");
var taskSchema = new mongoose.Schema({
    item: {
		type: String,
		required: true,
    	index: true,
    	unique: true
	}
});
var Task = mongoose.model("Task", taskSchema);

var CircularJSON = require('circular-json');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/first_template', function(req, res){
   res.render('first_view');
});


app.get('/dynamic_view', function(req, res){
   res.render('dynamic', {
      name: "TutorialsPoint", 
      url:"http://www.tutorialspoint.com"
   });
});



app.get("/", (req, res) => {
	var circularJSON = CircularJSON.stringify(req);
	var split = circularJSON.split("dropItem=");
	if (split) {
		var taskItem;
		if (split.length > 8) {
			var n = 8;
			taskItem = split[n].substring(0, split[n].indexOf('"'));
			MongoClient.connect(url, function(err, db) {
  				if (err) throw err;
  				var dbo = db.db("w7-demo");
  				var myquery = { item:  taskItem};
 	 			dbo.collection("tasks").deleteOne(myquery, function(err, obj) {
    				if (err) throw err;
					renderList(req, res);
				
    				db.close();
  				});
			});
			return;
		}		
		if (split[1]) { 
			taskItem = split[1].substring(0, split[1].indexOf('"'));
			MongoClient.connect(url, function(err, db) {
  				if (err) throw err;
  				var dbo = db.db("w7-demo");
  				var myquery = { item:  taskItem};
 	 			dbo.collection("tasks").deleteOne(myquery, function(err, obj) {
    					if (err) throw err;
					renderList(req, res);
    					db.close();
  				});
			});
			return;
		} 
	}
	var query = Task.find()
	var list = "";
    query.exec(function (err, docs) {
		var results = JSON.stringify(docs).split("item"); 
		var tasks = [];
		for (var i = 1; i < results.length; i++) {
			var cut = results[i].substring(results.indexOf(':')+4,results[i].length);
            var task = cut.substring(0,cut.indexOf('"'));
			tasks.push(task);
			list += "<li>"+task+"</li>";
		}
		var complete = tasks;
		res.render("index.ejs", { complete: complete });
	})
});

app.delete("/", function (request, response) {
	Task.deleteOne({_id: request.query.id}).exec()
});

app.post("/addtask", (req, res) => {
	itemName = JSON.stringify(req.body);
   	var myData = new Task(req.body);
    	myData.save()
        .then(item => {
		renderList(req, res);
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.get("/addtask", (req, res) => {
	var circularJSON = CircularJSON.stringify(req);
	var split = circularJSON.split("dropItem=");
	if (split) {
		var taskItem;
		if (split.length > 8) {
			var n = 8;
			taskItem = split[n].substring(0, split[n].indexOf('"'));
			MongoClient.connect(url, function(err, db) {
  				if (err) throw err;
  				var dbo = db.db("w7-demo");
  				var myquery = { item:  taskItem};
 	 			dbo.collection("tasks").deleteOne(myquery, function(err, obj) {
    				if (err) throw err;
					renderList(req, res);

    				db.close();
  				});
			});
			return;
		}
		if (split[1]) { 
			taskItem = split[1].substring(0, split[1].indexOf('"'));
			MongoClient.connect(url, function(err, db) {
  				if (err) throw err;
  				var dbo = db.db("w7-demo");
  				var myquery = { item:  taskItem};
 	 			dbo.collection("tasks").deleteOne(myquery, function(err, obj) {
    					if (err) throw err;
					renderList(req, res);

    					db.close();
  				});
			});
			return;
		} 
	}
	renderList(req,res);
});
app.listen(port, () => {
    console.log("Server listening on port " + port);
});

function dropTask(taskName) {

}


function renderList(req, res) {
	var query = Task.find()
    var list = "";
    query.exec(function (err, docs) {
        var results = JSON.stringify(docs).split("item");
        var tasks = [];
        for (var i = 1; i < results.length; i++) {
            var cut = results[i].substring(results.indexOf(':')+4,results[i].length);
            var task = cut.substring(0,cut.indexOf('"'));
            tasks.push(task);
            list += "<li>"+task+"</li>";
        }
        var complete = tasks;
        res.render("index.ejs", { complete: complete });
    })
}
