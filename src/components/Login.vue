<template>
  <el-row id="Login">
    <el-col :span='10' :offset='7' id='login_form'>
      <el-row>
        <el-row>
          <el-col :xs='8' :sm='8' :md='8' :lg='9' :xl='10' style='height:1em'></el-col>
          <el-col :xs='8' :sm='8' :md='8' :lg='5' :xl='4' class='user_bg'>
            <i class='el-icon-pingtaiguanli-yonghuguanli iconfont users'></i>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs='12' :sm='12' :md='12' :lg='12' :xl='12' :offset='6'>
            <el-form  :model="logindata" :rules="loginrule" ref="logindata" label-width="30" class="demo-ruleForm">
              <el-form-item prop='username'>
                <el-input v-model="logindata.username" placeholder="请输入用户名" prefix-icon='el-icon-user-s iconfont' class="user_top" autofocus></el-input>
              </el-form-item>
              <el-form-item prop='pwd'>
                <el-input v-model="logindata.pwd" type='password' placeholder="请输入密码" prefix-icon='el-icon-ziyuan iconfont' @keyup.enter.native="login()"></el-input>
                
              </el-form-item>
              <el-form-item >
                <el-alert type="error" :title="tipsmsg" show-icon id='error_tip' :closable='false' center style="width:100%"></el-alert>
                <el-button type="success" round class='login_btn' @click='login()' >登 录</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Login',
  data () {
    var checkname=(rule,val,callback)=>{
      if(!val){
        return callback(new Error('请输入用户名'))
      }
      else{
        callback()
      }
    }
    var checkpwd=(rule,val,callback)=>{
      if(!val){
        return callback(new Error('请输入密码'))
      }
      else
        callback()
    }
    return {
      logindata:{
        username:'',
        pwd:'',
      },
      loginrule:{
        username:[
          {validator:checkname, trigger:'blur'}
        ],
        pwd:[
          {validator:checkpwd, trigger:'blur'}
        ]
      },
      tipsmsg:''
    }
  },
  methods: {
    login(){
      this.$axios.post(this.$host+'login',{username:this.logindata.username,password:this.logindata.pwd}).then(res=>{
        if(res.data.success){
          sessionStorage.setItem('loginname',this.logindata.username)
          this.$router.push('system');
        }
        else if(!res.data.success){
          if(res.data.data){
            this.tipsmsg=res.data.data
            $('#error_tip').css({'display':'flex'})
            setTimeout(function(){
                $('#error_tip').css({'display':'none'})
            },2000)
          }
          else{
            this.tipsmsg='账号密码不匹配！'
            $('#error_tip').css({'display':'flex'})
            setTimeout(function(){
                $('#error_tip').css({'display':'none'})
            },2000)
          }
        }
      }).catch(error=>{
        console.log(error)
      })
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
}
/* #tip{
  display:none;
} */
</style>
