
var send_comment = function(req,res,amqp, movie){
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'review_logs';

            var id = scegliUser(req.user);
            var msg = req.body.review+"{"+movie+"{"+id;

            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(msg));
            console.log(" [x] Sent:  %s", req.body.review+" about "+movie+" from "+id);
        });
    });
};

function scegliUser(user) {

    var u;
    if (user.facebook.id !== undefined) u = user.facebook.last_name;
    else if (user.google.id !== undefined) u = user.google.name;
    else if (user.twitter.id) u = user.twitter.username;
    else u = user.local.username;
    return u;
}

module.exports.send_comment=send_comment;