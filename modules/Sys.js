var NB = NetBox;
exports.wait = function(ms){
    NB.sleep(ms);
};

exports.loop = function(fn, ms, count){
    var socket = $1k.getSocket();
    count = count > 0 ? count : -1;
    while(count-- && !fn() && !socket.eof){
        NB.sleep(ms);
    }
    
};


