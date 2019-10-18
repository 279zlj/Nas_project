<template>
    <div class='content'>
        <div class="tip_bg">
            <span class='tip'>SMB {{$t('message.file')}}</span>
        </div>
        <div>
            <el-row class='main_table'>
              <div style="width:96%;margin:0 auto">
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createsmb = true'></el-button></el-tooltip>
                    </el-row>
                    <el-table :data='smbdata.slice((currpage - 1) * pagesize, currpage*pagesize)' border :header-cell-style="getRowClass" class="table_cell" style='width:100%;min-height:32rem'>
                        <el-table-column :label="$t('smb.name')" prop='name'></el-table-column>
                        <el-table-column :label="$t('smb.path')" prop='path'></el-table-column>
                        <el-table-column :label="$t('smb.not')" prop='guest' width="250px"></el-table-column>
                        <el-table-column :label="$t('smb.per')" prop="writable"></el-table-column>
                        <el-table-column :label="$t('message.oper')">
                            <template slot-scope="scope">
                                <el-tooltip :content="$t('message.modify')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifysmb(scope.row)'></el-button></el-tooltip>
                                <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon='el-icon-delete' size='mini' @click="deletesmb(scope.row)"></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20]"
                    :page-size="pagesize"
                    :total="pageTotal" style="text-align: right;margin: 1em">
                    </el-pagination>
              </div>
            </el-row>
            <el-dialog :title="$t('smb.new')" :visible.sync="createsmb" width="40%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="smbform" ref='smbform' :rules="smbrule" label-width="130px" label-position="left" class="demo-ruleForm">
              <el-form-item :label="$t('smb.name')" prop='name'>
                  <el-input v-model="smbform.name" :placeholder="$t('smb.input')" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('smb.p_name')" prop='path'>
                  <el-input v-model="smbform.path" :placeholder="$t('smb.input1')" clearable ></el-input>
              </el-form-item>
              <el-form-item :label="$t('smb.user')" prop='user' v-if="!gestsate">
                  <el-select v-model="smbform.user" :placeholder="$t('smb.input2')">
                    <el-option v-for="u in user" :key="u" :value="u">{{u}}</el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('iscsi.logic')" prop='doc'>
                  <el-select v-model="smbform.doc" :placeholder="$t('message.select')">
                    <el-option v-for="i in docdata" :key="i.path" :value="i.path">{{i.name}}</el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('smb.per')" prop='rank'>
                  <el-switch :active-text="$t('smb.read')" v-model="smbform.rank" :inactive-text="$t('smb.write')" ></el-switch>
              </el-form-item>
              <el-form-item :label="$t('smb.gest')" prop='gest'>
                  <el-switch v-model="smbform.gest" ></el-switch>
              </el-form-item>
              <el-form-item>
                      <el-button type="primary" @click="smbsubmit('smbform')">{{$t('message.submit')}}</el-button>
                      <el-button @click="smbreset('smbform')">{{$t('message.reset')}}</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('message.modify')" :visible.sync="smbmodi" width="30%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="modifydata" ref='modifydata' :rules="smbrule" label-width="100px" label-position="left" class="demo-ruleFrom">
              <el-form-item :label="$t('smb.name')" prop="newname">
                  <el-input v-model="modifydata.newname" :placeholder="modifydata.name" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('smb.per')" prop="rank">
                  <el-switch :active-text="$t('smb.read')" v-model="modifydata.rank" :inactive-text="$t('smb.write')"></el-switch>
              </el-form-item>
              <el-form-item :label="$t('smb.gest')" prop="gest">
                  <el-switch v-model="modifydata.gest" ></el-switch>
              </el-form-item>
              <el-form-item >
                    <el-button type="primary" @click="modifysubmit('modifydata')">{{$t('message.submit')}}</el-button>
                    <el-button @click="smbreset('modifydata')">{{$t('message.reset')}}</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('smb.delete')" :visible.sync="smbremove" width="30%" center :close-on-click-modal="false">
            <p>{{$t('smb.delete')}}：{{starget}}?</p>
            <el-button type="primary" @click='sremove()'>{{$t('message.sure')}}</el-button>
            <el-button @click='smbremove=false'>{{$t('message.cancel')}}</el-button>
        </el-dialog>
        </div>
    </div>    
