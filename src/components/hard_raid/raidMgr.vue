<template>
    <div class="content">
        <div>
        <div class="tip_bg">
            <span class="tip">{{$t('message.diskMgr')}}</span>
        </div>
            <el-row class="main_table">
              <div style="width:96%;margin:0 auto">
                  <el-row>
                        <el-col :span='6'>
                            <span style="line-height:2.5em;font-weight:700">{{$t('raidMgr.alarm')}}：<el-tag effect='dark' :type="this.alert=='ON'?'success':'danger'" v-show='this.alert'>{{alert}}</el-tag></span>
                        </el-col>
                        <el-col :span="10" style="margin-bottom:.55em;float:right;text-align:end">
                        <el-tooltip content="JBOD设置" placement="bottom"><el-button type="primary" icon="el-icon-quanjushezhi iconfont" size="small" @click="gset = true"></el-button></el-tooltip>
                        <el-tooltip :content="$t('raidMgr.start')" placement="bottom"><el-button type="warning" icon="el-icon-zuoyebaojing iconfont" size="small" @click="startwarn" v-show="this.alert !== 'ON'"></el-button></el-tooltip>
                        <el-tooltip :content="$t('raidMgr.stop')" placement="bottom"><el-button type="danger" icon="el-icon-tianranqibaojingqi- iconfont" size="small" @click="stopwarn" v-show="this.alert === 'ON'"></el-button></el-tooltip>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-tianjia iconfont" size='small' @click='addraid = true'></el-button></el-tooltip>
                        </el-col>
                  </el-row>
                  <el-table :data="raiddata.slice((currpage - 1)* pagesize, currpage *pagesize)" border class="table_cell" :header-cell-style="getRowClass" style="width:100%;min-height:32rem"  >
                    <el-table-column label="ID" prop="DG/VD" ></el-table-column>
                    <el-table-column label="阵列名字" prop="Name"></el-table-column>
                    <el-table-column :label="$t('raid.level')" prop="TYPE"></el-table-column>
                    <el-table-column :label="$t('disk.capacity')" prop="Size"></el-table-column>
                    <el-table-column label="阵列缓存" prop="Cache"></el-table-column>
                    <el-table-column label="权限" prop="Access"></el-table-column>
                    <el-table-column :label="$t('message.state')" prop="State"></el-table-column>
                    <el-table-column label="初始化状态">
                        <template slot-scope="scope">
                            <el-tooltip placement="top" content="预计剩余时间：">
                                <el-progress percentage="23"/>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.oper')" width="150">
                        <template slot-scope='scope'>
                            <el-dropdown>
                                <el-button type="primary" size="mini">
                                    {{$t('message.opr')}}<i class="el-icon-arrow-down el-icon--right" ></i>
                                </el-button>
                              <el-dropdown-menu slot="dropdown">
                                  <span  @click="setraid(scope.row)"><el-dropdown-item >{{$t('raidMgr.set')}}</el-dropdown-item></span>
                                  <span  @click="startinit(scope.row)"><el-dropdown-item >{{$t('raidMgr.startinit')}}</el-dropdown-item></span>
                                  <span  @click="stopinit(scope.row)"><el-dropdown-item >{{$t('raidMgr.stopinit')}}</el-dropdown-item></span>
                                  <span  @click="rebuild(scope.row)"><el-dropdown-item >{{$t('raidMgr.srebuild')}}</el-dropdown-item></span>
                                  <span  @click="stoprebuild(scope.row)"><el-dropdown-item >{{$t('raidMgr.stopreb')}}</el-dropdown-item></span>
                                  <span  @click="deleteraid(scope.row)"><el-dropdown-item >{{$t('raidMgr.delraid')}}</el-dropdown-item></span>
                              </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20]"
                    :page-size="pagesize"
                    :total="raiddata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
                    <globalset :gset='gset' @changeset='setting'></globalset>
                    <createnew :addraid='addraid' @changenew='changeadd' :all_disks='all_disks'></createnew>
                    <modifyraid :mraid='mraid' :nowdata='nowdata' :own_disks='own_disks' @changemodify='changemo'></modifyraid>
                    <el-dialog :title="$t('raidMgr.rebuild')" :visible.sync="rebuildraid" width="40%" center :before-close="handleClose" :close-on-click-modal="false">
                        <el-form :model="rebdata" ref="rebdata" :rules="rebrule" label-width="150px" label-position="left">
                          <el-form-item label="ID">
                              {{nowdata.id}}
                          </el-form-item>
                          <el-form-item :label="$t('raidMgr.bad')">
                              
                          </el-form-item>
                          <el-form-item :label="$t('raidMgr.replace')">

                          </el-form-item>
                        </el-form>
                    </el-dialog>
              </div>
            </el-row>
        </div>
    </div>
