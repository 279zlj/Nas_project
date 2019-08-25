<template>
    <el-row>
        <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <span>客户端IP：{{clientip}}</span><el-button type="primary" size="mini" class='btnaa' @click="clienti = true">客户端IP</el-button>
            <el-tree :props="props" :accordion='true' ref='iptree' :load='loadclient' lazy check-strictly show-checkbox @check-change='ichangeselect' @node-click="ipselect" class="tree" v-if="isclient"></el-tree>
        </el-col>
        <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <span>服务器路径：{{serverip}}</span><el-button type="primary" size="mini" class="btnaa" @click="serveri = true">服务器路径</el-button>
            <el-tree :props="props" :accordion='true' node-key="path" :load='loadserver' :check-strictly='true' lazy  class="tree" v-if='isserver'></el-tree>
        </el-col>
        <el-col :span='2' :offset="22">
            <el-button type='success' size="small" style="margin-top:1rem" @click="getback">备份</el-button>
        </el-col>
        <el-dialog title="选择路径" :visible.sync="serveri" width="30%" :before-close="handleClose">
            <el-form :model="userdata" :rules="userrule" ref="userdata" label-width="100px" label-position="left" class="demo-ruleForm" >
            <el-form-item label="选择方式" prop="type">
                <el-radio-group v-model="userdata.type">
                  <el-radio label="已有"></el-radio>
                  <el-radio label="新建"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="路径" prop="user" v-if='userdata.type=="已有"'>
                <el-select v-model="userdata.user" placeholder="请选择路径">
                    <el-option v-for="u in user" :key="u" :value="u" :label="u"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="路径" prop="newdoc" v-if='userdata.type=="新建"'>
                <el-input v-model="userdata.newdoc" placeholder="请输入路径"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="usersubmit('userdata')">{{$t('message.submit')}}</el-button>
                <el-button @click="userreset('userdata')">{{$t('message.reset')}}</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="客户端IP" :visible.sync="clienti" width="30%" :before-close="handleClose">
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
    </el-row>
</template>
<script>
export default {
    name:'fileback',
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
        var checkdoc=(rule,val,callback)=>{
            var reg = /^[0-9a-zA-Z]+$/
            if(!val){
                return callback(new Error('请输入路径'))
            }
            else if( val.length < 3 || val.length > 10){
                return callback(new Error('请输入长度大于3小于10的路径'))
            }
            else if(!reg.test(val)){
                return callback(new Error('请输入不带特殊字符的路径'))
            }
            else 
                return callback()
        }
        return{
            clientip:'',
            serverip:'',
            clienti:false,
            serveri:false,
            isserver:true,
            isclient:true,
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            userdata:{
                user:'',
                ip:'',
                type:'已有',
                newdoc:''
            },
            userrule:{
                user:[
                    {required:true,message:'请选择路径',trigger:'blur'}
                ],
                ip:[
                    {required:true,validator:checkip,trigger:'blur'}
                ],
                type:[
                    {required:true,message:'请选择方式',trigger:'blur'}
                ],
                newdoc:[
                    {required:true,validator:checkdoc,trigger:'blur'}
                ]
            },
            user:[],
            clientp:[],
            serverp:[],
            checkedip:''
        }
    },
    methods:{
        ichangeselect(data, checked, indeterminate) {
            if(checked == true){
                this.checkedip = data.path
                this.$refs.iptree.setCheckedNodes([data])
            }
        },
        ipselect(data,checked,node){
            this.checkedip = data.path
            this.$refs.iptree.setCheckedNodes([data])
        },
        loadclient(node,resolve){
            if (node.level === 0) {
            return resolve(this.clientp);
            }
            this.path = node.data.path
            setTimeout(() => {
                const wsurl = "ws://" + this.ip + "/choicepath";
                this.websock  = new WebSocket(wsurl);
                var a='{"client":"'+this.userdata.user+'"num":"2","localpath":"'+this.path+'"}'
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
        loadserver(node,resolve){
             if (node.level === 0) {
            return resolve(this.serverp);
            }
            this.path = node.data.path
            setTimeout(() => {
                const wsurl = "ws://" + this.ip + "/choicepath";
                this.websock  = new WebSocket(wsurl);
                var a='{"server":"'+this.userdata.user+'"num":"3","localpath":"'+this.path+'"}'
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
        usersubmit(name){
            this.serverip=this.userdata.user
            var  _this=this
            var dd = []
            this.$refs[name].validate((valid)=>{
                if(valid){
                    const wsurl = "ws://" + this.ip + "/choicepath";
                    this.websock  = new WebSocket(wsurl);
                    var a='{"server":"'+this.userdata.user+'","num":"3","localpath":""}'
                    this.websock.addEventListener('open', function () {
                        _this.websocketsend(a)
                    });
                    this.websock.onmessage=function(e){
                        dd=JSON.parse(e.data).data
                        this.serverp=dd
                        _this.lstate(this.serverp)
                    }
                    this.changeu=false
                }
                
            })
        },
        ipubmit(name){
            this.clientip=this.userdata.ip
            var _this=this
            var data = []
            this.$refs[name].validate((valid)=>{
                if(valid){
                    const wsurl = "ws://" + this.ip + "/choicepath";
                    this.websock  = new WebSocket(wsurl);
                    var a='{"client":"'+this.userdata.ip+'","num":"2","addrpath":""}'
                    this.websock.addEventListener('open', function () {
                        _this.websocketsend(a)
                    });
                    this.websock.onmessage=function(e){
                        data=JSON.parse(e.data).data
                        // console.log(typeof(data),'111111111111111111')
                        this.clientp=JSON.parse(data)
                        // _this.isative = false
                        // _this.$nextTick(()=>(_this.isative=true))
                        _this.state(this.clientp)
                    }
                    this.changeip=false
                    
                }
            })
            _this.pcpath = data
        },
        getback(){
            if(this.userdata.ip != '' && this.userdata.ip != undefined && this.checkedip != '' && this.checkedip != undefined){
                this.$confirm('确认进行备份','提示',{
                    confirmButtonText:'确认',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.$axios.post(this.$host+'recoveryfile',{user:sessionStorage.getItem('loginname'),client:this.clientip,serverpath:this.checkedip,server:this.serverip}).then(res=>{
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
        state(data){
            this.clientp=data
            this.isclient = false
            this.$nextTick(()=>(this.isclient=true))
        },
        lstate(data){
            this.serverp=data
            this.isserver = false
            this.$nextTick(()=>(this.isserver=true))
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
        
        userreset(name){
            this.$refs[name].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['userdata'].resetFields();
        },
    }
}
</script>
<style>
.tree{
    margin:1rem 2rem 0 0 ;background-color:#E4E4E4;height:19rem;overflow-y:scroll;
}
.btnaa{
    float:right;
    margin-right:2rem;
}
</style>