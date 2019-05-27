<template>
    <div class="content">
        <headerBar></headerBar>
        <div>
            <div class="tip_bg">
                <span class='tip'>磁盘信息</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-table :data='diskdata' height="400" style='width:100%'>
                        <el-table-column label="名称" prop="path"></el-table-column>
                        <el-table-column label="使用状态" prop='used'></el-table-column>
                        <el-table-column label="是否存在FS" prop='filesystem'></el-table-column>
                        <el-table-column label="容量" prop='avli'></el-table-column>
                        <el-table-column label="状态" prop='status'></el-table-column>
                    </el-table>
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
            diskdata:[]
        }
    }
}
</script>
<style>

</style>