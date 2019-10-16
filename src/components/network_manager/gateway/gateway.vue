<template>
    <div class='content'>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.gateway')}}</span>
            </div>
            <el-row class="main_table">
              <div style="width:96%;margin:0 auto">
                <el-row style='margin-bottom:.5em;float:right'>
                    <el-button type='primary' @click='create_gw = true' size='small' icon="el-icon-circle-plus" ></el-button>
                </el-row>
                <el-table :data='gwdata'  border  class="table_cell" :header-cell-style="getRowClass" style='width:100%;min-height:32rem'>
                        <el-table-column :label="$t('gateway.interface')" prop='gw'></el-table-column>
                        <el-table-column :label="$t('gateway.ip')" prop='gw_addr'></el-table-column>
                        <el-table-column :label="$t('message.oper')" width:='150'>
                            <template slot-scope='scope'>
                                <el-tooltip :content="$t('message.modify')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifygw(scope.row)'></el-button></el-tooltip>
                                <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon="el-icon-delete" size="mini" @click="gwpool(scope.row)"></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
              </div>
            </el-row>
            <el-dialog :title="$t('gateway.create')" :visible.sync="create_gw" width="40%" center :close-on-click-modal="false" :before-close="handleClose">
                <el-form :model="modifydata" ref='modifydata' :rules="gwrule" label-width="145px" class="demo-rule"  label-position="left">
                  <el-form-item :label="$t('gateway.ip')" prop='new_gw'>
                      <el-input v-model="modifydata.new_gw" :placeholder="$t('gateway.input')" style="width:80%" clearable ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('gateway.interface')" prop="iface">
                      <el-select v-model="modifydata.iface" :placeholder="$t('gateway.interface')">
                        <el-option v-for="i in ifacedata" :key="i.interface" :value="i.interface">{{i.interface}}</el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="newsubmit('modifydata')">{{$t('message.submit')}}</el-button>
                      <el-button @click="gwreset('modifydata')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('gateway.modify')" :visible.sync="gwdialog" width="35%" center :before-close="handleClose" :close-on-click-modal="false">
                <el-form :model="modifydata" ref='modifydata' :rules='gwrule' label-width="160px" label-position="left" class="demo-ruleForm">
                  <el-form-item :label="$t('gateway.iface')">
                    {{rowdata.gw}}
                  </el-form-item>
                  <el-form-item :label="$t('gateway.interface')" prop="iface">
                      <el-select v-model="modifydata.iface" :placeholder="$t('gateway.interface')">
                        <el-option v-for="i in ifacedata" :key="i.interface" :value="i.interface">{{i.interface}}</el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('gateway.ip')" prop='gwip'>
                    <el-input v-model="modifydata.gwip" :placeholder='rowdata.gw_addr' style='width:80%' clearable ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="gwsubmit('modifydata')">{{$t('message.submit')}}</el-button>
                    <el-button @click="gwreset('modifydata')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    name:'gateway',
    data(){
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            gwdata:[],
            rowdata:[],
            gwdialog:false,
            create_gw:false,
            ifacedata:[],
            modifydata:{
                gwip:'',
                new_gw:'',
                iface:''
            },
            gwrule:{
                gwip:[
                    {required:true,message:this.$t('gateway.input'), trigger: 'blur'},
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('gateway.input1'),trigger:'blur'}
                ],
                new_gw:[
                    {required:true,message:this.$t('gateway.input'), trigger: 'blur'},
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('gateway.input1'),trigger:'blur'}
                ],
                iface:[
                    {required:true,message:this.$t('gateway.select'), trigger: 'blur'}
                ]
            }
        }
    },
    mounted(){
        this.getgateway()
    },
    methods: {
        getgateway(){
            var _this=this
            this.$axios.get(this.$host+'gw').then(res=>{
                _this.gwdata=res.data.data
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'network').then(res=>{
                _this.ifacedata=res.data.network
            }).catch(error=>{
                console.log(error)
            })
        },
        modifygw(row){
            this.gwdialog=true;
            this.rowdata=row
        },
        gwsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'gw',{gw:_this.modifydata.gwip,iface:_this.rowdata.gw,new_iface:_this.modifydata.iface}).then(res=>{
                        _this.gwdialog=false
                        if(res.data.success){
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            _this.$message.error(res.data.msg)
                        }
                        _this.getgateway()
                        _this.gwreset('modifydata')
                    })
                }
            })
        },
        newsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'gw',{gw:_this.modifydata.new_gw,iface:_this.modifydata.iface}).then(res=>{
                        _this.gwdialog=false
                        if(res.data.success){
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            _this.$message.error(res.data.msg)
                        }
                        _this.getgateway()
                        _this.gwreset('modifydata')
                    })
                }
            })
        },
        gwpool(row){
            this.$confirm('删除：'+'row.interface'+'？',$t('message.tips'),{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning'
            }).then(()=>{
                this.$axios.delete(this.$host+'gw',{data:{name:row.interface}}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: '已完成'
                        });
                    }
                    this.getdisk()
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })
        },
        gwreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['modifydata'].resetFields()
        }
    },    
}
</script>
<style>

</style>