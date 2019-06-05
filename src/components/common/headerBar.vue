<template>
    <div class='header_bg'>
        <el-row>
        <el-col :xs='15' :sm='15' :md='17' :lg='19' :xl='19' style='height:1em'></el-col>
        <el-col :xs='7' :sm='7' :md='5' :lg='3' :xl='3' >
        <el-dropdown>
        <span class="el-dropdown-link menu" ><i class="el-icon-duoyuyan iconfont" style='font-size:18px'></i>{{$t('message.change')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span @click="changlang('ch')"><i class="el-icon-zhongwenyuyan iconfont"></i>{{$t('message.cha')}}</span></el-dropdown-item>
            <el-dropdown-item><span @click="changlang('en')"><i class="el-icon-yingwenyuyan iconfont"></i>{{$t('message.eng')}}</span></el-dropdown-item>
        </el-dropdown-menu>
        </el-dropdown>
        </el-col>
        <el-col :xs='2' :sm='2' :md='2' :lg='2' :xl='2' >
        <el-tooltip :content="$t('message.exit')" placement="bottom">
            <i class='el-icon-denglu iconfont' id='outlogin' @click='out'></i>
        </el-tooltip>
        </el-col>
        </el-row>
        <el-dialog :title="$t('message.exit')" :visible.sync="outtips" width="30%" center :close-on-click-modal="false">
            <p>{{$t('message.logout')}}</p>
            <el-button type="primary" @click="outsubmit()">{{$t('message.sure')}}</el-button>
            <el-button @click="outtips = false">{{$t('message.cancel')}}</el-button>
        </el-dialog>
        
    </div>
</template>
<script>
export default {
    name:'headerBar',
    data(){
        return{
            outtips:false
        }
    },
    mounted(){
        this.selectValue = localStorage.lang == undefined?'ch':localStorage.lang
    },
    methods:{
        out(){
            this.outtips=true
        },
        outsubmit(){
            this.$router.push('/')
            sessionStorage.removeItem('loginname')
        },
        changlang (e) {
        localStorage.setItem('lang',e);
        this.$i18n.locale = e;
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
#outlogin{
    color:white;
    font-size:2em !important;
    margin:.4em 1em;
    cursor:pointer;
    float:right;
}
.menu{
     color:#FFF;
     font-size:1.3em;
     display:block;
     margin-top: .8em;
}
</style>