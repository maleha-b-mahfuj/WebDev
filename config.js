let config = {};
config.db = {};

// create properties on the config.db object for the host and database names
const userName = "galleryUser" // username for the MongoDB Atlas on cloud
const password = "M1W2oVmoXcoHQwUL" // password for the MongoDB on cloud
const dbname = "Gallery"; // name of the database that we want to connect to

const connectionURL = `mongodb+srv://${userName}:${password}@${dbname}.sm89cog.mongodb.net/?retryWrites=true&w=majority`; 
// full URL for connecting to our MongoDB database; includes the database username, password, and the database name. Retrieved from your MongoDB Atlas cluster

//M1W2oVmoXcoHQwUL
// create properties on the config.db object for the host and database names
config.db.host = connectionURL;
config.db.name = dbname;

//console.log(config);
module.exports = config;