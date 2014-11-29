var AP = Array.prototype;
if( !AP.indexOf ){
    /*
     * ECMAScript 5 15.4.4.14
     * ����ĳ����Ԫ���������е��������������򷵻�-1
     * @param { Anything } ����Ԫ��
     * @param { Number } ���ҵ���ʼ������������������ĩβ��ƫ����( -2 => len - 2 )
     * @return { String } ����ֵ
     */
    AP.indexOf = function( item, i ){
        var len = this.length;
            
        i = parseInt( i ) || 0;
            
        if( i < 0 ){
            i += len;
        }

        for( ; i < len; i++ ){
            if( this[i] === item ){
                return i;
            }
        }
        
        return -1;
    };
}

if( !AP.lastIndexOf ){
    // ECMAScript 5 15.4.4.15
    // lastIndexOfΪindexOf�ķ�ת�棬lastIndexOf�Ǵ��ҵ���Ĳ���˳��indexOf�Ǵ����ҵĲ���˳��
    AP.lastIndexOf = function( item, i ){
        var len = this.length;
        
        i = parseInt( i ) || len - 1;
        
        if( i < 0 ){
            i += len;
        }
        
        for( ; i >= 0; i-- ){
            if( this[i] === item ){
                return i;
            }
        }
        
        return -1;
    };
}
    
if( !AP.every ){
    /*
     * ECMAScript 5 15.4.4.16
     * �������鲢ִ�лص������ÿ������Ԫ�ض�����ص������Ĳ����򷵻�true�����򷵻�false
     * @param { Function } �ص�����( argument : ����Ԫ��, ��������, ���� )
     * @param { Object } this��ָ�����Ĭ��Ϊwindow
     * @return { Boolean } ÿ������Ԫ���Ƿ�ͨ���ص��Ĳ���
     */
    AP.every = function( fn, context ){
        var len = this.length,
            i = 0;
    
        for( ; i < len; i++ ){
            if( !fn.call(context, this[i], i, this) ){
                return false;
            }
        }
        
        return true;
    };
}

if( !AP.some ){
    /*
     * ECMAScript 5 15.4.4.17
     * �������鲢ִ�лص����������һ������Ԫ������ص������Ĳ����򷵻�true�����򷵻�false
     * @param { Function } �ص�����( argument : ����Ԫ��, ��������, ���� )
     * @param { Object } this��ָ�����Ĭ��Ϊwindow
     * @return { Boolean } ����һ������Ԫ���Ƿ�ͨ���ص��Ĳ���
     */
    AP.some = function( fn, context ){
        var len = this.length,
            i = 0;
    
        for( ; i < len; i++ ){
            if( fn.call(context, this[i], i, this) ){
                return true;
            }
        }
        
        return false;
    };
}
    
if( !AP.forEach ){
    /*
     * ECMAScript 5 15.4.4.18     
     * �������鲢ִ�лص�
     * @param { Function } �ص�����( argument : ����Ԫ��, ��������, ���� )
     * @param { Object } this��ָ�����Ĭ��Ϊwindow
     */
    AP.forEach = function( fn, context ){        
        var len = this.length,
            i = 0;
            
        for( ; i < len; i++ ){
            fn.call( context, this[i], i, this );
        }
    };
}

if( !AP.map ){
    /*
     * ECMAScript 5 15.4.4.19
     * �������鲢ִ�лص������ݻص������ķ���ֵ�ϲ���һ��������
     * @param { Function } �ص�����( argument : ����Ԫ��, ��������, ���� )
     * @param { Object } this��ָ�����Ĭ��Ϊwindow
     * @return { Array } ������
     */
    AP.map = function( fn, context ){
        var len = this.length,
            arr = [],
            i = 0,
            j = 0;
        
        for( ; i < len; i++ ){
            arr[ j++ ] = fn.call( context, this[i], i, this );
        }
        
        return arr;
    };
}

if( !AP.filter ){
    /*
     * ECMAScript 5 15.4.4.20 
     * �������鲢ִ�лص���������ص��������Ե�����Ԫ�ع��˵�һ���µ������У�ԭ���鱣�ֲ��䡣
     * @param { Function } �ص�����( argument : ����Ԫ��, ��������, ���� )
     * @param { Object } this��ָ�����Ĭ��Ϊwindow
     * @return { Array } ������
     */
    AP.filter = function( fn, context ){
        var len = this.length,
            arr = [],
            i = 0,
            j = 0,
            result;

        for( ; i < len; i++ ){
            result = this[i];
            
            if( fn.call(context, result, i, this) ){
                arr[ j++ ] = result;
            }
        }
        
        return arr;        
    };
}
    
if( !AP.reduce ){
    /*
     * ECMAScript 5 15.4.4.21    
     * �������鲢ִ�лص�����previousԪ����nextԪ�ش���ص������н��м��㣬
     * �ص��ķ���ֵ��ΪpreviousԪ�ؼ�����nextԪ���ٽ��м��㣬��󷵻ؼ�����
     * @param { Function } �ص�����( argument : previous, next, ��������, ���� )
     * @param { Anything } previous�ĳ�ʼֵ��Ĭ��Ϊ����ĵ�һ��Ԫ�أ�
     * �޲�ʱ��0������ʼ�������в�ʱ��1��ʼ����
     * @return { Anything } ���������ļ�����
     */     
    AP.reduce = function( fn, result ){        
        var len = this.length,
            i = 0;
            
        if( result === undefined ){
            result = this[i++];
        }
        
        for( ; i < len; i++ ){
            result = fn( result, this[i], i, this );
        }
        
        return result;
    };
}

if( !AP.reduceRight ){
    // ECMAScript 5 15.4.4.22
    // �÷�����reduce�ķ�ת�棬ֻ�Ǽ���˳���Ǵ��ҵ���reduce�Ǵ�����
    AP.reduceRight = function( fn, result ){
        var len = this.length,
            i = len - 1;
            
        if( result === undefined ){
            result = this[i--];
        }
        
        for( ; i >= 0; i-- ){
            result = fn( result, this[i], i, this );
        }
        
        return result;
    };    
}

// �޸�IE6-7��unshift���������鳤�ȵ�BUG
if( [].unshift(1) !== 1 ){
    var unshift = AP.unshift;
    AP.unshift = function(){
        unshift.apply( this, arguments );
        return this.length;
    };
}