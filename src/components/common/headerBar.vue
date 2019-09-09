<template>
    <div class='header_bg'>
        <el-row>
        <el-col :xs='13' :sm='13' :md='13' :lg='16' :xl='19'>
            <img src='../../../static/images/wuzhou.png' class='header' />
        </el-col>

        <el-col :xs='11' :sm='11' :md='11' :lg='8' :xl='5' style="text-align:end">
            <el-dropdown>
                <span class="el-dropdown-link menu" style="cursor:pointer;" ><i class="el-icon-zhuanhuan iconfont" style='font-size:18px'></i>{{$t('message.change')}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="changlang('ch')"><i class="el-icon-zhongwenyuyan iconfont"></i>{{$t('message.cha')}}</span></el-dropdown-item>
                    <el-dropdown-item><span @click="changlang('en')"><i class="el-icon-yingwenyuyan iconfont"></i>{{$t('message.eng')}}</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        
            <el-tooltip :content="$t('message.system')" placement="bottom">
                <i class='el-icon-info btn'  @click="sys=true" ></i>
            </el-tooltip>
        
            <el-tooltip :content="$t('message.author')" placement="bottom" >
                <i class='el-icon-shouquanzhengpin iconfont btn'  @click="author=true" ></i>
            </el-tooltip>

            <el-tooltip :content="$t('message.notice')" placement="bottom" >
                <i class='el-icon-message btn'  @click="email=true" ></i>
            </el-tooltip>
        
            <el-tooltip :content="$t('message.exit')" placement="bottom">
                <i class='el-icon-tuichu iconfont btn ' @click='out' ></i>
            </el-tooltip>
        </el-col>
        </el-row>
        <el-dialog :title="$t('message.setemail')" :visible.sync="email" width="30%" :close-on-click-modal="false" :before-close="handleClose">
            <el-form :model="emaildata" ref='emaildata' label-width="120px" label-position="left" class=demo-dynamic>
                <el-form-item :label="$t('message.email')" prop="email" :rules="
                [
                { required: true, message:$t('message.inpute'), trigger: 'blur' },
                { type: 'email', message:$t('message.inpute1'),trigger: ['blur','change'] }
                ]
                ">
                    <el-input v-model="emaildata.email" :placeholder="$t('message.inpute')" clearable ></el-input>
                </el-form-item>
                <!-- <el-form-item label="授权码" prop="code" :rules="
                [
                {required:true, message:'请输入授权码',trigger:'blur'},
                ]
                ">
                    <el-input v-model="emaildata.code" placeholder="请输入授权码"></el-input>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="emailsubmit('emaildata')">{{$t('message.submit')}}</el-button>
                    <el-button @click="emailreset('emaildata')">{{$t('message.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('message.author')" :visible.sync="author" width="35%" center :close-on-click-modal="false">
            <p>{{$t('message.authorcode')}}：<span>{{info.system_id}}</span></p>
            <p>{{$t('message.authortime')}}：<span>{{info.lic}}</span></p>
        </el-dialog>
        <el-dialog :title="$t('message.system')" :visible.sync="sys" width="30%" center :close-on-click-modal="false" >
            <p >{{$t('sys.version')}}：<span>{{sysinfo.bannel}}</span></p>
            <p >{{$t('sys.model')}}：<span>{{sysinfo.model}}</span></p>
            <p >{{$t('sys.suppliers')}}：<span>{{sysinfo.vendor}}</span></p>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'headerBar',
    data(){
        return{
            outtips:false,
            author:false,
            email:false,
            sysinfo:[],
            sys:false,
            info:[],
            warn:false,
            emaildata:{
                email:'',
                // code:''
            }
        }
    },
    mounted(){
        this.startinfo()
        this.system_info() 
        var _this=this
        setInterval(function(){
            _this.startinfo()
            if(_this.info.lic=='-1'){
                _this.$notify({
                    title:_this.$t('message.warn'),
                    message:_this.$t('message.authorerror'),
                    duration:0
                })
                _this.outsubmit()
            }
        },3600000)
        this.selectValue = localStorage.lang == undefined?'ch':localStorage.lang
    },
    methods:{
        system_info(){
            var _this=this
            this.$axios.get(this.$host+'sysinfo').then(res=>{
                _this.sysinfo=res.data.data
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.post(this.$host+'seleamil',{username:sessionStorage.getItem('loginname')}).then(res=>{
                _this.emaildata.email=res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        startinfo(){
             this.$axios.get(this.$host+'lic').then(res=>{
                this.info=res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        out(){
            var _this=this
            this.$confirm(_this.$t('message.logout'),_this.$t('message.exit'),{
                confirmButtonText:_this.$t('message.sure'),
                cancelButtonText:_this.$t('message.cancel'),
                type:'warning',
            }).then(()=>{
                this.$message({
                    type:'success',
                    message:_this.$t('message.logout')
                })
                this.outsubmit()
            }).catch(()=>{
                this.$message({
                    type:'info',
                    message:_this.$t('message.cancel')
                })
            })
        },
        emailsubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'setemail',{username:sessionStorage.getItem('loginname'),sender_mail:this.emaildata.email}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else{
                            this.$message.error(res.data.msg)
                        }
                        this.email=false
                        this.system_info()
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        handleClose(done){
            done();
            this.$refs['emaildata'].resetFields();
        },
        outsubmit(){
            this.$router.push('/')
            sessionStorage.removeItem('loginname')
        },
        changlang (e) {
        localStorage.setItem('lang',e);
        this.$i18n.locale = e;
        },
        emailreset(name){
            this.$refs[name].resetFields();
        }
    }  
}
</script>
<style>
.header_bg{
    background-color:#009588 !important;
    height:3.5em;
    width:100%;
    margin:0;
    padding:0;
}
.outlogin{
    color:white;
    font-size:2em !important;
    padding:.4em 0em;
    cursor:pointer;
    /* float:right; */
}
.menu{
     color:#FFF;
     font-size:1.3em;
     display:block;
     margin: .8em 1em;
}
.btn{
    font-size:1.4em !important;color:white;margin:.4em 1em;cursor: pointer;
}
</style>