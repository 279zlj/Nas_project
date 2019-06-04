<template>
    <div class="content">
        <headerBar></headerBar>
        <div>
            <div class="tip_bg">
                <span class='tip'>{{$t('message.disk')}}</span>
            </div>
            <el-row class='other_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-table :data='diskdata.slice((currpage - 1)*pagesize,currpage*pagesize)' border cell-style="padding:.7em" style='width:100%;min-height:310px;max-height:100%'>
                        <el-table-column :label="$t('disk.name')" prop="path"></el-table-column>
                        <el-table-column :label="$t('disk.used')" prop='used'></el-table-column>
                        <el-table-column :label="$t('disk.format')" prop='filesystem'></el-table-column>
                        <el-table-column :label="$t('disk.capacity')" prop='size'></el-table-column>
                        <el-table-column :label="$t('message.state')" prop='health'>
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.health === 'PASSED' ? 'success' : 'warning'" disable-transitions>{{scope.row.health}}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10]"
                    :page-size="pagesize"
                    :total="diskdata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import headerBar from '../common/headerBar'
export default {
    name:'disk',
    components:{headerBar},
    data(){
        return{
            diskdata:[],
            currpage:1,
            pagesize:5,
        }
    },
    mounted(){
        this.getdisk()
    },
    methods:{
        getdisk(){
            this.$axios.get(this.$host+'disks').then(res=>{
                var data=res.data.data
                for(let i=0;i<data.length;i++){
                    if(data[i].health==undefined)
                        data[i].health='unkown'
                    if(data[i].size==undefined)
                        data[i].size='—'
                }
                this.diskdata=data

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