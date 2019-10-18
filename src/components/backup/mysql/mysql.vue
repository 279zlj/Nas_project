<template>
    <div class="content">
        <div class="tip_bg">
            <span class="tip">MySQL 数据库备份</span>
        </div>
        <el-row class="main_table">
            <el-col :xs='20' :sm='20' :md='20' :xl='20' :offset="2">
                <el-row style="margin-bottom:.5em;float:right">
                    <el-tooltip :content="$t('message.add')" placement="bottom">
                        <el-button type="primary" icon='el-icon-circle-plus' size="small" @click="createback = true"></el-button>
                    </el-tooltip>
                </el-row>
                <el-table :data='mysqldata.slice((currpage - 1)*pagesize,currpage*pagesize)' boder class="table_cell" style='width:100%;min-height:310px;max-height'>
                    <el-table-column label="IP" prop="host"></el-table-column>
                    <el-table-column label="用户名" prop="user"></el-table-column>
                    <el-table-column label="端口号" prop="port"></el-table-column>
                    <el-table-column label="密码" prop="pwd"></el-table-column>
                    <el-table-column :label="$t('message.oper')" width="200">
                        <template slot-scope="scope">
                            <el-tooltip content="备份" placement="bottom">
                                <el-button type="warning" size="mini" icon='el-icon-dbsshujukubeifenDBS iconfont' @click="backup = true"></el-button>
                            </el-tooltip>
                            <el-tooltip content="恢复" placement="bottom">
                                <el-button type="success" size="mini" icon='el-icon-beifenhuifu iconfont' @click="recovery = true"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="total,sizes,prev,pager,next,jumper"
                @size-change='handleSizeChange'
                @current-change='handleCurrentChange'
                :page-sizes="[5,10]"
                :page-size="pagesize"
                :total="pageTotal"
                style="text-align:right;margin:1em"
                ></el-pagination>
            </el-col>
            <el-dialog title="创建MySQL数据库备份" :visible.sync="createback" width="45%" center :before-close="handleClose" :close-on-click-modal="false">
                <el-form :model="sqlform" :rules="sqlrule" label-position="left" label-width="130px" class="demo-ruleForm">
                    <el-form-item label="服务器IP" prop="ip">
                        <el-input v-model="sqlform.ip" placeholder="请输入服务器IP"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="sqlform.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input v-model="sqlform.pwd" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="端口号" prop="port">
                        <el-input v-model="sqlform.port" placeholder="请输入端口号" type='number'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="backsubmit('sqlform')">{{$t('message.submit')}}</el-button>
                        <el-button @click="backreset('sqlform')">{{$t('message.reset')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title="数据库备份" :visible.sync="backup" width="45%" center :before-close="handleClose" :close-on-click-modal="false">
                <el-form :model="sqlform" :rules="sqlrule" label-position="left" label-width="130px" class="demo-ruleForm">
                    
                    <el-form-item label="数据库名" prop="">

                    </el-form-item>
                    <el-form-item label="文件名" prop="">

                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-row>
    </div>
</template>
<script>
export default {
    name:'mysql',
    data(){
        return{
            createback:false,
            backup:false,
            recovery:false,
            mysqldata:[
                {host:'1312321312',user:'adasdd',port:'23123',pwd:'dasdasd23142'}
            ],
            currpage:1,
            pagesize:5,
            pageTotal:0,
            sqlform:{
                ip:'',
                name:'',
                pwd:'',
                port:''
            },
            sqlrule:{
                ip:[],
                name:[],
                pwd:[],
                port:[]
            }
        }
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
        backsubmit(name){

        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
        backreset(formname){
            this.$refs[formname].resetFields();
        },
    }
}
</script>