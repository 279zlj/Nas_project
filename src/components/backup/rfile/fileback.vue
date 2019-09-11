<template>
    <el-row>
        <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <span>{{$t('backup.fileclient')}}：{{clientip}}</span><el-button type="primary" size="mini" class='btnaa' @click="clienti = true">{{$t('backup.fileclient')}}</el-button>
            <el-tree :props="props" :accordion='true' node-key="path" ref='clirnttree' :load='loadclient' lazy check-strictly show-checkbox @check-change='clientchange' @node-click="clientselect" class="tree" v-if="isclient"></el-tree>
        </el-col>
        <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <span>{{$t('backup.filepath')}}：{{serverip}}</span><el-button type="primary" size="mini" class="btnaa" @click="serveri = true">{{$t('backup.filepath')}}</el-button>
            <el-tree :props="props" :accordion='true' :load='loadserver' :check-strictly='true' lazy  class="tree" v-if='isserver'></el-tree>
        </el-col>
        <el-col :span='2' :offset="22">
            <el-button type='success' size="small" style="margin-top:1rem" @click="getback">{{$t('backup.back')}}</el-button>
        </el-col>
        <el-dialog :title="$t('backup.select4')" :visible.sync="serveri" width="30%" :before-close="handleClose">
            <el-form :model="userdata" :rules="userrule" ref="userdata" label-width="100px" label-position="left" class="demo-ruleForm" >
            <el-form-item :label="$t('backup.select6')" prop="type">
                <el-radio-group v-model="userdata.type">
                  <el-radio :label="0">{{$t('backup.has')}}</el-radio>
                  <el-radio :label="1">{{$t('backup.new')}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('backup.path')" prop="user" v-if='userdata.type=="0"'>
                <el-select v-model="userdata.user" :placeholder="$t('backup.select5')">
                    <el-option v-for="u in userd" :key="u" :value="u" :label="u"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('backup.path')" prop="newdoc" v-if='userdata.type=="1"'>
                <el-input v-model="userdata.newdoc" :placeholder="$t('backup.path1')" clearable ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="usersubmit('userdata')">{{$t('message.submit')}}</el-button>
                <el-button @click="userreset('userdata')">{{$t('message.reset')}}</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('backup.fileclient')" :visible.sync="clienti" width="30%" :before-close="handleClose">
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
    </el-row>
</template>
<script>
export default {
    name:'fileback',
    props:['userdd'],
    data(){
        return{
            clientip:'',
            serverip:'',
            clienti:false,
            serveri:false,
            isserver:true,
            isclient:true,
            userd:this.userdd,
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            userdata:{
                user:'',
                ip:'',
                type:0,
                newdoc:''
            },
            userrule:{
                user:[
                    {required:true,message:this.$t('backup.select5'),trigger:'blur'}
                ],
                ip:[
                    {required:true,message:this.$t('bond.ip'),trigger:'blur'},
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('network.input'),trigger:'blur'}
                ],
                type:[
                    {required:true,message:this.$t('backup.select6'),trigger:'blur'}
                ],
                newdoc:[
                    {required:true,message:this.$t('backup.select4'),trigger:'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'},
                    {min:3,max:10,message:this.$t('nfs.input2'),trigger:'blur'}
                ]
            },
            clientp:[],
            serverp:[],
            checkedip:''
        }
    },
    watch:{
        userdd(val){
            this.userd=val
            return this.userd
        }
    },
    methods:{
        getuser(){
            this.$axios.get(this.$host+'backuser').then(res=>{
                console.log(res.data.data)
                this.userd = res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        clientchange(data, checked, indeterminate) {
            if(checked == true){
                this.checkedip = data.path
                this.$refs.clirnttree.setCheckedNodes([data])
            }
        },
        clientselect(data,checked,node){
            this.checkedip = data.path
            this.$refs.clirnttree.setCheckedNodes([data])
        },
        loadclient(node,resolve){
            if (node.level === 0) {
            return resolve(this.clientp);
            }
            this.path = node.data.path
            setTimeout(() => {
                const wsurl = "ws://" + this.ip + "/choicepath";
                this.websock  = new WebSocket(wsurl);
                var a='{"client":"'+this.userdata.ip+'","num":"2","localpath":"'+this.path+'"}'
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
                            console.log(aa[i].leaf)
                            }
                        }
                        resolve(aa);
                    }
                    else{
                        _this.$message.error(JSON.parse(e.data).msg)
                    }
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
                var a='{"server":"'+this.userdata.user+'","num":"3","localpath":"'+this.path+'"}'
                var _this=this
                let data = []
                this.websock.addEventListener('open', function () {
                    _this.websocketsend(a)
                });
                this.websock.onmessage=function(e){
                    // console.log(JSON.parse(e.data))
                    data=JSON.parse(e.data).data
                    resolve(data);
                }
                // console.log(this.path)
            
            }, 300);
        },
        usersubmit(name){
            var  _this=this
            var dd = []
            this.$refs[name].validate((valid)=>{
                if(valid){
                    const wsurl = "ws://" + this.ip + "/choicepath";
                    this.websock  = new WebSocket(wsurl);
                    if(this.userdata.type == '0'){
                        var a='{"server":"'+this.userdata.user+'","num":"3","localpath":""}'
                        _this.serverip=this.userdata.user
                    }
                    else{
                        var a='{"server":"'+this.userdata.newdoc+'","num":"3","localpath":""}'
                        _this.serverip=this.userdata.newdoc
                    }
                    this.websock.addEventListener('open', function () {
                        _this.websocketsend(a)
                    });
                    this.websock.onmessage=function(e){
                        _this.userd=JSON.parse(e.data).allpath
                        dd=JSON.parse(e.data).data
                        this.serverp=dd
                        _this.lstate(this.serverp)
                    }
                    this.serveri=false
                    _this.userreset('userdata')
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
                    var a='{"client":"'+this.userdata.ip+'","num":"2","localpath":""}'
                    this.websock.addEventListener('open', function () {
                        _this.websocketsend(a)
                    });
                    this.websock.onmessage=function(e){
                        var recevie=JSON.parse(e.data)
                        if(recevie.success){
                            data=JSON.parse(e.data).data
                            this.clientp=JSON.parse(data)
                            // _this.isative = false
                            // _this.$nextTick(()=>(_this.isative=true))
                            _this.state(this.clientp)
                        }
                        else{
                            _this.$message.error(recevie.msg)
                        }
                    }
                    this.clienti=false
                    
                }
            })
            _this.pcpath = data
        },
        getback(){
            if(this.userdata.ip != '' && this.userdata.ip != undefined && this.checkedip != '' && this.checkedip != undefined && this.serverip  !='' && this.serverip != undefined){
                this.$confirm(this.$t('backup.sure'),this.$t('message.tips'),{
                    confirmButtonText:this.$t('message.sure'),
                    cancelButtonText:this.$t('message.cancel'),
                    type:'warning'
                }).then(()=>{
                    this.$axios.post(this.$host+'backfileup',{user:sessionStorage.getItem('loginname'),client:this.clientip,clientpath:this.checkedip,server:this.serverip}).then(res=>{
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
                    message:this.$t('backup.select5')
                })
            }
        },
        state(data){
            this.clientp=data
            // console.log(this.clientp,'12131232')
            this.isclient = false
            this.$nextTick(()=>(this.isclient=true))
        },
        lstate(data){
            this.serverp=data
            this.isserver = false
            this.$nextTick(()=>(this.isserver=true))
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
        // console.log(Data)/
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
    margin:1rem 2rem 0 0 ;background-color:#E4E4E4 !important;height:19rem;overflow-y:scroll;
}
.btnaa{
    float:right;
    margin-right:2rem !important;
}
</style>