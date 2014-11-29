var AP = Array.prototype;
if( !AP.indexOf ){
    /*
     * ECMAScript 5 15.4.4.14
     * 查找某数组元素在数组中的索引，不包含则返回-1
     * @param { Anything } 数组元素
     * @param { Number } 查找的起始索引，负数则是数组末尾的偏移量( -2 => len - 2 )
     * @return { String } 索引值
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
    // lastIndexOf为indexOf的反转版，lastIndexOf是从右到左的查找顺序，indexOf是从左到右的查找顺序
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
     * 遍历数组并执行回调，如果每个数组元素都满足回调函数的测试则返回true，否则返回false
     * @param { Function } 回调函数( argument : 数组元素, 数组索引, 数组 )
     * @param { Object } this的指向对象，默认为window
     * @return { Boolean } 每个数组元素是否通过回调的测试
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
     * 遍历数组并执行回调，如果其中一个数组元素满足回调函数的测试则返回true，否则返回false
     * @param { Function } 回调函数( argument : 数组元素, 数组索引, 数组 )
     * @param { Object } this的指向对象，默认为window
     * @return { Boolean } 其中一个数组元素是否通过回调的测试
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
     * 遍历数组并执行回调
     * @param { Function } 回调函数( argument : 数组元素, 数组索引, 数组 )
     * @param { Object } this的指向对象，默认为window
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
     * 遍历数组并执行回调，根据回调函数的返回值合并成一个新数组
     * @param { Function } 回调函数( argument : 数组元素, 数组索引, 数组 )
     * @param { Object } this的指向对象，默认为window
     * @return { Array } 新数组
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
     * 遍历数组并执行回调，将满足回调函数测试的数组元素过滤到一个新的数组中，原数组保持不变。
     * @param { Function } 回调函数( argument : 数组元素, 数组索引, 数组 )
     * @param { Object } this的指向对象，默认为window
     * @return { Array } 新数组
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
     * 遍历数组并执行回调，将previous元素与next元素传入回调函数中进行计算，
     * 回调的返回值作为previous元素继续与next元素再进行计算，最后返回计算结果
     * @param { Function } 回调函数( argument : previous, next, 数组索引, 数组 )
     * @param { Anything } previous的初始值，默认为数组的第一个元素，
     * 无参时从0索引开始遍历，有参时从1开始遍历
     * @return { Anything } 遍历数组后的计算结果
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
    // 该方法是reduce的反转版，只是计算顺序是从右到左，reduce是从左到右
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

// 修复IE6-7的unshift不返回数组长度的BUG
if( [].unshift(1) !== 1 ){
    var unshift = AP.unshift;
    AP.unshift = function(){
        unshift.apply( this, arguments );
        return this.length;
    };
}