const express = require("express");
const app = express();
const {ObjectId} = require('mongodb');
const { db } = require("./config.js");

const mc = require("mongodb").MongoClient;
const config = require("./config.js"); // import the config module which contains the database login and name information



/* 
go to mongodb and connect to it first
make sure you have 'npm install express, pug, mongodb mongodb@4.0
run node server.js in the directory containing it 

*/

app.use(express.json());

app.set('view engine', 'pug');

app.use(express.static("public"));

//GET request for the path (http://localhost:3000)
app.get("/", function(req, res, next){
    res.render('pages/homepage');
});

app.get("/signup", function(req, res, next){
    res.render('pages/signup');
});

app.get("/logIn/:userID", function(req, res, next){
    console.log("inside the get account request");
    let id = req.params.userID;
    console.log(id);
    app.locals.db.collection("Users").findOne({"user": id}, function(err, result){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        res.render('pages/account', {list: result});

    })

});

app.get("/:userID/art", function(req, res, next){
    //gets the page that lists all the artworks
    let id = req.params.userID; 
    console.log(id);
    app.locals.db.collection("Art").find({}).toArray(function(err, result){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }

        let categories = {};
        categories["cat"] = {};

        //to be organize them by category and medium
        for (let i=0; i < result.length; i++) {
            if (!Object.keys(categories.cat).includes(result[i].category.toLowerCase())){ 
                let obj = {};
                obj["medium"] = {[result[i].medium]: [result[i]]};
                categories.cat[result[i].category] = obj;

            } else {
                let title = result[i].category.toLowerCase();
                if (Object.keys(categories.cat[title].medium).includes(result[i].medium.toLowerCase())) { 
                    categories.cat[title].medium[result[i].medium.toLowerCase()].push(result[i]);
                } else {
                    categories.cat[title].medium[result[i].medium.toLowerCase()] = [result[i]];
                }
            }
        }
        res.render('pages/allArtworks', {list: categories, user: {username: id}});
    });
});

app.get("/:userID/art/search/:item/:name", function(req, res, next){
    console.log("inside the search get request");
    //get the search page from using the links in the artist page
    let cat = req.params.item; 
    let nameId = req.params.name;  
    let userId = req.params.userID;
    
    app.locals.db.collection("Art").find({ [cat] : nameId }).toArray(function(err, result){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }

        let obj = {};
        obj[cat] = nameId;

        res.render('pages/search', {list: result, bool: {alt: true}, name: obj, user: {username: userId}});
    });
});

app.get("/:userId/search/:itemN", function(req, res, next){
    //get the search page from using the header bar
    let item = req.params.itemN; 
    let userId = req.params.userId;
    
    app.locals.db.collection("Art").find({$text: {$search: item}}).toArray(function(err, result){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }

        res.render('pages/search', {list: result, bool: {alt: false}, user: {username: userId}, name: {result: item}});
    });
})


app.get("/:userId/artist/:name", function (req, res, next){
    console.log("inside the get artist request");
    //page to get the page of one specific artist 

    let nameId = req.params.name;
    let userName = req.params.userId;
    app.locals.db.collection("Art").find({artist: nameId}).toArray(function(err, result){
        app.locals.db.collection("Workshops").find({artist: nameId}).toArray(function(err, shopResult){
            if (err){
                console.log(err);
                res.status(500).send("There was an error");
            }

            if (!(shopResult === null)){
                res.render('pages/oneArtist', {list: result, user: {username: userName}, work: shopResult});
            } 
        })
    });
})

app.get("/:userId/addArtwork", function(req, res, next){
    //pagd to add an artwork
    let userName = req.params.userId;
    console.log("inside the get addArtwork request");
    res.render('pages/addArtwork', {user: {username: userName}});
})

app.get("/:userId/addWorkshop", function(req, res, next){
    //page to add a workshop
    let userName = req.params.userId;
    console.log("inside the get addWorkshop request");
    res.render('pages/workshop', {user: {username: userName}});
})


