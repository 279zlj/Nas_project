<template>
    <div class='content'>
        <headerBar></headerBar>
        <div class='tip_bg'>
            <span class='tip'>{{$t('message.pool')}}</span>
        </div>
        <el-row class='main_table'>
          <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
            <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
            <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
            <el-row style='margin-bottom:.5em;float:right'>
                <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createpool = true'></el-button></el-tooltip>
            </el-row>
            <el-table :data='pooldata.slice((currpage - 1)*pagesize,currpage*pagesize)' border  class="table_cell"  style='width:100%;min-height:310px;max-height:100%'>
                <el-table-column :label="$t('pool.name')" prop='vg_name'></el-table-column>
                <el-table-column :label="$t('pool.capacity')" prop='vg_size'></el-table-column>
                <el-table-column :label="$t('message.state')" prop="vg_status">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.vg_status === 'active' ? 'success' : 'warning'" disable-transitions>{{scope.row.vg_status}}</el-tag>
                        <el-popover
                            placement="top-start"
                            :title="$t('message.note')"
                            width="200"
                            trigger="hover"
                            content="unkonw:无法识别,resizable:可扩容,active:已激活,inactive:无效">
                            <el-button slot="reference" type="info" size='mini' circle><i class="el-icon-info"></i></el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.oper')">
                    <template slot-scope="scope">
                        <el-tooltip :content="$t('message.expend')" placement="bottom"><el-button type='warning' icon="el-icon-kuozhan iconfont" size='mini' @click='modifypool(scope.row)'></el-button></el-tooltip>
                        <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon="el-icon-delete" size="mini" @click="deletepool(scope.row)"></el-button></el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10]"
            :page-size="pagesize"
            :total="pooldata.length" style="text-align: right;margin: 1em">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog :title="$t('pool.new')" :visible.sync="createpool" width="45%" :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="poolform" :rules="poolrule" ref="poolform" label-width="100px" label-position="left" class="demo-ruleForm">
                <el-form-item :label="$t('pool.name')" prop='name'>
                    <el-input v-model="poolform.name" :placeholder="$t('pool.input')" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('pool.disk')" prop="disks">
                    <el-transfer v-model="poolform.disks" :data="disks" :titles="[$t('pool.select'),$t('pool.alaway')]" ></el-transfer>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="poolsubmit('poolform')" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.submit')}}</el-button>
                    <el-button @click="poolreset('poolform')">{{$t('message.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('pool.expend')" :visible.sync="poolmodify" width="50%" :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="poolform" :rules="poolrule" ref="poolform" label-width="30" class="demo-ruleForm">
                <el-form-item :label="$t('pool.sele')" prop='adddisks'>
                    <el-transfer v-model="poolform.adddisks" :data="disks" :titles="[$t('pool.select'),$t('pool.alaway')]" ></el-transfer>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modifysubmit('poolform')" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.submit')}}</el-button>
                    <el-button @click="poolreset('poolform')">{{$t('message.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('pool.delete')" :visible.sync="pooldelete" width="30%" center :close-on-click-modal="false">
            <p>{{$t('pool.delete')}}：{{pooltarget}}?</p>
            <el-button type="primary" @click='deletep()'>{{$t('message.sure')}}</el-button>
            <el-button @click='pooldelete=false'>{{$t('message.cancel')}}</el-button>
        </el-dialog>
    </div>    
</template>
<script>
import headerBar from '../../common/headerBar'
export default {
    name:'pool',
    components:{headerBar},
    data(){
        var checkname=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入名称'))
            }
            else{
                if(val.length<3){
                    return callback(new Error('请输入长度至少为3的名称'))
                }
                callback()
            }
        }
        var checkdisks=(rule,val,callback)=>{
            if(val.length==0){
                return callback(new Error('请选择磁盘'))
            }
            else
                callback()
        }
        var checkadddisks=(rule,val,callback)=>{
            if(val.length==0){
                return callback(new Error('请选择磁盘'))
            }
            else
                callback()
        }
        return{
            createpool:false,
            poolmodify:false,
            pooldelete:false,
            pooldata:[],
            currpage:1,
            pagesize:5,
            pooltarget:'',
            fullscreenLoading:false,
            poolform:{
                name:'',
                disks:[],
                adddisks:[]
            },
            poolrule:{
                name:[
                    {validator:checkname, trigger: 'blur'},
                ],
                disks:[
                    {validator:checkdisks, trigger: 'blur'}
                ],
                adddisks:[
                    {validator:checkadddisks, trigger: 'blur'}
                ]
            },
            disks:[],
        }
    },
    mounted(){
        this.getpool()
    },
    methods:{
        getpool(){
            var _this=this
            this.$axios.get(this.$host+'pool').then(res=>{
                _this.pooldata=res.data.data
                for (let i in _this.pooldata){
                    if(_this.pooldata[i].vg_status==0){
                        _this.pooldata[i].vg_status='unknow'
                    }
                    else if(_this.pooldata[i].vg_status==1){
                        _this.pooldata[i].vg_status='resizable'
                    }
                    else if(_this.pooldata[i].vg_status==2){
                        _this.pooldata[i].vg_status='active'
                    }
                    else if(_this.pooldata[i].vg_status==3){
                        _this.pooldata[i].vg_status='inactive'
                    }
                    _this.pooldata[i].vg_size=_this.pooldata[i].vg_size.replace('<','')
                }
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'disks').then(res=>{
                var dd=[]
                for(let i=0;i<res.data.data.length;i++){
                    var disks={}
                    disks.key=res.data.data[i].path
                    disks.label=res.data.data[i].path
                    if(res.data.data[i].used=='no'){
                        disks.disabled=false
                    }
                    else{
                        disks.disabled=true
                    }
                    dd.push(disks)
                }
                _this.disks = dd
            }).catch(error=>{
                console.log(error)
            })
        },
        modifypool(row){
            this.poolmodify=true;
            this.pooltarget=row.vg_name
        },
        deletepool(row){
            this.pooldelete=true;
            this.pooltarget=row.vg_name
        },
        handleClose(done){
            done();
            this.$refs['poolform'].resetFields();
        },
        poolsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                    });
                    _this.$axios.post(this.$host+'pool',{name:_this.poolform.name,disks:_this.poolform.disks}).then(function(res){
                        _this.createpool=false
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
                        _this.getpool()
                        _this.poolreset('poolform')
                    }).catch(function(error){
                        console.log(error)
                    })
                }
            })
        },
        modifysubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                    });
                     _this.$axios.put(this.$host+'pool',{name:_this.pooltarget,disks:_this.poolform.adddisks}).then(function(res){
                        _this.poolmodify=false
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
                        _this.getpool()
                        _this.poolreset('poolform')
                    }).catch(function(error){
                        console.log(error)
                    })
                }
            })
        },
        deletep(){
            var _this=this
            this.$axios.delete(this.$host+'pool',{data:{name:_this.pooltarget}}).then(res=>{
                _this.pooldelete=false
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
                _this.getpool()
                _this.poolreset('poolform')
            }).catch(error=>{
                console.log(error)
            })
        },
        poolreset(formname){
            this.$refs[formname].resetFields();
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
    }
}
</script>
<style>

</style>


