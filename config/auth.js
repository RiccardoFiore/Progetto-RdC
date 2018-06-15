// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {


    'traktApi' : {
        'clientID'      : '05d8b28cffe1cdaff3a23f04a5e26970d566208439729874c1c5eccdb6bf9de7', // your App ID
        'clientSecret'  : '3f17301b35af37a5018197063a8df791828b664f8767aeb4255d86cd255be0b7', // your App Secret
        'ContentType'  : 'application/json',
        'ApiVersion'   : '2'
    },

    'facebookAuth' : {
        'clientID'      : '1733208910318408', // your App ID
        'clientSecret'  : 'b90724c3ef76b8027837c9633148e75f', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name','photos'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : 'r9RnKDR38WNSsUrTtngUhapVG',
        'consumerSecret'    : 'FJ9cv4bZRuUYF3VXLNwBfTWboq2V8Z82Tnp6kXVewvBxkZoAbD',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '781185685407-gi53od0at4hrq5p9lum4r7dq5mpdd5k0.apps.googleusercontent.com',
        'clientSecret'  : 'p_BHqZgpT3AdfV6ZUZ6Cc9C5',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};