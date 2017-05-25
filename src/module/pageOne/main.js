import Vue from 'vue'
import App from './App.vue'
import Api from 'Api'
import '@static/css/common.css'
if(ismock) require('@mockdata/host08.do')//如果生产环境也想走mock数据就不需要判断
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    mounted : () => {
        var _self = this
        Api({
            method : 'post',
            url : '/host08',
            data : {
                "transcode" : "selectmsg"
            }
        })
            .then(function(res){
                console.log('%c%s','color:green','requestResult',res.data)
            })
    }
})