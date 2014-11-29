/*
 * JSģ������Zero
 * */
var CODEPAGE = 0;
 
function Zero(options){
    options = options || {};
    var content = [];
    var codepage = options.codepage || CODEPAGE;
    var activecodeStr = '';
    var activecodePath = '';
    this.push = push;
    this.render = render;
    this.mappath = mappath;
    this.getContent = getContent;
    this.clearContent = clearContent;
    this.inc = inc;
    
    var output = options.output || null;
    
    function push(text){

        try{
            text = ''+text;
            content.push(text);
            output && output(text);
        }catch(e){
           return $1k.Error({
                info: 'Zero.push�Ĳ�������',
                message: e.message,
                file: activecodePath
            });
        }            
        
        
    }
    function render(templateStr, path){ //����ģ��templateStr��pathΪ��ǰģ���ļ����ڵĵ�ַ������$inc��������ģ��ʱ����Ϊ��ʼ·��
        var lChar = '<?'; //���ָ���
        var rChar = '?>'; //�Ҳ�ָ���
        
        var templateArr = templateStr.replace(/@(<[?%])|(<([?%])(?:@\3>|[\w\W])+?\3>)/g, function(all, zy, zcode, fchar){
            
            switch(!1){
                case !zy: //ת�塺@<? => <?��
                return zy;
                case !zcode: //ת�塺@?> => ?>�� fchar = ?|%
                lChar = '<'+ fchar;
                rChar = fchar +'>';
                zcode = zcode.replace(RegExp('@['+ fchar +']>', 'g'), rChar)
                .replace(/(@`)|`((?:@`|[^`])+)`/g, function(all, zy, templateStr){
                    switch(!1){
                        case !zy:
                        return '`';
                        case !templateStr:
                        return '\''+ templateStr
                        .replace(/\\/g, '\\\\')
                        .replace(/\r/g, '\\r')
                        .replace(/\n/g, '\\n')
                        .replace(/'/g, '\\\'')
                        .replace(/@`/g, '`')
                        +'\'';
                    }
                    
                });
                //��(<?...?>)��  => ��?><?(<?...?>)<?��
                return (rChar + lChar) + zcode + (lChar);
                
            }
            
        }).split(rChar + lChar);;
        
        
        
        var str;
        for(var i = 0, lg = templateArr.length; i < lg; i++){
            str = templateArr[i];
            if(~str.indexOf(lChar)){ //ִ��js������
                
                try{
                    activecodePath = path = mappath(path); //��ǰģ�����ʼλ�õľ���·��
                    activecodeStr = str.substr(2);
                    Function(
                        '$PATH',
                        '$inc',
                        '$require',
                        '$mappath',
                        '$push',
                        '$each',
                        'NetBox',
                        'ActiveXObject',
                        activecodeStr
                    )(
                        path,
                        function(filepath){
                            inc(mappath(filepath, path));
                        },
                        function(filepath){
                            return require(mappath(filepath, path), path);
                        },
                        function(filepath){
                            return mappath(filepath, path);
                        },
                        push,
                        each
                    );
                }catch(e){
                    
                    $1k.Error({
                        info: 'Zeroִ�г��ִ���',
                        message: e.message,
                        file: path,
                        code: activecodeStr
                    });
                }
                
            }else{
                
                push(str.replace(/(?:@([@?%{]))|\{([\w$.]+)\}/g, function(all, zy, vari){
                    if(zy){
                        return zy;
                    }
                    if(vari){
                        var v2 = $1k.global.getValue(vari, true);
                        if(/string|number/.test(typeof v2)){
                            return v2;
                        }else{
                            return '{'+ vari +'}';
                        }
                    }
                }));
                
            }
        }
        
    }
    function mappath(filepath, parentPath){ //��filepathת���������parentPath�ľ���·��
        if(filepath.indexOf('/') == 0){
            return $ROOTPATH + filepath;
        }else if(filepath.indexOf('./') == 0){
            filepath = filepath.substr(2);
        }
        filepath = filepath.replace(/\\/g, '/');
        if(filepath.indexOf(':') == -1){
            parentPath = parentPath.replace(/\/[^\/]+$/, ''); //ȥ���ļ���
            filepath = filepath.replace(/\.\.\//g, function(){
                parentPath = parentPath.replace(/\/[^\/]+$/,'');
            });
            return (parentPath+'/'+filepath).replace(/\/\//g, '/');
        }
        return filepath;
    }
    function getContent(){
        return content.join('');
    }
    function clearContent(){
        content = [];
    }
    function inc(path){
        render(Fs.readText(path, codepage || CODEPAGE), path); 
    }
    function require(filepath, path){
        var str = Fs.readText(filepath, codepage || CODEPAGE);
        var module = {exports:{}};
        
        try{
            Function('module', 'exports', '$mappath', '$each', '$require', str)(module, module.exports, function(pathIn){
                return mappath(pathIn, filepath);
            }, each, function(pathIn){
                return require(mappath(pathIn, filepath), filepath);
            });
            return module.exports;
        }catch(e){
            $1k.Error({
                info: 'Zero.require����ģ����ִ���',
                message: e.message,
                file: filepath,
                code: str
            });
        }
    }
}

function each(obj, func){
	var isArray = {}.toString.call(obj) == '[object Array]';
	if(typeof obj == 'number'){
		for(var i = 0; i < obj; i++){
			func.call(i, i);
		}
	}else if(isArray){
		for(var i = 0, lg = obj.length; i < lg; i++){
            if(func.call(obj, obj[i], i)){
                break;
            }
		}
	}else{
		for(var key in obj){
            if(func.call(obj, obj[key], key)){
                break;
            }
		}
	}
}
Zero.getContent = function(options, codepage){
    if(typeof options == 'string'){
        options = {
            path: options,
            codepage: codepage
        };
    }
    var z = new Zero({
        codepage: options.codepage
    });
    if(options.text){
        z.render(options.text, options.path || './');
    }else{
        z.inc(options.path); 
    }
    return z.getContent();
};
Zero.codepage = function(codepage){
    CODEPAGE = codepage || 0;
};

module.exports = Zero;





