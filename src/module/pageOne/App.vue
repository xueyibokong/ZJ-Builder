<template>
    <div id="app">
        {{ msg }}
        <div @click="aj"> click </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'app',
        data : () => {
            return {
                msg : "This my test pageOne"
            }
        },
        methods : {
            aj () {
                axios({
                    method : 'post',
                    url : 'host08/userinfo',
                    data : {
                        "transcode" : "selectmsg"
                    }
                })
                    .then(function(res){
                        console.log('%c%s','color:green','requestResult',res.data)
                    })
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
