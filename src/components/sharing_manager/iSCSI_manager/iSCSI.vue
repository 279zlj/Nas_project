<template>
    <div class='content'>
        <headerBar></headerBar>
        <div class='tip_bg'>
            <span class='tip'>iSCSI {{$t('message.management')}}</span>
        </div>
        <el-row class='main_table'>
          <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
            <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
            <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
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
            :total="iscsidata.length" style="text-align: right;margin: 1em">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog :title="$t('iscsi.new')" :visible.sync="createiscsi" width="45%" :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="iscsiform" ref='iscsiform' :rules="iscsirule" label-width="100px" label-position="left" class="rule-Form">
              <el-form-item label="IQN" prop='iname' >
                  <el-input v-model="iscsiform.iname" :placeholder="$t('iscsi.input')" >
                      <template slot='prepend'>iqn.2016-08.com.wuzhou.</template>
                  </el-input>
              </el-form-item>
              <!-- <el-form-item label="LIO名称" prop='isign'>
                  <el-input v-model="iscsiform.isign" type='number' placeholder="请输入LIO名称" style="width:80%"></el-input>
              </el-form-item> -->
              <el-form-item :label="$t('iscsi.gateway')" prop='ip'>
                  <el-input v-model="iscsiform.ip" :placeholder="$t('iscsi.input1')"></el-input>
              </el-form-item>
              <el-form-item label="Port" prop='port'>
                  <el-input v-model="iscsiform.port" type='number' :placeholder="$t('iscsi.port')" ></el-input>
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
import headerBar from '../../common/headerBar'
export default {
    name:'iSCSI',
    components:{headerBar},
    data(){
        var chcekiname=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入IQN'))
            }
            else{
                if(val.length>7){
                    return callback(new Error('请输入长度少于7的IQN'))
                }
                callback()
            }
        }
        var checkitype=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择逻辑单元类型'))
            }
            else
                callback()
        }
        // var checkisign=(rule,val,callback)=>{
        //     if(!val){
        //         return callback(new Error('请输入标识'))
        //     }
        //     else
        //         callback()
        // }
        var checklogic=(rule,val,callback)=>{
            if(val.length==0){
                return callback(new Error('请选择逻辑单元'))
            }
            else
                callback()
        }
        var checkip=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入ip地址'))
            }
            else{
                var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if(!reg.test(val)){
                    return callback(new Error('请输入正确的ip地址'))
                }
                else
                    callback()
            }
        }
        var checkport=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入端口'))
            }
            else {
                if(val.length>5){
                    return callback(new Error('请输入正确的端口'))
                }
                else
                    callback()
            }
        }
        return{
            createiscsi:false,
            idelete:false,
            currpage:1,
            pagesize:5,
            iscsidata:[],
            disks:[],
            pools:[],
            itarget:'',
            logictarget:'',
            iscsiform:{
                iname:'',
                // isign:'',
                ip:'',
                port:'',
                itype:'',
                logic:[]
            },
            iscsirule:{
                iname:[
                    {validator: chcekiname, trigger: 'blur'}
                ],
                // isign:[
                //     {validator: checkisign, trigger: 'blur'}
                // ],
                ip:[
                    {validator: checkip, trigger: 'blur'}
                ],
                port:[
                    {validator: checkport, trigger: 'blur'}
                ],
                itype:[
                    {validator: checkitype, trigger: 'blur'}
                ],
                logic:[
                    {validator: checklogic, trigger: 'blur'}
                ]
            }
        }
    },
    mounted(){
        this.getiscsi()
    },
    methods:{
        getiscsi(){
            this.$axios.get(this.$host+'iscsi').then(res=>{
                this.iscsidata=res.data.data
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
                    // if(res.data.data[i].vg_status==1){
                    //     pools.disabled=false
                    // }
                    // else{
                    //     pools.disabled=true
                    // }
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
            this.$axios.delete(this.$host+'iscsi',{data:{target:itarget.wwn,name:_this.itarget.disk_name,disk:_this.itarget.disk_path}}).then(res=>{
                _this.idelete=false
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
                    _this.$axios.post(this.$host+'iscsi',{iqn:_this.iscsiform.iname,disk_path:_this.iscsiform.logic,ip:_this.iscsiform.ip,port:_this.iscsiform.port}).then(res=>{
                        _this.createiscsi=false
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
