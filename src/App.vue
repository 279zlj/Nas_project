<template>
  <el-container id="app">
      <router-view />
      <router-view name='content'></router-view>
  </el-container>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app,body,html{
  margin:0;
  padding:0;
  top:0;
  bottom:0;
  height:100%;
  width:100%;
}
.content{
    width:100%;
    background-color:#E4E4E4;
}
.main{
    margin-top:2em;
}
.main_table{
  margin-top:3.5em;
}
.tip_bg{
    background-color:#FFF;
    height:3.5em;
    box-shadow:10px 5px 10px grey;
}
.tip{
    display:block;
    padding:.5em 1em;
    font-size:1.4em;
    font-weight:700;
}
a{
  text-decoration:none;
}
</style>
