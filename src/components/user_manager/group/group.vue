<template>
    <div class="content">
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>组管理</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" title="操作失败" show-icon id='error_tip' :closable='false' center style='display:none'></el-alert>
                <el-alert type="success" title="操作成功" show-icon id='success_tip' :closable='false' center style='display:none'></el-alert>
                <el-col :xs='1' :sm='1' :md='1' :lg='1' :xl='1' :offset='23' style='margin-bottom:.5em'>
                    <el-tooltip content="添加" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" @click='creategroup = true'></el-button></el-tooltip>
                </el-col>
                <el-table :data='groupdata.slice((currpage - 1) * pagesize, currpage * pagesize)' height='400' border style='width:100%'>
                    <el-table-column label="组名" prop='name'></el-table-column>
                    <el-table-column label="组ID" prop='type'></el-table-column>
                    <el-table-column label="操作" width:='150'>
                        <template slot-scope='scope'>
                            <el-tooltip content="删除" placement="bottom"><el-button type='danger' icon="el-icon-delete" size='mini' @click='deletegroup(scope.row)'></el-button></el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                </el-col>
            </el-row>
            <el-dialog title="新建组" width="20%" :close-on-click-modal="false" :visible.sync="creategroup" :before-close="handleClose">
                <el-form :model='groupform' :rules='grouprule' ref='groupform' label-width="30" class="demo-ruleForm">
                    <el-form-item label="组名" prop='groupname'>
                        <el-input v-model="groupform.groupname" placeholder="请输入组名" style='width:80%'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="groupsubmit('groupform')">提交</el-button>
                        <el-button @click="groupreset('groupform')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title="删除组" :visible.sync="deletelog" width="30%" center :close-on-click-modal="false">
                <p>删除组：{{grouptarget}}?</p>
                <el-button type="primary" @click='deleteg()'>确认</el-button>
                <el-button @click='deletedialog=false'>取消</el-button>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import headerBar from '../../common/headerBar'
export default {
    name:'group',
    components:{headerBar},
    data(){
        var namecheck=(rule,val,callback)=>{
            if(!val){
                callback(new Error('请输入组名'))
            }
            else{
                if(val.length<3){
                    callback(new Error('请输入长度大于3的组名'))
                }
                else
                    callback()
            }
        }
        return{
            groupdata:[],
            creategroup:false,
            pagesize: 5,
            currpage: 1,
            groupform:{
                groupname:''
            },
            grouprule:{
                groupname:[
                    {validator:namecheck,trigger: 'blur'}
                ]
            },
            grouptarget:'',
            deletelog:false
        }
    },
    methods: {
        groupsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'',{name:_this.groupform.groupname}).then(res=>{

                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        handleClose(done){
            done();
            this.$refs['groupform'].resetFields();
        },
        groupreset(formname){
            this.$refs[formname].resetFields();
        },
        deletegroup(){
            this.deletelog=true;
            this.grouptarget=row.name
        },
        deleteg(){
            this.$axios.post(this.$host+'',{name:target}).then(res=>{

            }).catch(error=>{
                console.log(error)
            })
        }
    },    
}
</script>
<style>

</style>