app.get("/:userId/workshop/:title", function(req, res, next){
    //get page of a specific workshop
    let titleId = req.params.title;
    let userName = req.params.userId;
    app.locals.db.collection("Workshops").findOne({title: titleId}, function(err, result){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        if (!(result === null)){
            res.render('pages/OneWorkshop', {list: result, user: {username: userName}});
        }
    })

})


app.get("/:userId/art/:artID",function(req, res, next){
    console.log("searching for one artwork");
    let id = req.params.artID; //
    let userName = req.params.userId;
    app.locals.db.collection("Art").findOne({"_id": new ObjectId(id)}, function(err, result){
        console.log(result);
        app.locals.db.collection("Users").find({ratings: {$in: [result]}}).toArray(function(err, likes){
            let count;
            if (likes == []){
                count = 0;
            } else {
                count = likes.length;
            }
            let iD = result._id;
            app.locals.db.collection("Users").find({reviews: {$in: [result]}}).toArray(function(err, likes){
                app.locals.db.collection("Users").find({[`reviews.${result._id}`] : {$exists: true}}).toArray(function (err, finalResult) {
                    let allReviews = [];
                    
                    for (let i=0; i < finalResult.length; i++){
                        console.log(finalResult[i].reviews);
            
                        for (let j=0; j < finalResult[i].reviews.length; j++){
                            console.log(finalResult[i].reviews[j]);
                            let key = Object.keys(finalResult[i].reviews[j]);
                            if (key[0] === result._id.toString()) {
                                for (let item of finalResult[i].reviews[j][result._id]) {
                                    allReviews.push(item);
                                } 
                            } 
                        }
                    }
                    
                    console.log(allReviews);
            
                res.render('pages/oneArtwork', {list: result, reviewed: allReviews, user: {username: userName}, like: {numLikes: count}});
            })
        })
    })
})});


app.put("/:userId/enroll",  express.json(), function(req, res, next){
    console.log("inside the enroll request");
    let user = req.params.userId;

    //checking on it based on the title
    app.locals.db.collection("Workshops").updateOne({title: req.body.id}, {$addToSet: {enroll: user}}, function(err, result){
        console.log(result);
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        if (result.modifiedCount === 1) { 
            res.status(201).send("Enrolled to workshop, " + req.body.id);
        } else {
            res.status(201).send("Already enrolled to workshop, " + req.body.id);
        }
    })

})
app.put("/:userId/like", express.json(), function(req, res, next){
    console.log("inside the put like request");
    let user = req.params.userId; //username

    //find the document in the Art cluster with the matching art ID
    app.locals.db.collection("Art").findOne({"_id": new ObjectId(req.body.artID)}, function(err, result){
        if (err){
            console.log(err);
        }
        app.locals.db.collection("Users").updateOne({"user": user}, {$addToSet: {ratings: result}}, function(err, finalResult){
            if (err){
                console.log(err);
                res.status(500).send("There was an error");
            }
            console.log(finalResult);
            if (finalResult.modifiedCount === 0) { 
                res.status(201).send(result.name + " has already been liked");
            } else {
                res.status(201).send(result.name + " has been liked");
            }
        })
    })
});

app.put("/logIn/:userId/unfollow", express.json(), function(req, res, next){
    console.log("inside the put unfollow request");
    let user = req.params.userId;  //retrieving the username from the URL
    console.log(user);
    console.log(req.body.artID);   //retrieving the artist's name
    
    //updating the document by removing an item from one of its fields 
    app.locals.db.collection("Users").updateOne({"user": user}, {$pull: {artists: req.body.artID}}, function(err, finalResult){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        console.log(finalResult);
        res.status(201).send(req.body.artID + " has been unfollowed");
    })
})

