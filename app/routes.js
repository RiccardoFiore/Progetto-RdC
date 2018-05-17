
module.exports = function(app, passport, path , express) {


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
    app.get("/parking", isLoggedIn, function(req,res){
        console.log(path.join(__dirname, 'maps-support'));
        app.use(express.static(path.join(__dirname,'maps-support')));
        res.render("maps-parking.ejs");
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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