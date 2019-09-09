<template>
    <div>
        <el-table :data='deldata.slice((currpage - 1) * pagesize,currpage * pagesize)' border class="table_cell" style="width:100%;min-height:310px;max-height:100%">
            <el-table-column :label="$t('backup.ff')" prop="filename"></el-table-column>
            <el-table-column :label="$t('backup.ff1')" prop="time"></el-table-column>
            <el-table-column :label="$t('message.oper')">
                <template slot-scope="scope">
                    <el-button type='danger' size="small" @click="delsure(scope.row.filename)">{{$t('message.delete')}}</el-button>
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
    </div>
</template>
<script>
export default {
    name:'delfile',
    data(){
        return{
            deldata:[],
            pagesize: 5,
            currpage: 1,
            pageTotal:0
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
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
        delsure(name){
            this.$message()
        },
    }
}
</script>