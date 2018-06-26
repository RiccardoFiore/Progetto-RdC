#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var mongoose = require('mongoose');
var Msg = require('./models/msg');
var configDB = require('../config/database.js');

const mongoOptions ={
    useMongoClient: true
}

mongoose.Promise=require('bluebird');

// configuration ===============================================================
mongoose.connect(configDB.url,mongoOptions); // connect to our database

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'review_logs';

        ch.assertExchange(q, 'fanout', {durable: false});
        ch.assertQueue('', {exclusive: true}, function(err, qu) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.bindQueue(qu.queue, q, '');

            ch.consume(qu.queue, function (msg) {
                var msg_split = msg.content.toString().split("{");
                var id = msg_split[2];
                var movie = msg_split[1];
                var review = msg_split[0];
                console.log(" [x] Received: ", movie, ": ", review, ", by: ", id);
                if (movie !== "" && review !== "" && id !== undefined) {
                    var new_msg = new Msg();
                    new_msg.message.id = id;
                    new_msg.message.review = review;
                    new_msg.message.movie = movie;

                    new_msg.save(function (err) {
                        if (err) throw err;
                        console.log('Message saved successfully!');
                    });
                }
            }, {noAck: true});
        });
    });
});