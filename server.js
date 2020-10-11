var express = require("express");
var app = express();
var port = 8080;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static('./static/'));
app.set('view engine', 'pug');
app.set('views', './static/');

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

app.get("/", (req, res) => {	
	var circularJSON = CircularJSON.stringify(req);
	var split = circularJSON.split("dropItem=");
	if (split) {
		dropTask(req, res);
	}
	if (split.length > 2) return;
	renderList(req, res);
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
		dropTask(req, res);
	} else {	
		renderList(req,res);
	}
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

function renderList(req, res) {
	var query = Task.find()
    var list = "";
    query.exec(function (err, docs) {
		var splitColon = JSON.stringify(docs).split('"item":');
        var tasks = [];
        for (var i = 1; i < splitColon.length; i++) {
			var itemIndex = splitColon[i].length - 10;
			var itemTemp = splitColon[i].substring(0, itemIndex);
			var itemCut = itemTemp.substring(itemTemp.indexOf(',,') + 2, itemTemp.length);	
			var task = itemCut.substring(0, itemCut.indexOf('"'));	
            tasks.push(task);
            list += "<li>"+task+"</li>";
        }
        var complete = tasks;
        res.render("index.ejs", { complete: complete });
    })
}

function dropTask(req, res) {
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
}
