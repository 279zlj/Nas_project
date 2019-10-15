<template>
    <div class='content'>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.bond')}}</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-button type='primary' @click='bond = true' size='small'>{{$t('bond.bond')}}</el-button>
                        <el-button type='warning' @click='unbond = true' :disabled="unbondcan" size='small'>{{$t('bond.unbond')}}</el-button>
                    </el-row>
                    <el-table ref='multipleTable' :data='bonddata' :header-cell-style="getRowClass" tooltip-effect="dark" border class="table_cell" style="width:100%;min-height:310px;max-height:100%" @selection-change="selectrow">
                        <el-table-column type='selection' width="55"></el-table-column>
                        <el-table-column :label="$t('network.interface')" prop='interface' :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="$t('network.ip')" prop='addr' :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="$t('network.mask')" prop='netmask'></el-table-column>
                        <el-table-column :label="$t('gateway.port')" prop='bond_iface'  :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span v-for='(i,index) in scope.row.bond_iface' :key='index'>
                                    <span style="margin-right:.5em">{{i}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('gateway.mode')" prop='mode' :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="$t('network.Speed')" prop="speed"  :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="$t('network.mac')" prop='link' width="130px">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.link === 'yes' ? 'success' : 'danger' " disable-transitions>{{scope.row.link}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.state')" prop='state'>
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.state === 'UP' ? 'success' : 'warning'" disable-transitions>{{scope.row.state}}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-dialog :title="$t('bond.netbond')" :visible.sync="bond" width="50%" center :before-close="handleClose" :close-on-click-modal="false">
                <el-form :model="bondform" ref='bondform' :rules="bondrule" label-width="140px" label-position="left" class="demo-Form">
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
                  <el-form-item label="IP" prop="ip">
                      <el-input v-model="bondform.ip" :placeholder="$t('bond.ip')" style='width:80%' clearable></el-input>
                  </el-form-item>   
                  <el-form-item :label="$t('network.mask')" prop="mask">
                      <el-input v-model="bondform.mask" :placeholder="$t('network.mask')" style='width:80%' clearable ></el-input>
                  </el-form-item> 
                  <el-form-item>
                        <el-button type="primary" @click="bondsubmit('bondform')" >{{$t('message.submit')}}</el-button>
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
export default {
    name:'bond',
    data(){
        var checkbond=(rule,val,callback)=>{
            if(val.length==0){
                return callback(new Error(this.$t('bond.input1')))
            }
            else if(val.length==1){
                return callback(new Error(this.$t('bond.input1')))
            }
            else
                callback()
        }
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
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
                type:'',
                ip:'',
                mask:''
            },
            bondrule:{
                bdata:[
                    {required:true,validator:checkbond,trigger:'blur'}
                ],
                type:[
                    {required:true,message:this.$t('bond.select3'),trigger:'blur'}
                ],
                ip:[
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('network.input'),trigger:'blur'}
                ],
                mask:[
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('network.input2'),trigger:'blur'}
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
                        if(res.data.network[i].state==undefined)
                            res.data.network[i].state='—'
                        _this.bonddata.push(res.data.network[i])
                    }
                    switch(res.data.network[i].mode){
                        case('balance-rr'):
                            res.data.network[i].mode='平衡负载模式'
                        case('active-backup'):
                            res.data.network[i].mode='自动备援模式'
                        case('balance-alb'):
                            res.data.network[i].mode='平衡负载模式(6)'
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
                    _this.$axios.post(this.$host+'bond',{iface:_this.bondform.bdata,type:_this.bondform.type,ip:_this.bondform.ip,mask:_this.bondform.mask}).then(res=>{
                        _this.bond=false
                        if(res.data.success){
                            loading.close();
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            loading.close();
                            _this.$message.error(res.data.msg)
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
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            });
            this.$axios.delete(this.$host+'bond',{data:{name:_this.name,ip:_this.ip}}).then(res=>{
                _this.unbond=false
                if(res.data.success){
                    loading.close();
                    _this.$message({
                        message:this.$t('message.success'),
                        type:'success',
                        offset:''
                    })
                }
                else if(!res.data.success){
                    loading.close();
                    _this.$message.error(res.data.msg)
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