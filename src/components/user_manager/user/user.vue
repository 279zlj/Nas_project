<template>
    <div class='content'>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.user')}}</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-row style='margin-bottom:.5em;float:right'>
                    <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createuser = true'></el-button></el-tooltip>
                </el-row>
                    <el-table :data='userdata.slice((currpage - 1) * pagesize, currpage * pagesize)' border  class="table_cell" style='width:100%;min-height:310px;max-height:100%' v-if='alive'>
                        <el-table-column :label="$t('user.id')" prop='userid'></el-table-column>
                        <el-table-column :label="$t('user.name')" prop='username'></el-table-column>
                        <el-table-column :label="$t('user.type')" prop='last_name'></el-table-column>
                        <el-table-column :label="$t('group.Attribution')" prop="group"></el-table-column>
                        <el-table-column :label="$t('message.oper')" width='200'>
                            <template slot-scope='scope'>
                                <el-tooltip :content="$t('user.mgroup')" placement="bottom"><el-button type='primary' icon="el-icon-pingtaiguanli-yonghuguanli iconfont" size='mini' @click='modifygroup(scope.row)'></el-button></el-tooltip>
                                <el-tooltip :content="$t('user.muser')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifyuser(scope.row)'></el-button></el-tooltip>
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
                    :total="pageTotal" style="text-align: right;margin: 1em">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-dialog :title="$t('user.new')" :visible.sync="createuser" width="35%" center :before-close="handleClose" :close-on-click-modal='false'>
                <el-form :model='userform' :rules="userrule" ref='userform' label-width="150px" label-position="left" class='demo-ruleForm'>
                    <el-form-item :label="$t('user.name')" prop='username' >
                        <el-input v-model="userform.username" :placeholder="$t('user.name')" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('user.new_pass')" prop='userpwd'>
                        <el-input v-model="userform.userpwd" :placeholder="$t('user.input')" type="password" clearable ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('user.confirm')" prop='userpwdt'>
                        <el-input v-model="userform.userpwdt" :placeholder="$t('user.input2')" type="password" clearable ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('user.u_type')" prop='usertype'>
                        <el-select v-model="userform.usertype" :placeholder="$t('user.input3')">
                          <el-option :label="$t('user.sys')" value='0'></el-option>
                          <el-option :label="$t('user.smb')" value='1'></el-option>
                          <el-option :label="$t('user.afp')" value='2'></el-option>
                          <el-option :label="$t('user.ftp')" value='3'></el-option>
                          <el-option :label="$t('user.sftp')" value='4'></el-option>
                          <!-- <el-option label='备份用户' value="5"></el-option> -->
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('group.Attribution')" prop="gid">
                        <el-select v-model="userform.gid" :placeholder="$t('group.input')">
                          <el-option v-for="g in groupdata" :key="g.gid" :value="g.gid" :label='g.name' ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('iscsi.logic')" prop='doc' v-if='userform.usertype == "3" || userform.usertype == "4" '>
                        <el-select v-model="userform.doc" :placeholder="$t('message.select')">
                            <el-option v-for="i in docdata" :key="i.path" :value="i.path">{{i.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="usersubmit('userform')">{{$t('message.submit')}}</el-button>
                        <el-button @click="userreset('userform')">{{$t('message.reset')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('user.muser')" :visible.sync="modifydialog" width="35%" :before-close="handleClose" center :close-on-click-modal='false'>
                <el-form :model="userform" :rules="userrule" ref='userform' label-width="150px" label-position="left" class='demo-ruleForm'>
                  <el-form-item :label="$t('user.name')" >
                      {{target.username}}
                  </el-form-item>
                  <el-form-item :label="$t('user.old')" prop='oldpwd' >
                      <el-input v-model="userform.oldpwd" type="password" :placeholder="$t('user.input4')" clearable></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('user.new_pass')" prop='userpwd'>
                    <el-input v-model="userform.userpwd" :placeholder="$t('user.input')" type="password" clearable ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('user.confirm')" prop='userpwdt'>
                    <el-input v-model="userform.userpwdt" :placeholder="$t('user.input2')" type="password" clearable ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="modifysubmit('userform')">{{$t('message.submit')}}</el-button>
                    <el-button @click="userreset('userform')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('user.mgroup')" :visible.sync="modifygg" width="35%" :before-close="handleClose" center :close-on-click-modal='false'>
                <el-form :model="userform" :rules="userrule" ref='userform' label-width="150px" label-position="left" class='demo-ruleForm'>
                  <el-form-item :label="$t('group.Attribution')" prop="group">
                        <el-select v-model="userform.group" :placeholder="$t('group.input')">
                            <el-option v-for="g in groupdata" :key="g.gid" :value="g.gid" :label='g.name'></el-option>
                        </el-select>
                    </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="groupsubmit('userform')">{{$t('message.submit')}}</el-button>
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
export default {
    name:'user',
    data(){
        var pwdvali=(rule, val, callback)=>{
            if(!val){
                return callback(new Error(this.$t('user.input')))
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
                return callback(new Error(this.$t('user.input2')))
            }
            else if(val !== this.userform.userpwd){
                return callback(new Error(this.$t('user.input5')))
            }
            else{
                callback()
            }
        }
        return{
            userdata:[],
            groupdata:[],
            pagesize: 5,
            currpage: 1,
            pageTotal:0,
            createuser:false,
            modifydialog:false,
            deletedialog:false,
            alive:true,
            modifygg:false,
            target:'',
            docdata:[],
            userform:{
                username:'',
                usertype:'',
                userpwd:'',
                userpwdt:'',
                oldpwd:'',
                doc:'',
                gid:'',
                group:''
            },
            userrule:{
                username:[
                    {required:true, message:this.$t('user.input'), trigger: 'blur' },
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'},
                    {min:3,message:this.$t('pool.input1'),trigger:'blur'}
                ],
                usertype:[
                    {required:true, message:this.$t('user.input3'), trigger: 'blur' }
                ],
                userpwd:[
                    {required:true, validator: pwdvali, trigger: 'blur'}
                ],
                userpwdt:[
                    {required:true, validator: pwdtvali, trigger: 'blur'}
                ],
                oldpwd:[
                    {required:true,message:this.$t('user.input4'), trigger: 'blur'}
                ],
                doc:[
                    {required:true,message:this.$t('nfs.input6'), trigger: 'blur'}
                ],
                group:[
                    {required:true,message:this.$t('group.input'), trigger: 'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getuser()
       
    },
    watch:{
      pageTotal(){
        if(this.pageTotal==(this.currpage-1)*this.pagesize&& this.pageTotal!=0){
          this.currpage-=1;
        //   getuser(this);//获取列表数据
        }
      }
    },
    methods: {
        getuser(){
            var _this=this
            this.$axios.get(this.$host+'users').then(function(res){
                _this.userdata = res.data.data    
                _this.pageTotal = _this.userdata.length
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'vd').then(res=>{
                _this.docdata=res.data.data
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'group').then(res=>{
                _this.groupdata = res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        usersubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'users',{name:_this.userform.username,type:_this.userform.usertype,password:_this.userform.userpwd,doc:_this.userform.doc,group_id:_this.userform.gid}).then(function(res){
                        _this.createuser=false
                        if(res.data.success){
                            _this.$message({
                                message:_this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            _this.$message.error(res.data.msg)
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
                    _this.$axios.put(this.$host+'users',{id:_this.target.userid,type:_this.target.last_name,pwd:_this.userform.userpwd,old_password:_this.userform.oldpwd,}).then(res=>{
                        _this.modifydialog=false
                        if(res.data.success){
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            _this.$message.error(res.data.msg)
                        }
                        _this.getuser()
                        _this.userreset('userform')
                        
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        groupsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.put(this.$host+'users',{id:_this.target.userid,group_id:_this.userform.group}).then(res=>{
                        _this.modifygg=false
                        if(res.data.success){
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            _this.$message.error(res.data.msg)
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
                    _this.$message({
                        message:this.$t('message.success'),
                        type:'success',
                        offset:''
                    })
                }
                else if(!res.data.success){
                    _this.$message.error(res.data.msg)
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
        modifygroup(row){
            this.modifygg=true;
            this.target=row
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