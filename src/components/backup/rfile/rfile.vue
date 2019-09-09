<template>
    <div class='content'>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{this.$t('message.fileback')}}</span>
            </div>
            <el-row class="main_table">
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-table :data='rfiledata' border class="table_cell" style="width:100%;min-height:150px;max-heigth:100%" >
                        <el-table-column :label="$t('message.service')" prop='service'></el-table-column>
                        <el-table-column :label="$t('message.oper')">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.status" :active-text="$t('message.open')" :inactive-text="$t('message.close')" @change="changestate(scope.row)" ></el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
              </el-col>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset="2" style="margin-top:2rem">
                  <el-card class="box-card" style="height:30em">
                      <el-tabs v-model="tabname">
                          <el-tab-pane :label="$t('message.fileback')" name='back'>
                                <Back :userdd='user'></Back>
                          </el-tab-pane>
                          <el-tab-pane :label="$t('backup.filereco')" name='recorey'>
                              <el-row>
                                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
                                    <span>{{$t('backup.filepath')}}：{{target}}</span><el-button type="primary" size="mini" class='btnaa' @click="changeu = true">{{$t('backup.select4')}}</el-button>
                                    <el-tree :props="props" :accordion='true' ref='treeForm' node-key="path" :load='loadNode' :check-strictly='true' lazy show-checkbox @check-change='changeselect' @node-click="nodeselect" class="tree" v-if='islinux'></el-tree>
                                </el-col>
                                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
                                    <span>{{$t('backup.fileclient')}}：{{pip}}</span><el-button type="primary" size="mini" class="btnaa" @click="changeip = true">{{$t('backup.fileclient')}}</el-button>
                                    <el-tree :props="props" :accordion='true' ref='iptree'  node-key='path' :load='loadIP' :check-strictly='true' lazy show-checkbox @check-change='ichangeselect' @node-click="ipselect" class="tree" v-if="isative"></el-tree>
                                </el-col>
                                <el-col :span='2' :offset="22">
                                    <el-button type='warning' size="small" style="margin-top:1rem" @click="getdata">{{$t('backup.renew')}}</el-button>
                                </el-col>
                            </el-row>
                          </el-tab-pane>
                          <el-tab-pane :label="$t('backup.del')" name='delfile'>
                              <Delfile></Delfile>
                          </el-tab-pane>
                      </el-tabs>
                  </el-card>
                  <el-dialog :title="$t('backup.select4')" :visible.sync="changeu" width="30%" :before-close="handleClose">
                      <el-form :model="userdata" :rules="userrule" ref="userdata" label-width="100px" label-position="left" class="demo-ruleForm" >
                        <el-form-item :label="$t('backup.path')" prop="user">
                            <el-select v-model="userdata.user" :placeholder="$t('backup.select4')">
                              <el-option v-for="u in user" :key="u" :value="u" :label="u"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="usersubmit('userdata')">{{$t('message.submit')}}</el-button>
                            <el-button @click="userreset('userdata')">{{$t('message.reset')}}</el-button>
                        </el-form-item>
                      </el-form>
                  </el-dialog>
                  <el-dialog :title="$t('backup.fileclient')" :visible.sync="changeip" width="30%" :before-close="handleClose">
                      <el-form :model="userdata" :rules="userrule" ref="userdata" label-width="100px" label-position="left" class="demo-ruleForm" >
                        <el-form-item :label="$t('backup.fileclient')" prop="ip">
                            <el-input v-model="userdata.ip" :placeholder="$t('bond.ip')" clearable ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="ipubmit('userdata')">{{$t('message.submit')}}</el-button>
                            <el-button @click="userreset('userdata')">{{$t('message.reset')}}</el-button>
                        </el-form-item>
                      </el-form>
                  </el-dialog>
              </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import Back from './fileback'
