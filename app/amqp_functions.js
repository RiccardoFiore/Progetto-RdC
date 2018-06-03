
var send_comment = function(req,res,amqp, movie){
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'review_logs';

            var id = scegliUser(req.user);
            var msg = req.body.review+"{"+movie+"{"+id;

            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(msg));
            console.log(" [x] Sent %s", req.body.review+" "+movie+" "+id);
        });
    });
};

function scegliUser(user) {
    var id;
    if (user.facebook.id !== undefined) id = user.facebook.id;
    else if (user.google.id !== undefined) id = user.google.id;
    else if (user.twitter.id !== undefined) id = user.twitter.id;
    else id = user.local.username;
    return id;
}

module.exports.send_comment=send_comment;