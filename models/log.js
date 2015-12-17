
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var logSchema = new mongoose.Schema({
    name: String,
	loggedDate: String
	
});


// Return model
module.exports = restful.model('Logs', logSchema);