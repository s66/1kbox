/*
* �������
* ·�ɴ���
* 
*/
var 
httpd = JSON.parse(NetBox('httpd')); //����������Ϣ
$1k.module.require('global.jsa'); //����ȫ������

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
    var headerArr = $1k.encoding.BinToStr(socket.BinaryRead(socket.dataAvailable)).split('\r\n'); //�ָ�����ͷ
    var requestLine = headerArr.shift(); //������
    var method = requestLine.split(' ')[0];
    var header = {}; //����ͷ��Ϣ
    var headerValue;
    var i = 0; 
    while(headerValue = headerArr[i++]){ //������ȡheader
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
    if(Host){ //����ĵ�ַ������������������
        var filepath;
        
        
        var path_search = requestLine.match(/([\w\W]*) HTTP/)[1].match(/ ([^?]*)\??([\w\W]+)?/); //����·�����ʺź���Ĳ���
        var path = path_search[1]; //����·�����ʺź���Ĳ���
        var fileName = '' + path.match(/[^\/]*$/);//�ļ���
        var filepath = Host.ROOTPATH + path;
        
        if(fileName.indexOf('.') == -1){ //û�ҵ�.��˵����Ŀ¼����������Ĭ���ļ���
            if(fileName){ //��Ŀ¼��β������/���������Ĭ�ϵ��ļ���������index.html
                fileName = '';
                filepath += '/';
            }
            var tmp_path;
            var DEFAULT_PAGE = httpd.DIRINDEX;
            for(var i = 0; i < DEFAULT_PAGE.length; i++){//ɨ����ڵ�Ĭ���ļ�
                tmp_path = filepath + DEFAULT_PAGE[i];
                if($1k.fs.FileExists(tmp_path)){
                    filepath = tmp_path;
                    fileName = DEFAULT_PAGE[i];
                    break;
                }
            }
        }
        
        
        if(fileName && $1k.fs.FileExists(filepath)){ //�����ļ�
            var ext = fileName.match(/\.([^.]+)$/)[1];//�ļ�����
            if(ext in httpd.MIMETYPE){ //��ʶ����ļ�����
                
                mimetype = httpd.MIMETYPE[ext];
                if(ext in Host.ENGINE){//Js����������������ļ�
                    code = 201;
                    var get = path_search[2] && function(search){
                        var query = {};
                        search.forEach(function(value){
                            value = value.match(/^([^=]*)=?(.*)$/);
                            query[value[1]] = value[2];
                            
                        });
                        return query;
                    }(path_search[2].split('&'));
                    
                    }else{//ֱ�ӷ����ļ�
                    var lastModified = ($1k.fs.GetFile(filepath)).DateLastModified;
                    if(header['If-Modified-Since'] == ''+ lastModified){ //�ͻ��˻���ʱ���
                        code = 304;  
                        }else{
                        code = 200;  
                    }
                }
                }else{//����ʶ����ļ�����
                code = 415;  
            }
            }else{//�ļ�������
            code = 404;  
        }
        
        }else{
        Host = {}; //Ϊ����contextʵ�����
        code = 418;
    }
    context = {
        socket: socket,
        lastModified: lastModified, //��Դ���µ�ʱ��
        CODE: code, //��Ӧ��״̬��
        HTTPPATH: Host.HTTPPATH, //������ַ
        FILEPATH: filepath, //��Ӧ���ļ������ַ
        ROOTPATH: Host.ROOTPATH, //������Ŀ¼�����ַ
        MIMETYPE: mimetype, //��Ӧ��ý������
        CODEPAGE: Host.CODEPAGE, //ҳ�룬��Ӧ��վ����
        HEADER: header, //ͷ��Ϣ
        GET: get, //url�ʺź��������
        POST: post, //post���͵�����
        DATA: data//�����͵�����ʵ��
    };
    $1k.getSocket = function(){ return socket; };
    $1k.getContext = function (key){ return key? context[key] : context; };
    $1k.onConnect(context);
    
}