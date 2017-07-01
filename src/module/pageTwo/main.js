import '@static/css/common.scss'
import '@static/css/test.scss'
import './index.css'
import $ from 'jquery'
import Api from  'Api'

Api({
    method:'post',
    url:'citylist',
    responseType:'json',
    data : {
        test : 'test'
    }
})
    .then((res)=>{
        console.log(res.data)
    })
    .catch((err)=>{
        console.log(err)
    })