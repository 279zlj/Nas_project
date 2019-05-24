<template>
  <el-row id="Login">
    <el-col :span='10' :offset='7' id='login_form'>
      <el-row>
        <el-col :span='4' :offset='10' class='user_bg'>
          <i class='el-icon-pingtaiguanli-yonghuguanli iconfont users'></i>
        </el-col>
        <el-col :span="12" :offset='6'>
          <el-input v-model="username" type='text' placeholder="请输入用户名" prefix-icon='el-icon-user-s iconfont' class="user_top" autofocus></el-input>
          <el-input v-model="pwd" type='password' placeholder="请输入密码" prefix-icon='el-icon-ziyuan iconfont' class='top'></el-input>
          <el-alert type="error" center  title="账号与密码不匹配！" show-icon id='tip' ></el-alert>
          <el-button type="success" round class='login_btn' @click='login()'>登 录</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username:'',
      pwd:'',
    }
  },
  methods: {
    login(){
      if(this.username=='admin'&&this.pwd=='admin'){
        this.$router.push('system');
      }
      else{
        $('#tip').css({display:'table'})
        setTimeout(function(){
          $('#tip').css({display:'none'})
        },3000)
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Login{
  background:url('../../static/images/bg.png') no-repeat;
  background-size:cover;
  background-color:#A6ECF9;
  height:100%;
  width:100%;
  margin:0;
  padding:0;
}
#login_form{
  margin-top:10%;
  background-color:#3E5D63;
  height:50%;
  border-radius:1em;
  
}
.users{
  color:#299FB5;
  font-size:4em !important;
  margin:.5em;
  text-align:center;
}
.user_bg{
  background-color:#FFF;
  border-radius:50%;
  margin-top:3em;
}
.user_top{
  margin-top:3em;
}
.top{
  margin-top:1.5em;
}
.login_btn{
  width:100%;
  margin-top:3em;
}
#tip{
  display:none;
}
</style>
