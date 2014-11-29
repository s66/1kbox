var httppath; //��һ��ʹ�õ�http��ַ

return {
    init: function(){
        var 
        context = $1k.getContext(),
        nowHttpPath = context.HTTPPATH;
        if(nowHttpPath && nowHttpPath != httppath){
            $1k.global.clearSite();
            httppath = nowHttpPath;
            this.onConnect = 
            this.onClose = noop;
            
            if($1k.fs.FileExists(context.ROOTPATH + '/global.jsa')){
                $1k.module.require('global.jsa');
            }
            
        }
    },
    
    onConnect: noop,  
    onClose: noop
};

function noop(){}