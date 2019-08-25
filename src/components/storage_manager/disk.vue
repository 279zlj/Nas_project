<template>
    <div class="content">
        <div>
            <div class="tip_bg">
                <span class='tip'>{{$t('message.sysdisk')}}</span>
            </div>
            <el-row class='other_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-table :data='diskdata.slice((currpage - 1)*pagesize,currpage*pagesize)' border  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="table_cell" style='width:100%;min-height:310px;max-height:100%'>
                        <el-table-column :label="$t('disk.name')" prop="path"></el-table-column>
                        <el-table-column :label="$t('disk.used')" prop='used'></el-table-column>
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
import {change} from '../../assets/change_size'
export default {
    name:'disk',
    data(){
        return{
            diskdata:[],
            currpage:1,
            pagesize:5,
            loading: true
        }
    },
    mounted(){
        this.getdisk()
    },
    methods:{
        getdisk(){
            this.$axios.get(this.$host+'disks').then(res=>{
                var data=res.data.data
                this.loading=false
                for(let i=0;i<data.length;i++){
                    if(data[i].health==undefined)
                        data[i].health='unkown'
                    if(data[i].size==undefined)
                        data[i].size='—'
                    if (data[i].path.indexOf('md') != -1)
                        data[i].size=change(data[i].size)
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