import Delfile from './delfile'
export default {
    name:'rfile',
    components:{Back,Delfile},
    data(){
        return{
            rfiledata:[],
            changeu:false,
            changeip:false,
            isative:true,
            islinux:true,
            tabname:'back',
            target:'',
            pip:'',
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            parent:[],
            iparent:[],
            path:'',
            ipath:'',
            user:[],
            userdata:{
                user:'',
                ip:''
            },
            userrule:{
                user:[
                    {required:true,message:this.$t('backup.select4'),trigger:'blur'}
                ],
                ip:[
                    {required:true,message:this.$t('bond.ip'),trigger:'blur'},
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('network.input'),trigger:'blur'}
                ]
            },
            webss:'',
            pcpath:[],
            linuxp:[],
            checkedid:'',
            checkedip:'',
        }
    },
    mounted(){
        this.getrsync()
    },
    methods:{
        changeselect(data, checked, indeterminate) {
            if(checked == true){
                this.checkedid = data.path
                this.$refs.treeForm.setCheckedKeys([data.path])
            }
        },
        ichangeselect(data, checked, indeterminate) {
            if(checked == true){
                this.checkedip = data.path
                this.$refs.iptree.setCheckedNodes([data])
            }
        },
        nodeselect(data,checked,node) {
            this.checkedid = data.path
            this.$refs.treeForm.setCheckedKeys([data.path])
        },
        ipselect(data,checked,node){
            this.checkedip = data.path
            this.$refs.iptree.setCheckedNodes([data])
        },
        loadNode(node, resolve) {
            
            if (node.level === 0) {
            return resolve(this.linuxp);
            }
            this.path = node.data.path
            setTimeout(() => {
                const wsurl = "ws://" + this.ip + "/choicepath";
                this.websock  = new WebSocket(wsurl);
                var a='{"username":"'+this.userdata.user+'","num":"0","localpath":"'+this.path+'"}'
                var _this=this
                let data = []
                this.websock.addEventListener('open', function () {
                    _this.websocketsend(a)
                });
                this.websock.onmessage=function(e){
                    data=JSON.parse(e.data).data
                    resolve(data);
                }
                // console.log(this.path)
            
            }, 300);
        },
        loadIP(node, resolve){
            if (node.level === 0) {
            return resolve(this.pcpath );
            }
            this.ipath = node.data.path
            setTimeout(() => {
                const wsurl = "ws://" + this.ip + "/choicepath";
                this.websock  = new WebSocket(wsurl);
                var a='{"pcip":"'+this.userdata.ip+'","num":"1","addrpath":"'+this.ipath+'"}'
                var _this=this
                let data = []
                this.websock.addEventListener('open', function () {
                    _this.websocketsend(a)
                });
                this.websock.onmessage=function(e){
                    if(JSON.parse(e.data).success){
                        data=JSON.parse(e.data).data
                        var aa= JSON.parse(data)
                        for(let i = 0;i<aa.length;i++){
                            if(aa[i].leaf){
                            aa[i].leaf=Boolean(aa[i].leaf)
                            }
                        }
                        resolve(aa);
                    }
                    else
                        _this.$message.error(JSON.parse(e.data).msg)
                }
                // console.log(this.path)
            
            }, 300);
        },
        getdata(){
            if(this.checkedid != '' && this.checkedid != undefined && this.checkedip != '' && this.checkedip != undefined){
                this.$confirm(this.$t('backup.sure1'),this.$t('backup.tips'),{
                    confirmButtonText:this.$t('message.sure'),
                    cancelButtonText:this.$t('message.cancel'),
                    type:'warning'
                }).then(()=>{
                    this.$axios.post(this.$host+'recoveryfile',{user:sessionStorage.getItem('loginname'),linuxname:this.target,linuxpath:this.checkedid,pc:this.pip,pcpath:this.checkedip}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                message:res.data.msg,
                                type:'success',
                            })
                        }
                        else {
                            this.$message.error(res.data.msg)
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:this.$t('message.cancel')
                    })
                })
            }
            else{
                this.$message.error({
                    message:this.$t('backup.select4')
                })
            }
        },
        usersubmit(name){
            this.target=this.userdata.user
            var  _this=this
            var dd = []
            this.$refs[name].validate((valid)=>{
                if(valid){
                    const wsurl = "ws://" + this.ip + "/choicepath";
                    this.websock  = new WebSocket(wsurl);
                    var a='{"username":"'+this.userdata.user+'","num":"0","localpath":""}'
                    this.websock.addEventListener('open', function () {
                        _this.websocketsend(a)
                    });
                    this.websock.onmessage=function(e){
                        dd=JSON.parse(e.data).data
                        this.linuxp=dd
                        _this.lstate(this.linuxp)
                    }
                    this.changeu=false
                }
                
            })
        },
        ipubmit(name){
            this.pip=this.userdata.ip
            var _this=this
            var data = []
            this.$refs[name].validate((valid)=>{
                if(valid){
                    const wsurl = "ws://" + this.ip + "/choicepath";
                    this.websock  = new WebSocket(wsurl);
                    var a='{"pcip":"'+this.userdata.ip+'","num":"1","addrpath":""}'
                    this.websock.addEventListener('open', function () {
                        _this.websocketsend(a)
                    });
                    this.websock.onmessage=function(e){
                        var recevie=JSON.parse(e.data)
                        if(recevie.success){
                            data=JSON.parse(e.data).data
                            this.pcpath=JSON.parse(data)
                            // _this.isative = false
                            // _this.$nextTick(()=>(_this.isative=true))
                            _this.state(this.pcpath)
                        }
                        else{
                            _this.$message.error(recevie.msg)
                        }
                    }
                    this.changeip=false
                    
                }
            })
            _this.pcpath = data
        },
        state(data){
            
            this.pcpath=data
            this.isative = false
            this.$nextTick(()=>(this.isative=true))
        },
        lstate(data){
            this.linuxp=data
            this.islinux = false
            this.$nextTick(()=>(this.islinux=true))
        },
        initWebSocket() {
        const wsurl = "ws://" + this.ip + "/choicepath";
        this.websock = new WebSocket(wsurl);
        this.websock.onopen = this.websocketonopen;
        this.websock.onmessage = this.websocketonmessage;
        //this.websock.onclose = this.websocketclose;
        },
        websocketonopen() {
        //console.log(JSON.parse(obj))
        console.log('ok')
        },
        websocketonmessage(e) {
        // const data = JSON.parse(e.data)
        // this.draw(data)
            
        console.log(e)
        },
        websocketsend(Data) {
        this.websock.send(Data);
        console.log(Data)
        },
        websocketclose(e) {
        console.log('断开连接', e);
        this.websock.close()
        },
        
        getrsync(){
            var _this=this
            this.$axios.get(this.$host+'statusrsync').then(res=>{
                _this.rfiledata=res.data.data
                _this.getuser()
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'backuser').then(res=>{
                _this.user = res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        getuser(){
            var  _this=this
            this.$axios.get(this.$host+'users').then(res=>{
                var rsync=[]
                for(let i=0;i<res.data.data.length;i++){
                    if(res.data.data[i].last_name == 'rsync')
                        rsync.push(res.data.data[i].username)
                }
                if(rsync.length == 0){
                    rsync.push('—')
                }
                _this.rfiledata.user=rsync
            }).catch(error=>{
                console.log(error)
            })
        },
        changestate(row){
            if(row.status){
                this.$axios.get(this.$host+'startrsync').then(res=>{
                    if(res.data.success){
                        this.$message({
                            message:res.data.msg,
                            type:'success' 
                        })
                    }
                    else{
                        this.$message.error({
                            message:res.data.msg,
                        })
                    }
                    this.getrsync()
                })
            }
            else{
                this.$axios.get(this.$host+'stoprsync').then(res=>{
                    if(res.data.success){
                        this.$message({
                            message:res.data.msg,
                            type:'success' 
                        })
                    }
                    else{
                        this.$message.error({
                            message:res.data.msg,
                        })
                    }
                })
            }
        },
        handleClose(done){
            done();
            this.$refs['userdata'].resetFields();
        },
        userreset(name){
            this.$refs[name].resetFields();
        }
    }
}
</script>
<style scoped>
.tree{
    margin:1rem 2rem 0 0 ;background-color:#E4E4E4;height:19rem;overflow-y:scroll;
}
.btnaa{
    float:right;
    margin-right:2rem;
}
</style>