app.put("/logIn/:userId/unlike", express.json(), function(req, res, next){
    console.log("inside the put unlike request");
    let user = req.params.userId;  //username
    console.log(user);
    console.log(req.body.artID);   //the unique ID that identifies each artwork in the database
    
    //searching for the document in the Art cluster 
    app.locals.db.collection("Art").findOne({"_id": new ObjectId(req.body.artID)}, function(err, result){
        if (err){
            console.log(err);
        }

        if (result != null) { //was able to find the artwork
            app.locals.db.collection("Users").updateOne({"user": user}, {$pull: {ratings: result}}, function(err, finalResult){
                if (err){
                    console.log(err);
                    res.status(500).send("There was an error");
                }
                console.log(finalResult);
                res.status(201).send(result.name + " has been un-liked");
            })
        }
    
    })

})

app.put("/:userId/follow", express.json(), function(req, res, next){
    console.log("inside the put follow request");
    let user = req.params.userId;

    //searching for a user in the Users cluster so one of their fields can be updated
    app.locals.db.collection("Users").updateOne({"user": user}, {$addToSet: {artists: req.body.artID}}, function(err, finalResult){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        console.log(finalResult);
        res.status(201).send(req.body.artID + " has been followed");
    })
});

app.put("/logIn/:userId/upgrade", express.json(), function(req, res, next){
    let user = req.params.userId; //getting the unique username 
    //updating the Users document with the same username
    app.locals.db.collection("Users").updateOne({"user": user}, {$set: {type: true}}, function(err, finalResult){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        res.status(201).send("Success");
    })

})

app.put("/logIn/:userId/patron", express.json(), function(req, res, next){
    console.log("inside the /patron requets");
    let user = req.params.userId;  //getting the unique username '
    //updating the Users document with the same username
    app.locals.db.collection("Users").updateOne({"user": user}, {$set: {type: false}}, function(err, finalResult){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        console.log(finalResult);
        res.status(201).send("Success");
    })

})

app.put("/:userId/review", express.json(), function(req, res, next){
    console.log("inside the put review request");
    let user = req.params.userId;

    
    app.locals.db.collection("Art").findOne({"_id": new ObjectId(req.body.artID)}, function(err, result){
        if (err){
            console.log(err);
            res.status(500).send("There was an error");
        }
        
        if (!(result === null)) {
            let obj = {};
            obj[result._id] = [req.body.review];
            console.log(obj);
            
            app.locals.db.collection("Users").findOne({[`reviews.${result._id}`] : {$exists: true}}, function (err, finalResult) {
                if (err){
                    console.log(err);
                    res.status(500).send("There was an error");
                }

                if (finalResult === null){
                    app.locals.db.collection("Users").updateOne({"user": user}, {$addToSet: {reviews: obj}}, function(err, result) {
                        if (!(result.modifiedCount == 0)){
                            res.status(201).send("Success");
                        }
                        ///dothe erorrs
                    })
                } else {
                    if (finalResult.user === user){
            
                        for (let i=0; i<finalResult.reviews.length; i++){
                            console.log(finalResult.reviews[i]);
                            console.log(result._id);
                            if (Object.keys(finalResult.reviews[i])[0] === result._id.toString()) {
                                let string = result._id.toString();
                                finalResult.reviews[i][string].push(req.body.review);
                            }
                        }
                    }
                    app.locals.db.collection("Users").updateOne({"user": user}, {$set: {reviews: finalResult.reviews}}, function(err, result) {
                        if (err){
                            console.log(err);
                            res.status(500).send("There was an error");
                        }

                        if (!(result.modifiedCount == 0)){
                            res.status(201).send("Success");
                        }
                    })
                }
            });
           
        }

    });  
        
});


