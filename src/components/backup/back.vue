<template>
  <div class="content">
    <headerBar></headerBar>
    <div>
      <div class="tip_bg">
        <span class="tip">Oracle 数据库备份</span>
      </div>
      <el-row class="main_table">
        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" :offset="2">
          <el-row style="margin-bottom:.5em;float:right">
            <el-tooltip :content="$t('message.add')" placement="bottom">
              <el-button
                type="primary"
                icon="el-icon-circle-plus"
                size="small"
                @click="createhost = true"
              ></el-button>
            </el-tooltip>
          </el-row>
          <el-table
            :data="backdata.slice((currpage - 1) * pagesize, currpage * pagesize)"
            boder
            class="table_cell"
            style="width:100%;min-height:310px;max-height:100%;"
          >
            <el-table-column label="IP" prop="host"></el-table-column>
            <el-table-column label="用户名" prop="sys_user"></el-table-column>
            <el-table-column label="SID" prop="sid"></el-table-column>
            <el-table-column label="服务器端口号" prop="port"></el-table-column>
            <el-table-column label="Oracle端口号" prop="orcl_port"></el-table-column>
            <el-table-column :label="$t('message.oper')" width="250">
              <template slot-scope="scope">
                <el-tooltip content="开始备份" placement="bottom">
                  <el-button
                    type="primary"
                    icon="el-icon-dbsshujukubeifenDBS iconfont"
                    size="mini"
                    @click="startback(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('message.modify')" placement="bottom">
                  <el-button
                    type="warning"
                    icon="el-icon-edit-outline"
                    size="mini"
                    @click="modifyback(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('message.delete')" placement="bottom">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteback(scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10]"
            :page-size="pagesize"
            :total="pageTotal"
            style="text-align: right;margin: 1em"
          ></el-pagination>
        </el-col>
      </el-row>
      <el-dialog
        title="创建Oracle数据库备份"
        :visible.sync="createhost"
        width="45%"
        center
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          :model="newback"
          :rules="backrules"
          ref="newback"
          label-width="120px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item label="服务器IP" prop="ip">
            <el-input v-model="newback.ip" placeholder="请输入服务器ip"></el-input>
          </el-form-item>
          <el-form-item label="系统用户名" prop="name">
            <el-input v-model="newback.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="newback.pwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="sysport">
            <el-input v-model="newback.sysport" placeholder="请输入端口号" type="number"></el-input>
          </el-form-item>
          <el-form-item label="Oracle用户名" prop="dbuser">
            <el-input v-model="newback.dbuser" placeholder="请输入数据库用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="dbpwd">
            <el-input v-model="newback.dbpwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="SID" prop="sid">
            <el-input v-model="newback.sid" placeholder="请输入sid"></el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="orport">
            <el-input v-model="newback.orport" placeholder="请输入端口号" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="backsubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="修改备份参数"
        :visible.sync="modifyhost"
        width="40%"
        center
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          :model="newback"
          :rules="backrules"
          ref="newback"
          label-width="120px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item label="服务器IP">{{target.host}}</el-form-item>
          <el-form-item label="数据库用户名" prop="dbuser">
            <el-input v-model="newback.dbuser" :placeholder="target.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="dbpwd">
            <el-input v-model="newback.dbpwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="SID" prop="sid">
            <el-input v-model="newback.sid" :placeholder="target.sid"></el-input>
          </el-form-item>
          <!-- <el-form-item label="备份表" prop="tabback">
            <el-input v-model="newback.tabback" :placeholder="target.tabname"></el-input>
            <span style="color:red">(多表请用 , 隔开)</span>
          </el-form-item>
          <el-form-item label="备份形式" prop="func">
            <el-select v-model="newback.func" placeholder="请选择备份形式">
              <el-option label="全表" value="0"></el-option>
              <el-option label="表结构" value="1"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="modifysubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="备份" :visible.sync="startvisi" width="40%" center :before-close="handleClose" :close-on-click-modal="false">
          <el-form
          :model="newback"
          :rules="backrules"
          ref="newback"
          label-width="120px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item label="备份表" prop="tabback">
            <el-input v-model="newback.tabback" :placeholder="target.tabname"></el-input>
            <span style="color:red">(多表请用 , 隔开)</span>
          </el-form-item>
          <el-form-item label="备份形式" prop="func">
            <el-select v-model="newback.func" placeholder="请选择备份形式">
              <el-option label="全表" value="0"></el-option>
              <el-option label="表结构" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="startsubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
          </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headerBar from '../common/headerBar'
