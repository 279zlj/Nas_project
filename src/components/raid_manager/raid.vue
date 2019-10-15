<template>
    <div class='content'>
            <div class="tip_bg">
                <span class="tip">{{$t('message.softraid')}}</span>
            </div>
            <div>
            <el-row class='main_table'>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                    <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createraid = true'></el-button></el-tooltip>
                    </el-row>
                    <el-table :data='raiddata.slice((currpage - 1) * pagesize, currpage * pagesize)' border  class="table_cell" :header-cell-style="getRowClass" style='width:100%;min-height:310px;max-height:100%'>
                        <el-table-column :label="$t('raid.name')" prop='name' :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="$t('raid.level')" prop='level'></el-table-column>
                        <el-table-column :label="$t('raid.chunk')" prop='chunk' ></el-table-column>
                        <el-table-column :label="$t('raid.all')" prop='total' ></el-table-column>
                        <el-table-column :label="$t('raid.spare')" prop='spare_num' width="110"></el-table-column>
                        <el-table-column :label="$t('message.state')" prop='state'>
                            <template slot-scope="scope">
                                <el-tooltip :content="scope.row.state" placement="bottom">
                                    <el-tag :type="scope.row.state === 'clean'? 'success':'warning' " disable-transitions>{{scope.row.state}}</el-tag>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.oper')" width="160">
                            <template slot-scope='scope'>
                                <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon="el-icon-delete" size='mini' @click='raiddelete(scope.row)'></el-button></el-tooltip>
                                <el-tooltip :content="$t('raid.detail')" placement="bottom"><el-button type='primary' icon="el-icon-document" size="mini" @click="raiddetail(scope.row)"></el-button></el-tooltip>
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
            <el-dialog :title="$t('raid.new')" :visible.sync="createraid" width='45%' center :close-on-click-modal="false" top='5em' :before-close='handleClose'>
                <el-form :model="raidform" :rules="raidrule" ref='raidform' label-width="100px" label-position="left" class='demo-ruleForm'>
                  <el-form-item :label="$t('raid.level')" prop='raidtype'>
                    <el-select v-model="raidform.raidtype" :placeholder="$t('raid.select')">
                      <el-option label="0" value="0"></el-option>
                      <el-option label='1' value='1'></el-option>
                      <el-option label='5' value='5'></el-option>
                      <el-option label='6' value='6'></el-option>
                      <el-option label="10" value="10"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('raid.chunk')" prop='datablock'>
                    <el-select v-model="raidform.datablock" :placeholder="$t('raid.select2')">
                      <el-option label='64K' value="64K"></el-option>
                      <el-option label="128K" value='128K'></el-option>
                      <el-option label="256K" value='256K'></el-option>
                      <el-option label='512K' value='512K'></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('raid.ddisk')" prop='datadisk'>
                    <template>
                        <el-transfer v-model="raidform.datadisk" :data="disks" :titles="[$t('raid.disk1'),$t('raid.disk2')]" ></el-transfer>
                    </template>
                  </el-form-item>
                  <el-form-item :label="$t('raid.ddisks')" prop='readydisk'>
                    <el-transfer v-model="raidform.readydisk" :data="disks" :titles="[$t('raid.disk1'),$t('raid.disk2')]" ></el-transfer>
                  </el-form-item>
                  <el-form-item>
                    <el-button type='primary' @click="addraidsubmit('raidform')">{{$t('message.submit')}}</el-button>
                    <el-button @click="raidreset('raidform')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('raid.delete')" :visible.sync='deletelog' width="30%" center :close-on-click-modal="false">
                <p>{{$t('raid.delete')}}：{{raidtarget.name}}?</p>
                <el-button type="primary" @click='rdelete()'>{{$t('message.sure')}}</el-button>
                <el-button @click='deletelog=false'>{{$t('message.cancel')}}</el-button>
            </el-dialog>
            <el-dialog :title="$t('raid.detail')" :visible.sync="detail" width="30%" center :close-on-click-modal="false" >
                <el-form label-width="100px" label-position="left">
                    <el-form-item class="ma" :label="$t('raid.name')">{{raidtarget.name}}</el-form-item>
                    <el-form-item class="ma" :label="$t('raid.level')">{{raidtarget.level}}</el-form-item>
                    <el-form-item class="ma" :label="$t('raid.chunk')">{{raidtarget.chunk}}</el-form-item>
                    <el-form-item class="ma" :label="$t('raid.all')">{{raidtarget.total}}</el-form-item>
                    <el-form-item class="ma" :label="$t('raid.use')"><span v-for='(r,index) in raidtarget.device' style='display:block' :key="index">{{r.device}} — {{$t('message.state')}}： {{r.state}}</span></el-form-item>
                    <el-form-item class="ma" :label="$t('raid.spare')">{{raidtarget.spare_num}}</el-form-item>
                    <el-form-item class="ma" :label="$t('raid.active')">{{raidtarget.active_num}}</el-form-item>
                    <el-form-item class="ma" :label="$t('raid.working')">{{raidtarget.working_num}}</el-form-item>
                    <el-form-item class="ma" :label="$t('raid.failed')">{{raidtarget.failed_num}}</el-form-item>
                    <el-form-item class="ma" :label="$t('message.size')">{{raidtarget.size}}</el-form-item>
                    <el-form-item class="ma" :label="$t('message.state')">{{raidtarget.state}}</el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {change} from '../../assets/change_size'
