<template>
        <div class='content'>
        <headerBar></headerBar>
        <div class="tip_bg">
            <span class='tip'>AFP {{$t('message.file')}}</span>
        </div>
        <div>
            <el-row class='main_table'>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-alert type="error" :title="$t('message.failed')" show-icon id='error_tip' :closable='false' center ></el-alert>
                    <el-alert type="success" :title="$t('message.success')" show-icon id='success_tip' :closable='false' center ></el-alert>
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createafp = true'></el-button></el-tooltip>
                    </el-row>
                    <el-table :data='afpdata.slice((currpage - 1) * pagesize, currpage*pagesize)' border  class="table_cell" style='width:100%;min-height:310px;max-height:100%'>
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
                    :total="afpdata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
              </el-col>
            </el-row>
            <el-dialog :title="$t('afp.new')" :visible.sync="createafp" width="30%" center :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="afpform" ref='afpform' :rules="afprule" label-width="30" class="demo-ruleForm">
              <el-form-item :label="$t('afp.name')" prop='name'>
                  <el-input v-model="afpform.name" :placeholder="$t('afp.input')" style='width:80%'></el-input>
              </el-form-item>
              <el-form-item :label="$t('afp.p_name')" prop='path'>
                  <el-input v-model="afpform.path" :placeholder="$t('afp.input1')" style='width:80%'></el-input>
              </el-form-item>
              <el-form-item :label="$t('afp.user')" prop='user'>
                  <el-select v-model="afpform.user" :placeholder="$t('afp.input2')">
                    <el-option v-for="u in user" :key="u" :value="u">{{u}}</el-option>
                  </el-select>
              </el-form-item>
              <!-- <el-form-item label="密码" prop='pwd'>
                  <el-input v-model="afpform.pwd" type='password' placeholder="请输入密码" style="width:80%"></el-input>
              </el-form-item> -->
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
import headerBar from '../../common/headerBar'
export default {
    name:'afp',
    components:{headerBar},
    data(){
        var checkname=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入名称'))
            }
            else
                callback()
        }
        var checkpath=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请输入路径名称'))
            }
            else{
                if(val.length<2){
                    return callback(new Error('请输入长度超过2的路径名称'))
                }
                else
                    callback()
            }
        }
        var checkuser=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择用户'))
            }
            else{
                callback()
            }
        }
        // var checkpwd=(rule,val,callback)=>{
        //     if(!val){
        //         return callback(new Error('请输入密码'))
        //     }
        //     else{
        //         callback()
        //     }
        // }
        return{
            createafp:false,
            afpremove:false,
            afpdata:[],
            atarget:'',
            currpage:1,
            pagesize:5,
            user:[],
            afpform:{
                name:'',
                path:'',
                user:'',
                // pwd:''
            },
            afprule:{
                name:[
                    {validator:checkname, trigger:'blur'}
                ],
                path:[
                    {validator:checkpath, trigger:'blur'}
                ],
                user:[
                    {validator:checkuser, trigger:'blur'}
                ],
                // pwd:[
                //     {validator:checkpwd, trigger:'blur'}
                // ]
            }
        }
    },
    mounted(){
        this.getafp()
    },
    methods:{
        getafp(){
            var _this=this
            this.$axios.get(this.$host+'afp').then(res=>{
                _this.afpdata=res.data.data
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'users').then(res=>{
                var users=[]
                for(let i=0;i<res.data.data.length;i++){
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
                    _this.$axios.post(this.$host+'afp',{name:_this.afpform.name,path:_this.afpform.path,user:_this.afpform.user}).then(res=>{
                        _this.createafp=false
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

