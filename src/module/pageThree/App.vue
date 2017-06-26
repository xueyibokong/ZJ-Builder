<template>
    <div id="app">
        <ul class="search-condition">
            <selectlist class="input-list"
                        :my-placeholder="'请选择BG类型'"
                        :my-selected = "''"
                        :my-disabled="false"
                        :my-data="propBGType"
                        @listenFromChildEvent="selectBGType">
            </selectlist>
            <selectlist class="input-list"
                        :my-placeholder="'请选择城市'"
                        :my-selected = "''"
                        :my-data="propCityList"
                        @listenFromChildEvent="selectCity">
            </selectlist>
        </ul>
    </div>
</template>
<script>
    import Api from 'Api'
    //组件
    import selectlist from '@component/selectlist'
    //根组件
    export default {
        name: 'app',
        data : () => {
            let _self = this
            return {
                propBGType: {
                    optionMap:{
                        text : 'bgname',
                        value : 'bgid',
                        alias : 'alias'
                    },
                    selectList : {
                        list : [{
                            bgname:'全部',
                            bgid : '',
                            alias : 'qb'
                        },{
                            bgname:'招聘',
                            bgid : '1',
                            alias : 'zp'
                        },{
                            bgname:'房产',
                            bgid : '2',
                            alias : 'fc'
                        },{
                            bgname:'二手',
                            bgid : '3',
                            alias : 'es'
                        },{
                            bgname:'车辆',
                            bgid : '4',
                            alias : 'cl'
                        },{
                            bgname:'黄页',
                            bgid : '5',
                            alias : 'hy'
                        }]
                    }
                },
                propCityList:{
                    url:'citylist',
                    optionMap:{
                        text : 'cityName',
                        value : 'cityId',
                        alias : 'listName'
                    },
                    selectList : {
                        list : []
                    }
                }
            }
        },
        methods : {
            //--查询页--组件传值事件
            selectBGType(data){
                console.log(data)
            },
            selectCity(data){
                console.log(data)
            }
        },
        watch:{},
        components : {
            selectlist
        },
        mounted (){
            let _self = this
            //页面初始化请求城市列表数据
            Api({
                method:'post',
                url:_self.propCityList.url,
                responseType:'json'
            })
                .then((res) => {
                    if(res.data.code == '0'){
                        _self.propCityList.selectList.list = res.data.data.citylist
                    }else{
                        alert(res.data.msg)
                    }
                })
                .catch(err=>{
                    alert('链接错误！')
                })
        }
    }
</script>
<style lang="scss">
    .search-condition{
        &>*{
            width: 50% !important;
            float: left;
        }
    }
</style>