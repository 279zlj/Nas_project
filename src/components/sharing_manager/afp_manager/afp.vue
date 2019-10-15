<template>
        <div class='content'>
        <div class="tip_bg">
            <span class='tip'>AFP {{$t('message.file')}}</span>
        </div>
        <div>
            <el-row class='main_table'>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createafp = true'></el-button></el-tooltip>
                    </el-row>
                    <el-table :data='afpdata.slice((currpage - 1) * pagesize, currpage*pagesize)' border :header-cell-style="getRowClass" class="table_cell" style='width:100%;min-height:310px;max-height:100%'>
                        <el-table-column :label="$t('afp.name')" prop='name'></el-table-column> 
                        <el-table-column :label="$t('afp.path')" prop='path'></el-table-column>
                        <el-table-column :label="$t('message.oper')">
                            <template slot-scope="scope">
                                <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type="danger" icon='el-icon-delete' size='mini' @click="deleteafp(scope.row)"></el-button></el-tooltip>
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
            <el-dialog :title="$t('afp.new')" :visible.sync="createafp" width="35%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="afpform" ref='afpform' :rules="afprule" label-width="130px" label-position="left" class="demo-ruleForm">
              <el-form-item :label="$t('afp.name')" prop='name'>
                  <el-input v-model="afpform.name" :placeholder="$t('afp.input')" clearable  ></el-input>
              </el-form-item>
              <el-form-item :label="$t('afp.p_name')" prop='path'>
                  <el-input v-model="afpform.path" :placeholder="$t('afp.input1')" clearable ></el-input>
              </el-form-item>
              <el-form-item :label="$t('afp.user')" prop='user'>
                  <el-select v-model="afpform.user" :placeholder="$t('afp.input2')">
                    <el-option v-for="u in user" :key="u" :value="u">{{u}}</el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('iscsi.logic')" prop='doc'>
                  <el-select v-model="afpform.doc" :placeholder="$t('message.select')">
                    <el-option v-for="i in docdata" :key="i.path" :value="i.path">{{i.name}}</el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                      <el-button type="primary" @click="afpsubmit('afpform')">{{$t('message.submit')}}</el-button>
                      <el-button @click="afpreset('afpform')">{{$t('message.reset')}}</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('afp.delte')" :visible.sync="afpremove" width="30%" center :close-on-click-modal="false">
            <p>{{$t('afp.delte')}}：{{atarget}}?</p>
            <el-button type="primary" @click='aremove()'>{{$t('message.sure')}}</el-button>
            <el-button @click='afpremove=false'>{{$t('message.cancel')}}</el-button>
        </el-dialog>
        </div>
    </div>    
</template>
<script>
export default {
    name:'afp',
    data(){
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            createafp:false,
            afpremove:false,
            afpdata:[],
            atarget:'',
            currpage:1,
            pagesize:5,
            pageTotal:0,
            user:[],
            docdata:[],
            afpform:{
                name:'',
                path:'',
                user:'',
                doc:''
                // pwd:''
            },
            afprule:{
                name:[
                    {required:true,message:this.$t('smb.input'), trigger:'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'}
                ],
                path:[
                    {required:true,message:this.$t('smb.input1'), trigger:'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'},
                    {min:2,message:this.$t('smb.input3'),trigger:'blur'}
                ],
                user:[
                    {required:true,message:this.$t('afp.input2'), trigger:'blur'}
                ],
                doc:[
                    {required:true,message:this.$t('message.input'), trigger: 'blur'}
                ]
                // pwd:[
                //     {validator:checkpwd, trigger:'blur'}
                // ]
            }
        }
    },
    mounted(){
        this.getafp()
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
        getafp(){
            var _this=this
            this.$axios.get(this.$host+'afp').then(res=>{
                _this.afpdata=res.data.data
                _this.pageTotal=_this.afpdata.length
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
                    if (res.data.data[i].last_name=='afp')
                        users.push(res.data.data[i].username)
                }
                _this.user = users
            }).catch(error=>{
                console.log(error)
            })
        },
        deleteafp(row){
            this.afpremove=true
            this.atarget=row.name
        },
        handleClose(done){
            done();
            this.$refs['afpform'].resetFields()
        },
        afpsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'afp',{name:_this.afpform.name,path:_this.afpform.path,user:_this.afpform.user,lvm:_this.afpform.doc}).then(res=>{
                        _this.createafp=false
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
                        _this.getafp()
                        _this.afpreset('afpform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        afpreset(formname){
            this.$refs[formname].resetFields();
        },
        aremove(){
            this.$axios.delete(this.$host+'afp',{data:{name:this.atarget}}).then(res=>{
                this.afpremove=false
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
                this.getafp()
                this.afpreset('afpform')
            }).catch(error=>{
                console.log(error)
            })
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

