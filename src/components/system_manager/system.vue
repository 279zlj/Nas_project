<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>系统信息</span>
            </div>
            <el-row class='main'>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-setting'></i>
                            <span>基础信息</span>
                        </div>
                        <div>
                            <p class='basic_info'>版本：<span>{{version}}</span></p>
                            <p class='basic_info'>型号：<span>{{model}}</span></p>
                            <p class='basic_info'>供应商：<span>{{vendor}}</span></p>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-date'></i>
                            <span>时间设置</span>
                        </div>
                        <div>
                            <el-alert type="error" title="操作失败" show-icon center :closable='false' style='display:none' id='error_tip'></el-alert>
                            <el-alert type="success" title="操作成功" show-icon center :closable='false' style='display:none' id='success_tip'></el-alert>
                            <el-date-picker v-model="datetime" placeholder="选择日期" type='datetime' value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker>
                            <el-button type='primary' @click='datesave()'>保存</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class='main'>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-cpu iconfont'></i>
                            <span>CPU利用率(%)</span>
                        </div>
                        <cpucharts></cpucharts>
                    </el-card>
                </el-col>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-neicun iconfont'></i>
                            <span>内存利用率(%)</span>
                        </div>
                        <menorycharts></menorycharts>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import headerBar from '../common/headerBar'
import cpucharts from './charts/cpucharts'
import menorycharts from './charts/menorycharts'
export default {
    name:'syetem',
    components:{cpucharts,menorycharts,headerBar},
    data(){
        return{
            datetime:'',
            version:'',
            model:'',
            vendor:''
        }
    },
    mounted() {
        this.system_info()    
        console.log(this.$host+'sysinfo')    
    },
    methods:{
        system_info(){
            var _this=this
            this.$axios.get(this.$host+'sysinfo').then(function(res){
                _this.version = res.data.sysinfo.version
                _this.model = res.data.sysinfo.model
                _this.vendor = res.data.sysinfo.vendor
            }).catch(function(error){
                console.log(error)
            })
        },
        datesave(){
            this.$axios.post(this.$host+'datetime',{date:this.datetime}).then(function(res){
                if(res.data.status=='OK'){
                    $('#success_tip').css({'display':'flex'})
                    setTimeout(function(){
                        $('#success_tip').css({'display':'none'})
                    },3000)
                }
                else{
                    $('#error_tip').css({'display':'flex'})
                    setTimeout(function(){
                        $('#error_tip').css({'display':'none'})
                    })
                }
            }).catch(function(error){
                console.log(error)
            })
        }
    }
}
</script>
<style>
.basic_info{
    font-weight:700;
}
</style>