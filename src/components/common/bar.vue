<template>
    <el-aside class='bg_color'>
        <el-menu :default-active="barnum" class="el-menu-vertical-demo" background-color="#292A2F" text-color="#FFF" :unique-opened='true'>
            <div class='header_bg'>
                <img src='../../../static/images/wuzhou.png' class='header' />
            </div>
            <el-row>
                <el-col id='logo'>
                    <img src='../../../static/images/logo.png' class='logo' />
                </el-col>
                <div style='margin-top:3.5em'>
                    <p class='welcome'>{{$t('message.Welcome')}}</p>
                    <p class="welcome" style="font-size:18px"><i class="el-icon-user-solid" style="margin-right:.5em"></i><b>{{username}}</b></p>
                </div>
            </el-row>
            <router-link :to="{name:'system'}"><el-menu-item index="1">
                <i class='el-icon-setting'></i>
                <span slot='title'>{{$t('message.system')}}</span>
            </el-menu-item></router-link>
            <el-submenu index="2">
                <template slot='title'>
                    <i class="el-icon-zhanghaoguanli iconfont"></i>
                    <span slot='title'>{{$t('message.account')}}</span>
                </template>
                <router-link :to="{name:'group'}"><el-menu-item index="2-1"><i class="el-icon-yonghuzu iconfont"></i>{{$t('message.group')}}</el-menu-item></router-link>
                <router-link :to="{name:'user'}"><el-menu-item index="2-2"><i class='el-icon-user-solid'></i>{{$t('message.user')}}</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="3">
                <template slot='title'>
                    <i class="el-icon-wangluo iconfont"></i>
                    <span slot='title'>{{$t('message.network')}}</span>
                </template>
                <router-link :to="{name: 'gateway'}"><el-menu-item index="3-1"><i class="el-icon-wangguanpeizhi iconfont"></i>{{$t('message.gateway')}}</el-menu-item></router-link>
                <router-link :to="{name:'network'}"><el-menu-item index="3-2"><i class="el-icon-wangluoshezhi iconfont"></i>{{$t('message.net_setting')}}</el-menu-item></router-link>
                <router-link :to="{name:'bond'}"><el-menu-item index="3-3"><i class="el-icon-juhe iconfont"></i>{{$t('message.bond')}}</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="4">
                <template slot='title'>
                    <i class='el-icon-storageresource- iconfont'></i>
                    <span slot='title'>{{$t('message.storage')}}</span>
                </template>
                <router-link :to="{name:'disk'}"><el-menu-item index="4-2"><i class="el-icon-cipan iconfont"></i>{{$t('message.disk')}}</el-menu-item></router-link>
                <router-link :to="{name:'pool'}"><el-menu-item index="4-1"><i class="el-icon-erji-yunziyuanchi iconfont"></i>{{$t('message.pool')}}</el-menu-item></router-link>
                <router-link :to="{name: 'lv'}"><el-menu-item index="4-4"><i class="el-icon-luojichi iconfont"></i>{{$t('message.logical')}}</el-menu-item></router-link>
                <router-link :to="{name: 'rbd'}"><el-menu-item index="4-5"><i class="el-icon-bangzhuzhichi_yuncunchu iconfont"></i>{{$t('message.external')}}</el-menu-item></router-link>
            </el-submenu>
            <router-link :to="{name:'raid'}"><el-menu-item index="5">
                <i class='el-icon--raid iconfont'></i>
                <span slot='title'>{{$t('message.raid')}}</span>
            </el-menu-item></router-link>
            <el-submenu index="6">
                <template slot='title'>
                    <i class='el-icon-gongxiang iconfont'></i>
                    <span slot='title'>{{$t('message.sharing')}}</span>
                </template>
                <router-link :to="{name: 'ftp'}"><el-menu-item index="6-5"><i class="el-icon-st-to-ftp iconfont"></i>FTP、SFTP {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name:'nfs'}"><el-menu-item index="6-1"><i class="el-icon-lupingNFS iconfont"></i>Unix(NFS) {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name:'smb'}"><el-menu-item index="6-2"><i class="el-icon-SMB iconfont"></i>Windows(SMB) {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name:'afp'}"><el-menu-item index="6-3"><i class="el-icon-AFPLOGO iconfont"></i>MAC(AFP) {{$t('message.file')}}</el-menu-item></router-link>
                <router-link :to="{name: 'iscsi'}"><el-menu-item index="6-4"><i class="el-icon-iscsi iconfont"></i>{{$t('message.block')}} (iSCSI)</el-menu-item></router-link>
            </el-submenu>
        </el-menu>
    </el-aside>
</template>
<script>
export default {
    name:'bar',
    data(){
        return{
            username:'admin',
            barnum:''
        }
    },
    mounted() {
        this.barselect()
        this.username=sessionStorage.getItem('loginname')
    },
    methods: {
        barselect(){
            let name = location.hash;
            if(name == '#/system'){
                this.barnum = '1'
            }
            else if(name == '#/user'){
                this.barnum = '2-2'
            }
            else if(name == '#/network'){
                this.barnum = '3-2'
            }
            else if(name == '#/bond'){
                this.barnum = '3-3'
            }
            else if(name == '#/disk'){
                this.barnum = '4-2'
            }
            else if(name == '#/raid'){
                this.barnum = '5'
            }
            else if(name == '#/group'){
                this.barnum = '2-1'
            }
            else if(name == '#/gateway'){
                this.barnum = '3-1'
            }
            else if(name == '#/lv'){
                this.barnum = '4-4'
            }
            else if(name == '#/pool'){
                this.barnum = '4-1'
            }
            else if(name == '#/rbd'){
                this.barnum = '4-5'
            }
            else if(name == '#/nfs'){
                this.barnum = '6-1'
            }
            else if(name == '#/smb'){
                this.barnum = '6-2'
            }
            else if(name == '#/afp'){
                this.barnum = '6-3'
            }
            else if(name == '#/iscsi'){
                this.barnum = '6-4'
            }
            else if(name == '#/ftp'){
                this.barnum = '6-5'
            }
        }
    },
}
</script>
<style>
.bg_color,.el-aside{
    background-color:#292A2F;
    
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
</style>