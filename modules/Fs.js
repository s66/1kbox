//文件操作模块
var CODEPAGE = 0;
var fs = NetBox.FileSystem;
function codepage(codepage){
    CODEPAGE = codepage || 0;
}
function read(path){
    var file = new ActiveXObject('NetBox.File');
    try{
        file.Open(path);
        var content = file.Read();
    }catch(e){
        throw { message: "系统找不到文件" + path};
    }
    file.Close();
    return content;
}
function write(path, content){
    var file = new ActiveXObject('NetBox.File');
    try{
        file.Open(path, 2, 16);
        file.write(content);
    }catch(e){
        throw { message: "系统找不到文件" + path};
    }
    file.Close();
}
function readText(path, codepage){
    var file = new ActiveXObject('NetBox.File');
    try{
        file.Open(path);
        file.codepage = codepage || CODEPAGE;//编码方式，gbk=936,utf-8=65001
        var content = file.readText();    
    }catch(e){
        $1k.Error({
            info: '读取文件发生错误',
            message: e.message,
            file: path
        });
    }
    file.Close();
    return content;
}
function writeText(path, content, codepage){
    var file = new ActiveXObject('NetBox.File');
    codepage = codepage || CODEPAGE;
    if(fileExists(path)){
        file.Open(path);
        file.codepage = codepage;
        if(file.ReadText() == content){//没有改变
            file.Close();
            return;
        }else{//删除老的
            file.Close();
            deleteFile(path);
        }
    }
    file.Create(path);
    file.codepage = codepage;
    file.WriteText(content);
    file.Close();
}
function deleteFile(path){
    fs.DeleteFile(path);
}
function fileExists(path){
    return fs.FileExists(path);
}
function createFolder(foldername){
    fs.CreateFolder(foldername);
}
function getFolder(foldername){
    return fs.GetFolder(foldername);
}
function getFile(path){
    return fs.GetFile(path);
}
function getExt(path){
    return fs.GetExtensionName(path);
}
function formatPath(path){
    return fs.BuildPath(path).replace(/\\/g, '/');
}
function parentPath(path){
    return fs.GetParentFolderName(path);
}
function syncText(targetPath, text, codepage){
    createDeepFolder(parentPath(targetPath)); //假如目标文件夹不存在，则创建
    writeText(targetPath, text, codepage);
}
function syncFile(targetPath, sourcePath){
    targetPath = formatPath(targetPath);
    sourcePath = formatPath(sourcePath);
    var hasUpdate = 0;

    if(!fileExists(targetPath)){
        createDeepFolder(parentPath(targetPath)); //假如目标文件夹不存在，则创建
        hasUpdate = 1;
    }else{
        var targetFile = getFile(targetPath);
        var sourceFile = getFile(sourcePath);
        if(+targetFile.dateLastModified != +sourceFile.dateLastModified){
            hasUpdate = 1;
        }
    }
    if(hasUpdate){
        fs.CopyFile(sourcePath, targetPath, true);
    }
}

