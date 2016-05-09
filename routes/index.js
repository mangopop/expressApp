var express = require('express');
var router = express.Router();

// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');


/* POST login. */
router.post('/login', function(req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');

    // console.log(req.body);
    //res.json(req.body);
    //res.json(req.body.username);
    
    collection.find({ "username": req.body.username, $and: [ { "email": req.body.email } ] },function(e,docs){
        // res.send(docs[0].username + docs[0].email)
        if(docs[0].username == "simon" && docs[0].email == "sim.nort"){
            
            
            
            res.send('names match posted vars');
        }   
    });
});

/* GET json users. */
router.get('/jsonusers', function(req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({ "username": "simon", $and: [ { "email": "sim.nort" } ] },function(e,docs){
        res.json('list', {
            "userlist" : docs
        });
    });
});



router.get('/token', function(req, res, next) {
    var token = jwt.sign({ foo: 'bar' }, 'shh');
    
    // invalid token - synchronous
    try {
        var decoded = jwt.verify(token, 'shh');
    } catch(err) {
    // err
    }

    res.send(decoded);
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});
/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});


module.exports = router;