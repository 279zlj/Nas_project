<template>
    <el-aside class='bg_color'>
        <el-menu :default-active="barnum" class="el-menu-vertical-demo" background-color="#292A2F" text-color="#fff" active-text-color="#009588" :unique-opened='true'>
            <div class='header_bg'>
                <img src='../../../static/images/wuzhou.png' class='header'></img>
            </div>
            <div>
                <div id='logo'>
                    <img src='../../../static/images/logo.png' class='logo'></img>
                </div>
                <p class='welcome'>Welcome! {{username}}</p>
            </div>
            <router-link :to="{name:'system'}"><el-menu-item index="1">
                <i class='el-icon-setting'></i>
                <span slot='title'>系统信息</span>
            </el-menu-item></router-link>
            <el-submenu index="2">
                <template slot='title'>
                    <i class="el-icon-zhanghaoguanli iconfont"></i>
                    <span slot='title'>账户管理</span>
                </template>
                <router-link :to="{name:'group'}"><el-menu-item index="2-1"><i class="el-icon-yonghuzu iconfont"></i>组管理</el-menu-item></router-link>
                <router-link :to="{name:'user'}"><el-menu-item index="2-2"><i class='el-icon-pingtaiguanli-yonghuguanli iconfont'></i>用户管理</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="3">
                <template slot='title'>
                    <i class="el-icon-wangluo iconfont"></i>
                    <span slot='title'>网络管理</span>
                </template>
                <el-menu-item index="3-1"><i class="el-icon-wangguanpeizhi iconfont"></i>网关配置</el-menu-item>
                <router-link :to="{name:'network'}"><el-menu-item index="3-2"><i class="el-icon-wangluoshezhi iconfont"></i>网络设置</el-menu-item></router-link>
                <router-link :to="{name:'bond'}"><el-menu-item index="3-3"><i class="el-icon-juhe iconfont"></i>聚合管理</el-menu-item></router-link>
            </el-submenu>
            <el-submenu index="4">
                <template slot='title'>
                    <i class='el-icon-storageresource- iconfont'></i>
                    <span slot='title'>存储管理</span>
                </template>
                <el-menu-item index="4-1"><i class="el-icon-erji-yunziyuanchi iconfont"></i>存储池</el-menu-item>
                <router-link :to="{name:'disk'}"><el-menu-item index="4-2"><i class="el-icon-cipan iconfont"></i>磁盘</el-menu-item></router-link>
                <el-menu-item index="4-3"><i class="el-icon-exam_bank iconfont"></i>卷组管理</el-menu-item>
                <el-menu-item index="4-4"><i class="el-icon-luojichi iconfont"></i>逻辑卷管理</el-menu-item>
            </el-submenu>
            <router-link :to="{name:'raid'}"><el-menu-item index="5">
                <i class='el-icon--raid iconfont'></i>
                <span slot='title'>阵列管理</span>
            </el-menu-item></router-link>
            <el-submenu index="6">
                <template slot='title'>
                    <i class='el-icon-gongxiang iconfont'></i>
                    <span slot='title'>共享管理</span>
                </template>
                <el-menu-item index="6-1"><i class="el-icon-lupingNFS iconfont"></i>Unix(NFS) 共享服务</el-menu-item>
                <el-menu-item index="6-2"><i class="el-icon-SMB iconfont"></i>Windows(SMB) 共享服务</el-menu-item>
                <el-menu-item index="6-2"><i class="el-icon-AFPLOGO iconfont"></i>MAC(AFP) 共享服务</el-menu-item>
                <el-menu-item index="6-3"><i class="el-icon-iscsi iconfont"></i>块存储(iSCSI)</el-menu-item>
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
      width:7em;
      margin:3em 5em 1em 6em;
      border-radius:50%;
      text-align:center;
  }
  .logo{
      width:4.5em;
      padding:1em;
  }
  .welcome{
      color:white;
      text-align:center;
      margin-bottom:2em;
  }
  .header{
      margin:.2em;
      margin-left:6em;
  }
</style>