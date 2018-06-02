const msg_q = require("./amqp_functions");
var configAuth = require('../config/auth');

module.exports = function(app, passport, path , express, amqp) {

    var id_slugs = [];
    var title = [];
    var year = [];


    // HOME PAGE ===========================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });


    // LOGIN ===============================
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    //ACTION FOR LOGIN FORM ================
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',   // redirect to the secure profile section
        failureRedirect : '/login',     // redirect back to the signup page if there is an error
        failureFlash : true             // allow flash messages
    }));

    // SIGNUP ==============================
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    //ACTION FOR SIGNUP FORM ===============
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',   // redirect to the secure profile section
        failureRedirect : '/signup',    // redirect back to the signup page if there is an error
        failureFlash : true             // allow flash messages
    }));

    // PROFILE SECTION =====================
    app.get('/profile', isLoggedIn, function(req, res) {    // we will check if an user is loggedin by using route middleware (isLoggedIn function)
        res.render('profile.ejs', {
            user : req.user             // get the user out of session and pass to template
        });
    });

    // FACEBOOK AUTHENTICATION =============
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',           //where to redirect after successful facebook authentication
            failureRedirect : '/'
        }));

    // GOOGLE AUTHENTICATION =======================
    app.get('/auth/google', passport.authenticate('google', {
        scope : ['profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',           //where to redirect after successful google authentication
            failureRedirect : '/'
        }));


    // MAPS API ====================================
    app.get("/cinema", isLoggedIn, function(req,res){
        app.use(express.static(path.join(__dirname,'maps-support')));
        res.render("maps-cinema.ejs",{
            user : req.user //get the user out of session and pass to template
        });
    });


    // RABBIT MQ ===================================
    app.post("/cinema",function (req, res) {
        msg_q.send_comment(req,res,amqp);
        res.render("maps-cinema.ejs",{
            user : req.user //get the user out of session and pass to template
        });
    });

    // LOGOUT ======================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/movies', isLoggedIn, function(req, res) {    // we will check if an user is loggedin by using route middleware (isLoggedIn function)
        var request = require('request');
        request({
            headers: {
                'Content-Type': configAuth.traktApi.ContentType,
                'trakt-api-version': configAuth.traktApi.ApiVersion,
                'trakt-api-key': configAuth.traktApi.clientID
            },
            url: 'https://api.trakt.tv/movies/boxoffice/'//URL to hit
        }, function (error, response, body) {
            if(error) {
                console.log(error);
            } else {
                var body1 = JSON.parse(body);
                var i;
                for (i = 0; i < 5; i++){
                    var mov = JSON.stringify(body1[i].movie);
                    title[i] = JSON.parse(mov).title;
                    var id = JSON.parse(mov).ids;
                    id = JSON.stringify(id);
                    console.log(id);
                    id_slugs[i] = JSON.parse(id).slug;
                    year[i] = JSON.parse(mov).year;
                }
                console.log(id_slugs[0]);
                res.render('cinema.ejs', {
                    user : req.user,
                    title : title,
                    year  : year,
                    ids: id_slugs
                });
            }
        });

    });


    app.post('/movies/ratings', isLoggedIn, function(req, res) {
        var request = require('request');
        var rat = [];
        var movie = req.body.movie;
        console.log(movie);
        request({
            url: 'https://api.trakt.tv/movies/' + id_slugs[movie] + '/ratings',
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': '05d8b28cffe1cdaff3a23f04a5e26970d566208439729874c1c5eccdb6bf9de7'
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                var body1 = JSON.parse(body);
                var distribution = JSON.stringify(body1.distribution);
                console.log(distribution);
                var j;
                for (j = 0; j < 10; j++) {
                    rat[j] = JSON.parse(distribution)[j + 1];
                    console.log(rat[j]);
                }
                res.render('ratings.ejs', {
                    user : req.user,
                    title : title[movie],
                    rat: rat
                });
            }
        });
    });

};

// route middleware to make sure a user is loggedin
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}