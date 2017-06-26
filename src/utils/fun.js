/*
* 此方法演示
* eg: arr = [{a:'a',b:'b'},{a:'a',b:'b'}]
*     =>
*     {
*       arr[0].a : a,
*       arr[0].b : b,
*       arr[1].a : a,
*       arr[1].b : b
*     }
* */
export let arrObjToObj = (arr,arrName) => {
    let obj = {}
    arr.forEach((item,index)=>{
        for(let x in item){
            obj[arrName+'['+index+'].'+x] = item[x]
        }
    })
    return obj
}
/*
* 校验提示
* eg : checkTips({
        start : '您输入的',
         a : 'a',
         b : 'b',
        end : '有误'
     },{
        a : true,
        b : false
     })
   结果 : 您输入的b有误
* */
export let checkTips = (obj1,obj2) => {
    let str = obj1.start
    for(let item in obj2){
        if(!obj2[item]){
            str += obj1[item]
        }
    }
    return str += obj1.end
}
/*
* 追条回调
* eg:checkTipItem({
         start : '您输入的',
         a : 'a',
         b : 'b',
         end : '有误'
     },{
         a : true,
         b : false
     },function(d){
        console.log(d)
     })
     结果 : 'a'
            'b'
* */
export let checkTipItem = (obj1,obj2,callback) => {
    let flag = true
    for(let item in obj2){
        if(!obj2[item]){
            callback(obj1[item])
            flag = false
            break;
        }
    }
    return flag
}