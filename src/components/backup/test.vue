<template>
  <div class="content">
    <div>
      <div class="tip_bg">
        <span class="tip">数据库备份</span>
      </div>
      <el-row class="main_table">
        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" :offset="2">
          <el-row style="margin-bottom:.5em;float:right">
            <el-tooltip :content="$t('message.add')" placement="bottom">
              <el-button
                type="primary"
                icon="el-icon-tianjia iconfont"
                size="small"
                @click="createhost = true"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="SMB配置" placement="bottom">
              <el-button
                type="warning"
                icon="el-icon-SMB iconfont"
                size="small"
                @click="smbsetting = true"
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
            <el-table-column label="数据库类型" prop="port"></el-table-column>
            <el-table-column label="端口号" prop="orcl_port"></el-table-column>
            <el-table-column :label="$t('message.oper')" width="150">
              <template slot-scope="scope">
                <el-dropdown>
                  <el-button type="primary" size="mini">
                    {{$t('message.opr')}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <span @click="startback(scope.row)">
                      <el-dropdown-item>开始备份</el-dropdown-item>
                    </span>
                    <span @click="modifyback(scope.row)">
                      <el-dropdown-item>{{$t('message.modify')}}</el-dropdown-item>
                    </span>
                    <span @click="recovery(scope.row)">
                      <el-dropdown-item>恢复</el-dropdown-item>
                    </span>
                    <span @click="delfile(scope.row)">
                      <el-dropdown-item>删除备份文件</el-dropdown-item>
                    </span>
                    <span @click="deleteback(scope.row)">
                      <el-dropdown-item>{{$t('message.delete')}}</el-dropdown-item>
                    </span>
                  </el-dropdown-menu>
                </el-dropdown>
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
      <el-dialog title="创建数据库备份" :visible.sync="createhost" width="45%" center :before-close="handleClose" :close-on-click-modal="false">
        <el-form :model="addback" ref='addback' class="demo-ruleForm">
          <el-form-item label="服务器IP" prop="ip" :rules="[
            {required:true,message:'请输入服务器ip', trigger: 'blur' }
            ]">
            <el-input v-model="addback.ip" placeholder="请输入服务器ip"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="backsubmit('addback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('addback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- <el-dialog
        title="创建数据库备份"
        :visible.sync="createhost"
        width="45%"
        center
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          :model="addback"
          ref="addback"
          label-width="120px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item label="服务器IP" prop="ip" :rules="[
            {required:true,message:'请输入服务器ip', trigger: 'blur' }
            ]">
            <el-input v-model="addback.ip" placeholder="请输入服务器ip"></el-input>
          </el-form-item>
          <el-form-item label="数据库类型" prop="type">
            <el-select v-model="addback.type" placeholder="请选择数据库类型">
              <el-option v-for="t in typedata" :key="t.value" :value="t.value" :label="t.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据库用户名" prop="dbuser">
            <el-input v-model="addback.dbuser" placeholder="请输入数据库用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="dbpwd">
            <el-input v-model="addback.dbpwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="SID" prop="sid">
            <el-input v-model="addback.sid" placeholder="请输入sid"></el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="orport">
            <el-input v-model="addback.orport" placeholder="请输入端口号" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="backsubmit('addback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('addback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
      <!-- <el-dialog
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
            <el-input v-model="newback.dbuser" :placeholder="target.sys_user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="dbpwd">
            <el-input v-model="newback.dbpwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="SID" prop="sid">
            <el-input v-model="newback.sid" :placeholder="target.sid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="modifysubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
      <!-- <el-dialog
        title="备份"
        :visible.sync="startvisi"
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
          <el-form-item label="备份文件名" prop="filename">
            <el-input v-model="newback.filename" placeholder="请输入备份文件名"></el-input>
          </el-form-item>
          <el-form-item label="备份描述" prop="content">
            <el-input v-model="newback.content" placeholder="备份描述"></el-input>
          </el-form-item>
          <el-form-item label="备份表" prop="tabback">
            <el-input v-model="newback.tabback" placeholder="请输入表名"></el-input>
            <span style="color:red">(多表请用 , 隔开)</span>
          </el-form-item>
          <el-form-item label="备份形式" prop="func">
            <el-select v-model="newback.func" placeholder="请选择备份形式">
              <el-option label="非增量" value="0"></el-option>
              <el-option label="增量" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划任务" prop="plan">
            <el-radio-group v-model="newback.plan">
              <el-radio label="0">即时任务</el-radio>
              <el-radio label="1">定时任务</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间" prop="time" v-if="newback.plan == 1">
            <el-select placeholder="请选择时间" v-model="newback.time">
              <el-option label="每日" value="day"></el-option>
              <el-option label="每周" value="week"></el-option>
              <el-option label="每月" value="monthday"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="day" v-if="newback.time == 'day'">
            <el-time-picker v-model="newback.day" placeholder="任意时间点" value-format="HH" format="HH"></el-time-picker>
          </el-form-item>
          <el-form-item prop="week" v-if="newback.time == 'week'">
            <el-select v-model="newback.week" placeholder="选择星期">
              <el-option label="星期一" value="1"></el-option>
              <el-option label="星期二" value="2"></el-option>
              <el-option label="星期三" value="3"></el-option>
              <el-option label="星期四" value="4"></el-option>
              <el-option label="星期五" value="5"></el-option>
              <el-option label="星期六" value="6"></el-option>
              <el-option label="星期日" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="month" v-if="newback.time == 'monthday'">
            <el-select v-model="newback.month" placeholder="请选择时间" >
              <el-option v-for="i in timedata" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="startsubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
      <!-- <el-dialog
        title="恢复数据库"
        :visible.sync="reco"
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
          <el-form-item label="备份文件" prop="recodoc">
            <el-select v-model="newback.recodoc" placeholder="请选择备份文件">
              <el-option v-for="d in docs" :key="d.id" :value="d.id" :label="d.file">
                <b>{{d.file}}</b>
                — Time：{{d.create_time}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="recosubmit('newback')">恢复</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
      <!-- <el-dialog title="配置SMB" :visible.sync="smbsetting" width="30%" center :before-close="handleClose" :close-on-click-modal="false">
        <el-form :model="newback" :rules="backrules" ref='newback' label-position="left" label-width="130px" class="demo-ruleForm">
          <el-form-item label="SMB" prop="smbval">
            <el-select v-model="newback.smbval" placeholder="请选择SMB">
               <el-option v-for="(s,index) in smbdata" :key="index" :value="s.path" :label="s.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网络" prop="net">
            <el-select v-model="newback.net" placeholder="请选择网络">
              <el-option v-for="(n,index) in netdata" :key="index" :value="n.path" :label="n.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="smbsubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
      <!-- <el-dialog
        title="删除备份文件"
        :visible.sync="dfile"
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
          <el-form-item label="已有备份文件" prop="recodoc">
            <el-select v-model="newback.recodoc" placeholder="请选择备份文件">
              <el-option v-for="d in docs" :key="d.id" :value="d.id" :label="d.file">
                <b>{{d.file}}</b>
                — Time：{{d.create_time}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dfilesubmit('newback')">删除</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "back",
  data() {
    return {
      backdata: [],
      pagesize: 5,
      currpage: 1,
      pageTotal: 0,
      createhost: false,
      modifyhost: false,
      startvisi: false,
      reco: false,
      dfile: false,
      smbsetting: false,
      docs: [],
      addback:{
        ip: "",
        type: "",
        dbuser: "",
        dbpwd: "",
        sid: "",
        orport: "",
      },
      // addrules:{
      //   ip: [{ required: true, message:'请输入服务器ip', trigger: "blur" },
      //   {required:true,pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:'输入ip格式不正确',trigger:'blur'}],
      //   type: [{ required: true ,message:'请选择数据库类型',trigger:'blur'}],
      //   dbuser: [
      //     { required: true, message: "请输入服务器用户名", trigger: "blur" }
      //   ],
      //   dbpwd: [
      //     { required: true, message: this.$t("user.input2"), trigger: "blur" }
      //   ],
      //   sid: [{ required: true, message: "请输入SID", trigger: "blur" }],
      //   orport: [
      //     {
      //       required: true,
      //       message: "请输入Oracle端口号",
      //       trigger: "blur"
      //     }
      //   ],
      // },
      // newback: {
      //   tabback: "",
      //   func: "",
      //   content: "",
      //   recodoc: "",
      //   plan: "",
      //   time: "",
      //   day: "",
      //   week: "",
      //   month: "",
      //   diy: "",
      //   smbval:'',
      //   net:'',
      //   filename:''
      // },
      // backrules: {
      //   func: [{ required: true, message: "请选择备份方式", trigger: "blur" }],
        
        
        
      //   recodoc: [
      //     {
      //       required: true,
      //       message: "请选择备份文件",
      //       trigger: "blur"
      //     }
      //   ],
      //   plan: [{ required: true, message: "请选择任务类型", trigger: "blur" }],
      //   time: [{ required: true, message: "请选择时间", trigger: "blur" }],
      //   day: [{ required: true, message: "请输入时间", trigger: "blur" }],
      //   week: [{ required: true, message: "请输入时间", trigger: "blur" }],
      //   month: [{ required: true, message: "请输入时间", trigger: "blur" }],
      //   diy: [{ required: true, message: "请输入时间", trigger: "blur" }],
      //   smbval: [{ required: true, message: "请选择SMB", trigger: "blur" }],
      //   net: [{required:true,message:'请选择网络',trigger:blur}],
      //   filename:[{required:true,message:'请输入备份文件名',trigger:'bulr'},{pattern:/^[0-9a-zA-Z]+$/,message:'请不要有特殊符合',trigger:'blur'}]
      // },
      target: "",
      smbdata:[],
      typedata:[{value:'oracle',label:'Oracle'},{value:'mysql',label:'MySQL'},{value:'sqlserver',label:'SQL Server'}],
      timedata:[{value:'1',label:'1号'},
      {value:'2',label:'2号'},
      {value:'3',label:'3号'},
      {value:'4',label:'4号'},
      {value:'5',label:'5号'},
      {value:'6',label:'6号'},
      {value:'7',label:'7号'},
      {value:'8',label:'8号'},
      {value:'9',label:'9号'},
      {value:'10',label:'10号'},
      {value:'11',label:'11号'},
      {value:'12',label:'12号'},
      {value:'13',label:'13号'},
      {value:'14',label:'14号'},
      {value:'15',label:'15号'},
      {value:'16',label:'16号'},
      {value:'17',label:'17号'},
      {value:'18',label:'18号'},
      {value:'19',label:'19号'},
      {value:'20',label:'20号'},
      {value:'21',label:'21号'},
      {value:'22',label:'22号'},
      {value:'23',label:'23号'},
      {value:'24',label:'24号'},
      {value:'25',label:'25号'},
      {value:'26',label:'26号'},
      {value:'27',label:'27号'},
      {value:'28',label:'28号'},
      ],
      netdata:[]
    };
  },
  watch: {
    pageTotal() {
      if (
        this.pageTotal == (this.currpage - 1) * this.pagesize &&
        this.pageTotal != 0
      ) {
        this.currpage -= 1;
        //   getuser(this);//获取列表数据
      }
    }
  },
  mounted() {
    this.getback();
  },
  methods: {
    getback() {
      this.smbdata=[]
      this.netdata=[]
      this.$axios
        .get(this.$host + "orcl")
        .then(res => {
          this.backdata = res.data.data;
          this.pageTotal = this.backdata.length
        })
        .catch(error => {
          console.log(error);
        });
        this.$axios.get(this.$host+'smb').then(res=>{
          var data = res.data.data
          for(let i = 0;i<data.length;i++){
            let a = {}
            a.path = data[i].data.path
            a.name = data[i].name
            this.smbdata.push(a)
          }
        }).catch(error=>{
          console.log(error)
        })
        this.$axios.get(this.$host+'network').then(res=>{
          var dd =res.data.network
          for(let i=0;i<dd.length;i++){
            let a ={}
            if(dd[i].addr != null){
              a.name = dd[i].addr
              a.path = dd[i].addr
              this.netdata.push(a)
            }
          }
        }).catch(error=>{
          console.log(error)
        })
        // this.$axios.get(this.$host+'orcl_smb').then(res=>{
        //   this.newback.net=res.data.data.host
        //   this.newback.smbval=res.data.data.user
        // }).catch(error=>{
        //   console.log(error)
        // })
    },
    startback(row) {
      this.target = row;
      this.startvisi = true;
    },
    modifyback(row) {
      this.target = row;
      this.modifyhost = true;
    },
    delfile(row) {
      this.target = row;
      this.dfile = true;
      this.$axios
        .post(this.$host + "orcl_restore", { id: row.id })
        .then(res => {
          this.docs = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    recovery(row) {
      this.target = row;
      this.reco = true;
      this.$axios
        .post(this.$host + "orcl_restore", { id: row.id })
        .then(res => {
          this.docs = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    recosubmit(name) {
      this.$refs[name].validate(vaild => {
        if (vaild) {
          this.$axios
            .put(this.$host + "orcl_restore", {
              id: this.target.id,
              oid: this.newback.recodoc
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: _this.$t("message.success"),
                  type: "success",
                  offset: ""
                });
              } else if (!res.data.success) {
                this.$message.error(res.data.msg);
              }
              this.reco = false;
              this.getback();
            });
        }
      });
    },
    dfilesubmit(name) {
      this.$refs[name].validate(vaild => {
        if (vaild) {
          this.$axios
            .delete(this.$host + "orcl_restore", {
              data: { oid: this.newback.recodoc }
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: _this.$t("message.success"),
                  type: "success",
                  offset: ""
                });
              } else if (!res.data.success) {
                this.$message.error(res.data.msg);
              }
              this.dfile = false;
              this.getback();
            });
        }
      });
    },
    backsubmit(name) {
      this.$refs[name].validate(valid => {
      console.log(111111111)

        if (valid) {
          console.log("dsadas");
          this.$axios
            .post(this.$host + "orcl", {
              host: this.newback.ip,
              user: this.newback.dbuser,
              pwd: this.newback.dbpwd,
              sid: this.newback.sid,
              type: this.newback.type,
              port: this.newback.orport
            })
            .then(res => {
               if (res.data.success){
                this.$message({
                  message: _this.$t("message.success"),
                  type: "success",
                  offset: ""
                });
               }
              else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              console.log(error);
            });
          this.createhost = false;
        } 
        this.getback();
        this.backreset('addback')
      });
    },
    modifysubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .put(this.$host + "orcl", {
              host: this.target.id,
              orcl_user: this.newback.dbuser,
              orcl_pwd: this.newback.dbpwd,
              sid: this.newback.sid
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: _this.$t("message.success"),
                  type: "success",
                  offset: ""
                });
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {
              console.log(error);
            });
          this.modifyhost = false;
        }
        this.getback();
      });
    },
    smbsubmit(name){
      this.$refs[name].validate((valid)=>{
        if(valid){
        this.$axios.post(this.$host+'orcl_smb',{smb:this.newback.smbval,net:this.newback.net}).then(res=>{
          if(res.data.success){
            this.$message({
              message: _this.$t("message.success"),
              type: "success",
              offset: ""
            });
          }
          else {
                this.$message.error(res.data.msg);
              }
        })
        .catch(error => {
              console.log(error);
            });
            this.smbsetting = false;
        }
        this.getback();
        this.backreset('newback')
      })
    },
    startsubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.$host + "orcl_back", {
              sid: this.target.id,
              filen: this.newback.filename,
              type: this.newback.func,
              tables: this.newback.tabback,
              content: this.newback.content,
              plan: this.newback.plan,
              type: this.newback.time,
              day: this.newback.day,
              week: this.newback.week,
              month: this.newback.month,
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: _this.$t("message.success"),
                  type: "success",
                  offset: ""
                });
              } else {
                this.$message.error(res.data.msg);
              }
            });
          this.startvisi = false;
        }
        this.getback();
        this.backreset('newback')
        this.$emit('changes' ,false)
      });
    },
    deleteback(row) {
      this.target = row;
      this.$confirm("删除：" + row.host + "？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(this.$host + "orcl", { data: { sid: this.target.id } })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "已删除"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      this.getback();
    },
    backreset(formname) {
      this.$refs[formname].resetFields();
    },
    handleClose(done) {
      done();
      this.$refs["newback"].resetFields();
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    }
  }
};
</script>
