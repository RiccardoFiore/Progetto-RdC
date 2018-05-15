// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1733208910318408', // your App ID
        'clientSecret'  : 'b90724c3ef76b8027837c9633148e75f', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name','photos'] // For requesting permissions from Facebook API
    }
};