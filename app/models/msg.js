// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var msgSchema = mongoose.Schema({

    message          : {
        username     : String,
        src          : String,
        dest         : String
    }

});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Msg', msgSchema);

