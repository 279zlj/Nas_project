<template>
    <el-dialog :title="$t('raidMgr.global')" :visible.sync="globalset" width="35%" center :before-close="handleClose" :close-on-click-modal="false">
        <el-form :model="setdata" ref="setdata" label-width="200px" label-position="left" class="demo-ruleForm">
            <el-form-item :label="$t('global.status')" prop="state">
                <el-switch v-model="setdata.state" :active-text="$t('global.open')" :inactive-text="$t('global.close')"></el-switch>
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
                state:'',
                // check:'',
                // init:'',
                // consisten:'',
                // numrebuild:''
            },
            status:''
        }
    },
    watch:{
    gset(val) {
        this.globalset = val;//②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
        
    },
    },
    mounted(){
        this.getstate()
    },
    methods:{
        getstate(){
            var _this=this
            this.$axios.get(this.$host+'diskCfg').then(res=>{
                if(res.data.data == 'ON'){
                    _this.setdata.state = true
                }
                else{
                    _this.setdata.state = false
                }
                
                // _this.globaldata=res.data.data
                // _this.setdata.numrebuild=_this.globaldata.rebuild_rate.replace('%','')
                // _this.setdata.init=_this.globaldata.bgi_rate.replace('%','')
                // _this.setdata.consisten=_this.globaldata.check_consistency_rate.replace('%','')
                // _this.setdata.check=_this.globaldata.pr_rate.replace('%','')
                // _this.setdata.rebuild=_this.globaldata.reconstruction_rate.replace('%','')
            }).catch(error=>{
                console.log(error)
            })
        },
        handleClose(done){
            done();
            this.$refs['setdata'].resetFields();
            this.$emit('changeset' ,false)
        },
        globalsubmit(name){
            if(this.setdata.state){
                this.status = 'ON'
            }
            else
                this.status = 'OFF'
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.delete(this.$host+'diskCfg',{data:{active:this.status}}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                type: 'success',
                                message: this.$t('message.success')
                            });
                        }
                        else{
                            this.$message.error(res.data.msg)
                        }
                    })
                    this.getstate()
                    this.globalset = false
                    this.$emit('changeset' ,false)
                }
            })
        },
        globalreset(name){
            this.$refs[name].resetFields()
        },
    }
}
</script>

