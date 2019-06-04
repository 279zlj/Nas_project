<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.gateway')}}</span>
            </div>
            <el-row class="other_table">
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                <el-table :data='gwdata'  border cell-style="padding:.7em" style='width:100%;min-height:310px;max-height:100%'>
                        <el-table-column :label="$t('gateway.interface')" prop='gw_face'></el-table-column>
                        <el-table-column :label="$t('gateway.ip')" prop='gw'></el-table-column>
                        <el-table-column :label="$t('message.oper')" width:='150'>
                            <template slot-scope='scope'>
                                <el-tooltip :content="$t('message.modify')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifygw(scope.row)'></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
              </el-col>
            </el-row>
            <el-dialog :title="$t('gateway.modify')" :visible.sync="gwdialog" width="30%" center :before-close="handleClose" :close-on-click-modal="false">
                <el-form :model="modifydata" ref='modifydata' :rules='gwrule' label-width="30" class="demo-ruleForm">
                  <el-form-item :label="$t('gateway.interface')">
                    {{rowdata.gw_face}}
                  </el-form-item>
                  <el-form-item :label="$t('gateway.ip')" prop='gwip'>
                    <el-input v-model="modifydata.gwip" :placeholder='rowdata.gw' style='width:80%'></el-input>
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
import headerBar from '../../common/headerBar'
export default {
    name:'gateway',
    components:{headerBar},
    data(){
        var gwipcheck=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入网关地址'))
            }
            else{
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callback(new Error('请输入正确的网关地址'))
                }
                else
                    callback()
            }
        }
        return{
            gwdata:[],
            rowdata:[],
            gwdialog:false,
            modifydata:{
                gwip:''
            },
            gwrule:{
                gwip:[
                    {validator: gwipcheck, trigger: 'blur'}
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
                _this.gwdata.push(res.data.data)
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
            this.$axios.post(this.$host+'gw',{gw:_this.rowdata.gw,iface:_this.rowdata.gw_face}).then(res=>{
                _this.gwdialog=false
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
                _this.getgateway()
                _this.gwreset('modifydata')
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