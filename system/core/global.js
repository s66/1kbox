/**
* ȫ�ֶ���global��ȫ�ֱ�����Ϊ��վ����ͷ���������
* ���磺��վ����ı������޷������������·��ʵ�
* ����
* getValue(key, deep) ��ȡָ����ȫ�ֱ���
* register(name, value) ע��һ��ȫ�ֱ���
* has(name) �ж��Ƿ����ָ����ȫ�ֱ���
* keys() ��������ȫ�ֱ�����key�������ʽ
* remove(name) �Ƴ�ָ����ȫ�ֱ���
* clear() �Ƴ�ȫ����ȫ�ֱ���
* clearSite() �Ƴ���վ�����ȫ�ֱ���
*/
var 
global = function(){ return this; }(),
scopeServer = {},
scopeSite = {};

return {
    getValue: function(key, deep){ //deep�趨Ϊ��Ȳ��ң�����a.b.c ������global.a.b.c��Ĭ���ǲ���global['a.b.c']
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
    register: function(name, value){ //ע��һ��ȫ�ֱ���
        if(this.has(name)){
            if(scopeSite[name] || scopeServer[name]){
                $1k.console('����'+name +'�ظ�ע�ᣬ�Ѿ�����ע�ᣡ');
            }else{
                $1k.console('����'+name +'�Ѿ����ڣ��Ѿ�����ע�ᣡ');
            }
            return;
        }
        if($1k.getContext('HTTPPATH')){ //ָ������ע�ᣬ��ô������վģʽ�������
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
            if(!/^(NetBox|Trace|OnAccept)$/.test(key)){ //���˵�
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
