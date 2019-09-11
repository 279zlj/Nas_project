<template>
    <div id='Login'>
      <video autoplay loop muted>
        <source src='../../static/images/bg02.mp4' id='bg'></source>
      </video>  
      <el-row>
          
        <el-col :xs='12' :sm='12' :md='12' :lg='12' :xl='12' :offset='6' style="margin-top:8rem" >
          <div>
            <img src="../../static/images/logo02.png" style="height:3rem;margin-bottom:.5rem" />
          </div>
          <el-row  id='iform'>
          <el-col :xs='12' :sm='12' :md='12' :lg='12' :xl='12' style="height:100%">
            <img src='../../static/images/nas.gif' style="width:100%;padding:3rem 0;height:20rem" />
          </el-col>
          <el-col :xs='12' :sm='12' :md='12' :lg='12' :xl='12' style="padding:8% 3rem 0rem 3rem">
            <h2 style="color:#01968A">欢迎登录</h2>
            <el-form :model="logindata" ref='logindata' :rules="loginrule" >
              <el-form-item prop="username">
                <el-input v-model="logindata.username" placeholder="请输入用户名" prefix-icon='el-icon-user-s iconfont' class="user_top" autofocus clearable ></el-input>
              </el-form-item>
              <el-form-item prop="pwd">
                <el-input v-model="logindata.pwd" placeholder="请输入密码" type="password" prefix-icon='el-icon-ziyuan iconfont' clearable show-password @keyup.enter.native="login('logindata')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button round class='login_btn' @click="login('logindata')" >登录</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          </el-row>
        </el-col>
       
      </el-row>
       <el-row id='footer'>
            <el-col>
                <span class="bot">浏览器推荐使用：谷歌（Chrome）、火狐（FireFox）、IE10（以上）版本，大于1440*900分辨率!</span>
                <span class="bot">Copyright ® 2019 广州五舟科技股份有限公司.</span>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      logindata:{
        username:'',
        pwd:'',
      },
      loginrule:{
        username:[
          {required:true,message:'请输入用户名', trigger:'blur'}
        ],
        pwd:[
          {required:true,message:'请输入密码', trigger:'blur'}
        ]
      },
    }
  },
  methods: {
    login(name){
      this.$refs[name].validate((valid)=>{
        if(valid){
          this.$axios.post(this.$host+'login',{username:this.logindata.username,password:this.logindata.pwd}).then(res=>{
          if(res.data.success){
            sessionStorage.setItem('loginname',this.logindata.username)
            this.$router.push('system');
            this.$notify({
              title:'登录成功',
              type:'success'
            })
          }
          else if(!res.data.success){
            this.$notify.error({
              title:'账号、密码不匹配!',
            })
          }
          this.logindata.pwd=''
        }).catch(error=>{
          console.log(error)
        })
        }
      })
      
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Login{
        position: fixed;
        width: 100%;
        height: 100%;
        /* z-index: -100; */
        transition: 1s opacity;
        margin: 0 ;
        padding: 0 ;
        bottom:0;
        background: linear-gradient(to right, #01978D 20%, #089195 30%, #138AA2 50%,#1E7EB0 65%, #217DB2 70%,#356DC8 90%) !important;
    }
    video{
        position:absolute;
        width: 100%;
        height: 100%;
        z-index: -100;
    }
    video #bg{
        width: auto;
        height: auto;
        z-index: -100;
        background-size: contain;
    }
    #iform{
      z-index: 999;
      background-color:white;
      border-radius: .5rem;
      box-shadow: 0px 3px 15px #303133;
    }
    .login_btn{
      width:100%;
      background-color: #01968A;
      color:white;
    }
    #footer{
        position:absolute;
        width: 100%;
        color:white;
        bottom:1rem;
        
    }
    .bot{
      text-align: center;display:block;font-size:.8rem
    }
</style>
