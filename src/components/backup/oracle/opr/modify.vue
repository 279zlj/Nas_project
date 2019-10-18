<template>
    <div>
        <el-dialog :title="$t('backup.modi')"
        :visible.sync="modify"
        width="40%"
        center
        :before-close="handleClose"
        :close-on-click-modal="false">
            <el-form :model="modata" :rules="datarule" ref='modata' label-width="160px" label-position="left" class="demo-ruleForm">
                <el-form-item :label="$t('backup.server')">{{tar.host}}</el-form-item>
                <el-form-item :label="$t('backup.name')" prop="dbuser">
                    <el-input v-model="modata.dbuser" :placeholder="tar.sys_user"></el-input>
                </el-form-item>
                <el-form-item :label="$t('backup.pass')" prop="dbpwd">
                    <el-input v-model="modata.dbpwd" :placeholder="$t('backup.input6')" type="password"></el-input>
                </el-form-item>
                <el-form-item label="SID" prop="sid">
                    <el-input v-model="modata.sid" :placeholder="tar.sid"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modifysubmit('modata')">{{$t('message.submit')}}</el-button>
                    <el-button @click="backreset('modata')">{{$t('message.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'Backupmodify',
    props:['status','tar'],
    data(){
        return{
            modify:false,
            modata:{
                dbuser:'',
                dbpwd:'',
                sid: ''
            },
            datarule:{
                dbuser:[
                    { required: true, message: this.$t("backup.input15"), trigger: "blur" }
                ],
                dbpwd: [
                    { required: true, message: this.$t("user.input2"), trigger: "blur" }
                ],
                sid: [{ required: true, message: this.$t("backup.input4"), trigger: "blur" }],
            }
        }
    },
    watch:{
        status(val){
            this.modify=val
        },
        tar(val){
            this.modata.dbuser = val.sys_user,
            this.modata.sid = val.sid
        }
    },
    mounted(){
        this.modata.dbuser = this.tar.sys_user,
        this.modata.sid = this.tar.sid
    },
    methods:{
        handleClose(done) {
            done();
            this.$refs["modata"].resetFields();
            this.$emit('changes' ,false)
        },
        modifysubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.put(this.$host+'db',{host:this.tar.id,orcl_user:this.tar.sys_user,new_user:this.modata.dbuser,orcl_pwd:this.modata.dbpwd,sid:this.modata.sid}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                message: this.$t("message.success"),
                                type: "success",
                            })
                        }
                        else{
                            this.$message.error(res.data.msg);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                    this.modify=false
                    this.$emit('changes' ,false)
                    this.backreset('modata')
                }
            })
        },
        backreset(formname) {
            this.$refs[formname].resetFields();
        },
    }
}
</script>