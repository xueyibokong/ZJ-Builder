<template>
    <div class="select-list"
         :class="isunfold ? 'select-list-isunfold' : ''">
        <input type="text"  @focusin="searchFocus" :disabled="myDisabled" @focusout="searchBlur" class="search" :placeholder="myPlaceholder" v-model="inputValue">
        <ul class="inner-select"
            :class="isunfold&&isall ? 'isunfold' : ''">
            <li class="option" @mousedown="select" v-for="item in myData.selectList.list" :value="item[myData.optionMap.value]">
                {{ item[myData.optionMap.text]}}
            </li>
        </ul>
        <ul class="top-select"
            :class="isunfold&&!isall ? 'isunfold' : ''">
            <li class="option" @mousedown="select" v-for="item in topSelectList.list" :value="item[myData.optionMap.value]">
                {{ item[myData.optionMap.text]}}
            </li>
            <span class="search-result-holder" :class="searchResultHolder?'search-result-holder-show':''">未找到匹配效果...</span>
        </ul>
    </div>

</template>

<script>
    /*
     -----父组件注入的数据【都是必输字段】-----
     url:'citylist',
     placeholder : '请选择或输入城市',
     optionMap{    //option 字段映射
        text : '',
        value : '',
        alias : ''
     },
     selectList : {
     list : []
     },
     topSelectList:{
     list : []
     }
    */

    export default {
        name: 'selectlist',
        props : ['myData','myPlaceholder','mySelected','myDisabled'],
        data  ()  {
            return {
                //组件交互变量
                inputValue:'',
                selected:'',
                isSearch:'',
                isunfold : false,
                isall : true,
                searchResultHolder : true,
                topSelectList:{
                    list : []
                }
            }
        },
        computed : {
        },
        methods :{
            searchFocus : function(e){
                let _self = this
                _self.isunfold = true
            },
            searchBlur: function(e){
                let _self = this
                _self.isunfold = false
            },
            select : function(e){
                let _self = this
                setTimeout(()=>{//定时器是为了兼容ie10以下
                    _self.selected = e.target.getAttribute('value')
                    _self.inputValue = e.target.innerText.trim()
                },100)
            },
            _emit : function(){
                let _self = this
                let temporary = ""
                _self.myData.selectList.list.forEach((o,i)=>{
                    if(_self.inputValue == o[_self.myData.optionMap.text]){
                        temporary = _self.selected = o[_self.myData.optionMap.value]
                        return
                    }
                })
                _self.$emit('listenFromChildEvent',{
                    text : _self.inputValue,
                    value : temporary
                })
            }
        },
        watch : {
            inputValue : function(val, oldVal){
                let _self = this
                _self._emit()//监听输入的值改变后更新暴露出去的值
                if(!val){
                    _self.isall = true
                    return
                }
                _self.isall = false
                _self.topSelectList.list = []
                _self.myData.selectList.list.forEach(function(item,index){
                    if(new RegExp(val).test(item[_self.myData.optionMap.alias].substr(0,val.length)) || new RegExp(val).test(item[_self.myData.optionMap.text].substr(0,val.length))){
                        _self.topSelectList.list.push(item)
                        _self.searchResultHolder = false
                    }
                })
                if(_self.topSelectList.list.length === 0){
                    _self.searchResultHolder = true
                }
            },
            'myData.selectList.list': function(val, oldVal){
                //此处监听为保证列表异步刷新后的selected重新再新的列表数据中匹配
                let _self = this
                _self.myData.selectList.list.forEach(function(item,index){
                    if(item[_self.myData.optionMap.value] + '' == _self.mySelected){
                        _self.selected = _self.mySelected
                        _self.inputValue = item[_self.myData.optionMap.text]
                    }
                })
            },
            mySelected :function(val,oldval){
                let _self = this
                if(val+'' == ''){
                    _self.selected = val
                    _self.inputValue = ''
                    return
                }
                _self.myData.selectList.list.forEach(function(item,index){
                    if(item[_self.myData.optionMap.value] + '' == val){
                        _self.selected = val
                        _self.inputValue = item[_self.myData.optionMap.text]
                    }
                })
            }
        },
        mounted () {
            //初始化匹配selected再列表中
            var _self = this
            _self.myData.selectList.list.forEach(function(item,index){
                if(item[_self.myData.optionMap.value] + '' == _self.mySelected){
                    _self.selected = _self.mySelected
                    _self.inputValue = item[_self.myData.optionMap.text]
                }
            })
        }
    }
</script>

<style lang="scss">
    $unitHeight : 180px;
    $fontSize : 26px;
    $lineHeight : $fontSize + 150px;
    $borderColor : #ccc;
    $hoverColor:#ededed;
    $activeColor:#cdcdcd;
    $padding:45px;
    $letterSpacing:2px;
    .select-list {
        width: 100%;
        border:1px solid #ccc;
        font-size:$fontSize;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        letter-spacing:$letterSpacing;
        position: relative;
        text-align: left;
    }
    .select-list.select-list-isunfold{
        -webkit-box-shadow: 0 0 15px #ccc;
        moz-box-shadow: 0 0 15px #ccc;
        box-shadow: 0 0 15px #ccc;
        z-index: 5;
    }
    .select-list:after{
        content: "";
        display: block;
        width: 0px;
        height: 0px;
        border-left:36px solid #aaaaaa;
        border-bottom:24px solid transparent;
        border-top:24px solid transparent;
        position: absolute;
        right: 0;
        top:$unitHeight/2;
        -webkit-transform: rotate(0deg) translate(-50%,-50%);
        -moz-transform: rotate(0deg) translate(-50%,-50%);
        -ms-transform: rotate(0deg) translate(-50%,-50%);
        transform: rotate(0deg) translate(-50%,-50%);
        -webkit-transform-origin: (0px 0px 0px);
        -moz-transform-origin: (0px 0px 0px);
        -ms-transform-origin: (0px 0px 0px);
        transform-origin: (0px 0px 0px);
        -webkit-transition: all .2s linear;
        -moz-transition: all .2s linear;
        -ms-transition: all .2s linear;
        transition: all .2s linear;
    }
    .select-list.select-list-isunfold:after{
        -webkit-transform: rotate(90deg) translate(-50%,-50%);
        -moz-transform: rotate(90deg) translate(-50%,-50%);
        -ms-transform: rotate(90deg) translate(-50%,-50%);
        transform: rotate(90deg) translate(-50%,-50%);
    }
    .search {
        width: 100%;
        height:$unitHeight;
        border: 0px;
        background: #efefef;
        font-size:$fontSize;
        outline: none;
        padding-left:$padding;
        padding-right: $padding + 3px;
        letter-spacing:$letterSpacing;
    }
    .inner-select,.top-select{
        width: 100%;
        max-height: 780px;
        overflow: auto;
        display:none;
    }
    .isunfold{
        display:block;
    }
    .option{
        line-height: $lineHeight;
        padding:0 $padding;
    }
    .option:nth-of-type(2n){
        background:#f7f7f7;
    }
    .option:nth-of-type(2n+1){
        background:#ffffff;
    }
    .option:hover{
        background: $hoverColor;
    }
    .option:active{
        background: $activeColor;
    }
    .search-result-holder{
        color:#cccccc;
        display: none;
        padding-left: $padding
    }
    .search-result-holder-show{
        display: block;
    }
    .disabled{

    }
</style>
