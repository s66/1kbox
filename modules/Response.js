//Response模块

var hasHeader;
var socket;
var header; //响应头信息
var statusCode; //状态信息
var buffer;
var socketWrite;
var CODEPAGE = 0;
var statusText = {
    200: '200 OK',
    201: '200 OK',
    302: '302 Moved Temporarily',
    304: '304 Not Modified',
    404: '404 Not Found',
    415: '415 Unsupported Media Type',
    418: '418 HELLO!'
};
var CODEPAGE2CHARSET = {
    936: 'gbk',
    65001: 'utf-8'
};
module.exports = {
    init: function(options){
        hasHeader = 0;
        header = {
            mimetype: options.mimetype
        };
        socket = options.socket;
        buffer = new Buffer(options.bufferSize || 1024*8);  
        statusCode = options.code || 0;  
        CODEPAGE = options.codepage || 0;
        socketWrite = CODEPAGE == 936 ? function(content){
            socket.write(content);
        }: function(){
            var encode = NetBox.Encoding;
            return function(content){
                socket.BinaryWrite(encode.StrToBin(content, CODEPAGE));
            };
        }();
    },
    setHeader: function(key, value){
        if(typeof key == 'object'){
            for(var e in key){
                this.setHeader(e, key[e]); 
            }
        }else{
            header[key] = value;  
        } 
    },
    setStatusCode: function(statusCodeIn){
        statusCode = statusCodeIn;
    },
    setBuffer: function(size){
        buffer.setSize(size);
    },
    noBuffer: function(){
        buffer.setSize(0);
    },
    flush: function(){
        buffer.flush();
    },
    end: function(text){
        !hasHeader && writeHeader();
        if(typeof text != 'undefined'){
            buffer.push(text);
        }
        buffer.flush();
        socket.Close();
    },
    write: function(text){
        !hasHeader && writeHeader();
        buffer.push(text);
        if(buffer.isFull()){
            buffer.flush();
        }
    },
    BinaryWrite: function(text){
        !hasHeader && writeHeader();
        socket.BinaryWrite(text);
    }
};
function writeHeader(){
    hasHeader = 1;
    var head = [
        'HTTP/1.1 ' + statusText[statusCode],
        'Server: 1kbox '+ $1k.ver,
        'Connection: close'
    ];
    var mimetype = header.mimetype;
    var charset = CODEPAGE2CHARSET[CODEPAGE];

    header['Content-type'] = mimetype == 'text/html' || /text\/|javascript/.test(mimetype)
        ? (mimetype +  (charset ? ';charset='+ charset : '')) 
        : mimetype
    delete header.mimetype;
    
    for(var key in header){
        head.push(key + ':' + header[key]);
    }
    head.push('', '');
    socketWrite(head.join('\r\n'));
}

function Buffer(size){
    var buffer = [];
    var maxSize = size;
    var contentSize = 0;
    this.push = function(text){
        
        buffer.push(text);
        contentSize += text.length;
    };
    this.isFull = function(){
        return contentSize >= maxSize;
    };
    this.flush = function(){
        var text = buffer.join('');
        
        socketWrite(text);
        contentSize = 0;
        buffer.length = 0;
        
    };
    this.setSize = function(size){
        maxSize = size;
    };
}


