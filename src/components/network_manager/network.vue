<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.net_setting')}}</span>
            </div>
            <el-row class='other_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                <el-table :data='netdata' border  class="table_cell"  style='width:100%;min-height:310px;max-height:100%'>
                    <el-table-column :label="$t('network.interface')" prop='interface'></el-table-column>
                    <el-table-column :label="$t('network.ip')" prop='addr'></el-table-column>
                    <el-table-column :label="$t('network.mask')" prop='netmask'></el-table-column>
                    <el-table-column :label="$t('network.mac')" prop='mac'></el-table-column>
                    <el-table-column :label="$t('network.dns')" prop='dns'></el-table-column>
                    <el-table-column :label="$t('message.state')" prop='state'>
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.state === 'UP' ? 'success' : 'warning'" disable-transitions>{{scope.row.state}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.oper')" width:='150'>
                        <template slot-scope='scope'>
                            <el-tooltip :content="$t('message.modify')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifynet(scope.row)'></el-button></el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                </el-col>
            </el-row>
            <el-dialog :title="$t('network.modify')" :before-close="handleClose" :visible.sync="modifyn" width="30%" :close-on-click-modal="false" center>
                <el-form :model="modifydata" :rules="netrule" ref='modifydata' label-width="30" class="demo-ruleForm">
                  <el-form-item :label="$t('network.interface')">
                    <span>{{rowdata.interface}}</span>
                  </el-form-item>
                  <el-form-item :label="$t('network.ip')" prop='IP'>
                    <el-input v-model="modifydata.IP" :placeholder="rowdata.addr" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('network.mask')" prop='mask'>
                    <el-input v-model="modifydata.mask" :placeholder="rowdata.netmask" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('network.dns')" prop="DNS">
                    <el-input v-model="modifydata.DNS" :placeholder="rowdata.dns" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="netsubmit('modifydata')">{{$t('message.submit')}}</el-button>
                    <el-button @click="netreset('modifydata')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
    
</template>
<script>
import headerBar from '../common/headerBar'
export default {
    name:'network',
    components:{headerBar},
    data(){
        var IPcheck=(rule,val,callbcak)=>{
            if(!val){
                return callbcak(new Error('请输入IP地址'))
            }
            else{
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callbcak(new Error('请输入正确的IP地址'))
                }
                else
                    callbcak()
            }
        }
        var maskcheck=(rule,val,callbcak)=>{
            if(!val){
                return callbcak(new Error('请输入mask地址'))
            }
            else{
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callbcak(new Error('请输入正确的mask地址'))
                }
                else
                    callbcak()
            }
        }
        var DNScheck=(rule,val,callbcak)=>{
            if(val){
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callbcak(new Error('请输入正确的DNS地址'))
                }
                else 
                    callbcak()
            }
            else 
                callbcak()
        }
        return{
            netdata:[],
            pagesize: 5,
            currpage: 1,
            modifyn:false,
            rowdata:[],
            modifydata:{
                IP:'',
                mask:'',
                DNS:''
            },
            netrule:{
                IP:[
                    {validator:IPcheck, trigger:'blur'},
                ],
                mask:[
                    {validator:maskcheck, trigger:'blur'},
                ],
                DNS:[
                    {validator:DNScheck, trigger:'blur'}
                ]
            }
        }
    },
    mounted() {
        this.netget()
    },
    methods: {
        netget(){
            var _this=this
            this.$axios.get(this.$host+'network').then(res=>{
                var data=res.data.network
                for(let i=0;i<data.length;i++){
                    if(data[i].addr==undefined||data[i].addr=='')
                        data[i].addr='—'
                    if(data[i].interface==undefined||data[i].interface=='')
                        data[i].interface='—'
                    if(data[i].netmask==undefined||data[i].netmask=='')
                        data[i].netmask='—'
                    if(data[i].mac==undefined)
                        data[i].mac='—'
                    if(data[i].dns==undefined)
                        data[i].dns='—'
                    if(data[i].state==undefined)
                        data[i].state='—'
                }
                _this.netdata=res.data.network
            }).catch(error=>{
                console.log(error)
            })
        },
        modifynet(row){
            this.modifyn=true
            this.rowdata=row
        },
        netsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'network',{iface:_this.rowdata.interface,addr:_this.modifydata.IP,netmask:_this.modifydata.mask,dns:_this.modifydata.DNS}).then(res=>{
                        _this.modifyn=false
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
                        _this.netget()
                        _this.netreset('modifydata')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        netreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['modifydata'].resetFields();
        },
    },
}
</script>
<style>

</style>