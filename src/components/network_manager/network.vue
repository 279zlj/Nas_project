<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>网络设置</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" title="操作失败" show-icon id='error_tip' :closable='false' center style='display:none'></el-alert>
                <el-alert type="success" title="操作成功" show-icon id='success_tip' :closable='false' center style='display:none'></el-alert>
                <el-table :data='netdata.slice((currpage - 1) * pagesize, currpage * pagesize)' height='400' border style='width:100%'>
                    <el-table-column label="网口" prop='interface'></el-table-column>
                    <el-table-column label="IP地址" prop='ip'></el-table-column>
                    <el-table-column label="子网掩码" prop='mask'></el-table-column>
                    <el-table-column label="MAC地址" prop='mac'></el-table-column>
                    <el-table-column label="DNS" prop='dns'></el-table-column>
                    <el-table-column label="状态" prop='state'></el-table-column>
                    <el-table-column label="操作" width:='150'>
                        <template slot-scope='scope'>
                            <el-tooltip content="修改" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifynet(scope.row)'></el-button></el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                </el-col>
            </el-row>
            <el-dialog title="修改网络" :before-close="handleClose" :visible.sync="modifyn" width="30%" :close-on-click-modal="false" center>
                <el-form :model="modifydata" :rules="netrule" ref='modifydata' label-width="30" class="demo-ruleForm">
                  <el-form-item label="网口">
                    <span>{{rowdata.interface}}</span>
                  </el-form-item>
                  <el-form-item label="IP地址" prop='IP'>
                    <el-input v-model="modifydata.IP" :placeholder="rowdata.ip" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item label="子网掩码" prop='mask'>
                    <el-input v-model="modifydata.mask" :placeholder="rowdata.mask" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item label="DNS" prop="DNS">
                    <el-input v-model="modifydata.DNS" :placeholder="rowdata.dns" style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="netsubmit('modifydata')">提交</el-button>
                    <el-button @click="netreset('modifydata')">重置</el-button>
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
            if(!val){
                return callbcak(new Error('请输入NDS地址'))
            }
            else{
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callbcak(new Error('请输入正确的DNS地址'))
                }
                else 
                    callbcak()
            }
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
                _this.netdata=res.data.interfaces.interfaces
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
                    _this.$axios.post(this.$host+'',{interface:_this.rowdata.interface,ip:_this.rowdata.ip,mask:_this.rowdata.mask,dns:_this.rowdata.dns}).then(res=>{

                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
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