export default {
    name:'back',
    components:{headerBar},
    data(){
        var  checkip=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入服务器ip'))
            }
            else{
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callback(new Error('输入ip不正确'))
                }
                else
                    callback()
            }
        }
        var checkname=(rule, val,callback)=>{
            if(!val){
                 return callback(new Error('请输入服务器用户名'))
            }
            else
                callback()
        }
        var checkdbname=(rule, val,callback)=>{
            if(!val){
                 return callback(new Error('请输入数据库用户名'))
            }
            else
                callback()
        }
        var checkpwd=(rule, val, callback)=>{
            if(!val){
                return callback(new Error(this.$t('user.input')))
            }
            else
                callback()
            
        }
        var checkdbpwd=(rule, val,callback)=>{
            if(!val){
                 return callback(new Error(this.$t('user.input2')))
            }
            else
                callback()
        }
        var checktab=(rule, val,callback)=>{
            if(!val){
                 return callback(new Error('请输入表名'))
            }
            else
                callback()
        }
        var checkfun=(rule, val,callback)=>{
            if(!val){
                 return callback(new Error('请选择备份方式'))
            }
            else
                callback()
        }
        var checksid=(rule, val,callback)=>{
            if(!val){
                 return callback(new Error('请输入SID'))
            }
            else
                callback()
        }
        var checksysport=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入服务器端口号'))
            }
            else
                callback()
        }
        var checkorport = (rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入Oracle端口号'))
            }
            else
                callback()
        }
        return{
            backdata:[],
            pagesize: 5,
            currpage: 1,
            pageTotal:0,
            createhost:false,
            modifyhost:false,
            startvisi:false,
            newback:{
                ip:'',
                name:'',
                pwd:'',
                sid:'',
                tabback:'',
                func:'',
                dbuser:'',
                dbpwd:'',
                sysport:'',
                orport:''
            },
            backrules:{
                ip:[
                    {validator:checkip,trigger:'blur'}
                ],
                name:[
                    {validator:checkname,trigger:'blur'}
                ],
                sid:[
                    {validator:checksid,trigger:'blur'}
                ],
                pwd:[
                    {validator:checkpwd,trigger:'blur'}
                ],
                tabback:[
                    {validator:checktab,trigger:'blur'}
                ],
                func:[
                    {validator:checkfun,trigger:'blur'}
                ],
                dbuser:[
                    {validator:checkdbname, trigger:'blur'}
                ],
                dbpwd:[
                    {validator:checkdbpwd, trigger:'blur'}
                ],
                sysport:[
                    {validator:checksysport, trigger:'blur'}
                ],
                orport:[
                    {validator:checkorport, trigger:'blur'}
                ]
            },
            target:''
        }
    },
    watch:{
      pageTotal(){
        if(this.pageTotal==(this.currpage-1)*this.pagesize&& this.pageTotal!=0){
          this.currpage-=1;
        //   getuser(this);//获取列表数据
        }
      }
    },
    mounted(){
        this.getback()
    },
    methods:{
        getback(){
            this.$axios.get(this.$host+'orcl').then(res=>{
                this.backdata=res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        startback(row){
            this.target=row
            this.startvisi=true
        },
        modifyback(row){
            this.target=row
            this.modifyhost=true
        },
        backsubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'orcl',{sys_user:this.newback.name,sys_pwd:this.newback.pwd,host:this.newback.ip,orcl_user:this.newback.dbuser,orcl_pwd:this.newback.dbpwd,sid:this.newback.sid,sysport:this.newback.sysport,port:this.newback.orport}).then(res=>{
                        this.$message({
                            message:_this.$t('message.success'),
                            type:'success',
                            offset:''
                        })
                    }).catch(error=>{
                        console.log(error)
                    })
                }
                else if(!res.data.success){
                    this.$message.error(res.data.msg)
                }
            })
        },
        modifysubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.put(this.$host+'orcl',{host:this.target.id,orcl_user:this.newback.dbuser,orcl_pwd:this.newback.dbpwd,sid:this.newback.sid}).then(res=>{
                        this.$message({
                            message:_this.$t('message.success'),
                            type:'success',
                            offset:''
                        })
                    }).catch(error=>{
                        console.log(error)
                    })
                }
                else if(!res.data.success){
                    this.$message.error(res.data.msg)
                }
            })
        },
        startsubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'orcl',{sid:this.target.id,type:this.newback.func,tables:this.newback.tables}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                message:_this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                    })
                }
                else if(!res.data.success){
                    this.$message.error(res.data.msg)
                }
            })
        },
        deleteback(row){
            this.target=row
            this.$confirm('删除：'+row.id+'？','提示',{
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                this.$axios.delete(this.$host+'orcl',{data:{sid:this.target.id}}).then(res=>{
                        if(res.data.success){
                            this.$message({
                            type:'success',
                            message:'已删除'
                        })
                        }
                    })
                
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: '已取消'
                });  
            })
        },
        backreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['newback'].resetFields();
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