export default {
    name:'raid',
    data(){        
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            raiddata:[],
            createraid:false,
            deletelog:false,
            pagesize: 5,
            raidtarget:'',
            currpage: 1,
            pageTotal: 0,
            detail:false,
            raidform:{
                // name:'',
                raidtype:'',
                datablock:'',
                datadisk:[],
                readydisk:[]
            },
            raidrule:{
                // name:[
                //     {validator: nameval, trigger: 'blur'},
                // ],
                raidtype:[
                    {required:true,message:this.$t('raid.select'), trigger: 'blur'},
                ],
                datablock:[
                    {required:true,message:this.$t('raid.select2'), trigger: 'blur'},
                ],
                datadisk:[
                    {required:true,message:this.$t('raid.select3'), trigger: 'blur'},
                ],
                
            },
            disks:[],
        }
    },
    mounted(){
        this.getraid()
    },
    watch:{
      pageTotal(){
        if(this.pageTotal==(this.currpage-1)*this.pagesize&& this.pageTotal!=0){
          this.currpage-=1;
        //   getuser(this);//获取列表数据
        }
      }
    },
    methods: {
        getraid(){
            var _this=this
            this.$axios.get(this.$host+'mdadm').then(res=>{
                _this.raiddata=res.data.data
                _this.pageTotal=_this.raiddata.length
                for(let i=0;i<_this.raiddata.length;i++){
                    _this.raiddata[i].size=change(_this.raiddata[i].size)
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
        addraidsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'mdadm',{level:_this.raidform.raidtype,disks:_this.raidform.datadisk,spares:_this.raidform.readydisk,chunk:_this.raidform.datablock}).then(function(res){
                        _this.createraid=false
                        if(res.data.success){
                            _this.$message({
                                message:_this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            _this.$message.error(res.data.msg)
                        }
                        _this.getraid()
                        _this.raidreset('raidform')
                    }).catch(function(error){
                        console.log(error)
                    })
                }
            })
        },
        rdelete(){
            var _this=this
            this.$axios.delete(this.$host+'mdadm',{data:{name:_this.raidtarget.name}}).then(res=>{
                _this.deletelog=false
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
                setTimeout(function(){
                    _this.getraid()
                },2000)
                _this.raidreset('raidform')
            }).catch(error=>{
                console.log(error)
            })
        },
        raidreset(formname){
            this.$refs[formname].resetFields();
        },
        raiddelete(row){
            this.deletelog=true;
            this.raidtarget=row
        },
        raiddetail(row){
            this.detail=true
            this.raidtarget=row
        },
        handleClose(done){
            done();
            this.$refs['raidform'].resetFields();
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
    },
}
</script>
<style>
.ma{margin-bottom:0px !important}
</style>