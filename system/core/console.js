var console;
return function(msg){
    if(!console){
        console = $1k('Shell').Console;
        console.Caption = '��ʽ��Ϣ';
    }
    console.WriteLine((new Date+'').match(/\d+:\d+:\d+/)+' '+ [].slice.call(arguments, 0).join(',')); 
};    
