/*
 * 1kbox����ļ�
 * ��ʼ������
 * ����ϵͳģ��
 * */

var netbox = NetBox,
$1k = function(){
    var
    Objects = {

    },
    ObjectIDs = {
        Shell: 'Shell',
        File: 'NetBox.File',
        Stream: 'NetBox.Stream'
    };
    return function(objectID){
        if(!Objects[objectID]){
            if(ObjectIDs[objectID]){
                return Objects[objectID] = new ActiveXObject(ObjectIDs[objectID]);
            }else{
                return null;
            }
        }
        return Objects[objectID];
    };
}();

mix($1k, {
    thread: +new Date,
    getContext: function(key){
        return key ? null : {};
    },
    
    mappath: function(path){
        return netbox.mappath(path);
    },
    
    encoding: netbox.Encoding,
    
    fs: netbox.FileSystem,
    
    alert: function(msg){
        $1k('Shell').msgbox(msg, 'ϵͳ��ʾ');
    },
    
    ver: 2.02
    
});


loads({
    console: 'core/console.js',
    Array: 'standard/Array.js',
    global: 'core/global.js',
    module: 'core/module.js',
    Error: 'core/error.js'
});
//$1k.console('���߳�'+ +new Date);
$1k.global.register('$1k', $1k);
$1k.module.register('JSON', 'system/standard/JSON.js');

loads({
    _routes: 'core/routes.js',
    site: 'core/site.js'
    
});


function loads(modules){
    var file = $1k('File');

    for(var module in modules){
        var path = NetBox.mappath('system/'+modules[module]);
        try{
            file.Open(path);
            var ret = Function('$1k', file.readText())($1k);
            ret && ($1k[module] = ret);
        }catch(e){
            $1k.console([
                '',
                '����������ģ����ش���'+ e.message.replace(/\n$/, ''),
                '�ļ�·����'+ path,
                ''
            ].join('\n'));
        }
        file.Close();
    }
}


function mix(target, source){
    for(var key in source){
        target[key] = source[key];
    }
}
