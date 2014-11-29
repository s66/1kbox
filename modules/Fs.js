//�ļ�����ģ��
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
        throw { message: "ϵͳ�Ҳ����ļ�" + path};
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
        throw { message: "ϵͳ�Ҳ����ļ�" + path};
    }
    file.Close();
}
function readText(path, codepage){
    var file = new ActiveXObject('NetBox.File');
    try{
        file.Open(path);
        file.codepage = codepage || CODEPAGE;//���뷽ʽ��gbk=936,utf-8=65001
        var content = file.readText();    
    }catch(e){
        $1k.Error({
            info: '��ȡ�ļ���������',
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
        if(file.ReadText() == content){//û�иı�
            file.Close();
            return;
        }else{//ɾ���ϵ�
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
    createDeepFolder(parentPath(targetPath)); //����Ŀ���ļ��в����ڣ��򴴽�
    writeText(targetPath, text, codepage);
}
function syncFile(targetPath, sourcePath){
    targetPath = formatPath(targetPath);
    sourcePath = formatPath(sourcePath);
    var hasUpdate = 0;

    if(!fileExists(targetPath)){
        createDeepFolder(parentPath(targetPath)); //����Ŀ���ļ��в����ڣ��򴴽�
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
    /*filterΪ�����������������������ļ������ļ�������
    filter = {
        matchFile: /\.js$/, //ƥ��.js��β���ļ�
        skipFile: /\.res\.js$/, //����.res.js��β���ļ�
        matchFolder: /.+/, //ƥ�������ļ���
        skipFolder: /\.res$/ //������βʱ.res���ļ���
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
            if( //������ƥ���ڹ��˵��߼�������ƥ������������ģ��ڽ���н��й��� 
                (!matchFolder || matchFolder.test(folder)) //û��ƥ��������������ƥ������
                && (!skipFolder || !skipFolder.test(folder)) //û�������������߲�������������
            ){
            
                if(!fs.FileExists(target)){ //Ŀ���ļ��в�����
                    fs.CreateFolder(target); //����֮
                    $1k.Console('�����ļ��У�'+ target);
                }
                var files = folder.Files;
                var file;
                
                for(var i = 1; i <= files.count; i++){
                    file = files(i);
                    if( //ƥ��͹�������
                        (!matchFile || matchFile.test(file))
                        && (!skipFile || !skipFile.test(file))
                    ){
                        var targetPath = target +'/'+ file.Name;
                        if(fs.FileExists(targetPath)){ //�ж��ļ��Ƿ����
                            var oldFile = fs.GetFile(targetPath);
                            
                            if(+file.DateLastModified != +oldFile.DateLastModified){ //�Ա��ļ��޸�ʱ��
                                if(file.size != oldFile.size){ //�Ա��ļ���С
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
                    $1k.Console('�����ļ���'+ file.path);
                }
                
                var subfolders = folder.SubFolders;
                var subfolder;
                for(var i = 1; i <= subfolders.count; i++){
                    subfolder = subfolders(i);
                    copyEach(subfolder, target +'/'+ subfolder.Name); //�����������ļ������������
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
        while(subFolder = pathArr.shift()){ //����һ��㴴��Ŀ¼
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
        if( //������ƥ���ڹ��˵��߼�������ƥ������������ģ��ڽ���н��й��� 
            (!matchFolder || matchFolder.test(folder)) //û��ƥ��������������ƥ������
            && (!skipFolder || !skipFolder.test(folder)) //û�������������߲�������������
        ){
            var 
            files = folder.Files,
            count = files.count,
            file;
            for(var i = 1; i <= count; i++){
                file = files(i);
                if( //ƥ��͹�������
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
                    each(subfolders(i)); //�����������ļ������������
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
