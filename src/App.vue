<template>
  <el-container id="app">
            
      
      <router-view />
      <keep-alive>
      <el-container>
          <el-header>
            <router-view name='top'></router-view>
          </el-header>
          <el-container>
            <el-aside style="background-color:#292A2F">
              <router-view name='aside'></router-view>
            </el-aside>
            <el-main>
              <router-view name='content'></router-view>
            </el-main>
          </el-container>
      </el-container>
    </keep-alive>
  </el-container>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
body,html{
  margin:0;
  padding:0;
  top:0;
  bottom:0;
  width:100%;
  height: 100%;
}
#app{
  margin:0;
  padding:0;
  top:0;
  bottom:0;
  width:100%;
  min-height: 100%;
}
.el-table thead {
    background-color: #009588 !important
}
.el-card__header {
    background-color: #009588 !important;
}
#cpu,#menory{
        width: 100%;height:300px;border-radius: .3em;
    }
.content{
    width:100%;
    background-color:#E4E4E4;
}
.el-header{
  padding:0 !important;
  height:3.5rem !important;
}
.el-main{
  padding: 0 !important;
  background-color: #E4E4E4 !important;
}
.main{
    margin-top:2em;
}
.main_table{
  margin-top:3.5em;
}
.other_table{
  margin-top: 6.3em;
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
#error_tip,#success_tip{
        display: none;
        position: absolute;
        width: inherit;
        z-index: 999;
}
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    width: 6px;
    height: 10rpx;
    background-color: #F5F5F5;
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 3px gray;
    background-color: #D6D6D6;
}
 
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px gray;
    background-color: #3390ED;
}
</style>
