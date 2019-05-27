<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>聚合管理</span>
            </div>
            <el-row class='main_table'>
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                    <el-alert type="error" title="操作失败" show-icon id='error_tip' :closable='false' center style='display:none'></el-alert>
                    <el-alert type="success" title="操作成功" show-icon id='success_tip' :closable='false' center style='display:none'></el-alert>
                    <el-col :xs='1' :sm='1' :md='1' :lg='1' :xl='1' :offset='21' style='margin-bottom:.5em'>
                        <el-button type='primary' @click='createuser = true' :disabled="bondcan">聚合</el-button>
                    </el-col>
                    <el-col :xs='1' :sm='1' :md='1' :lg='1' :xl='1' :offset='1' style='margin-bottom:.5em'>
                        <el-button type='warning' @click='createuser = true' :disabled="unbondcan">解聚</el-button>
                    </el-col>
                    <el-table ref='multipleTable' :data='bonddata.slice((currpage - 1) * pagesize, currpage * pagesize)' tooltip-effect="dark" style='width:100%' height="400" @selection-change="selectrow">
                        <el-table-column type='selection' width="55"></el-table-column>
                        <el-table-column label="网口" prop='interface'></el-table-column>
                        <el-table-column label="IP地址" prop='ip'></el-table-column>
                        <el-table-column label="子网掩码" prop='mask'></el-table-column>
                        <el-table-column label="MAC地址" prop='mac'></el-table-column>
                        <el-table-column label="DNS" prop='dns'></el-table-column>
                        <el-table-column label="状态" prop='state'></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import headerBar from '../common/headerBar'
export default {
    name:'bond',
    components:{headerBar},
    data(){
        return{
            bonddata:[],
            bondcan:true,
            unbondcan:true,
            pagesize: 5,
            currpage: 1,
            multiplesletion:[]
        }
    },
    mounted() {
        this.netget()
    },
    methods: {
        netget(){
            var _this=this
            this.$axios.get(this.$host+'network').then(res=>{
                _this.bonddata=res.data.interfaces.interfaces
            }).catch(error=>{
                console.log(error)
            })
        },
        selectrow(val){
            this.multiplesletion = val
            console.log(this.multiplesletion)
        }
    },  
}
</script>
<style>

</style>