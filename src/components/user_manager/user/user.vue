<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.user')}}</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                <el-row style='margin-bottom:.5em;float:right'>
                    <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createuser = true'></el-button></el-tooltip>
                </el-row>
                    <el-table :data='userdata.slice((currpage - 1) * pagesize, currpage * pagesize)' border  class="table_cell" style='width:100%;min-height:310px;max-height:100%' v-if='alive'>
                        <el-table-column :label="$t('user.id')" prop='userid'></el-table-column>
                        <el-table-column :label="$t('user.name')" prop='username'></el-table-column>
                        <el-table-column :label="$t('user.type')" prop='last_name'></el-table-column>
                        <el-table-column :label="$t('message.oper')" width:='150'>
                            <template slot-scope='scope'>
                                <el-tooltip :content="$t('message.modify')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifyuser(scope.row)'></el-button></el-tooltip>
                                <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type='danger' icon="el-icon-delete" size='mini' @click='deleteuser(scope.row)'></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10]"
                    :page-size="pagesize"
                    :total="userdata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-dialog :title="$t('user.new')" :visible.sync="createuser" width="30%" center :before-close="handleClose" :close-on-click-modal='false'>
                <el-form :model='userform' :rules="userrule" ref='userform' label-width="100px" label-position="left" class='demo-ruleForm'>
                    <el-form-item :label="$t('user.name')" prop='username'>
                        <el-input v-model="userform.username" :placeholder="$t('user.name')" ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('user.new_pass')" prop='userpwd'>
                        <el-input v-model="userform.userpwd" :placeholder="$t('user.input')" type="password" ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('user.confirm')" prop='userpwdt'>
                        <el-input v-model="userform.userpwdt" :placeholder="$t('user.input2')" type="password" ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('user.u_type')" prop='usertype'>
                        <el-select v-model="userform.usertype" :placeholder="$t('user.input3')">
                          <el-option :label="$t('user.sys')" value='0'></el-option>
                          <el-option :label="$t('user.smb')" value='1'></el-option>
                          <el-option :label="$t('user.afp')" value='2'></el-option>
                          <el-option :label="$t('user.ftp')" value='3'></el-option>
                          <el-option :label="$t('user.sftp')" value='4'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="usersubmit('userform')">{{$t('message.submit')}}</el-button>
                        <el-button @click="userreset('userform')">{{$t('message.reset')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('user.modify')" :visible.sync="modifydialog" width="30%" :before-close="handleClose" center :close-on-click-modal='false'>
                <el-form :model="userform" :rules="userrule" ref='userform' label-width="100px" label-position="left" class='demo-ruleForm'>
                  <el-form-item :label="$t('user.old')" prop='oldpwd'>
                      <el-input v-model="userform.oldpwd" type="password" :placeholder="$t('user.input4')" ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('user.new_pass')" prop='userpwd'>
                    <el-input v-model="userform.userpwd" :placeholder="$t('user.input')" type="password" ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('user.confirm')" prop='userpwdt'>
                    <el-input v-model="userform.userpwdt" :placeholder="$t('user.input2')" type="password" ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="modifysubmit('userform')">{{$t('message.submit')}}</el-button>
                    <el-button @click="userreset('userform')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('user.cancel')" :visible.sync="deletedialog" width="30%" center :close-on-click-modal="false">
                <p>{{$t('user.cancel')}}：{{target.username}}?</p>
                <el-button type="primary" @click='deleteu()'>{{$t('message.sure')}}</el-button>
                <el-button @click='deletedialog=false'>{{$t('message.cancel')}}</el-button>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import headerBar from '../../common/headerBar'
export default {
    name:'user',
    components:{headerBar},
    data(){
        var usernameval=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入用户名'))
            }
            else if(val.length<3&&val.length>10){
                return callback(new Error('长度为3-10个字符'))
            }
            else 
                return callback()
        }
        var typevali=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择用户类型'))
            }
            else
                return callback()
        }
        var pwdvali=(rule, val, callback)=>{
            if(!val){
                return callback(new Error('请输入新密码'))
            }
            else{
                if(this.userform.userpwdt !== ''){
                    this.$refs.userform.validateField('userpwdt')
                }
                callback()
            }
        }
        var  checkold=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入旧密码'))
            }
            else
                callback()
        }
        var pwdtvali=(rule, val, callback)=>{
            if(!val){
                return callback(new Error('请再次输入密码'))
            }
            else if(val !== this.userform.userpwd){
                return callback(new Error('两次输入密码不一致'))
            }
            else{
                callback()
            }
        }
        return{
            userdata:[],
            pagesize: 5,
            currpage: 1,
            createuser:false,
            modifydialog:false,
            deletedialog:false,
            alive:true,
            target:'',
            userform:{
                username:'',
                usertype:'',
                userpwd:'',
                userpwdt:'',
                oldpwd:''
            },
            userrule:{
                username:[
                    { validator: usernameval, trigger: 'blur' }
                ],
                usertype:[
                    { validator: typevali, trigger: 'blur' }
                ],
                userpwd:[
                    { validator: pwdvali, trigger: 'blur'}
                ],
                userpwdt:[
                    { validator: pwdtvali, trigger: 'blur'}
                ],
                oldpwd:[
                    {validator: checkold, trigger: 'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getuser()
       
    },
    methods: {
        getuser(){
            var _this=this
            this.$axios.get(this.$host+'users').then(function(res){
                _this.userdata = res.data.data                
            })
        },
        usersubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'users',{name:_this.userform.username,type:_this.userform.usertype,password:_this.userform.userpwd}).then(function(res){
                        _this.createuser=false
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
                        _this.getuser()
                        _this.userreset('userform')
                    }).catch(function(error){
                        console.log(error)
                    })
                }
            })
        },
        modifysubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.put(this.$host+'users',{id:_this.target.userid,type:_this.target.last_name,pwd:_this.userform.userpwd,old_password:_this.userform.oldpwd}).then(res=>{
                        _this.modifydialog=false
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
                        _this.getuser()
                        _this.userreset('userform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        deleteu(){
            var _this=this
            this.$axios.delete(this.$host+'users',{data:{id:_this.target.userid,type:_this.target.last_name}}).then(res=>{
                this.deletedialog=false
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
                _this.getuser()
            }).catch(error=>{
                console.log(error)
            })
        },
        deleteuser(row){
            this.deletedialog=true;
            this.target=row
        },
        handleClose(done){
            done();
            this.$refs['userform'].resetFields();
        },
        userreset(formname){
            this.$refs[formname].resetFields();
        },
        modifyuser(row){
            this.modifydialog=true;
            this.target=row
            $('#success').css('display','flex')
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
    },    
}
</script>
<style>
    
</style>