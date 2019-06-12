<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.bond')}}</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center style='display:none'></el-alert>
                    <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center style='display:none'></el-alert>
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-button type='primary' @click='bond = true' size='medium'>{{$t('bond.bond')}}</el-button>
                        <el-button type='warning' @click='unbond = true' :disabled="unbondcan" size='medium'>{{$t('bond.unbond')}}</el-button>
                    </el-row>
                    <el-table ref='multipleTable' :data='bonddata' tooltip-effect="dark" border class="table_cell" style="width:100%;min-height:310px;max-height:100%" @selection-change="selectrow">
                        <el-table-column type='selection' width="55"></el-table-column>
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
                    </el-table>
                </el-col>
            </el-row>
            <el-dialog :title="$t('bond.netbond')" :visible.sync="bond" width="50%" center :before-close="handleClose" :close-on-click-modal="false">
                <el-form :model="bondform" ref='bondform' :rules="bondrule" label-width="100px" label-position="left" class="demo-Form">
                  <el-form-item :label="$t('bond.select')" prop='bdata'>
                      <el-transfer v-model="bondform.bdata" :data="netdata" :titles="[$t('bond.select1'),$t('bond.select2')]"></el-transfer>
                  </el-form-item>
                  <el-form-item :label="$t('bond.model')" prop='type'>
                      <el-select v-model="bondform.type" :placeholder="$t('bond.select3')">
                        <el-option :label="$t('bond.model1')" value='0'></el-option>
                        <el-option :label="$t('bond.model2')" value='1'></el-option>
                        <el-option :label="$t('bond.model3')" value='6'></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item>
                        <el-button type="primary" @click="bondsubmit('bondform')" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.submit')}}</el-button>
                        <el-button @click="bondreset('bondform')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('bond.unbond')" :visible.sync="unbond" width="30%" center :close-on-click-modal="false">
                <p>{{$t('bond.delete')}} {{name}}？</p>
                <el-button type="primary" @click='bdelete()'>{{$t('message.sure')}}</el-button>
                <el-button @click='unbond=false'>{{$t('message.cancel')}}</el-button>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import headerBar from '../common/headerBar'
export default {
    name:'bond',
    components:{headerBar},
    data(){
        var checkbond=(rule,val,callback)=>{
            if(val.length==0){
                return callback(new Error('请选择网卡'))
            }
            else if(val.length==1){
                return callback(new Error('请选择两个以上网卡进行聚合'))
            }
            else
                callback()
        }
        var checktype=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择聚合模式'))
            }
            else
                callback()
        }
        return{
            bonddata:[],
            bondcan:true,
            unbondcan:true,
            multiplesletion:[],
            bond:false,
            unbond:false,
            name:'',
            ip:'',
            netdata:[],
            bondform:{
                bdata:[],
                type:''
            },
            bondrule:{
                bdata:[
                    {validator:checkbond,trigger:'blur'}
                ],
                type:[
                    {validator:checktype,trigger:'blur'}
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
                var nn = []
                for(let i=0;i<res.data.network.length;i++){
                    var n ={}
                    var a = res.data.network[i].interface
                    n.key=res.data.network[i].interface
                    n.label=res.data.network[i].interface                    
                    if(res.data.network[i].bond==0&&a.indexOf('bond')==-1){
                        n.disabled=false
                    }
                    else{
                        n.disabled=true
                    }
                    if(a.indexOf('bond')==0){
                        if(res.data.network[i].mac==undefined)
                            res.data.network[i].mac='—'
                        if(res.data.network[i].dns==undefined)
                            res.data.network[i].dns='—'
                        if(res.data.network[i].state==undefined)
                            res.data.network[i].state='—'
                        _this.bonddata.push(res.data.network[i])
                    }
                    nn.push(n)
                }
                 _this.netdata=nn
            }).catch(error=>{
                console.log(error)
            })
        },
        selectrow(val){
            this.multiplesletion = val
            console.log(this.multiplesletion.length)
            if(this.multiplesletion.length==1){
                this.unbondcan=false
                this.name=val[0].interface
                this.ip=val[0].addr
            }
            if(this.multiplesletion.length==0){
                this.unbondcan=true
            }
            // console.log(this.multiplesletion)
        },
        bondsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                    });
                    _this.$axios.post(this.$host+'bond',{iface:_this.bondform.bdata,type:_this.bondform.type}).then(res=>{
                        _this.bond=false
                        if(res.data.success){
                            loading.close();
                            $('#success_tip').css({'display':'flex'})
                            setTimeout(function(){
                                $('#success_tip').css({'display':'none'})
                            },3000)
                        }
                        else if(!res.data.success){
                            loading.close();
                            $('#error_tip').css({'display':'flex'})
                            setTimeout(function(){
                                $('#error_tip').css({'display':'none'})
                            },3000)
                        }
                        _this.bonddata=[]
                        _this.netget()
                        _this.bondreset('bondform')
                    }).catch(function(error){
                        console.log(error)
                    })
                }
            })
        },
        bdelete(){
            var _this=this
            this.$axios.delete(this.$host+'bond',{data:{name:_this.name,ip:_this.ip}}).then(res=>{
                _this.unbond=false
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
                _this.bonddata=[]
                _this.netget()
                _this.bondreset('bondform')
            }).catch(error=>{
                console.log(error)
            })
        },
        bondreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['bondform'].resetFields();
        },

    },  
}
</script>
<style>

</style>