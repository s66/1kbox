//Requestģ��

module.exports = {
    init: init,
    getHeader: getHeader,
    getQuery: getQuery,
    getForm: getForm,
    getData: getData 
};
    
var header; //����ͷ��Ϣ
var query; //get��ѯ����
var form; //post��ѯ����
var data; //�ύ������

function init(options){
    header = options.header || {};
    query = options.query || {};
    form = options.form || {};
    data = options.data || null;
}
function getData(){
    return data;
}
function getHeader(key){
    return getValue(header, key);
}
function getQuery(key){
    return getValue(query, key);
}
function getForm(key){
    return getValue(form, key);
}
function getValue(hash, key){
    if(typeof key == 'undefined'){
        return hash;
    }
    return key in hash ? hash[key] : null;
}

