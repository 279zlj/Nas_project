<template>
    <el-dialog :title="$t('raid.new')" :visible.sync="createraid" width="50%" center :before-close="handleClose" top='5em' :close-on-click-modal="false">
        <el-form :model="newraid" ref="newraid" :rules="newrule" label-width="165px" label-position="left" class="demo-ruleForm">
            <el-form-item :label="$t('raid.name')" prop="name">
                <el-input v-model="newraid.name" />
            </el-form-item>
            <el-form-item :label="$t('raid.level')" prop='level'>
                <el-select v-model="newraid.level" :placeholder="$t('raid.select')">
                <el-option label="0" value="0"></el-option>
                <el-option label='1' value='1'></el-option>
                <el-option label='5' value='5'></el-option>
                <el-option label='6' value='6'></el-option>
                <el-option label="10" value="10"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('raid.diskraid')" prop='datadisk'>
                <template>
                    <el-transfer v-model="newraid.datadisk" :data="all_disks" :titles="[$t('raid.disk1'),$t('raid.disk2')]" ></el-transfer>
                </template>
            </el-form-item>
            <el-form-item :label="$t('raid.ddisks')" prop='readydisk'>
                <el-transfer v-model="newraid.readydisk" :data="all_disks" :titles="[$t('raid.disk1'),$t('raid.disk2')]" ></el-transfer>
            </el-form-item>
            <el-form-item :label="$t('raid.cache')" prop='initfun'>
                <el-select v-model="newraid.initfun" :placeholder="$t('raid.select5')">
                <el-option :label="$t('raid.ss')"  value="direct"></el-option>
                <el-option :label="$t('raid.ss1')" value='cached'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('raid.chunk')" prop='datablock'>
                <el-select v-model="newraid.datablock" :placeholder="$t('raid.select2')">
                <el-option label='64K' value="64"></el-option>
                <el-option label="128K" value='128'></el-option>
                <el-option label="256K" value='256'></el-option>
                <el-option label='512K' value='512'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('raid.read')" prop='readplot'>
                <el-select v-model="newraid.readplot" :placeholder="$t('raid.select6')">
                <el-option :label="$t('raid.notinit')" value="nora"></el-option>
                <el-option :label="$t('raid.quit')" value='ra'></el-option>
                <el-option :label="$t('raid.all')" value='adra'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('raid.write')" prop='writeplot'>
                <el-select v-model="newraid.writeplot" :placeholder="$t('raid.select7')">
                <el-option :label="$t('raid.aa')" value="wt"></el-option>
                <el-option :label="$t('raid.aa1')" value='wb'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="createsubmit('newraid')">{{$t('message.submit')}}</el-button>
                <el-button @click="globalreset('newraid')">{{$t('message.reset')}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
export default {
    name:'newraid',
    props:['addraid','all_disks'],
    data(){
        return{
            newraid:{
                name:'',
                level:'',
                datadisk:[],
                readydisk:[],
                initfun:'',
                datablock:'',
                readplot:'',
                writeplot:''
            },
            newrule:{
                name:[
                    {required:true,message:'请输入阵列名称',trigger:'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'}
                ],
                level:[
                    {required:true,message:this.$t('raid.select8'), trigger: 'blur'}
                ],
                datadisk:[
                    {required:true,message:this.$t('raid.input'), trigger: 'blur'}
                ],
                initfun:[
                    {required:true,message:this.$t('raid.select5'), trigger: 'blur'}
                ],
                datablock:[
                    {required:true,message:this.$t('raid.select2'), trigger: 'blur'}
                ],
                readplot:[
                    {required:true,message:this.$t('raid.select6'), trigger: 'blur'}
                ],
                writeplot:[
                    {required:true,message:this.$t('raid.select7'), trigger: 'blur'}
                ]
            },
            disks:[],
            createraid:false
        }
    },
    watch:{
        addraid(val){
            this.createraid=val
        },
        all_disks(val){
            this.alldisks=val
        }
    },
    methods:{
        handleClose(done){
            done();
            this.$refs['newraid'].resetFields();
            this.$emit('changenew' ,false)
        },
        createsubmit(name){
            var _this=this
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'cli',{name:_this.newraid.name,level:_this.newraid.level,disks:_this.newraid.datadisk,cache_policy:_this.newraid.initfun,write_policy:_this.newraid.writeplot,read_policy:_this.newraid.readplot,hot_spares:_this.newraid.readydisk,strip:_this.newraid.datablock}).then(res=>{
                        console.log(res.data.success)
                        if(res.data.success){
                            _this.createraid=false
                                _this.$message({
                                    message:this.$t('message.success'),
                                    type:'success',
                                    offset:''
                                })
                        }
                        else {
                            _this.$message.error(res.data.msg)
                        }
                        _this.globalreset('newraid')
                    }).catch(error=>{
                        console.log(error)
                    })
                    this.$emit('changenew' ,false)
                }
            })
        },
        globalreset(name){
            this.$refs[name].resetFields()
        },
    }
}
</script>

