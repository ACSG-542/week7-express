var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var taskSchema  = new mongoose.Schema({
    item: {
		type: String,
		required: true,
    	index: true,
    	unique: true
	}
});
exports.taskSchema = taskSchema;
