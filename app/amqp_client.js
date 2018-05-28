#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var mongoose = require('mongoose');
var Msg = require('./models/msg');
var configDB = require('../config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'path_logs';
        ch.assertQueue(q, {durable: false});
        ch.consume(q, function(msg) {
            var msg_split = msg.content.toString().split("{");
            var username =  msg_split[2];
            var src = msg_split[0];
            var dest = msg_split[1];
            if (src !== "" && dest !== "" && username !== undefined) {
                var new_msg = new Msg();
                new_msg.message.username = username;
                new_msg.message.src = src;
                new_msg.message.dest = dest;
                new_msg.save(function (err) {
                    if (err) throw err;

                });
            }
        }, {noAck: true});

    });
});