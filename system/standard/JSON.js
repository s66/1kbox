var rValidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,    
    rValidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,    
    rValidbraces = /(?:^|:|,)(?:\s*\[)+/g,
    rValidchars = /^[\],:{}\s]*$/;
    
module.exports = {
    parse: function(data){
        if (1 || rValidchars.test( 
            data.replace( rValidescape, '@' )
                .replace( rValidtokens, ']' )
                .replace( rValidbraces, '')
            ) 
        ){
            return Function('return ' + data)();
        }else{
            return null;
        }
    },
    stringify: function(obj){
        switch(typeof obj){
            case 'object':
            if(obj == null){
                return obj;
            }
            var _json = [];
            if({}.toString.apply(obj) == '[object Array]'){
                for(var e = 0, l = obj.length; e < l; e++){
                    _json[e] = arguments.callee(obj[e]);
                }
                return '['+ _json.join(',') +']';
            }
            for(e in obj){
                _json.push('"'+ e +'":'+ arguments.callee(obj[e]));
            }
            return '{'+ _json.join(',') +'}';
            case 'function':
            obj = (''+ obj).replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n');
            case 'string':
            return '"'+ obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n') +'"';
            case 'number':
            case 'boolean':
            case 'undefined':
            return obj;
        }
        return obj; 
    }
};