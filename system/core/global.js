/**
* 全局对象global，全局变量分为网站级别和服务器级别
* 例如：网站级别的变量是无法被其他域名下访问的
* 方法
* getValue(key, deep) 获取指定的全局变量
* register(name, value) 注册一个全局变量
* has(name) 判断是否存在指定的全局变量
* keys() 返回所以全局变量的key，数组格式
* remove(name) 移除指定的全局变量
* clear() 移除全部的全局变量
* clearSite() 移除网站级别的全局变量
*/
var 
global = function(){ return this; }(),
scopeServer = {},
scopeSite = {};

return {
    getValue: function(key, deep){ //deep设定为深度查找，比如a.b.c 将查找global.a.b.c，默认是查找global['a.b.c']
        if(deep){
            var 
            ikey,
            i = 0,
            obj = global;
            key = key.split('.');
            while(ikey = key[i++]){
                if(ikey in obj){
                    obj = obj[ikey];
                }else{
                    return null;  
                }
            }
            return obj;
        }else{
            return global[key];
        }
    },
    register: function(name, value){ //注册一个全局变量
        if(this.has(name)){
            if(scopeSite[name] || scopeServer[name]){
                $1k.console('变量'+name +'重复注册，已经跳过注册！');
            }else{
                $1k.console('变量'+name +'已经存在，已经跳过注册！');
            }
            return;
        }
        if($1k.getContext('HTTPPATH')){ //指定域下注册，那么就以网站模式加载组件
            scopeSite[name] = 1;
        }else{
            scopeServer[name] = 1; 
        }
        global[name] = value;

    },
    has: function(name){
        return name in global;
    },
    keys: function(){
        var keys = [];
        for(var key in global){
            if(!/^(NetBox|Trace|OnAccept)$/.test(key)){ //过滤掉
                keys.push(key); 
            }
        }
        return keys;
    },
    remove: function(name){
        delete global[name];
    },
    clear: function(){
        for(var key in global){
            if(key in scopeServer || key in scopeSite){
                continue;
            }
            this.remove(key);
        }
    },
    clearSite: function(){
        for(var name in scopeSite){
            this.remove(name);
        }
    }
};
