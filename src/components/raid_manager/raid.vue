<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class="tip">阵列管理</span>
            </div>
            <el-row class='main_table'>
                <el-alert type="error" title="操作失败" show-icon id='error_tip' :closable='false' center style='display:none'></el-alert>
                <el-alert type="success" title="操作成功" show-icon id='success_tip' :closable='false' center style='display:none'></el-alert>
                <el-col :xs='1' :sm='1' :md='1' :lg='1' :xl='1' :offset='21' style='margin-bottom:.5em'>
                    <el-tooltip content="添加" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" @click='createraid = true'></el-button></el-tooltip>
                </el-col>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-table :data='raiddata.slice((currpage - 1) * pagesize, currpage * pagesize)' height="400" style='width:100%'>
                        <el-table-column label="名称" porp='raidname'></el-table-column>
                        <el-table-column label="级别" prop='raidlevel'></el-table-column>
                        <el-table-column label="数据块" prop='raidblock'></el-table-column>
                        <el-table-column label="数据盘" prop='datadisk'></el-table-column>
                        <el-table-column label="热备盘" prop='readydisk'></el-table-column>
                        <el-table-column label="容量" prop='capacity'></el-table-column>
                        <el-table-column label="状态" prop='state'></el-table-column>
                        <el-table-column>
                            <template slot-scope='scope'>
                                <el-tooltip content="删除" placement="bottom"><el-button type="danger" icon="el-icon-delete" size='mini' @click='raiddelete(scope)'></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
              </el-col>
            </el-row>
            <el-dialog title="新建阵列" :visible.sync="createraid" width='35%' center :close-on-click-modal="false" top='5em' :before-close='handleClose'>
                <el-form :model="raidform" :rules="raidrule" ref='raidform' label-width="30" class='demo-ruleForm'>
                  <el-form-item label="名称" prop='name'>   
                        <el-input v-model="raidform.name" placeholder="请输入名称" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item label="级别" prop='raidtype'>
                    <el-select v-model="raidform.raidtype" placeholder="请选择级别">
                      <el-option label="0" value="0"></el-option>
                      <el-option label='1' value='1'></el-option>
                      <el-option label='5' value='5'></el-option>
                      <el-option label='6' value='6'></el-option>
                      <el-option label="10" value="10"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="数据块" prop='datablock'>
                    <el-select v-model="raidform.datablock" placeholder="请选择数据块">
                      <el-option label='64K' value="64K"></el-option>
                      <el-option label="128K" value='128K'></el-option>
                      <el-option label="256K" value='256K'></el-option>
                      <el-option label='512K' value='512K'></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="数据盘" prop='datadisk'>
                    <template>
                        <el-transfer v-model="raidform.datadisk" :data="disks" :titles="['可选磁盘','已选磁盘']" ></el-transfer>
                    </template>
                  </el-form-item>
                  <el-form-item label="热备盘" prop='readydisk'>
                    <el-transfer v-model="raidform.readydisk" :data="disks" :titles="['可选磁盘','已选磁盘']" ></el-transfer>
                  </el-form-item>
                  <el-form-item>
                    <el-button type='primary' @click="addraidsubmit('raidform')">提交</el-button>
                    <el-button @click="raidreset('raidform')">重置</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title='删除阵列' :visible.sync='deletelog' width="30%" center :close-on-click-modal="false">
                <p>删除阵列：{{raidtarger}}?</p>
                <el-button type="primary" @click='rdelete()'>确认</el-button>
                <el-button @click='deletelog=false'></el-button>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import headerBar from '../common/headerBar'
export default {
    name:'raid',
    components:{headerBar},
    data(){
        var nameval=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入用户名'))
            }
            else{
                if(val.length<3){
                    return callback(new Error('请输入长度至少为3的用户名'))
                }
                callback()
            }
        }
        var typeval=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择阵列类别'))
            }
            else
                callback()
        }
        var blockval=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择数据块大小'))
            }
            else
                callback()
        }
        var diskval=(rule,val,callback)=>{
            if(val.length==0){
                return callback(new Error('请选择数据盘'))
            }
            else
                callback()
        }
        var readyval=(rule,val,callback)=>{
            if(val.length==0){
                return callback(new Error('请选择热备盘'))
            }
            else
                callback()
        }
        return{
            raiddata:[],
            createraid:false,
            pagesize: 5,
            currpage: 1,
            raidform:{
                name:'',
                raidtype:'',
                datablock:'',
                datadisk:[],
                readydisk:[]
            },
            raidrule:{
                name:[
                    {validator: nameval, trigger: 'blur'},
                ],
                raidtype:[
                    {validator: typeval, trigger: 'blur'},
                ],
                datablock:[
                    {validator: blockval, trigger: 'blur'},
                ],
                datadisk:[
                    {validator: diskval, trigger: 'blur'},
                ],
                readydisk:[
                    {validator: readyval, trigger: 'blur'}
                ]
            },
            disks:[
                {key:1,label:'aaa',disabled:false},
                {key:2,label:'bbb',disabled:false},
                {key:3,label:'ccc',disabled:false},
                {key:4,label:'ddd',disabled:false},
                {key:5,label:'eee',disabled:true},
                {key:6,label:'fff',disabled:false},
                {key:7,label:'ggg',disabled:true}
            ],
        }
    },
    methods: {
        addraidsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    console.log(_this.raidform)
                }
            })
        },
        rdelete(){
            this.$axios.post(this.$host+'',{name:raidtarget}).then(res=>{

            }).catch(error=>{

            })
        },
        raidreset(fromname){
            this.$refs[formname].resetFields();
        },
        raiddelete(row){
            this.deletelog=true;
            this.raidtarget=row.name
        },
        handleClose(done){
            done();
            this.$refs['raidform'].resetFields();
        }
    },
}
</script>
<style>

</style>