function syncFolder(to, from, filter){
    /*filter为过滤器，过滤条件可以是文件或者文件夹名称
    filter = {
        matchFile: /\.js$/, //匹配.js结尾的文件
        skipFile: /\.res\.js$/, //跳过.res.js结尾的文件
        matchFolder: /.+/, //匹配所有文件夹
        skipFolder: /\.res$/ //跳过结尾时.res的文件夹
    };
    */
    try{
        var startTime = +new Date;
        
        filter = filter || {};
        var matchFolder = filter.matchFolderRegExp;
        var skipFolder = filter.skipFolderRegExp;
        var matchFile = filter.matchFileRegExp;
        var skipFile = filter.skipFileRegExp;
        
        var folder = fs.GetFolder(from);
        copyEach(folder, to);
        
        function copyEach(folder, target){
            if( //采用先匹配在过滤的逻辑，即先匹配出满足条件的，在结果中进行过滤 
                (!matchFolder || matchFolder.test(folder)) //没有匹配条件或者满足匹配条件
                && (!skipFolder || !skipFolder.test(folder)) //没有跳过条件或者不满足跳过条件
            ){
            
                if(!fs.FileExists(target)){ //目标文件夹不存在
                    fs.CreateFolder(target); //创建之
                    $1k.Console('创建文件夹：'+ target);
                }
                var files = folder.Files;
                var file;
                
                for(var i = 1; i <= files.count; i++){
                    file = files(i);
                    if( //匹配和过滤条件
                        (!matchFile || matchFile.test(file))
                        && (!skipFile || !skipFile.test(file))
                    ){
                        var targetPath = target +'/'+ file.Name;
                        if(fs.FileExists(targetPath)){ //判断文件是否存在
                            var oldFile = fs.GetFile(targetPath);
                            
                            if(+file.DateLastModified != +oldFile.DateLastModified){ //对比文件修改时间
                                if(file.size != oldFile.size){ //对比文件大小
                                    copyFile();
                                }
                            }
                            
                        }else{ 
                            copyFile(); 
                        }
                    }
                    
                }  
                function copyFile(){
                    fs.CopyFile(file.path, targetPath, true);
                    $1k.Console('拷贝文件：'+ file.path);
                }
                
                var subfolders = folder.SubFolders;
                var subfolder;
                for(var i = 1; i <= subfolders.count; i++){
                    subfolder = subfolders(i);
                    copyEach(subfolder, target +'/'+ subfolder.Name); //继续处理子文件夹里面的数据
                }
            }
        }
        
    }catch(e){
        $1k.Console(e.message);
    }
}
function createDeepFolder(path){
    path = formatPath(path);
    
    if(!fileExists(path)){
        var pathArr = path.split('/');
        var root = pathArr.shift();
        var subFolder;
        while(subFolder = pathArr.shift()){ //遍历一层层创建目录
            root += '/'+ subFolder;
            if(!fileExists(root)){
                createFolder(root);
            }
        }
    }
}

function eachFiles(from, filter, deep, fn){
	var args = arguments;
	var len = args.length;
	if(len == 2){
		fn = filter;
		var files = fs.GetFolder(from).Files;
		for(var i = 1, count = files.count; i <= count; i++){
		   fn(files(i));
		}
		return;
	}else if(len == 3){
		fn = deep;
		deep = false;
	}
	
	filter = filter || {};
    var 
    matchFolder = filter.matchFolder,
    skipFolder = filter.skipFolder,
    matchFile = filter.matchFile,
    skipFile = filter.skipFile;
    each(fs.GetFolder(from));
    function each(folder){
        if( //采用先匹配在过滤的逻辑，即先匹配出满足条件的，在结果中进行过滤 
            (!matchFolder || matchFolder.test(folder)) //没有匹配条件或者满足匹配条件
            && (!skipFolder || !skipFolder.test(folder)) //没有跳过条件或者不满足跳过条件
        ){
            var 
            files = folder.Files,
            count = files.count,
            file;
            for(var i = 1; i <= count; i++){
                file = files(i);
                if( //匹配和过滤条件
                    (!matchFile || matchFile.test(file))
                    && (!skipFile || !skipFile.test(file))
                ){
                    fn(file);
                }
            }
            if(deep){
                var 
                subfolders = folder.SubFolders,
                count = subfolders.count;
                for(var i = 1; i <= subfolders.count; i++){
                    each(subfolders(i)); //继续处理子文件夹里面的数据
                }
            }
        }
    }
    
}
function ext(fileInfo){
    var ext = fileInfo.name.match(/\.([^.\/]+)$/);
    return ext ? ext[1] : '';
}
module.exports = {
    codepage: codepage,
    read: read,
    readText: readText,
    writeText: writeText,
    exists: fileExists,
    'delete': deleteFile,
    createFolder: createFolder,
    getFolder: getFolder,
    getFile: getFile,
    getExt: getExt,
    syncText: syncText,
    syncFile: syncFile,
    syncFolder: syncFolder,
    eachFiles: eachFiles,
    ext: ext,
    //createDeepFolder: createDeepFolder,
    end: 0
};
