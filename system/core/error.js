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
                '����������'+ error.info,
                'ϵͳ��ʾ��'+ error.message.replace('\n', ''),
                '�����ļ���'+ error.file
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
