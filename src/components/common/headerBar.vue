<template>
    <div class='header_bg'>
        <el-tooltip content="退出" placement="bottom">
            <i class='el-icon-denglu iconfont outlogin'></i>
        </el-tooltip>
    </div>
</template>
<script>
export default {
    name:'headerBar',
    data(){
        return{

        }
    }    
}
</script>
<style>
.header_bg{
    background-color:#009588 !important;
    height:3.5em;
    width:100%;
}
.outlogin{
    color:white;
    font-size:2em;
    margin:.5em 1em;
    cursor:pointer;
    float:right;
}
</style>