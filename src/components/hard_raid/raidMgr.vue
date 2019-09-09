<template>
    <div class="content">
        <div>
        <div class="tip_bg">
            <span class="tip">{{$t('message.diskMgr')}}</span>
        </div>
            <el-row class="main_table">
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset="2">
                  <el-row>
                        <el-col :span='6'>
                            <span style="line-height:2.5em;font-weight:700">{{$t('raidMgr.alarm')}}：<el-tag effect='dark' :type="this.alert=='Enabled'?'success':'danger'" v-show='this.alert'>{{alert}}</el-tag></span>
                        </el-col>
                        <el-col :span="10" style="margin-bottom:.55em;float:right;text-align:end">
                        <el-tooltip :content="$t('raidMgr.global')" placement="bottom"><el-button type="primary" icon="el-icon-quanjushezhi iconfont" size="small" @click="gset = true"></el-button></el-tooltip>
                        <el-tooltip :content="$t('raidMgr.start')" placement="bottom"><el-button type="warning" icon="el-icon-zuoyebaojing iconfont" size="small" @click="startwarn"></el-button></el-tooltip>
                        <el-tooltip :content="$t('raidMgr.stop')" placement="bottom"><el-button type="danger" icon="el-icon-tianranqibaojingqi- iconfont" size="small" @click="stopwarn"></el-button></el-tooltip>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-tianjia iconfont" size='small' @click='addraid = true'></el-button></el-tooltip>
                        </el-col>
                  </el-row>
                  <el-table :data="raiddata.slice((currpage - 1)* pagesize, currpage *pagesize)" border class="table_cell" style="width:100%;min-height:310px;max-height:100%"  >
                    <el-table-column label="ID" prop="id" ></el-table-column>
                    <el-table-column :label="$t('raid.level')" prop="raid_level"></el-table-column>
                    <el-table-column :label="$t('disk.capacity')" prop="size"></el-table-column>
                    <el-table-column :label="$t('raidMgr.check')" prop="parity_size" width="200px"></el-table-column>
                    <el-table-column :label="$t('raid.chunk')" prop="sector_size"></el-table-column>
                    <el-table-column :label="$t('message.state')" prop="state"></el-table-column>
                    <el-table-column :label="$t('raid.all')" prop="number_of_drives"></el-table-column>
                    <el-table-column :label="$t('message.oper')" width="150">
                        <template slot-scope='scope'>
                            <el-dropdown>
                                <el-button type="primary" size="mini">
                                    {{$t('message.opr')}}<i class="el-icon-arrow-down el-icon--right" ></i>
                                </el-button>
                              <el-dropdown-menu slot="dropdown">
                                  <span  @click="setraid(scope.row)"><el-dropdown-item >{{$t('raidMgr.set')}}</el-dropdown-item></span>
                                  <span  @click="startinit(scope.row)"><el-dropdown-item :disabled='scope.row.status == "正在初始化"'>{{$t('raidMgr.startinit')}}</el-dropdown-item></span>
                                  <span  @click="stopinit(scope.row)"><el-dropdown-item :disabled='scope.row.status != "正在初始化"'>{{$t('raidMgr.stopinit')}}</el-dropdown-item></span>
                                  <span  @click="rebuild(scope.row)"><el-dropdown-item :disabled='scope.row.firmware_state == "离线"'>{{$t('raidMgr.srebuild')}}</el-dropdown-item></span>
                                  <span  @click="stoprebuild(scope.row)"><el-dropdown-item :disabled='scope.row.firmware_state == "正在重建"'>{{$t('raidMgr.stopreb')}}</el-dropdown-item></span>
                                  <span  @click="deleteraid(scope.row)"><el-dropdown-item >{{$t('raidMgr.delraid')}}</el-dropdown-item></span>
                                  <span  @click="makegood(scope.row)"><el-dropdown-item >Make good</el-dropdown-item></span>
                              </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10]"
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
              </el-col>
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
            raiddata:[],
            pagesize: 5,
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
            rebrule:{}
        }
    },
    mounted(){
        this.getriad()
    },
    methods:{
        getriad(){
            this.$axios.get(this.$host+'cli').then(res=>{
                
                this.raiddata = res.data.data[0].data
                for(let i=0;i<this.raiddata.length;i++){
                    this.raiddata[i].size=change(this.raiddata[i].size)
                    this.raiddata[i].parity_size=change(this.raiddata[i].parity_size)
                }
                var disks=this.raiddata[0].disks[0]
                for(let p =0;p<disks.length;p++){
                    var _disk={}
                    _disk.key=disks[p].driver
                    _disk.label=disks[p].driver
                    this.own_disks.push(_disk)
                }
                this.diskdata = res.data.data[1].data
                for(let a=0;a<this.diskdata.length;a++){
                    var _all={}
                    if (this.diskdata[a].firmware_state.indexOf('unconfigured(good)') !== -1){
                        _all.key=this.diskdata[a].driver
                        _all.label=this.diskdata[a].driver
                        this.all_disks.push(_all)
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
            this.gset=val
            // this.getriad()
        },
        changeadd(val){
            this.addraid=val
            // this.getriad()
        },
        changemo(val){
            this.mraid=val
            // this.getriad()
        },
        startwarn(){
            this.$confirm(this.$t('raidMgr.start'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'alarm',{action:'start'}).then(res=>{
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
                this.$axios.post(this.$host+'alarm',{action:'stop'}).then(res=>{
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
            this.$confirm(this.$t('raidMgr.startinit'),this.$t('message.tips'),{
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
            this.$confirm(this.$t('stopinit.delraid'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.delete(this.$host+'cli',{data:{drive:this.nowdata.id}}).then(res=>{
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
        makegood(row){
            this.nowdata = row
            this.$confirm(this.$t('stopinit.startgood'),this.$t('message.tips'),{
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
        }
    }
}
</script>
