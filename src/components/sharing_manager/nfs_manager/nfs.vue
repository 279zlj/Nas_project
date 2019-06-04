<template>
    <div class="content">
        <headerBar></headerBar>
        <div class="tip_bg">
            <span class='tip'>NFS {{$t('message.file')}}</span>
        </div>    
        <el-row class="main_table">
          <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
            <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
            <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
            <el-row style='margin-bottom:.5em;float:right'>
                <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createnfs = true'></el-button></el-tooltip>
            </el-row>
            <el-table :data='nfsdata.slice((currpage - 1) * pagesize, currpage*pagesize)' border cell-style="padding:.7em" style='width:100%;min-height:310px;max-height:100%'>
                <el-table-column :label="$t('nfs.path')" prop='path'></el-table-column>
                <el-table-column :label="$t('nfs.per')" prop='info'></el-table-column>
                <el-table-column :label="$t('nfs.ok')" prop='client'></el-table-column>
                <el-table-column :label="$t('message.oper')">
                    <template slot-scope="scope">
                        <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon='el-icon-delete' size='mini' @click="deletenfs(scope.row)"></el-button></el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10]"
            :page-size="pagesize"
            :total="nfsdata.length" style="text-align: right;margin: 1em">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog :title="$t('nfs.new')" :visible.sync="createnfs" width="30%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="nfsform" ref='nfsform' :rules="nfsrule" label-width="30" class="demo-ruleForm">
              <el-form-item :label="$t('nfs.path')" prop='path'>
                  <el-input v-model="nfsform.path" :placeholder="$t('nfs.input')" style='width:80%'></el-input>
              </el-form-item>
              <el-form-item :label="$t('nfs.per')" prop='rank'>
                  <el-select v-model="nfsform.rank" :placeholder="$t('nfs.input1')">
                    <el-option :label="$t('nfs.write')" value="ro"></el-option>
                    <el-option :label="$t('nfs.read')" value='rw'></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('nfs.reli')" prop='address'>
                  <el-input v-model="nfsform.address" placeholder="x.x.x.x/x,x.x.x.x/x" style='width:80%'></el-input>
                  <p style='color:red'>({{$t('nfs.note')}})</p>
              </el-form-item>
              <el-form-item>
                      <el-button type="primary" @click="nfssubmit('nfsform')">{{$t('message.submit')}}</el-button>
                      <el-button @click="nfsreset('nfsform')">{{$t('message.reset')}}</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('nfs.delete')" :visible.sync="nfsremove" width="30%" center :close-on-click-modal="false">
            <p>{{$t('nfs.delete')}}：{{ntarget}}?</p>
            <el-button type="primary" @click='nremove()'>{{$t('message.sure')}}</el-button>
            <el-button @click='nfsremove=false'>{{$t('message.cancel')}}</el-button>
        </el-dialog>
    </div>    
</template>
<script>
import headerBar from '../../common/headerBar'
export default {
    name:'nfs',
    components:{headerBar},
    data(){
        var pathcheck=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入路径名称'))
            }
            else{
                if(val.length<3){
                    return callback(new Error('请输入长度超过3的路径名称'))
                }
                else
                    callback()
            }
        }
        var addcheck=(rule,val,callback)=>{
            if (!val){
                return callback(new Error('请输入网段'))
            }
            else{
                if(val){
                    if(val.indexOf(',')){
                        var value=val.split(',')
                        var ok=0;
                        var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d{1,2}$/
                        for(let i=0;i<value.length;i++){
                            if(!reg.test(value[i])){
                                return callback(new Error('请输入正确的ip网段'))
                            }
                            else
                                ok+=1;
                        }
                        if(ok==value.length){
                            callback()
                        }
                    }
                }
            }
            callback()
        }
        var rankcheck=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择权限'))
            }
            else{
                callback()
            }
        }
        return{
            createnfs:false,
            nfsremove:false,
            ntarget:'',
            iptarget:'',
            currpage:1,
            pagesize:5,
            nfsdata:[],
            nfsform:{
                path:'',
                rank:'',
                address:'',
            },
            nfsrule:{
                path:[
                    {validator:pathcheck, trigger: 'blur'}
                ],
                rank:[
                    {validator:rankcheck, trigger: 'blur'}
                ],
                address:[
                    {validator:addcheck, trigger: 'blur'}
                ]
            }
        }
    },
    mounted(){
        this.getnfs()
    },
    methods:{
        getnfs(){
            var _this=this
            this.$axios.get(this.$host+'nfs').then(function(res){
                _this.nfsdata = res.data.data                
            })
        },
        nfssubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'nfs',{path:_this.nfsform.path,ip:_this.nfsform.address,permission:_this.nfsform.rank}).then(res=>{
                         _this.createnfs=false
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
                        _this.getnfs()
                        _this.nfsreset('nfsform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        deletenfs(row){
            this.nfsremove=true
            this.ntarget=row.path
            this.iptarget=row.client
        },
        nremove(){
            this.$axios.delete(this.$host+'nfs',{data:{path:this.ntarget,ip:this.iptarget}}).then(res=>{
                 this.nfsremove=false
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
                this.getnfs()
                this.nfsreset('nfsform')
            }).catch(error=>{
                console.log(error)
            })
        },
        nfsreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['nfsform'].resetFields();
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
    #error_tip,#success_tip{
        display: none;
        position: absolute;
        width: inherit;
    }
</style>

