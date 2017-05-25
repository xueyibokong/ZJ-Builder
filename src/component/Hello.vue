<template>
    <div id="hello">
        {{ msg }}
    </div>
</template>

<script>

    export default {
        name: 'hello',
        data : () => {
            return {
                msg : "This my test page Hello"
            }
        }
    }
</script>

<style lang="postcss">
    #hello{
        font-size:12px;
    }

</style>
