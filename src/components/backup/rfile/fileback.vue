<template>
    <el-row>
        <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <span>{{$t('backup.fileclient')}}：{{clientip}}</span><el-button type="primary" size="mini" class='btnaa' @click="clienti = true">{{$t('backup.fileclient')}}</el-button>
            <el-tree :props="props" :accordion='true' node-key="path" ref='clirnttree' :load='loadclient' lazy check-strictly show-checkbox @check-change='clientchange' @node-click="clientselect" class="tree" v-if="isclient"></el-tree>
        </el-col>
        <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
            <span>{{$t('backup.filepath')}}：{{serverip}}</span><el-button type="primary" size="mini" class="btnaa" @click="serverpath">{{$t('backup.filepath')}}</el-button>
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
                    <el-option v-for="u in user" :key="u" :value="u" :label="u"></el-option>
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
        <el-dialog :title="$t('message.fileback')" :visible.sync="backvisi" width="40%" :before-close="backhandle">
            <el-form :model="backdata" :rules="backrules" ref="backdata" label-width="140px" label-position="left" class="demo-ruleForm">
                <el-form-item :label="$t('backup.plan')" prop="plan">
                    <el-radio-group v-model="backdata.plan">
                    <el-radio label="0">{{$t('backup.plana')}}</el-radio>
                    <el-radio label="1">{{$t('backup.planb')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('backup.time')" prop="type" v-if="backdata.plan == 1">
                    <el-select :placeholder="$t('backup.input11')" v-model="backdata.type" >
                    <el-option :label="$t('backup.day')" value="day"></el-option>
                    <el-option :label="$t('backup.week')" value="week"></el-option>
                    <el-option :label="$t('backup.month')" value="monthday"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="week" v-if="backdata.type == 'week' && backdata.plan == 1">
                    <el-select v-model="backdata.week" :placeholder="$t('backup.input13')" >
                    <el-option :label="$t('backup.mon')" value="1"></el-option>
                    <el-option :label="$t('backup.tues')" value="2"></el-option>
                    <el-option :label="$t('backup.wed')" value="3"></el-option>
                    <el-option :label="$t('backup.thur')" value="4"></el-option>
                    <el-option :label="$t('backup.fri')" value="5"></el-option>
                    <el-option :label="$t('backup.sat')" value="6"></el-option>
                    <el-option :label="$t('backup.sun')" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="month" v-if="backdata.type == 'monthday' && backdata.plan == 1">
                    <el-select v-model="backdata.month" :placeholder="$t('backup.input11')" >
                    <el-option v-for="i in timedata" :key="i.value" :label="i.label" :value="i.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="day" v-if="backdata.type && backdata.plan == 1">
                    <el-time-picker v-model="backdata.day" :placeholder="$t('backup.input12')" value-format="HH" format="HH"></el-time-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="backsubmit('backdata')">{{$t('message.submit')}}</el-button>
                    <el-button @click="userreset('backdata')">{{$t('message.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-row>
</template>
<script>
export default {
    name:'fileback',
    data(){
        return{
            clientip:'',
            serverip:'',
            clienti:false,
            serveri:false,
            isserver:true,
            isclient:true,
            backvisi:false,
            backdata:{
                plan:'',
                type:'',
                day:'',
                week:'',
                month:''
            },
            backrules:{
                plan: [{ required: true, message: this.$t('backup.select3'), trigger: "blur" }],
                type: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                day: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                week: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                month: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
            },
            user:[],
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
            checkedip:'',
            flag:false,
            timedata:[
                {value:'1',label:'1号'},
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
        }
    },
    mounted(){
        this.selectuser()
    },
    methods:{
        changetime(val){
            console.log(val)
        },
        selectuser(){
            var _this=this
             this.$axios.get(this.$host+'backuser').then(res=>{
                _this.user = res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        serverpath(){
            this.serveri = true
            this.selectuser()
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
        backsubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'backfileup',{user:sessionStorage.getItem('loginname'),client:this.clientip,clientpath:this.checkedip,server:this.serverip,
                    plan:this.backdata.plan,type:this.backdata.type,hour:this.backdata.day,day:this.backdata.month,day_of_week:this.backdata.week}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                message:res.data.msg,
                                type:'success',
                            })
                            var date = new Date()
                            this.resetSetItem('backup',date.toLocaleString().replace('上午','').replace('下午',''))
                        }
                        else {
                            this.$message.error(res.data.msg)
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
                    this.backvisi = false
                }
            })
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
                let mutildata = []
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
                let mutildata = []
                this.websock.addEventListener('open', function () {
                    _this.websocketsend(a)
                });
                this.websock.onmessage=function(e){
                    if(JSON.parse(e.data).success){
                        data=JSON.parse(e.data).data
                        var aa= data
                        console.log(aa)
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
            if(!!this.userdata.ip && !!this.checkedip && !!this.serverip ){
                this.backvisi = true
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
        backhandle(done){
            done();
            this.$refs['backdata'].resetFields();
        }
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