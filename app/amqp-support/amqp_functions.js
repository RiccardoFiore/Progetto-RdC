var send_comment = function(req,res,amqp){
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'path_logs';
            var msg = req.body.comment;
            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(msg));
        });
    });
};


module.exports.send_comment=send_comment;