</template>
<script>
import {change} from '../../assets/change_size'
import globalset from './function/global'
import createnew from './function/newraid'
import modifyraid from './function/modify'
export default {
    name:'raidMgr',
    components:{globalset,createnew,modifyraid},
    data(){
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            raiddata:[],
            pagesize: 10,
            currpage: 1,
            gset:false,
            addraid:false,
            nowdata:[],
            mraid:false,
            rebuildraid:false,
            alert:'',
            own_disks:[],
            all_disks:[],
            globaldata:[],
            rebdata:{},
            rebrule:{},
            dev:''
        }
    },
    mounted(){
        this.getriad()
    },
    methods:{
        getriad(){
            this.all_disks = []
            this.$axios.get(this.$host+'cli').then(res=>{
                this.raiddata = res.data.data.virtual
                this.diskdata = res.data.data.physical
                for(let a=0;a<this.diskdata.length;a++){
                    var _all={}
                    if (this.diskdata[a].State.indexOf('UGood') !== -1){
                        for(let key in this.diskdata[a]){
                            if(key == 'EID:Slt'){
                                _all.key=this.diskdata[a][key]
                                _all.label=this.diskdata[a][key]
                                this.all_disks.push(_all)
                            }
                        }
                        
                    }
                }

            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'alarm').then(res=>{
                this.alert=res.data.data
            }).catch(error=>{
                console.log(error)
            })
            
        },
        handleCurrentChange(cpage){
            this.currpage = cpage;
        },
        handleSizeChange(psize){
            this.pagesize = psize
        },
        handleClose(done){
            done();
            this.$refs['rebdata'].resetFields();
        },
        setting(val){
            // this.getriad()
            this.gset=val
            this.getriad()
        },
        changeadd(val){
            // this.getriad()
            this.addraid=val
            this.getriad()
        },
        changemo(val){
            // this.getriad()
            this.mraid=val
            this.getriad()
        },
        startwarn(){
            this.$confirm(this.$t('raidMgr.start'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'alarm',{active:'on'}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
                    }
                    this.getriad()
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })
        },
        stopwarn(){
            this.$confirm(this.$t('raidMgr.stop'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'alarm',{active:'off'}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
                    }
                    this.getriad()
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })
        },
        setraid(row){
            this.nowdata=row
            this.mraid=true
        },
        startinit(row){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'DG/VD')
                    this.dev = this.nowdata[key]
            }
            this.$confirm(this.$t('raidMgr.startinit'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'diskinit',{dv:this.dev}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
                    }
                    this.getriad()
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })
        },
        stopinit(row){
            this.nowdata = row
            this.$confirm(this.$t('raidMgr.stopinit'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'',{drive:this.nowdata.id}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
                    }
                    this.getriad()
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })
        },
        rebuild(row){
            this.nowdata = row
            
        },
        stoprebuild(row){
            this.nowdata = row
            this.$confirm(this.$t('raidMgr.stopreb'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'').then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
                    }
                    this.getriad()
                })

            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })
        },
        deleteraid(row){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'DG/VD')
                    this.dev = this.nowdata[key]
            }
            this.$confirm(this.$t('raidMgr.delraid'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.delete(this.$host+'cli',{data:{vd:this.dev}}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
                    }
                    this.getriad()
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })
        },
        
    }
}
</script>
