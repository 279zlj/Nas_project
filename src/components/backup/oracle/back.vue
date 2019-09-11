<template>
  <div class="content">
    <div>
      <div class="tip_bg">
        <span class="tip">{{$t('message.sqlback')}}</span>
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
            <el-tooltip :content="$t('backup.smb')" placement="bottom">
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
            <el-table-column :label="$t('user.name')" prop="sys_user"></el-table-column>
            <el-table-column label="SID" prop="sid"></el-table-column>
            <el-table-column :label="$t('backup.type')" prop="port"></el-table-column>
            <el-table-column :label="$t('backup.port')" prop="orcl_port"></el-table-column>
            <el-table-column :label="$t('message.oper')" width="150">
              <template slot-scope="scope">
                <el-dropdown>
                  <el-button type="primary" size="mini">
                    {{$t('message.opr')}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <span @click="startback(scope.row)">
                      <el-dropdown-item>{{$t('backup.start')}}</el-dropdown-item>
                    </span>
                    <span @click="modifyback(scope.row)">
                      <el-dropdown-item>{{$t('message.modify')}}</el-dropdown-item>
                    </span>
                    <span @click="recovery(scope.row)">
                      <el-dropdown-item>{{$t('backup.renew')}}</el-dropdown-item>
                    </span>
                    <span @click="delfile(scope.row)">
                      <el-dropdown-item>{{$t('backup.del')}}</el-dropdown-item>
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
      <el-dialog :title="$t('backup.new')" :visible.sync="createhost" width="45%" center :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model='newback' :rules="backrule" ref='newback' class="demo-ruleForm" label-position="left" label-width="170px">
          <el-form-item :label="$t('backup.server')" prop="server">
            <el-input v-model="newback.server" :placeholder="$t('backup.input1')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('backup.type')" prop="type">
            <el-select v-model="newback.type" :placeholder="$t('backup.input2')">
              <el-option v-for="t in typedata" :key="t.value" :value="t.value" :label="t.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('backup.name')" prop="dbuser">
            <el-input v-model="newback.dbuser" :placeholder="$t('backup.input3')"></el-input>
          </el-form-item>
           <el-form-item :label="$t('backup.pass')" prop="dbpwd">
            <el-input v-model="newback.dbpwd" :placeholder="$t('backup.input6')" type="password"></el-input>
          </el-form-item>
          <el-form-item label="SID" prop="sid" v-if='newback.type == "oracle"'>
            <el-input v-model="newback.sid" :placeholder="$t('backup.input4')"></el-input>
          </el-form-item>
          <el-form-item label="数据库名" prop="sqlname" v-else>
            <el-input v-model="newback.sqlname" placeholder="请输入数据库名"></el-input>
          </el-form-item>
          <el-form-item :label="$t('backup.input5')" prop="orport">
            <el-input v-model="newback.orport" :placeholder="$t('backup.input5')" type="number"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="backsubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="$t('backup.smb')" :visible.sync="smbsetting" width="30%" center :before-close="handleSMB" :close-on-click-modal="false">
        <el-form :model="smbset" ref='smbset' label-position="left" label-width="130px" class="demo-ruleForm">
          <el-form-item label="SMB" prop="smbval" :rules="
                [
                { required: true, message:this.$t('backup.select1'), trigger: 'blur' },
                ]
                ">
            <el-select v-model="smbset.smbval" :placeholder="$t('backup.select1')">
               <el-option v-for="(s,index) in smbdata" :key="index" :value="s.name" :label="s.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('backup.net')" prop="net"  :rules="
                [
                { required: true, message:this.$t('backup.input14'), trigger: 'blur' },
                ]
                ">
            <el-select v-model="smbset.net" :placeholder="$t('backup.input14')">
              <el-option v-for="(n,index) in netdata" :key="index" :value="n.path" :label="n.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="smbsubmit('smbset')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('smbset')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="$t('backup.del')" :visible.sync="dfile"  width="45%" center :before-close="handleSMB" :close-on-click-modal="false">
        <el-form :model="smbset" ref='smbset' label-position="left" label-width="160px" class="demo-ruleForm">
        <el-form-item :label="$t('backup.had')" prop="recodoc" :rules="
          [
          { required: true, message:this.$t('backup.input2'), trigger: 'blur' },
          ]
          ">
          <el-select v-model="smbset.recodoc" :placeholder="$t('backup.input2')">
              <el-option v-for="d in docs" :key="d.id" :value="d.id" :label="d.file">
                <b>{{d.file}}</b>
                — Time：{{d.create_time}}
              </el-option>
            </el-select>
        </el-form-item>
         <el-form-item>
            <el-button type="primary" @click="dfilesubmit('smbset')">{{$t('message.delete')}}</el-button>
            <el-button @click="backreset('smbset')">{{$t('message.reset')}}</el-button>
          </el-form-item>
          </el-form>
      </el-dialog>
      <el-dialog :title="$t('backup.renewdata')" :visible.sync="reco"  width="45%" center :before-close="handleSMB" :close-on-click-modal="false">
        <el-form :model="smbset" ref='smbset' label-position="left" label-width="160px" class="demo-ruleForm">
          <el-form-item :label="$t('backup.file')" prop="recodoc" :rules="
          [
          { required: true, message:this.$t('backup.select2'), trigger: 'blur' },
          ]
          ">
            <el-select v-model="newback.recodoc" :placeholder="$t('backup.select2')">
              <el-option v-for="d in docs" :key="d.id" :value="d.id" :label="d.file">
                <b>{{d.file}}</b>
                — Time：{{d.create_time}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="recosubmit('smbset')">{{$t('backup.renew')}}</el-button>
            <el-button @click="backreset('smbset')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <Backupstart :status='startvisi' :tar='target' @changes='satechange'></Backupstart>
      <Backupmodify :status='modifyhost' :tar='target' @changes="satechange"></Backupmodify>
    </div>
  </div>
</template>
<script>
import Backupmodify from './opr/modify'
import Backupstart from './opr/start'
export default {
  name:'back',
  components:{Backupmodify,Backupstart},
  data(){
    return{
      createhost: false,
      modifyhost: false,
      startvisi:false,
      smbsetting:false,
      dfile:false,
      reco:false,
      backdata: [],
      pagesize: 5,
      currpage: 1,
      pageTotal: 0,
      smbdata:[],
      netdata:[],
      docs:[],
      typedata:[{value:'oracle',label:'Oracle'},{value:'mysql',label:'MySQL'},{value:'sqlserver',label:'SQL Server'}],
      newback:{
        server:'',
        type:'',
        dbuser:'',
        dbpwd:'',
        sid:'',
        orport:'',
        sqlname:''
      },
      backrule:{
        server:[
          {required:true,message:this.$t('backup.input1'), trigger:'blur'},
          {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:'输入ip格式不正确',trigger:'blur'}
        ],
        type:[
          { required: true ,message:this.$t('backup.input2'),trigger:'blur'}
        ],
        dbuser: [
          { required: true, message: this.$t('backup.input3'), trigger: "blur" }
        ],
        dbpwd: [
          { required: true, message: this.$t('backup.input6'), trigger: "blur" }
        ],
        sid: [{ required: true, message: this.$t('backup.input4'), trigger: "blur" }],
        orport: [
          {required: true,message: this.$t('backup.input5'),trigger: "blur"}
        ],
        sqlname:[
          {required: true,message: '请输入数据库名',trigger:'blur'},
          {pattern:/^[0-9a-zA-Z_]+$/,message:'请不要输入特殊字符，除下划线外',trigger:'blur'}
        ]
      },
      smbset:{
          smbval:'',
          net:'',
          recodoc:''
      },
      target:''
    }
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
  methods:{
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
        this.$axios.get(this.$host+'orcl_smb').then(res=>{
          this.smbset.net=res.data.data.host
          this.smbset.smbval=res.data.data.user
        }).catch(error=>{
          console.log(error)
        })
    },
    startback(row){
      this.target = row;
      this.startvisi=true
    },
    modifyback(row){
      this.target = row;
      this.modifyhost=true
    },
    satechange(val){
      this.startvisi=false
      this.modifyhost=false
    },
    backsubmit(name){
      this.$refs[name].validate((valid)=>{
        if(valid){
          this.$axios.post(this.$host+'orcl',{host:this.newback.server,user:this.newback.dbuser,pwd:this.newback.dbpwd,sid:this.newback.sid,sqlname:this.newback.sqlname,type:this.newback.dbpwd,port:this.newback.orport}).then(res=>{
            if(res.data.success){
              this.$message({
                message:this.$t('message.success'),
                type:'success',
              })
            }
            else{
              this.$message.error(res.data.msg)
            }
            
          }).catch(error=>{
            console.log(error)
          })
          this.createhost=false
          this.getback()
          this.backreset('newback')
        }
      })
    },
    smbsubmit(name){
      this.$refs[name].validate((valid)=>{
        if(valid){
          this.$axios.post(this.$host+'orcl_smb',{smb:this.smbset.smbval,net:this.smbset.net}).then(res=>{
            if(res.data.success){
              this.$message({
                message:this.$t('message.success'),
                type:'success'
              })
            }
            else{
              this.$message.error(res.data.msg)
            }
            
          }).catch(error=>{
            console.log(error)
          })
          this.smbsetting = false;
          this.getback()
          this.backreset('smbset')
        }
      })
    },
    dfilesubmit(name){
      this.$refs[name].validate((valid)=>{
        if(valid){
          this.$axios.delete(this.$host+'orcl_restore',{data:{oid:this.smbset.recodoc}}).then(res=>{
            if(res.data.success){
              this.$message({
                message:this.$t('message.success'),
                type:'success'
              })
            }
            else{
              this.$message.error(res.data.msg)
            }
          }).catch(error=>{
            console.log(error)
          })
          this.dfile = false;
          this.getback()
          this.backreset('smbset')
        }
      })
    },
    recosubmit(name){
      this.$refs[name].validate((valid)=>{
        if(valid){
          this.$axios.put(this.$host+'orcl_restore',{id:this.target.id,oid:this.smbset.recodoc}).then(res=>{
            if(res.data.success){
              this.$message({
                message:this.$t('message.success'),
                type:'success'
              })
            }
            else{
              this.$message.error(res.data.msg)
            }
          }).catch(error=>{
            console.log(error)
          })
          this.reco = false;
          this.getback();
          this.backreset('smbset')
        }
      })
    },
    delfile(row){
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
    recovery(row){
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
    deleteback(row) {
      this.target = row;
      this.$confirm(this.$t('message.delete')+"：" + row.host + "？", this.$t('message.tips'), {
        confirmButtonText: this.$t('message.sure'),
        cancelButtonText: this.$t('message.cancel'),
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(this.$host + "orcl", { data: { sid: this.target.id } })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: this.$t('message.success')
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('message.failed')
          });
        });
      this.getback();
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    },
    backreset(formname) {
      this.$refs[formname].resetFields();
    },
    handleClose(done) {
      done();
      this.$refs["newback"].resetFields();
    },
    handleSMB(done){
      done();
      this.$refs["smbset"].resetFields();
    }
  }
}
</script>