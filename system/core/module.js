/**
* 模块管理对象module
* 方法
* require(path) 获取一个模块句柄，path为绝对路径时或者相对路径
* register(name, path) 注册一个全局模块
*/

var Contents = NetBox.Contents;
return {
    require: function(path){
        path = ($1k.getContext('ROOTPATH') || '') +'/'+ path.replace(/^[.\/\\]+/, '');

        
        if(~path.indexOf(':')){
            //path = path
        }else{
            path = $1k.mappath(path);
        }

        try{
            if(hasCode(path)){
                var moduleCode = Contents('moduleCode.'+ path);
            }else{ //不在缓存中
                moduleCode = Contents('moduleCode.'+ path) = text(path, $1k.getContext('codepage')); //从当前位置读取
                Contents('modulesCode') += path +'```'; //存入缓存
            }
            var module = {exports:{}};
            Function('module', 'exports', moduleCode)(module, module.exports);
            return module.exports;
        }catch(e){
            $1k.console([
            '',
            '错误描述：模块加载错误，'+ e.message.replace(/\n$/, ''),
            '文件路径：'+ path,
            ''
            ].join('\n'), '系统提示2');
        }
        
    },
    register: function(name, path){
        if(!path){
            path = '/modules/'+name+'.js';
        }
        $1k.global.register(name, this.require(path)); 
    }
};


function hasCode(path){ //  regexp = /(?:```)PATH(?=```|$)/
    if(!Contents('modulesCode')){
        Contents('modulesCode') = '```';
        return 0;
    }
    return ~Contents('modulesCode').indexOf('```'+ path +'```');
}

function text(path, codepage){
    var file = new ActiveXObject('NetBox.File');
    try{
        file.Open(path);
        file.codepage = codepage || 936; //编码方式，gbk=936,utf-8=65001
        var content = file.readText();    
    }catch(e){
        throw e;
    }
    file.Close();
    return content;
}