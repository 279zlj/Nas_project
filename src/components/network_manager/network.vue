<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>网络设置</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-alert type="error" title="操作失败" show-icon id='error_tip' :closable='false' center style='display:none'></el-alert>
                <el-alert type="success" title="操作成功" show-icon id='success_tip' :closable='false' center style='display:none'></el-alert>
                <el-table :data='netdata.slice((currpage - 1) * pagesize, currpage * pagesize)' height='400' border style='width:100%'>
                    <el-table-column label="网口" prop='interface'></el-table-column>
                    <el-table-column label="IP地址" prop='ip'></el-table-column>
                    <el-table-column label="子网掩码" prop='mask'></el-table-column>
                    <el-table-column label="MAC地址" prop='mac'></el-table-column>
                    <el-table-column label="DNS" prop='dns'></el-table-column>
                    <el-table-column label="状态" prop='state'></el-table-column>
                    <el-table-column label="操作" width:='150'>
                        <template slot-scope='scope'>
                            <el-tooltip content="修改" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifynet(scope.row)'></el-button></el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                </el-col>
            </el-row>
        </div>
    </div>
    
</template>
<script>
import headerBar from '../common/headerBar'
export default {
    name:'network',
    components:{headerBar},
    data(){
        return{
            netdata:[],
            pagesize: 5,
            currpage: 1,
        }
    },
    mounted() {
        this.netget()
    },
    methods: {
        netget(){
            var _this=this
            this.$axios.get(this.$host+'network').then(res=>{
                _this.netdata=res.data.interfaces.interfaces
            }).catch(error=>{
                console.log(error)
            })
        }
    },
}
</script>
<style>

</style>