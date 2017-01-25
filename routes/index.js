var express = require('express');
var router = express.Router();

// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');


/* POST login. */
router.post('/login', function (req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');

    // console.log(req.body);
    //res.json(req.body);
    //res.json(req.body.username);

    collection.find({ "username": req.body.username, $and: [{ "email": req.body.email }] }, function (e, docs) {
        // res.send(docs[0].username + docs[0].email)
        if (docs[0].username == "simon" && docs[0].email == "sim.nort") {
            res.send('names match posted vars');
        }
    });
});

// GET ------------------------------------------------------------- //

/* GET record user using parameter */
router.get('/jsonuser/:user', function (req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');
    var params = req.params;
    collection.find({ "username": params.user }, function (e, docs) {
        res.json(docs);
    });
});

/* GET record by user and email using parameter */
router.get('/jsonuser/:user/:email', function (req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');
    var params = req.params;
    collection.find({ "username": params.user, $and: [{ "email": params.email }] }, function (e, docs) {
        res.json(docs);
    });
});

/* GET json users */
router.get('/jsonusers', function (req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});



router.get('/token', function (req, res, next) {
    var token = jwt.sign({ foo: 'bar' }, 'shh');

    // invalid token - synchronous
    try {
        var decoded = jwt.verify(token, 'shh');
    } catch (err) {
        // err
    }

    res.send(decoded);
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Marvel DB' });
});

// POST ------------------------------------------------------------- //

/* POST to Add User Service */
router.post('/adduser', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.email;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username": userName,
        "email": userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database."+err);
        }
        else {
            // And forward to success page
            // res.redirect("userlist");
            // TODO want to return the success object
            res.json({
                "message": "success"
                , "doc": doc
            });
        }
    });
});

/* POST to delete user  */
router.post('/deleteuser', function (req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userEmail = req.body.email;

    // Set our collection
    var collection = db.get('usercollection');

    // TODO should we find the user first then remove
    collection.remove({
        "email": userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem deleting the information to the database. "+err);
        }
        else {
            res.json({
                "message": "success"
                , "doc": doc
            });
        }
    });
});

/* POST to update user  */
router.put('/updateuser/:username', function (req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('usercollection');
    

    // TODO should we find the user first then remove
    collection.update({
        "username": req.params.username
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem deleting the information to the database. "+err);
        }
        else {
            res.json({
                "message": "success"
                , "doc": doc
            });
        }
    });
});

// non api stuff --------------------------- //
/* GET Userlist page. */
// router.get('/userlist', function(req, res) {
//     var db = req.db;
//     var collection = db.get('usercollection');
//     collection.find({},{},function(e,docs){
//         res.render('userlist', {
//             "userlist" : docs
//         });
//     });
// });
// /* GET New User page. */
// router.get('/newuser', function(req, res) {
//     res.render('newuser', { title: 'Add New User' });
// });

module.exports = router;