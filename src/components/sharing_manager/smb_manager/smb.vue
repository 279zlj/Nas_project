<template>
    <div class='content'>
        <headerBar></headerBar>
        <div class="tip_bg">
            <span class='tip'>SMB {{$t('message.file')}}</span>
        </div>
        <div>
            <el-row class='main_table'>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                    <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createsmb = true'></el-button></el-tooltip>
                    </el-row>
                    <el-table :data='smbdata.slice((currpage - 1) * pagesize, currpage*pagesize)' border  class="table_cell" style='width:100%;min-height:310px;max-height:100%'>
                        <el-table-column :label="$t('smb.name')" prop='name'></el-table-column>
                        <el-table-column :label="$t('smb.path')" prop='path'></el-table-column>
                        <el-table-column :label="$t('smb.not')" prop='guest'></el-table-column>
                        <el-table-column :label="$t('message.oper')">
                            <template slot-scope="scope">
                                <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon='el-icon-delete' size='mini' @click="deletesmb(scope.row)"></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10]"
                    :page-size="pagesize"
                    :total="smbdata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
              </el-col>
            </el-row>
            <el-dialog :title="$t('smb.new')" :visible.sync="createsmb" width="30%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="smbform" ref='smbform' :rules="smbrule" label-width="30" class="demo-ruleForm">
              <el-form-item :label="$t('smb.name')" prop='name'>
                  <el-input v-model="smbform.name" :placeholder="$t('smb.input')" style='width:80%'></el-input>
              </el-form-item>
              <el-form-item :label="$t('smb.p_name')" prop='path'>
                  <el-input v-model="smbform.path" :placeholder="$t('smb.input1')" style='width:80%'></el-input>
              </el-form-item>
              <el-form-item :label="$t('smb.user')" prop='user' v-if="!gestsate">
                  <el-select v-model="smbform.user" :placeholder="$t('smb.input2')">
                    <el-option v-for="u in user" :key="u" :value="u">{{u}}</el-option>
                  </el-select>
              </el-form-item>
              <!-- <el-form-item label="密码" prop='pwd' v-if="!gestsate">
                  <el-input v-model="smbform.pwd" type="password" placeholder="请输入密码" style="width:80%"></el-input>
              </el-form-item> -->
              <el-form-item :label="$t('smb.per')" prop='rank'>
                  <el-switch :active-text="$t('smb.read')" v-model="smbform.rank" :inactive-text="$t('smb.write')" ></el-switch>
              </el-form-item>
              <el-form-item :label="$t('smb.gest')" prop='gest'>
                  <el-switch v-model="smbform.gest" ></el-switch>
              </el-form-item>
              <el-form-item>
                      <el-button type="primary" @click="smbsubmit('smbform')">{{$t('message.submit')}}</el-button>
                      <el-button @click="smbreset('smbform')">{{$t('message.reset')}}</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('smb.delete')" :visible.sync="smbremove" width="30%" center :close-on-click-modal="false">
            <p>{{$t('smb.delete')}}：{{starget}}?</p>
            <el-button type="primary" @click='sremove()'>{{$t('message.sure')}}</el-button>
            <el-button @click='smbremove=false'>{{$t('message.cancel')}}</el-button>
        </el-dialog>
        </div>
    </div>    
</template>
<script>
import headerBar from '../../common/headerBar'
export default {
    name:'smb',
    components:{headerBar},
    data(){
        var namecheck=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入名称'))
            }
            else{
                if(val.length<2){
                    return callback(new Error('请输入长度超过2的名称'))
                }
                else
                    callback()
            }
        }
        var pathcheck=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入路径名称'))
            }
            else{
                if(val.length<3){
                    return callback(new Error('请输入长度超过3的路径名称'))
                }
                else
                    callback()
            }
        }
        var usercheck=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择用户'))
            }
            else{
                callback()
            }
        }
        // var pwdcheck=(rule,val,callback)=>{
        //     if(!val){
        //         return callback(new Error('请输入密码'))
        //     }
        //     else{
        //         callback()
        //     }
        // }
        return{
            smbdata:[],
            user:[],
            createsmb:false,
            smbremove:false,
            gestsate:'',
            starget:'',
            currpage:1,
            pagesize:5,
            smbform:{
                name:'',
                path:'',
                user:'',
                rank:false,
                // pwd:'',
                gest:false
            },
            smbrule:{
                name:[
                    {validator:namecheck, trigger: 'blur'}
                ],
                path:[
                    {validator:pathcheck, trigger: 'blur'}
                ],
                user:[
                    {validator:usercheck, trigger: 'blur'}
                ],
                // pwd:[
                //     {validator:pwdcheck, trigger: 'blur'}
                // ]
            }
        }
    },
    mounted(){
        this.getsmb()
    },
    methods:{
        getsmb(){
            var _this=this
            this.$axios.get(this.$host+'smb').then(res=>{
                // _this.smbdata=res.data.data
                var c=res.data.data
                var s =[]
                for(let i=0;i<c.length;i++){
                    var ss={}
                    ss.name=c[i].name
                    ss.path=c[i].data.path
                    if(c[i].data.public==undefined)
                        ss.guest='—'
                    else
                        ss.guest=c[i].data.public
                    s.push(ss)
                }
                _this.smbdata=s
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'users').then(res=>{
                var users=[]
                for(let i=0;i<res.data.data.length;i++){
                    users.push(res.data.data[i].username)
                }
                _this.user = users
            }).catch(error=>{
                console.log(error)
            })
        },
        smbsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'smb',{name:_this.smbform.name,user:_this.smbform.user,writable:_this.smbform.rank,path:_this.smbform.path,security:_this.smbform.gest}).then(res=>{
                        _this.createsmb=false
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
                        _this.getsmb()
                        _this.smbreset('smbform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        changegest(state){
            this.gestsate=state
        },
        sremove(){
            this.$axios.delete(this.$host+'smb',{data:{name:this.starget}}).then(res=>{
                this.smbremove=false
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
                this.getsmb()
                this.smbreset('smbform')
            }).catch(error=>{
                console.log(error)
            })
        },
        deletesmb(row){
            this.smbremove=true
            this.starget=row.name
        },
        smbreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['smbform'].resetFields();
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
    }
}
</script>
<style>

</style>
