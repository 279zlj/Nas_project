<template>
    <el-dialog :title="$t('raidMgr.global')" :visible.sync="globalset" width="45%" center :before-close="handleClose" :close-on-click-modal="false">
        <el-form :model="setdata" ref="setdata" :rules="setrule" label-width="270px" label-position="left" class="demo-ruleForm">
            <p><b>{{$t('raidMgr.source')}}:</b></p>
            <el-form-item :label="$t('global.rebuild')" prop="rebuild">
                <el-input v-model="setdata.rebuild" type="number"></el-input>
            </el-form-item>
            <el-form-item :label="$t('global.check')" prop="check">
                <el-input v-model="setdata.check" type="number"></el-input>
            </el-form-item>
            <el-form-item :label="$t('global.init')" prop="init">
                <el-input v-model="setdata.init" type="number"></el-input>
            </el-form-item>
            <el-form-item :label="$t('global.consisten')" prop="consisten">
                <el-input v-model="setdata.consisten" type="number"></el-input>
            </el-form-item>
            <el-form-item :label="$t('global.num')" prop="numrebuild">
                <el-input v-model="setdata.numrebuild" type="number"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="globalsubmit('setdata')">{{$t('message.submit')}}</el-button>
                <el-button @click="globalreset('setdata')">{{$t('message.reset')}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
export default {
    name:'global',
    props:['gset'],
    data(){
        return{
            globalset:false,
            globaldata:[],
            setdata:{
                rebuild:'',
                check:'',
                init:'',
                consisten:'',
                numrebuild:''
            },
            setrule:{
                rebuild:[
                    {required:true,message:this.$t('global.input1'), trigger:'blur'},
                ],
                check:[
                    {required:true,message:this.$t('global.input2'), trigger :'blur'}
                ],
                init:[
                    {required:true,message:this.$t('global.input3'), trigger: 'blur'}
                ],
                consisten:[
                    {required:true,message:this.$t('global.input4'), trigger: 'blur'}
                ],
                numrebuild:[
                    {required:true,message:this.$t('global.input5') ,trigger: 'blur'}
                ]
            },
        }
    },
    watch:{
    gset(val) {
        this.globalset = val;//②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
        
    },
    },
    mounted(){
        var _this=this
        this.$axios.get(this.$host+'global').then(res=>{
            _this.globaldata=res.data.data
            _this.setdata.numrebuild=_this.globaldata.rebuild_rate.replace('%','')
            _this.setdata.init=_this.globaldata.bgi_rate.replace('%','')
            _this.setdata.consisten=_this.globaldata.check_consistency_rate.replace('%','')
            _this.setdata.check=_this.globaldata.pr_rate.replace('%','')
            _this.setdata.rebuild=_this.globaldata.reconstruction_rate.replace('%','')
        }).catch(error=>{
            console.log(error)
        })
    },
    methods:{
        handleClose(done){
            done();
            this.$refs['setdata'].resetFields();
            this.$emit('changeset' ,false)
        },
        globalsubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){

                }
            })
        },
        globalreset(name){
            this.$refs[name].resetFields()
        },
    }
}
</script>

