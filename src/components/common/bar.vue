<template>
    <el-aside class='bg_color' style='heigh:auto'>
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#292A2F" text-color="#FFF" :unique-opened='true' style="height:100%;position:relative;margin-bottom:3rem">
            <!-- <div class='header_bar'>
                <img src='../../../static/images/wuzhou.png' class='header' />
            </div> -->
            <el-row>
                <el-col :span='12' style="text-align:center;margin-top:2.5em">
                    <img src='../../../static/images/lo.png' width="60%;margin:0 auto" />
                </el-col>
                <el-col :span='12'>
                <div style='margin-top:3.5em'>
                    <p class='welcome' style="font-size:17px"><b>{{$t('message.sysname')}}</b></p>
                    <p class="welcome" style="font-size:18px"><i class="el-icon-user-solid" style="margin-right:.5em"></i><b>{{username}}</b></p>
                </div>
                </el-col>
            </el-row>
            <router-link :to="{name:'system'}"><el-menu-item index="/system">
                <i class='el-icon-setting'></i>
                <span slot='title'>{{$t('message.sysinfo')}}</span>
            </el-menu-item></router-link>
            <el-submenu index="2">
                <template slot='title'>
                    <i class="el-icon-zhanghaoguanli iconfont"></i>
                    <span slot='title'>{{$t('message.account')}}</span>
                </template>
                <router-link :to="{name:'group'}"><el-menu-item index="/group"><i class="el-icon-yonghuzu iconfont"></i>{{$t('message.group')}}</el-menu-item></router-link>
                <router-link :to="{name:'user'}"><el-menu-item index="/user"><i class='el-icon-user-solid'></i>{{$t('message.user')}}</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="6">
                <template slot='title'>
                    <i class='el-icon-gongxiang iconfont'></i>
                    <span slot='title'>{{$t('message.sharing')}}</span>
                </template>
                <router-link :to="{name: 'ftp'}"><el-menu-item index="/ftp"><i class="el-icon-st-to-ftp iconfont"></i>FTP、SFTP {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name:'nfs'}"><el-menu-item index="/nfs"><i class="el-icon-lupingNFS iconfont"></i>Unix(NFS) {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name:'smb'}"><el-menu-item index="/smb"><i class="el-icon-SMB iconfont"></i>Windows(SMB) {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name:'afp'}"><el-menu-item index="/afp"><i class="el-icon-AFPLOGO iconfont"></i>MAC(AFP) {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name: 'iscsi'}"><el-menu-item index="/iscsi"><i class="el-icon-iscsi iconfont"></i>{{$t('message.block')}} (iSCSI)</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="3">
                <template slot='title'>
                    <i class="el-icon-wangluo iconfont"></i>
                    <span slot='title'>{{$t('message.network')}}</span>
                </template>
                <router-link :to="{name: 'gateway'}"><el-menu-item index="/gateway"><i class="el-icon-wangguanpeizhi iconfont"></i>{{$t('message.gateway')}}</el-menu-item></router-link>
                <router-link :to="{name:'network'}"><el-menu-item index="/network"><i class="el-icon-wangluoshezhi iconfont"></i>{{$t('message.net_setting')}}</el-menu-item></router-link>
                <router-link :to="{name:'bond'}"><el-menu-item index="/bond"><i class="el-icon-juhe iconfont"></i>{{$t('message.bond')}}</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="4">
                <template slot='title'>
                    <i class='el-icon-storageresource- iconfont'></i>
                    <span slot='title'>{{$t('message.storage')}}</span>
                </template>
                <router-link :to="{name:'sysdisk'}"><el-menu-item index="/sysdisk"><i class="el-icon-cipan iconfont"></i>{{$t('message.sysdisk')}}</el-menu-item></router-link>
                <router-link :to="{name:'pool'}"><el-menu-item index="/pool"><i class="el-icon-erji-yunziyuanchi iconfont"></i>{{$t('message.pool')}}</el-menu-item></router-link>
                <router-link :to="{name: 'lv'}"><el-menu-item index="/lv"><i class="el-icon-luojichi iconfont"></i>{{$t('message.logical')}}</el-menu-item></router-link>
                <router-link :to="{name: 'rbd'}"><el-menu-item index="/rbd"><i class="el-icon-bangzhuzhichi_yuncunchu iconfont"></i>{{$t('message.external')}}</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="7">
                <template slot="title">
                    <i class='el-icon--raid iconfont'></i>
                    <span slot='title'>{{$t('message.hardraid')}}</span>
                </template>
                <router-link :to="{name:'diskMgr'}"><el-menu-item index="/diskMgr"><i class="el-icon-cipan iconfont"></i>{{$t('message.disk')}}</el-menu-item></router-link>
                <router-link :to="{name:'raiddisk'}"><el-menu-item index="/raiddisk"><i class="el-icon-guanli iconfont"></i>{{$t('message.diskMgr')}}</el-menu-item></router-link>
            </el-submenu>
            <router-link :to="{name:'raid'}"><el-menu-item index="/raid">
                <i class='el-icon--raid iconfont'></i>
                <span slot='title'>{{$t('message.softraid')}}</span>
            </el-menu-item></router-link>
            <el-submenu index="8">
                <template slot="title">
                    <i class='el-icon-dbsshujukubeifenDBS iconfont'></i>
                    <span slot='title'>{{$t('message.backup')}}</span>
                </template>
                <router-link :to="{name:'back'}"><el-menu-item index="/back"><i class="el-icon-shujuku iconfont"></i>{{$t('message.sqlback')}}</el-menu-item></router-link>
                <router-link :to="{name:'rfile'}"><el-menu-item index="/rfile"><i class="el-icon-beifenhuifu iconfont"></i>{{$t('message.fileback')}}</el-menu-item></router-link>
            </el-submenu>
            <div style="width:240px"><p style="position:fixed;bottom:0em;text-align:center;color:white;font-size:.8em;width:300px">{{$t('message.tech')}}：400-716-7160</p></div>
        </el-menu>
        
    </el-aside>
</template>
<script>
export default {
    name:'bar',
    data(){
        return{
            username:'',
        }
    },
    mounted() {
        this.username=sessionStorage.getItem('loginname')
    },
    methods: {
        
    },
}
</script>
<style>
.bg_color,.el-aside{
    background-color:#292A2F;
    height: initial;
}
 aside{
    max-width: 20em !important;
    z-index: 999;
  }
  #logo{
      background-color:#FFF;
      width:6em;
      margin:3em 2em;
      border-radius:50%;
      text-align:center;
  }
  .logo{
      width:4.5em;
      padding:.5em;
  }
  .welcome{
      color:white;
      text-align:left;
      margin-bottom:1.5em;
  }
  .header{
      margin:.2em;
      margin-left:6em;
  }
  .header_bar{
        background-color:#009588 !important;
        height:3.5em;
        width:100%;
  }
</style>