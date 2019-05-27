<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>用户管理</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" title="操作失败" show-icon id='error_tip' :closable='false' center style='display:none'></el-alert>
                <el-alert type="success" title="操作成功" show-icon id='success_tip' :closable='false' center style='display:none'></el-alert>
                <el-col :xs='1' :sm='1' :md='1' :lg='1' :xl='1' :offset='23' style='margin-bottom:.5em'>
                    <el-tooltip content="添加" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" @click='createuser = true'></el-button></el-tooltip>
                </el-col>
                    <el-table :data='userdata.slice((currpage - 1) * pagesize, currpage * pagesize)' height='400' border style='width:100%'>
                        <el-table-column label="用户名" prop='name'></el-table-column>
                        <el-table-column label="类型" prop='type'></el-table-column>
                        <el-table-column label="创建时间" prop='created_at'></el-table-column>
                        <el-table-column label="操作" width:='150'>
                            <template slot-scope='scope'>
                                <el-tooltip content="修改" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifyuser(scope.row)'></el-button></el-tooltip>
                                <el-tooltip content="删除" placement="bottom"><el-button type='danger' icon="el-icon-delete" size='mini' @click='deleteuser(scope.row)'></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-dialog title="新增用户" :visible.sync="createuser" width="30%" center :before-close="handleClose" :close-on-click-modal='false'>
                <el-form :model='userform' :rules="userrule" ref='userform' label-width="30" class='demo-ruleForm'>
                    <el-form-item label="用户名" prop='username'>
                        <el-input v-model="userform.username" placeholder="用户名" style='width:80%'></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" prop='usertype'>
                        <el-select v-model="userform.usertype" placeholder="请选择用户类型">
                          <el-option label="系统用户" value='sys'></el-option>
                          <el-option label="SMB用户" value='smb'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="usersubmit('userform')">提交</el-button>
                        <el-button @click="userreset('userform')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title="修改用户" :visible.sync="modifydialog" width="30%" :before-close="handleClose" center :close-on-click-modal='false'>
                <el-form :model="userform" :rules="userrule" ref='userform' label-width="30" class='demo-ruleForm'>
                  <el-form-item label="新密码" prop='userpwd'>
                    <el-input v-model="userform.userpwd" placeholder="请输入新密码" type="password" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop='userpwdt'>
                    <el-input v-model="userform.userpwdt" placeholder="请再次输入新密码" type="password" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="modifysubmit('userform')">提交</el-button>
                    <el-button @click="userreset('userform')">重置</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title="删除用户" :visible.sync="deletedialog" width="30%" center :close-on-click-modal="false">
                <p>删除用户：{{target}}?</p>
                <el-button type="primary" @click='deleteu()'>确认</el-button>
                <el-button @click='deletedialog=false'>取消</el-button>
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
            target:'',
            userform:{
                username:'',
                usertype:'',
                userpwd:'',
                userpwdt:''
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
                _this.userdata = res.data.users                
            })
        },
        usersubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'',{name:_this.userform.username,type:userform.usertype}).then(function(res){
                        _this.createuser=false
                        if(res.data.status=='OK'){
                            $('#success').css({'display':'flex'})
                            setTimeout(function(){
                                $('#success').css({'display':'none'})
                            },3000)
                        }
                        else{
                            $('#error').css({'display':'flex'})
                            setTimeout(function(){
                                $('#error').css({'display':'none'})
                            },3000)
                        }
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
                    _this.$axios.post(this.$host+'',{name:_this.target,pwd:_this.userform.userpwd}).then(res=>{
                        _this.modifydialog=false
                        if(res.data.status=='OK'){
                           $('#success').css({'display':'flex'})
                            setTimeout(function(){
                                $('#success').css({'display':'none'})
                            },3000)
                        }
                        else{
                            $('#error').css({'display':'flex'})
                            setTimeout(function(){
                                $('#error').css({'display':'none'})
                            },3000)
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        deleteu(){
            this.$axios.post(this.$host+'',{name:target}).then(res=>{
                _this.deletedialog=false
                if(res.data.status=='OK'){
                    $('#success').css({'display':'flex'})
                    setTimeout(function(){
                        $('#success').css({'display':'none'})
                    },3000)
                }
                else{
                    $('#error').css({'display':'flex'})
                    setTimeout(function(){
                        $('#error').css({'display':'none'})
                    },3000)
                }
            }).catch(error=>{
                console.log(error)
            })
        },
        deleteuser(row){
            this.deletedialog=true;
            this.target=row.name
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
            this.target=row.name
        }
    },    
}
</script>
<style>

</style>