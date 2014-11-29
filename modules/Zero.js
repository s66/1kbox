/*
 * JS模板引擎Zero
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
                info: 'Zero.push的参数错误',
                message: e.message,
                file: activecodePath
            });
        }            
        
        
    }
    function render(templateStr, path){ //解析模板templateStr，path为当前模板文件所在的地址，用于$inc导入其他模板时候作为起始路径
        var lChar = '<?'; //左侧分隔符
        var rChar = '?>'; //右侧分隔符
        
        var templateArr = templateStr.replace(/@(<[?%])|(<([?%])(?:@\3>|[\w\W])+?\3>)/g, function(all, zy, zcode, fchar){
            
            switch(!1){
                case !zy: //转义『@<? => <?』
                return zy;
                case !zcode: //转义『@?> => ?>』 fchar = ?|%
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
                //『(<?...?>)』  => 『?><?(<?...?>)<?』
                return (rChar + lChar) + zcode + (lChar);
                
            }
            
        }).split(rChar + lChar);;
        
        
        
        var str;
        for(var i = 0, lg = templateArr.length; i < lg; i++){
            str = templateArr[i];
            if(~str.indexOf(lChar)){ //执行js解释器
                
                try{
                    activecodePath = path = mappath(path); //当前模板的起始位置的绝对路径
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
                        info: 'Zero执行出现错误',
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
    function mappath(filepath, parentPath){ //将filepath转化成相对于parentPath的绝对路径
        if(filepath.indexOf('/') == 0){
            return $ROOTPATH + filepath;
        }else if(filepath.indexOf('./') == 0){
            filepath = filepath.substr(2);
        }
        filepath = filepath.replace(/\\/g, '/');
        if(filepath.indexOf(':') == -1){
            parentPath = parentPath.replace(/\/[^\/]+$/, ''); //去除文件名
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
                info: 'Zero.require加载模块出现错误',
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





