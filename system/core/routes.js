/*
* 请求分析
* 路由处理
* 
*/
var 
httpd = JSON.parse(NetBox('httpd')); //加载配置信息
$1k.module.require('global.jsa'); //加载全局设置

return routes;
function routes(socket){
    try{
        doRoutes(socket);
    }catch(e){
        socket.write(e.message);
    }
}

function doRoutes(socket){
    var context;
    var headerArr = $1k.encoding.BinToStr(socket.BinaryRead(socket.dataAvailable)).split('\r\n'); //分割请求头
    var requestLine = headerArr.shift(); //请求行
    var method = requestLine.split(' ')[0];
    var header = {}; //请求头信息
    var headerValue;
    var i = 0; 
    while(headerValue = headerArr[i++]){ //分析获取header
        headerValue = headerValue.match(/([\w\W]+?):([\w\W]*)/);
        header[headerValue[1]] = headerValue[2].replace(/^ /, '');
    }
    if(method == 'POST'){
        var post = {};
        if(headerArr[i]){
            headerArr[i].split('&').forEach(function(value){
                value = value.match(/^([^=]*)=?(.*)$/);
                post[value[1]] = value[2];
            });
        }
        
    }
    if(i + 2 < headerArr.length){
        var data = headerArr.slice(i+2).join('\r\n');
    }
    
    var code = 0;
    var Host = httpd.HOST[header['Host']];
    var mimetype = 'text/html';
    if(Host){ //请求的地址在虚拟主机的配置中
        var filepath;
        
        
        var path_search = requestLine.match(/([\w\W]*) HTTP/)[1].match(/ ([^?]*)\??([\w\W]+)?/); //访问路径和问号后面的参数
        var path = path_search[1]; //访问路径和问号后面的参数
        var fileName = '' + path.match(/[^\/]*$/);//文件名
        var filepath = Host.ROOTPATH + path;
        
        if(fileName.indexOf('.') == -1){ //没找到.，说明是目录结束，生成默认文件名
            if(fileName){ //以目录结尾，加上/，后面跟上默认的文件名，比如index.html
                fileName = '';
                filepath += '/';
            }
            var tmp_path;
            var DEFAULT_PAGE = httpd.DIRINDEX;
            for(var i = 0; i < DEFAULT_PAGE.length; i++){//扫描存在的默认文件
                tmp_path = filepath + DEFAULT_PAGE[i];
                if($1k.fs.FileExists(tmp_path)){
                    filepath = tmp_path;
                    fileName = DEFAULT_PAGE[i];
                    break;
                }
            }
        }
        
        
        if(fileName && $1k.fs.FileExists(filepath)){ //存在文件
            var ext = fileName.match(/\.([^.]+)$/)[1];//文件类型
            if(ext in httpd.MIMETYPE){ //可识别的文件类型
                
                mimetype = httpd.MIMETYPE[ext];
                if(ext in Host.ENGINE){//Js解释器处理请求的文件
                    code = 201;
                    var get = path_search[2] && function(search){
                        var query = {};
                        search.forEach(function(value){
                            value = value.match(/^([^=]*)=?(.*)$/);
                            query[value[1]] = value[2];
                            
                        });
                        return query;
                    }(path_search[2].split('&'));
                    
                    }else{//直接返回文件
                    var lastModified = ($1k.fs.GetFile(filepath)).DateLastModified;
                    if(header['If-Modified-Since'] == ''+ lastModified){ //客户端缓存时间戳
                        code = 304;  
                        }else{
                        code = 200;  
                    }
                }
                }else{//不可识别的文件类型
                code = 415;  
            }
            }else{//文件不存在
            code = 404;  
        }
        
        }else{
        Host = {}; //为了让context实现填充
        code = 418;
    }
    context = {
        socket: socket,
        lastModified: lastModified, //资源更新的时间
        CODE: code, //响应的状态码
        HTTPPATH: Host.HTTPPATH, //主机地址
        FILEPATH: filepath, //响应的文件物理地址
        ROOTPATH: Host.ROOTPATH, //主机根目录物理地址
        MIMETYPE: mimetype, //响应的媒体类型
        CODEPAGE: Host.CODEPAGE, //页码，对应网站编码
        HEADER: header, //头信息
        GET: get, //url问号后面的数据
        POST: post, //post发送的数据
        DATA: data//请求发送的数据实体
    };
    $1k.getSocket = function(){ return socket; };
    $1k.getContext = function (key){ return key? context[key] : context; };
    $1k.onConnect(context);
    
}