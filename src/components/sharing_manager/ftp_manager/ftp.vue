<template>
    <div class="content">
        <headerBar></headerBar>
        <div class="tip_bg">
            <span class="tip">FTP、SFTP {{$t('message.management')}}</span>
        </div>
        <div>
            <el-row class="other_table">
              <el-col :xs='20' :sm='20' :md='20' :lg="20" :xl='20' :offset="2">
                    <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                    <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                    <el-table :data='ftpdata' border class="table_cell" style="width:100%;min-height:310px;max-heigth:100%" >
                        <el-table-column :label="$t('message.service')" prop='service'></el-table-column>
                        <el-table-column :label="$t('message.user')" prop="user" >
                            <template slot-scope="scope">
                                <span v-for='(i,index) in scope.row.user' :key='index'>
                                    {{i}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.oper')">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.state" :active-text="$t('message.open')" :inactive-text="$t('message.close')" @change="changestate(scope.row)" :disabled="scope.row.operchange"></el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
              </el-col>
            </el-row>
        </div>
    </div>    
</template>
<script>
import headerBar from '../../common/headerBar'
export default {
    name:'ftp',
    components:{headerBar},
    data(){
        return{
            ftpdata:[]
        }
    },
    mounted(){
        this.getftp()
    },
    methods:{
        getftp(){
            var _this=this
            this.$axios.get(this.$host+'ftp').then(res=>{
                _this.ftpdata=res.data.data
                _this.getuser()
            }).catch(error=>{
                console.log(error)
            })
            
        },
        getuser(){
            this.$axios.get(this.$host+'users').then(res=>{
                var ftp_users=[]
                var sftp=[]
                for(let i=0;i<res.data.data.length;i++){
                    if(res.data.data[i].last_name == 'ftp')
                        ftp_users.push(res.data.data[i].username)
                    if(res.data.data[i].last_name == 'sftp')
                        sftp.push(res.data.data[i].username)
                }
                if(ftp_users.length == 0){
                    ftp_users.push('请先创建用户')
                    this.ftpdata[0].operchange=true
                }
                if(sftp.length == 0){
                    sftp.push('请先创建用户')
                    this.ftpdata[1].operchange=true
                }
                this.ftpdata[0].user = ftp_users
                this.ftpdata[1].user = sftp
            }).catch(error=>{
                console.log(error)
            })
        },
        changestate(row){
            this.$axios.post(this.$host+'ftp',{target:row.service,state:row.state}).then(res=>{
                if(res.data.success){
                    $('#success_tip').css({'display':'flex'})
                    setTimeout(function(){
                        $('#success_tip').css({'display':'none'})
                    },3000)
                }
                else if(!res.data.success){
                    $('#error_tip').css({'display':'flex'})
                    setTimeout(function(){
                        $('#error_tip').css({'display':'none'})
                    },3000)
                }
                this.getuser()
            }).catch(error=>{
                console.log(error)
            })
        }
    }
}
</script>
<style>

</style>

