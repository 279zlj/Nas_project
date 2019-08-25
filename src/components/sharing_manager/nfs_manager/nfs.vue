<template>
    <div class="content">
        <div class="tip_bg">
            <span class='tip'>NFS {{$t('message.file')}}</span>
        </div>    
        <el-row class="main_table">
          <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
            <el-row style='margin-bottom:.5em;float:right'>
                <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createnfs = true'></el-button></el-tooltip>
            </el-row>
            <el-table :data='nfsdata.slice((currpage - 1) * pagesize, currpage*pagesize)' border  class="table_cell" style='width:100%;min-height:310px;max-height:100%'>
                <el-table-column :label="$t('nfs.path')" prop='path'></el-table-column>
                <el-table-column :label="$t('nfs.per')" prop='info'></el-table-column>
                <el-table-column :label="$t('nfs.ok')" prop='client'></el-table-column>
                <el-table-column :label="$t('message.oper')">
                    <template slot-scope="scope">
                        <el-tooltip :content="$t('message.modify')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifynfs(scope.row)'></el-button></el-tooltip>
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
            :total="pageTotal" style="text-align: right;margin: 1em">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog :title="$t('nfs.new')" :visible.sync="createnfs" width="45%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="nfsform" ref='nfsform' :rules="nfsrule" label-width="190px" label-position="left" class="demo-ruleForm">
              <el-form-item :label="$t('nfs.path')" prop='path'>
                  <el-input v-model="nfsform.path" :placeholder="$t('nfs.input')" ></el-input>
              </el-form-item>
              <el-form-item :label="$t('nfs.per')" prop='rank'>
                  <el-select v-model="nfsform.rank" :placeholder="$t('nfs.input1')">
                    <el-option :label="$t('nfs.write')" value="ro"></el-option>
                    <el-option :label="$t('nfs.read')" value='rw'></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('nfs.reli')" prop='address'>
                  <el-input v-model="nfsform.address" placeholder="x.x.x.x/x,x.x.x.x/x" ></el-input>
                  <p style='color:red'>({{$t('nfs.note')}})</p>
              </el-form-item>
              <el-form-item :label="$t('iscsi.logic')" prop='doc'>
                  <el-select v-model="nfsform.doc" :placeholder="$t('message.select')">
                    <el-option v-for="i in docdata" :key="i.path" :value="i.path">{{i.name}}</el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                      <el-button type="primary" @click="nfssubmit('nfsform')">{{$t('message.submit')}}</el-button>
                      <el-button @click="nfsreset('nfsform')">{{$t('message.reset')}}</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('message.modify')" :visible.sync="nfsmodi" width="30%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="nfsform" ref='nfsform' :rules="nfsrule" label-width="100px" label-position="left" class="demo-ruleFrom">
                <el-form-item :label="$t('nfs.per')" prop="newrank">
                    <el-select v-model="nfsform.newrank" :placeholder="$t('nfs.input1')" >
                        <el-option :label="$t('nfs.write')" value="ro"></el-option>
                        <el-option :label="$t('nfs.read')" value='rw'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('nfs.reli')" prop="newaddress">
                    <el-input v-model="nfsform.newaddress" :placeholder="modifyreli.client"></el-input>
                    <p style='color:red'>({{$t('nfs.note')}})</p>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modifysubmit('nfsform')">{{$t('message.submit')}}</el-button>
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
export default {
    name:'nfs',
    data(){
        var pathcheck=(rule,val,callback)=>{
            var reg = /^[0-9a-zA-Z]+$/
            if(!val){
                return callback(new Error(this.$t('nfs.input')))
            }
            else{
                if(val.length<3){
                    return callback(new Error(this.$t('nfs.input2')))
                }
                else if(!reg.test(val)){
                    return callback(new Error(this.$t('user.reg')))
                }
                else
                    callback()
            }
        }
        var addcheck=(rule,val,callback)=>{
            if (!val){
                return callback(new Error(this.$t('nfs.input3')))
            }
            else{
                if(val){
                    if(val.indexOf(',')){
                        var value=val.split(',')
                        var ok=0;
                        var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d{1,2}$/
                        for(let i=0;i<value.length;i++){
                            if(!reg.test(value[i])){
                                return callback(new Error(this.$t('nfs.input4')))
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
        return{
            createnfs:false,
            nfsremove:false,
            nfsmodi:false,
            ntarget:'',
            modifyreli:[],
            iptarget:'',
            currpage:1,
            pagesize:5,
            pageTotal:0,
            nfsdata:[],
            docdata:[],
            nfsform:{
                path:'',
                rank:'',
                address:'',
                doc:'',
                newrank:'',
                newaddress:''
            },
            nfsrule:{
                path:[
                    {required:true,validator:pathcheck, trigger: 'blur'}
                ],
                rank:[
                    {required:true,message:this.$t('nfs.input5'), trigger: 'blur'}
                ],
                address:[
                    {required:true,validator:addcheck, trigger: 'blur'}
                ],
                doc:[
                    {required:true,message:this.$t('nfs.input6'), trigger: 'blur'}
                ]
            }
        }
    },
    mounted(){
        this.getnfs()
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
        getnfs(){
            var _this=this
            this.$axios.get(this.$host+'nfs').then(function(res){
                _this.nfsdata = res.data.data         
                _this.pageTotal = _this.nfsdata.length       
            })
            this.$axios.get(this.$host+'vd').then(res=>{
                _this.docdata=res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        modifynfs(row){
            this.nfsmodi=true
            this.modifyreli=row
        },
        nfssubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'nfs',{path:_this.nfsform.path,ip:_this.nfsform.address,permission:_this.nfsform.rank,lvm:_this.nfsform.doc}).then(res=>{
                         _this.createnfs=false
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
                        _this.getnfs()
                        _this.nfsreset('nfsform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        modifysubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.put(this.$host+'nfs',{path:_this.modifyreli.path,ip:_this.nfsform.newaddress,permission:_this.nfsform.newrank}).then(res=>{
                         _this.nfsmodi=false
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
                    this.$message({
                        message:this.$t('message.success'),
                        type:'success',
                        offset:''
                    })
                }
                else if(!res.data.success){
                    this.$message.error(res.data.msg)
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