</template>
<script>
export default {
    name:'smb',
    data(){
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            smbdata:[],
            user:[],
            docdata:[],
            createsmb:false,
            smbremove:false,
            smbmodi:false,
            gestsate:'',
            starget:'',
            currpage:1,
            pagesize:10,
            pageTotal:0,
            modifydata:{
                name:'',
                rank:false,
                gest:false
            },
            smbform:{
                name:'',
                path:'',
                user:'',
                doc:'',
                newname:'',
                rank:false,
                // pwd:'',
                gest:false
            },
            smbrule:{
                name:[
                    {required:true,message:this.$t('smb.input'), trigger: 'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'},
                    {min:2,message:this.$t('smb.input3'),trigger:'blur'}
                ],
                path:[
                    {required:true,message:this.$t('smb.input1'), trigger: 'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'},
                    {min:3,message:this.$t('smb.inout2'),trigger:'blur'}
                ],
                user:[
                    {required:true,message:this.$t('smb.input2'), trigger: 'blur'}
                ],
                doc:[
                    {required:true,message:this.$t('nfs.input6'), trigger: 'blur'}
                ],
                newname:[
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'}
                ]
                // pwd:[
                //     {validator:pwdcheck, trigger: 'blur'}
                // ]
            }
        }
    },
    mounted(){
        this.getsmb()
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
        getsmb(){
            var _this=this
            this.$axios.get(this.$host+'smb').then(res=>{
                // _this.smbdata=res.data.data
                var c=res.data.data
                var s =[]
                for(let i=0;i<c.length;i++){
                    var ss={}
                    ss.name=c[i].name
                    ss.path=c[i].data.path
                    if (c[i].data.writable == 'yes')
                        ss.writable='rw'
                    else
                        ss.writable='ro'
                    if(c[i].data.public==undefined)
                        ss.guest='no'
                    else
                        ss.guest=c[i].data.public
                    s.push(ss)
                }
                _this.smbdata=s
                _this.pageTotal = _this.smbdata.length
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'vd').then(res=>{
                _this.docdata=res.data.data
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'users').then(res=>{
                var users=[]
                for(let i=0;i<res.data.data.length;i++){
                    if (res.data.data[i].last_name=='samba')
                        users.push(res.data.data[i].username)
                }
                _this.user = users
            }).catch(error=>{
                console.log(error)
            })
        },
        smbsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'smb',{name:_this.smbform.name,user:_this.smbform.user,writable:_this.smbform.rank,path:_this.smbform.path,security:_this.smbform.gest,lvm:_this.smbform.doc}).then(res=>{
                        _this.createsmb=false
                        if(res.data.success){
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else{
                            _this.$message.error(res.data.msg)
                        }
                        _this.getsmb()
                        _this.smbreset('smbform')
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
                    _this.$axios.put(this.$host+'smb',{oldname:_this.modifydata.name,newname:_this.modifydata.newname,writable:_this.modifydata.rank,security:_this.modifydata.gest}).then(res=>{
                        _this.smbmodi=false
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
                        _this.getsmb()
                        _this.smbreset('smbform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },  
        changegest(state){
            this.gestsate=state
        },
        sremove(){
            this.$axios.delete(this.$host+'smb',{data:{name:this.starget}}).then(res=>{
                this.smbremove=false
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
                this.getsmb()
                this.smbreset('smbform')
            }).catch(error=>{
                console.log(error)
            })
        },
        modifysmb(row){
            this.modifydata.name=row.name
            if (row.writable == 'rw')
                this.smbform.rank=true
            else
                this.smbform.rank=false
            if (row.guest == 'yes')
                this.smbform.gest=true
            else
                this.smbform.gest=false
            this.modifydata.newname = row.name
            this.smbmodi=true
        },
        deletesmb(row){
            this.smbremove=true
            this.starget=row.name
        },
        smbreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['smbform'].resetFields();
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
