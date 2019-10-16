<template>
    <div class="content">
        <div>
        <div class="tip_bg">
            <span class="tip">{{$t('message.disk')}}</span>
        </div>
            <el-row class="other_table">
              <div style="width:96%;margin:0 auto">
                  <el-table :data="diskdata.slice((currpage - 1)* pagesize, currpage *pagesize)" border class="table_cell" :header-cell-style="getRowClass" style="width:100%;min-height:32rem"  >
                    <el-table-column :label="$t('raid.name')" prop="EID:Slt"></el-table-column>
                    <el-table-column :label="$t('disk.capacity')" prop="Size"></el-table-column>
                    <el-table-column label="面板位置" prop="DID"></el-table-column>
                    <el-table-column label="磁盘分组" prop="DG"></el-table-column>
                    <!-- <el-table-column :label="$t('disk.inter')" prop="port_linkspeed"></el-table-column> -->
                    <el-table-column :label="$t('message.state')" prop='State' >
                        <!-- <template slot-scope="scope">
                            <el-tag :type="{scope.row.health === '' ? 'success' : '',scope.row.health === '' ? '' : '' }" disable-transitions>{{scope.row.health}}</el-tag>
                        </template> -->
                    </el-table-column>
                    <el-table-column label="初始化状态">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="'预计剩余时间：'+preinit[0].Estimated" placement="top">
                                <el-progress :percentage="preinit[0].Progress" />
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
                                  <span  @click="startinit(scope.row)"><el-dropdown-item >开始初始化</el-dropdown-item></span>
                                  <span  @click="stopinit(scope.row)"><el-dropdown-item >停止初始化</el-dropdown-item></span>
                                  <span  @click="addspare(scope.row)"><el-dropdown-item :disabled='scope.row.State == "DHS" || scope.row.State == "GHS"'>{{$t('disk.addspare')}}</el-dropdown-item></span>
                                  <span  @click="removespare(scope.row)"><el-dropdown-item :disabled='scope.row.State | rmstate'>{{$t('disk.delspare')}}</el-dropdown-item></span>
                                  <span  @click="gps(scope.row)"><el-dropdown-item >{{$t('raid.gps')}}</el-dropdown-item></span>
                                  <span  @click="stopgps(scope.row)"><el-dropdown-item >{{$t('raid.stopgps')}}</el-dropdown-item></span>
                                  <span  @click="makestate(scope.row,'good')"><el-dropdown-item>Make good</el-dropdown-item></span>
                                  <!-- <span  @click="makestate(scope.row,'online')"><el-dropdown-item>Make online</el-dropdown-item></span>
                                  <span  @click="makestate(scope.row,'offline')"><el-dropdown-item>Make offline</el-dropdown-item></span>
                                  <span  @click="makestate(scope.row,'missing')"><el-dropdown-item>Make missing</el-dropdown-item></span> -->
                                  <span  @click="makestate(scope.row,'jbod')"><el-dropdown-item>Make jbod</el-dropdown-item></span>
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
                    :total="diskdata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
                    <el-dialog :title="$t('disk.addspare')" :visible.sync="spareadd" width="30%" center :before-close="handleClose" :close-on-click-modal="false" >
                        <el-form :model="sparedata" ref="sparedata" :rules="sparerule" label-width="120px" label-position="left" class="demo-ruleForm">
                          <el-form-item :label="$t('disk.select')">
                              {{dev}}
                          </el-form-item>
                          <el-form-item :label="$t('user.type')" prop="type" >
                              <el-select v-model="sparedata.type" :placeholder="$t('disk.type')">
                                <el-option  :label="$t('disk.global')" value='0'></el-option>
                                <el-option  :label="$t('disk.local')" value='1'></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('disk.raid')" prop="raid" v-if="sparedata.type=='1'">
                              <el-select v-model="sparedata.raid" :placeholder="$t('disk.raid')">
                                <el-option v-for="r in raiddata" :key="r" :value="r">{{r}}</el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item >
                                <el-button type="primary" @click="sparesubmit('sparedata')">{{$t('message.submit')}}</el-button>
                                <el-button @click="sparereset('sparedata')">{{$t('message.reset')}}</el-button>
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
import {renderSize} from '../../assets/change_bytes'
export default {
    name:'hard_disk',
    data(){
        
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            diskdata:[],
            raiddata:[],
            currpage:1,
            pagesize:10,
            spareadd:false,
            sparedata:{
                type:'',
                raid:''
            },
            sparerule:{
                type:[
                    {required:true,message:this.$t('raid.select7'), trigger:'blur'}
                ],
                
            },
            nowdata:[],
            dev:'',
            preinit:[
                {
                "VD": 0,
                "Operation": "INIT",
                "Progress": 35,
                "Status": "In progress",
                "Estimated": "5 Hours 58 Minutes"
                }
            ]
        }
    },
    filters:{
        rmstate:function(value){
            if(value == 'GHS' || value == 'DHS'){
                return false
            }
            else
                return true
        }
    },
    mounted(){
        this.getdisk()
    },
    methods:{
        getdisk(){
            this.$axios.get(this.$host+'cli').then(res=>{
                this.raiddata = []
                this.diskdata = res.data.data.physical
                var raid = res.data.data.virtual
                for(let i = 0;i<raid.length;i++)
                for (var key in raid[i]){
                    if(key == 'DG/VD'){
                        this.raiddata.push(raid[i][key])
                    }
                }
            })
        },
        handleCurrentChange(cpage){
            this.currpage = cpage;
        },
        handleSizeChange(psize){
            this.pagesize = psize
        },
        addspare(row){
            this.nowdata=row
            for (var key in this.nowdata){
                if(key == 'EID:Slt')
                    this.dev = this.nowdata[key]
            }
            this.spareadd=true
        },
        handleClose(done){
            done();
            this.$refs['sparedata'].resetFields();
        },
        makestate(row,action){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'EID:Slt')
                    this.dev = this.nowdata[key]
            }
            this.$confirm('开始进行make '+action+'操作',this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'diskCfg',{drive:this.dev,active:action}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.msg)
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
        removespare(row){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'EID:Slt')
                    this.dev = this.nowdata[key]
            }
            this.$confirm(this.$t('disk.delspare'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.delete(this.$host+'hot',{data:{action:'delete',devices:this.dev}}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.msg)
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
        startinit(row){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'EID:Slt')
                    this.dev = this.nowdata[key]
            }
            this.$confirm('磁盘初始化',this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'diskinit',{device:this.dev}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
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
        stopinit(row){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'EID:Slt')
                    this.dev = this.nowdata[key]
            }
            this.$confirm('磁盘初始化',this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.delete(this.$host+'diskinit',{data:{device:this.dev}}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
                    }
                    this.getdisk()
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: this.$t('message.cancel')
                })
            })},
        gps(row){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'EID:Slt')
                    this.dev = this.nowdata[key]
            }
            this.$confirm(this.$t('raid.Positioning'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'gps',{device:this.dev}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('message.success')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
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
        stopgps(row){
            this.nowdata = row
            for (var key in this.nowdata){
                if(key == 'EID:Slt')
                    this.dev = this.nowdata[key]
            }
            this.$confirm(this.$t('raid.stop'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.delete(this.$host+'gps',{data:{device:this.dev}}).then(res=>{
                    if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('raid.stop')
                        });
                    }
                    else{
                        this.$message.error(res.data.data)
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
        sparesubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'hot',{action:'hot',devices:this.dev,type:this.sparedata.type,dgs:this.sparedata.raid}).then(res=>{
                        if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('raid.successadd')
                        });
                        this.getdisk()
                        }
                        else{
                            this.$message.error(res.data.msg)
                        }
                        this.getdisk()
                        this.spareadd = false
                        this.getdisk()
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            })
        },
        sparereset(name){
            this.$refs[name].resetFields()
        }
    }
}
</script>
