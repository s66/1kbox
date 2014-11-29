/**
* ģ��������module
* ����
* require(path) ��ȡһ��ģ������pathΪ����·��ʱ�������·��
* register(name, path) ע��һ��ȫ��ģ��
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
            }else{ //���ڻ�����
                moduleCode = Contents('moduleCode.'+ path) = text(path, $1k.getContext('codepage')); //�ӵ�ǰλ�ö�ȡ
                Contents('modulesCode') += path +'```'; //���뻺��
            }
            var module = {exports:{}};
            Function('module', 'exports', moduleCode)(module, module.exports);
            return module.exports;
        }catch(e){
            $1k.console([
            '',
            '����������ģ����ش���'+ e.message.replace(/\n$/, ''),
            '�ļ�·����'+ path,
            ''
            ].join('\n'), 'ϵͳ��ʾ2');
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
        file.codepage = codepage || 936; //���뷽ʽ��gbk=936,utf-8=65001
        var content = file.readText();    
    }catch(e){
        throw e;
    }
    file.Close();
    return content;
}