app.put("/logIn/:userId/removeReview", express.json(), function(req, res, next){
    console.log("remove review request");

    let user = req.params.userId;
    app.locals.db.collection("Users").findOne({"user": user}, function(err, result){
        console.log(result.reviews);
        if (!(result === null)){
            for (let i=0; i < result.reviews.length; i++){
                if (Object.keys(result.reviews[i])[0] === req.body.id) {

                    let x = result.reviews[i][req.body.id].indexOf(req.body.review);
                    result.reviews[i][req.body.id].splice(x, 1);
                    if (result.reviews[i][req.body.id].length === 0) {result.reviews.splice(i, 1);}
                }
            }
        }

        app.locals.db.collection("Users").updateOne({"user": user}, {$set: {reviews: result.reviews}}, function(err, newresult) {
            if (err){
                console.log(err);
                res.status(500).send("There was an error");
            }

            if (!(newresult.modifiedCount == 0)){
                res.status(201).send("Success");
            }
        })
    })
})

app.post("/signup", express.json(), function(req,res,next){
	console.log("Inside the /signup POST request...");

    //creating default values for the new user document 
    req.body.ratings = [];
    req.body.artists = [];
    req.body.reviews = [];
    req.body.notifications = [];
    req.body.type = false;
    console.log(req.body);

    //checking if the desired username already exists 
    app.locals.db.collection("Users").findOne({"user": req.body.user}, function(err, result){
        if (err){
            res.status(500).send("There was an error");
        }

        if (result == null) { //username does not exist so it can be used to create a new account
            app.locals.db.collection("Users").insertOne(req.body, function(err, result){
                if (err){
                    res.status(500).send("There was an error");
                }
                res.status(200).send("Success");
                console.log(result);
            });
        } else {  //username exists
            res.status(200).send("Username already exists.")
        }
    });
});

app.post("/:userId/addWorkshop", express.json(), function(req,res,next){
	console.log("Inside the /addWorkshop POST request...");

    //checking if the workshop already exists (assuming a workshop is unique by its title) 
    app.locals.db.collection("Workshops").findOne({"title": req.body.title}, function(err, result){
        if (err){
            res.status(500).send("There was an error");
        }
        if (result == null) { //workshop does not exist so it can be created
            app.locals.db.collection("Workshops").insertOne(req.body, function(err, result){
                if (err){
                    res.status(500).send("There was an error");
                }
                res.status(200).send("Success");
                console.log(result);
            });
        } else {  //username exists
            res.status(200).send("Workshop already exists.")
        }
    });
});

app.post("/addArtwork", express.json(), function(req, res, next){
    console.log("inside the /addArtwork post request");
    app.locals.db.collection("Art").findOne(req.body, function(err, result){
        if (err){
            res.status(500).send("there is an error");
        }
        console.log(result);
        if (result == null){
            app.locals.db.collection("Art").insertOne(req.body, function(err, result){
                if (err){
                    console.log(err);
                }
                app.locals.db.collection("Users").updateMany({artists: {$in: [req.body.artist]}}, {$push: {notifications: `${req.body.artist} has added a new artwork`}}, function(err, newResult){
                    console.log(newResult);
                })
                console.log(result);
                res.status(200).send("Artwork was added");
            });
        } else {
            res.status(200).send("Artwork already exists in the database. ");
        }
    });
})

app.post("/signIn", express.json(), function(req,res,next){
	console.log("Inside the /signIn POST request...");
    console.log(req.body);

    //checking if the username exists in the database
    app.locals.db.collection("Users").findOne({"user": req.body.user}, function(err, result){
        if (err){
            res.status(500).send(err);
        }

        if (result == null){ //username does not exist
            res.status(200).send("Username does not exist.");
        } else { 
            //username was found 
            if (result.password === req.body.password){   //checking if the username and the inputted password match
                res.status(200).send("Success");   //sending the username 
            } else {   
                res.status(200).send("Username and password do not match.");
            }
        }
    });

});


mc.connect(config.db.host, function(err, client) {
	if(err){
		console.log("ERROR: There was an error in connecting to database...");
		console.log(err);
		return;
	}

	// Get the database and save it to a global variable
	app.locals.db = client.db(config.db.name);

	// Only start listening now, when we know the database is available.
	app.listen(3000);
    console.log("Server running at http://localhost:3000");

});