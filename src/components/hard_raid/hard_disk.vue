<template>
    <div class="content">
        <div>
        <div class="tip_bg">
            <span class="tip">{{$t('message.disk')}}</span>
        </div>
            <el-row class="other_table">
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset="2">
                  <el-table :data="diskdata.slice((currpage - 1)* pagesize, currpage *pagesize)" border class="table_cell" style="width:100%;min-height:310px;max-height:100%"  >
                    <el-table-column :label="$t('raid.name')" prop="inquiry_data" width="250"></el-table-column>
                    <el-table-column :label="$t('disk.capacity')" prop="raw_size"></el-table-column>
                    <el-table-column :label="$t('disk.inter')" prop="port_linkspeed"></el-table-column>
                    <el-table-column :label="$t('message.state')" prop='firmware_state' width="300">
                        <!-- <template slot-scope="scope">
                            <el-tag :type="{scope.row.health === '' ? 'success' : '',scope.row.health === '' ? '' : '' }" disable-transitions>{{scope.row.health}}</el-tag>
                        </template> -->
                    </el-table-column>
                    <el-table-column :label="$t('message.oper')" width="150">
                        <template slot-scope='scope'>
                            <el-dropdown>
                                <el-button type="primary" size="mini">
                                    {{$t('message.opr')}}<i class="el-icon-arrow-down el-icon--right" ></i>
                                </el-button>
                              <el-dropdown-menu slot="dropdown">
                                  <!-- <span  @click="startinit(scope.row)"><el-dropdown-item :disabled='scope.row.firmware_state != "unconfigured(good), spun down" '>开始初始化</el-dropdown-item></span>
                                  <span  @click="stopinit(scope.row)"><el-dropdown-item :disabled='scope.row.firmware_state == "正在初始化"'>停止初始化</el-dropdown-item></span> -->
                                  <span  @click="addspare(scope.row)"><el-dropdown-item :disabled='scope.row.firmware_state == "hotspare, spun down"'>{{$t('disk.addspare')}}</el-dropdown-item></span>
                                  <span  @click="removespare(scope.row)"><el-dropdown-item :disabled='scope.row.firmware_state != "hotspare, spun down"'>{{$t('disk.delspare')}}</el-dropdown-item></span>
                                  <span  @click="gps(scope.row)"><el-dropdown-item >{{$t('raid.gps')}}</el-dropdown-item></span>
                                  <span  @click="stopgps(scope.row)"><el-dropdown-item >{{$t('raid.stopgps')}}</el-dropdown-item></span>
                                  <span  @click="online(scope.row)"><el-dropdown-item>Make online</el-dropdown-item></span>
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
                    :total="diskdata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
                    <el-dialog :title="$t('disk.delspare')" :visible.sync="spareadd" width="30%" center :before-close="handleClose" :close-on-click-modal="false" >
                        <el-form :model="sparedata" ref="sparedata" :rules="sparerule" label-width="120px" label-position="left" class="demo-ruleForm">
                          <el-form-item :label="$t('disk.select')">
                              {{nowdata.inquiry_data}}
                          </el-form-item>
                          <el-form-item :label="$t('user.type')" prop="type" >
                              <el-select v-model="sparedata.type" :placeholder="$t('disk.type')">
                                <el-option  :label="$t('disk.global')" value='0'></el-option>
                                <el-option  :label="$t('disk.local')" value='1'></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('disk.raid')" prop="raid" v-if="sparedata.type=='1'">
                              <el-select v-model="sparedata.raid" :placeholder="$t('disk.raid')">
                                <el-option v-for="r in raiddata" :key="r.id" :value="r.id">{{r.id}}</el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item >
                                <el-button type="primary" @click="sparesubmit('sparedata')">{{$t('message.submit')}}</el-button>
                                <el-button @click="sparereset('sparedata')">{{$t('message.reset')}}</el-button>
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
import {renderSize} from '../../assets/change_bytes'
export default {
    name:'hard_disk',
    data(){
        var checkraid=(rule,val,callback)=>{
            if(isNaN(val)){
                console.log(val)
                return callback(new Error('请选择阵列ID'))
            }
            else
                callback()
        }
        return{
            diskdata:[],
            raiddata:[],
            currpage:1,
            pagesize:5,
            spareadd:false,
            sparedata:{
                type:'',
                raid:''
            },
            sparerule:{
                type:[
                    {required:true,message:'请选择热备类型', trigger:'blur'}
                ],
                raid:[
                    {validator:checkraid, trigger: 'blur'}
                ]
            },
            nowdata:[]
        }
    },
    mounted(){
        this.getdisk()
    },
    methods:{
        getdisk(){
            this.$axios.get(this.$host+'cli').then(res=>{
                this.diskdata = res.data.data[1].data
                for(let i=0;i<this.diskdata.length;i++){
                    this.diskdata[i].raw_size=change(this.diskdata[i].raw_size)
                }
                for(let i=0;i<this.diskdata.length;i++){
                    this.diskdata[i].port_linkspeed=renderSize(this.diskdata[i].port_linkspeed)
                }
                this.raiddata = res.data.data[0].data
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
            this.spareadd=true
        },
        handleClose(done){
            done();
            this.$refs['sparedata'].resetFields();
        },
        online(row){
            this.nowdata = row
            this.$confirm('Make online',$t('message.tips'),{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'',{drive:this.nowdata.id}).then(res=>{
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
        removespare(row){
            this.nowdata = row
            this.$confirm(this.$t('disk.delspare'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'hot',{devices:this.nowdata.driver}).then(res=>{
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
        gps(row){
            this.nowdata = row
            this.$confirm(this.$t('raid.Positioning'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'gps',{device:this.nowdata.driver,action:'start'}).then(res=>{
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
            this.$confirm(this.$t('raid.stop'),this.$t('message.tips'),{
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                type:'warning'
            }).then(()=>{
                this.$axios.post(this.$host+'gps',{device:this.nowdata.driver,action:'stop'}).then(res=>{
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
                    this.$axios.post(this.$host+'hot',{devices:this.nowdata.driver,type:this.sparedata.type,array:this.sparedata.raid}).then(res=>{
                        if(res.data.success){
                        this.$message({
                            type: 'success',
                            message: this.$t('raid.successadd')
                        });
                        this.getdisk()
                        }
                        else{
                            this.$message.error(res.data.data)
                        }
                        this.getdisk()
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
