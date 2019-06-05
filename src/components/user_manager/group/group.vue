<template>
    <div class="content">
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.group')}}</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                <el-row style='margin-bottom:.5em;float:right'>
                    <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='creategroup = true'></el-button></el-tooltip>
                </el-row>
                <el-table :data='groupdata.slice((currpage - 1) * pagesize, currpage * pagesize)' border  class="table_cell" style='width:100%;min-height:310px;max-height:100%'>
                    <el-table-column :label="$t('group.name')" prop='name'></el-table-column>
                    <el-table-column :label="$t('group.id')" prop='id'></el-table-column>
                    <el-table-column :label="$t('message.oper')" width:='150'>
                        <template slot-scope='scope'>
                            <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type='danger' icon="el-icon-delete" size='mini' @click='deletegroup(scope.row)'></el-button></el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[5, 10]"
                :page-size="pagesize"
                :total="groupdata.length" style="text-align: right;margin: 1em">
                </el-pagination>
                </el-col>
            </el-row>
            <el-dialog :title="$t('group.new')" width="20%" :close-on-click-modal="false" :visible.sync="creategroup" :before-close="handleClose">
                <el-form :model='groupform' :rules='grouprule' ref='groupform' label-width="30" class="demo-ruleForm">
                    <el-form-item :label="$t('group.name')" prop='groupname'>
                        <el-input v-model="groupform.groupname" :placeholder="$t('group.input')" style='width:80%'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="groupsubmit('groupform')">{{$t('message.submit')}}</el-button>
                        <el-button @click="groupreset('groupform')">{{$t('message.reset')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('group.delete')" :visible.sync="deletelog" width="30%" center :close-on-click-modal="false">
                <p>{{$t('group.delete')}}：{{grouptarget}}?</p>
                <el-button type="primary" @click='deleteg()'>{{$t('message.sure')}}</el-button>
                <el-button @click='deletelog=false'>{{$t('message.cancel')}}</el-button>
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
    mounted(){
        this.getgroup()
    },
    methods: {
        getgroup(){
            var _this=this
            this.$axios.get(this.$host+'group').then(function(res){
                _this.groupdata = res.data.data                
            })
        },
        groupsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'group',{name:_this.groupform.groupname}).then(res=>{
                        _this.creategroup=false
                        if(res.data.success){
                            $('#success_tip').css({'display':'flex'})
                            setTimeout(function(){
                                $('#success_tip').css({'display':'none'})
                            },3000)
                        }
                        else if(!res.data.success){
                            $('#error_tip').css({'display':'flex'})
                            setTimeout(function(){
                                $('#error_tip').css({'display':'none'})
                            },3000)
                        }
                        _this.getgroup()
                        _this.groupreset('groupform')
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
        deletegroup(row){
            this.deletelog=true;
            this.grouptarget=row.name
        },
        deleteg(){
            var _this=this
            this.$axios.delete(this.$host+'group',{data:{name:_this.grouptarget}}).then(res=>{
                _this.deletelog=false
                if(res.data.success){
                    $('#success_tip').css({'display':'flex'})
                    setTimeout(function(){
                        $('#success_tip').css({'display':'none'})
                    },3000)
                }
                else if(!res.data.success){
                    $('#error_tip').css({'display':'flex'})
                    setTimeout(function(){
                        $('#error_tip').css({'display':'none'})
                    },3000)
                }
                _this.getgroup()
                _this.groupreset('groupform')
            }).catch(error=>{
                console.log(error)
            })
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
    },    
}
</script>
<style>

</style>