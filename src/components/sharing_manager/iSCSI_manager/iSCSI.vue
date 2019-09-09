<template>
    <div class='content'>
        <div class='tip_bg'>
            <span class='tip'>iSCSI {{$t('message.management')}}</span>
        </div>
        <el-row class='main_table'>
          <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
            <el-row style='margin-bottom:.5em;float:right'>
                <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createiscsi = true'></el-button></el-tooltip>
            </el-row>
            <el-table :data='iscsidata.slice((currpage - 1)*pagesize,currpage*pagesize)' border  class="table_cell" style='width:100%;min-height:310px;max-height:100%'>
                <el-table-column label="IQN" prop='node_wwn' :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="$t('iscsi.name')" prop='disk_name' width="160"></el-table-column>
                <el-table-column :label="$t('iscsi.path')" prop='disk_path' width="160"></el-table-column>
                <el-table-column :label="$t('iscsi.size')" prop='disk_size'></el-table-column>
                <el-table-column :label="$t('iscsi.per')" prop='auth'></el-table-column>
                <el-table-column :label="$t('message.state')" prop="enable"></el-table-column>
                <el-table-column :label="$t('message.oper')">
                    <template slot-scope="scope">
                        <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteiscsi(scope.row)"></el-button></el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10]"
            :page-size="pagesize"
            :total="pageTotal" style="text-align: right;margin: 1em">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog :title="$t('iscsi.new')" :visible.sync="createiscsi" width="50%" :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="iscsiform" ref='iscsiform' :rules="iscsirule" label-width="140px" label-position="left" class="rule-Form">
              <el-form-item label="IQN" prop='iname' >
                  <el-input v-model="iscsiform.iname" :placeholder="$t('iscsi.input')" clearable >
                      <template slot='prepend'>iqn.2016-08.com.wuzhou.</template>
                  </el-input>
              </el-form-item>
              <el-form-item :label="$t('iscsi.uint')" prop="itype">
                  <el-select v-model="iscsiform.itype" :placeholder="$t('iscsi.select')" @change="typechange(iscsiform)">
                    <el-option :label="$t('iscsi.logic')" value="pools"></el-option>
                    <el-option :label="$t('iscsi.disk')" value="disks"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('iscsi.dy')" prop="logic">
                  <el-transfer v-model="iscsiform.logic" :data="pools" :titles="[$t('iscsi.sele1'),$t('iscsi.sele2')]" v-if='logictarget=="pools"'></el-transfer>
                  <el-transfer v-model="iscsiform.logic" :data="disks" :titles="[$t('iscsi.disk1'),$t('iscsi.disk2')]" v-if='logictarget=="disks"'></el-transfer>
              </el-form-item>
              <el-form-item>
                <el-button type='primary' @click="newsubmit('iscsiform')">{{$t('message.submit')}}</el-button>
                <el-button @click="iscsireset('iscsiform')">{{$t('message.reset')}}</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('iscsi.delete')" :visible.sync='idelete' width="30%" center :close-on-click-modal="false">
            <p>{{$t('iscsi.delete')}}：{{itarget.node_wwn}}?</p>
            <el-button type="primary" @click='deletei()'>{{$t('message.sure')}}</el-button>
            <el-button @click='idelete=false'>{{$t('message.cancel')}}</el-button>
        </el-dialog>
    </div>  
</template>
<script>
import {change} from '../../../assets/change_size'
export default {
    name:'iSCSI',
    data(){
        return{
            createiscsi:false,
            idelete:false,
            currpage:1,
            pagesize:5,
            pageTotal:0,
            iscsidata:[],
            disks:[],
            pools:[],
            itarget:'',
            logictarget:'',
            iscsiform:{
                iname:'',
                itype:'',
                logic:[]
            },
            iscsirule:{
                iname:[
                    {required:true,message:this.$t('iscsi.input'), trigger: 'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'},
                    {max:7,message:this.$t('iscsi.input2'),trigger:'blur'}
                ],
                itype:[
                    {required:true,message:this.$t('iscsi.select'), trigger: 'blur'}
                ],
                logic:[
                    {required:true,message:this.$t('iscsi.select1'), trigger: 'blur'}
                ]
            }
        }
    },
    mounted(){
        this.getiscsi()
    },
    watch:{
      pageTotal(){
        if(this.pageTotal==(this.currpage-1)*this.pagesize&& this.pageTotal!=0){
          this.currpage-=1;
        //   getuser(this);//获取列表数据
        }
      }
    },
    methods:{
        getiscsi(){
            this.$axios.get(this.$host+'iscsi').then(res=>{
                this.iscsidata=res.data.data
                for(let i=0;i<this.iscsidata.length;i++)
                    this.iscsidata[i].disk_size=change(this.iscsidata[i].disk_size)
                this.pageTotal=this.iscsidata.length
            }).catch(error=>{
                console.log(error)
            })
            var _this=this
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
            this.$axios.get(this.$host+'vd').then(res=>{
                var pp=[]
                for(let i=0;i<res.data.data.length;i++){
                    var pools={}
                    // console.log(res.data.data)
                    pools.key=res.data.data[i].path
                    pools.label=res.data.data[i].path
                    pools.disabled=false
                    pp.push(pools)
                }
                // console.log(pp)
                _this.pools = pp
            }).catch(error=>{
                console.log(error)
            })
        },
        deleteiscsi(row){
            this.idelete=true;
            this.itarget=row
        },
        deletei(){
            var _this=this
            this.$axios.delete(this.$host+'iscsi',{data:{target:_this.itarget.wwn,name:_this.itarget.disk_name,disk:_this.itarget.disk_path}}).then(res=>{
                _this.idelete=false
                if(res.data.success){
                    _this.$message({
                        message:this.$t('message.success'),
                        type:'success',
                        offset:''
                    })
                }
                else if(!res.data.success){
                    _this.$message.error(res.data.msg)
                }
                _this.getiscsi()
                _this.iscsireset('iscsiform')
            }).catch(error=>{
                console.log(error)
            })
        },
        newsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'iscsi',{iqn:_this.iscsiform.iname,disk_path:_this.iscsiform.logic}).then(res=>{
                        _this.createiscsi=false
                        if(res.data.success){
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            _this.$message.error(res.data.msg)
                        }
                        _this.getiscsi()
                        _this.iscsireset('iscsiform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        iscsireset(formname){
            this.$refs[formname].resetFields();
            this.logictarget=''
        },
        typechange(val){
            if(val.itype=='pools')
                this.logictarget='pools'
            else if(val.itype=='disks')
                this.logictarget='disks'
        },
        handleClose(done){
            done();
            this.$refs['iscsiform'].resetFields();
            this.logictarget=''
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
