<template>
    <div class="content">
        <div>
            <div class="tip_bg">
                <span class="tip">{{$t('message.logical')}}</span>
            </div>
            <el-row class="main_table">
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-row style='margin-bottom:.5em;float:right'>
                        <el-tooltip :content="$t('message.add')" placement="bottom"><el-button type='primary' icon="el-icon-circle-plus" size='small' @click='createlv = true'></el-button></el-tooltip>
                    </el-row>
                    <el-table :data="lvdata.slice((currpage - 1)*pagesize,currpage * pagesize)" border  class="table_cell" style='width:100%;min-height:310px;max-height:100%' >
                        <el-table-column :label="$t('lv.name')" prop='name'></el-table-column>
                        <el-table-column :label="$t('lv.pool')" prop='vg_name'></el-table-column>
                        <el-table-column prop='state'>
                            <template slot="header" slot-scope="scope">
                                <span>{{$t('message.state')}}</span>
                                <el-popover
                                    placement="top-start"
                                    :title="$t('message.note')"
                                    trigger="hover"
                                    content="unkonw:无法识别,available:可用,inactive:无效">
                                    <el-button slot="reference" type="info" size='mini' circle style="margin-left:1em"><i class="el-icon-question" ></i></el-button>
                                </el-popover>
                            </template>
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.state === 'available' ? 'success' : 'warning'">{{scope.row.state}}</el-tag>
                                
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('lv.path')" prop='path' width="200"></el-table-column>
                        <el-table-column :label="$t('lv.capacity')" prop='size'></el-table-column>
                        <el-table-column :label="$t('message.oper')" width="200">
                            <template slot-scope='scope'>
                                <el-tooltip :content="$t('message.expend')" placement="bottom"><el-button type='warning' icon='el-icon-kuozhan iconfont' size='mini' @click="lvmodify(scope.row)"></el-button></el-tooltip>
                                <el-tooltip :content="$t('message.delete')" placement="bottom"><el-button type='danger' icon='el-icon-delete' size='mini' @click="lvdelete(scope.row)"></el-button></el-tooltip>
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
            <el-dialog :title="$t('lv.new')" :visible.sync="createlv" width="35%" center :close-on-click-modal="false" :before-close="headleClose">
                <el-form :model="lvform" :rules='lvrule' ref='lvform' label-width="140px" label-position="left" class='demo-ruleForm'>
                    <el-form-item :label="$t('lv.name')" prop='name'>
                        <el-input v-model="lvform.name" :placeholder="$t('lv.input')" clearable ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('lv.pool')" prop='pool'>
                        <el-select v-model="lvform.pool" :placeholder="$t('lv.input1')" @change="uintchange(lvform)">
                          <el-option v-for="p in pooldata" :key="p.name" :value="p.name">{{p.name}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.size')" prop='size' >
                        <el-input v-model="lvform.size" type='number' :placeholder="$t('lv.input2')" clearable ></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.uint')" prop="uint" >
                        <el-select v-model="lvform.uint" :placeholder="$t('lv.input3')" >
                          <el-option v-for="u in uintdata" :key="u" :value='u'>{{u}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('lv.pool_ca')" prop='poolfree'>
                        <el-input v-model="poolfree" :disabled="true" ></el-input>   
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addsubmit('lvform')" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.submit')}}</el-button>
                        <el-button @click="lvreset('lvform')">{{$t('message.reset')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('message.expend')" :visible.sync="lvextend" width="35%" center :close-on-click-modal="false" :before-close="headleClose">
                <el-form :model="lvform" :rules="lvrule" ref="lvform" label-width="150px" label-position="left" class="demo-Form">
                  <el-form-item :label="$t('lv.now')">
                      {{rowdata}}
                  </el-form-item>
                  <el-form-item :label="$t('lv.avli')">
                      {{poolfree}}
                  </el-form-item>
                  <el-form-item :label="$t('lv.e_size')" prop="expand">
                      <el-input v-model="lvform.expand" type='number' :placeholder="$t('lv.input4')" style='width:80%' clearable ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lv.e_uint')" prop='expanduint'>
                        <el-select v-model="lvform.expanduint" :placeholder="$t('lv.input5')" >
                            <el-option v-for="i in uintdata" :key="i" :value='i'>{{i}}</el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item>
                        <el-button type="primary" @click="expandsubmit('lvform')" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.submit')}}</el-button>
                        <el-button @click="lvreset('lvform')">{{$t('message.reset')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('lv.delete')" :visible.sync="lvremove" width="30%" center :close-on-click-modal="false">
                <p>{{$t('lv.delete')}}：{{lvtarget}}?</p>
                <el-button type="primary" @click='deletelv()'>{{$t('message.sure')}}</el-button>
                <el-button @click='lvremove=false'>{{$t('message.cancel')}}</el-button>
            </el-dialog>
        </div>
    </div>    
</template>
<script>
export default {
    name:'lv',
    data(){
        return{
            createlv:false,
            lvdata:[],
            pagesize: 5,
            currpage: 1,
            pageTotal: 0,
            pooldata:[],
            uintdata:['M','G','T'],
            lvform:{
                name:'',
                pool:'',
                size:'',
                uint:'',
                expand:'',
                expanduint:''
            },
            lvrule:{
                name:[
                    {required:true,message:this.$t('pool.input'), trigger: 'blur'},
                    {pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'},
                    {min:3,message:this.$t('pool.input1'),trigger:'blur'}
                ],
                pool:[
                    {required:true,message:this.$t('lv.input1'), trigger: 'blur'},
                ],
                size:[
                    {required:true,message:this.$t('lv.input2'), trigger: 'blur'},
                ],
                uint:[
                    {required:true,message:this.$t('lv.input3'), trigger: 'blur'}
                ],
                expand:[
                    {required:true,message:this.$t('lv.input4'), trigger: 'blur'}
                ],
                expanduint:[
                    {required:true,message:this.$t('lv.input3'), trigger: 'blur'}
                ]
            },
            rowdata:'',
            lvextend:false,
            poolfree:'',
            lvremove:false,
            lvtarget:'',
            fullscreenLoading: false
        }
    },
    mounted(){
        this.getlv()
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
        getlv(){
            var _this=this
            this.$axios.get(this.$host+'vd').then(res=>{
                _this.lvdata=res.data.data
                _this.pageTotal = _this.lvdata.length
                for (let i in _this.lvdata){
                    if(_this.lvdata[i].state==0){
                        _this.lvdata[i].state='unknow'
                    }
                    else if(_this.lvdata[i].state==1){
                        _this.lvdata[i].state='available'
                    }
                    else if(_this.pooldata[i].state==2){
                        _this.lvdata[i].state='inactive'
                    }
                }
            }).catch(error=>{
                console.log(error)
            })
            this.$axios.get(this.$host+'pool').then(res=>{
                var pp=[]
                for(let i=0;i<res.data.data.length;i++){
                    var pools={}
                    pools.name=res.data.data[i].vg_name
                    pools.capacity=res.data.data[i].vg_size
                    pp.push(pools)
                }
                _this.pooldata = pp
            }).catch(error=>{
                console.log(error)
            })
        },
        lvmodify(row){
            this.lvtarget=row
            this.rowdata=row.size[0]+row.size[1]
            for(let i=0;i<this.pooldata.length;i++){
                console.log(this.pooldata)
                if(this.pooldata[i].name==row.vg_name){
                    this.poolfree=this.pooldata[i].capacity
                }
            }
            this.lvextend=true
        },
        headleClose(done){
            done();
            this.$refs['lvform'].resetFields();
            this.poolfree=''
        },
        lvreset(formname){
            this.$refs[formname].resetFields();
            this.poolfree=''
        },
        addsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                    });
                    var allsize=_this.lvform.size+_this.lvform.uint
                    _this.$axios.post(this.$host+'vd',{name:_this.lvform.name,pool:_this.lvform.pool,size:allsize}).then(res=>{
                        _this.createlv=false
                        if(res.data.success){
                            loading.close();
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            loading.close();
                            _this.$message.error(res.data.msg)
                        }
                        _this.getlv()
                        _this.lvreset('lvform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        uintchange(val){
            for(var i=0;i<this.pooldata.length;i++){
                if(this.pooldata[i].name==val.pool){
                    this.poolfree=this.pooldata[i].capacity
                    
                }
            }
            // this.poolfree=val
        },
        expandsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                    });
                    var expendsize=_this.lvform.expand+_this.lvform.expanduint
                    _this.$axios.put(this.$host+'vd',{pool:_this.lvtarget.vg_name,path:_this.lvtarget.path,size:expendsize}).then(res=>{
                         _this.lvextend=false
                        if(res.data.success){
                            loading.close();
                            _this.$message({
                                message:this.$t('message.success'),
                                type:'success',
                                offset:''
                            })
                        }
                        else if(!res.data.success){
                            loading.close();
                            _this.$message.error(res.data.msg)
                        }
                        _this.getlv()
                        _this.lvreset('lvform')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        lvdelete(name){
            this.lvtarget=name.path
            this.lvremove=true
        },
        deletelv(){
            var _this=this
            this.$axios.delete(this.$host+'vd',{data:{name:_this.lvtarget}}).then(res=>{
                _this.lvremove=false
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
                _this.getlv()
                _this.lvreset('lvform')
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

