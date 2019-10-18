<template>
    <div>
        <div>
          <el-button type='primary' size="small" style='float:right;margin-bottom:.5em' @click="chosse = true">{{$t('backup.select4')}}</el-button>
        </div>
        <el-table :data='deldata.slice((currpage - 1) * pagesize,currpage * pagesize)' :header-cell-style="getRowClass" border class="table_cell" style="width:100%;min-height:310px;max-height:100%">
            <el-table-column :label="$t('backup.ff')" prop="file"></el-table-column>
            <el-table-column :label="$t('backup.ff1')" prop="time"></el-table-column>
            <el-table-column :label="$t('message.oper')">
                <template slot-scope="scope">
                    <el-button type='danger' size="small" @click="delsure(scope.row)">{{$t('message.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5]"
        :page-size="pagesize"
        :total="pageTotal" style="text-align: right;margin: 1em">
        </el-pagination>
        <el-dialog :title="$t('backup.select4')" :visible.sync="chosse"  width="30%" :before-close="handleClose">
          <el-form :model="pathdata" :rules="pathrule" ref="pathdata" label-width="100px" label-position="left" class="demo-ruleForm" >
            <el-form-item :label="$t('backup.path')" prop="user">
                <el-select v-model="pathdata.user" :placeholder="$t('backup.select4')">
                  <el-option v-for="u in user" :key="u" :value="u" :label="u"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="pathsubmit('pathdata')">{{$t('message.submit')}}</el-button>
                <el-button @click="pathreset('pathdata')">{{$t('message.reset')}}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'delfile',
    data(){
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            deldata:[],
            pagesize: 5,
            currpage: 1,
            pageTotal:0,
            chosse:false,
            user:[],
            pathdata:{
              user:''
            },
            pathrule:{
              user:[
                {rquired:true,message:this.$t('backup.select5'),trigger:'blur'}
              ]
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
    mounted(){
      this.getdata()
    },
    methods:{
        getdata(){
          this.$axios.get(this.$host+'backuser').then(res=>{
                this.user = res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        handleClose(done){
            done();
            this.$refs['pathdata'].resetFields();
        },
        pathreset(formname){
          this.$refs[formname].resetFields();
        },
        pathsubmit(formname){
          this.$refs[formname].validate((valid)=>{
            if(valid){
              this.$axios.post(this.$host+'sbackfile',{backpath:this.pathdata.user}).then(res=>{
                if(res.data.success){
                  this.deldata=res.data.msg
                  this.pageTotal=res.data.msg.length
                  this.chosse=false
                }
              }).catch(error=>{
                console.log(error)
              })
            }
          })
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
        getsome(user){
          this.$axios.post(this.$host+'sbackfile',{backpath:user}).then(res=>{
            if(res.data.success){
              this.deldata=res.data.msg
              this.pageTotal=res.data.msg.length
            }
          }).catch(error=>{
            console.log(error)
          })
        },
        delsure(name){
            this.$confirm( this.$t('backup.tips1'), this.$t('message.tips'), {
              confirmButtonText: this.$t('message.sure'),
              cancelButtonText: this.$t('message.cancel'),
              type: 'warning'
            }).then(() => {
              this.$axios.delete(this.$host+'sbackfile',{data:{filepath:name.filepath}}).then(res=>{
                if(res.data.success){
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });
                  this.getsome(this.pathdata.user)
                }
                else{
                  this.$message.error(res.data.msg)
                }
              })
              // console.log(name.filepath)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('message.cancel')
              });          
            });
        },
    }
}
</script>