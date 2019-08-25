<template>
    <div class='content'>
        <div>
            <div class='tip_bg'>
                <span class='tip'>文件备份</span>
            </div>
            <el-row class="main_table">
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-table :data='rfiledata' border class="table_cell" style="width:100%;min-height:150px;max-heigth:100%" >
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
                                <el-switch v-model="scope.row.status" :active-text="$t('message.open')" :inactive-text="$t('message.close')" @change="changestate(scope.row)" ></el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
              </el-col>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset="2" style="margin-top:2rem">
                  <el-card class="box-card" style="height:30em">
                      <el-tabs v-model="tabname">
                          <el-tab-pane label='客户端IP' name='back'>
                                <Back></Back>
                          </el-tab-pane>
                          <el-tab-pane label='文件恢复' key='recorey'>
                              <el-row>
                                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
                                    <span>服务器路径：{{target}}</span><el-button type="primary" size="mini" class='btnaa' @click="changeu = true">选择路径</el-button>
                                    <el-tree :props="props" :accordion='true' ref='treeForm' node-key="path" :load='loadNode' :check-strictly='true' lazy show-checkbox @check-change='changeselect' @node-click="nodeselect" class="tree" v-if='islinux'></el-tree>
                                </el-col>
                                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
                                    <span>客户端IP：{{pip}}</span><el-button type="primary" size="mini" class="btnaa" @click="changeip = true">客户端IP</el-button>
                                    <el-tree :props="props" :accordion='true' ref='iptree'  node-key='path' :load='loadIP' lazy show-checkbox check-strictly @check-change='ichangeselect' @node-click="ipselect" class="tree" v-if="isative"></el-tree>
                                </el-col>
                                <el-col :span='2' :offset="22">
                                    <el-button type='warning' size="small" style="margin-top:1rem" @click="getdata">恢复</el-button>
                                </el-col>
                            </el-row>
                          </el-tab-pane>
                      </el-tabs>
                  </el-card>
                  <el-dialog title="选择路径" :visible.sync="changeu" width="30%" :before-close="handleClose">
                      <el-form :model="userdata" :rules="userrule" ref="userdata" label-width="100px" label-position="left" class="demo-ruleForm" >
                        <el-form-item label="路径" prop="user">
                            <el-select v-model="userdata.user" placeholder="请选择路径">
                              <el-option v-for="u in user" :key="u" :value="u" :label="u"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="usersubmit('userdata')">{{$t('message.submit')}}</el-button>
                            <el-button @click="userreset('userdata')">{{$t('message.reset')}}</el-button>
                        </el-form-item>
                      </el-form>
                  </el-dialog>
                  <el-dialog title="客户端IP" :visible.sync="changeip" width="30%" :before-close="handleClose">
                      <el-form :model="userdata" :rules="userrule" ref="userdata" label-width="100px" label-position="left" class="demo-ruleForm" >
                        <el-form-item label="客户端IP" prop="ip">
                            <el-input v-model="userdata.ip" placeholder="请输入IP地址"></el-input>
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
export default {
    name:'rfile',
    components:{Back},
    data(){
        var checkip=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入IP'))
            }
            else{
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callback(new Error(this.$t('network.input')))
                }
                else
                    callback()
            }
        }
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
                    {required:true,message:'请选择路径',trigger:'blur'}
                ],
                ip:[
                    {required:true,validator:checkip,trigger:'blur'}
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
                this.$refs.iptree.setCheckedNodes([data.path])
            }
        },
        nodeselect(data,checked,node) {
            this.checkedid = data.path
            this.$refs.treeForm.setCheckedKeys([data,path])
        },
        ipselect(data,checked,node){
            this.checkedip = data.path
            this.$refs.iptree.setCheckedNodes([data.path])
        },
        loadNode(node, resolve) {
            
            if (node.level === 0) {
            return resolve(this.linuxp);
            }
            this.path = node.data.path
            setTimeout(() => {
                const wsurl = "ws://" + this.ip + "/choicepath";
                this.websock  = new WebSocket(wsurl);
                var a='{"username":"'+this.userdata.user+'"num":"0","localpath":"'+this.path+'"}'
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
            console.log(node.data)
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
                    data=JSON.parse(e.data).data
                    console.log(JSON.parse(data))
                    resolve(JSON.parse(data));
                }
                // console.log(this.path)
            
            }, 300);
        },
        getdata(){
            if(this.checkedid != '' && this.checkedid != undefined && this.checkedip != '' && this.checkedip != undefined){
                this.$confirm('确认进行恢复','提示',{
                    confirmButtonText:'确认',
                    cancelButtonText:'取消',
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
                        message:'已取消'
                    })
                })
            }
            else{
                this.$message.error({
                    message:'请选择路径'
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
                        data=JSON.parse(e.data).data
                        // console.log(typeof(data),'111111111111111111')
                        this.pcpath=JSON.parse(data)
                        // _this.isative = false
                        // _this.$nextTick(()=>(_this.isative=true))
                        _this.state(this.pcpath)
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
            this.$axios.get(this.$host+'users').then(res=>{
                var users=[]
                for(let i=0;i<res.data.data.length;i++){
                    if (res.data.data[i].last_name=='rsync')
                        users.push(res.data.data[i].username)
                }
                _this.user = users
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