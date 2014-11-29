var errors = [];
function Error(error){
    errors.push(error);
}
Error.clear = function(){
    errors = [];  
};
Error.show = function(){
    if(errors.length){
        var errorsInfo = [];
        errors.forEach(function(error){
            errorsInfo.push([
                '错误描述：'+ error.info,
                '系统提示：'+ error.message.replace('\n', ''),
                '错误文件：'+ error.file
            ].join('\n'));
        });
        this.clear();
        if($1k.debug == 2){
            $1k.alert(errorsInfo.join('\n\n\n'));
        }else if($1k.debug == 1){
            $1k.console(errorsInfo.join('\n\n\n'));
        }
    }
};

return Error;
