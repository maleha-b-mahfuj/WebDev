const mc = require("mongodb").MongoClient;
const fs = require("fs");

const config = require("./config.js"); // import the config module which contains the database login and name information


fs.readFile('gallery.json', 'utf8', function(err, data){
      
    // Display the file content
    //console.log(JSON.parse(data));

    mc.connect(config.db.host, function(err, client) {
		if(err) throw err; // catch the error if there were any issues with connecting to the database (e.g., authentication issues)

		console.log("We have successfully connected to the database!");

		// Select the database by name
		let db = client.db(config.db.name); // e.g., "lectureExamples"
		
		db.collection("Art").insertMany(JSON.parse(data), function(err, result){
			if(err) throw err;

			client.close();
		});
	});
});