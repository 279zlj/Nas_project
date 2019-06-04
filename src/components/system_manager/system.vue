<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.system')}}</span>
            </div>
            <el-row class='main'>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-setting'></i>
                            <span>{{$t('sys.basic')}}</span>
                        </div>
                        <div>
                            <p class='basic_info'>{{$t('sys.version')}}：<span>{{sysinfo.bannel}}</span></p>
                            <p class='basic_info'>{{$t('sys.model')}}：<span>{{sysinfo.model}}</span></p>
                            <p class='basic_info'>{{$t('sys.suppliers')}}：<span>{{sysinfo.vendor}}</span></p>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-icon01 iconfont'></i>
                            <span>{{$t('sys.hardware')}}</span>
                        </div>
                        <div>
                            <!-- <el-alert type="error" title="操作失败" show-icon center :closable='false' style='display:none' id='error_tip'></el-alert>
                            <el-alert type="success" title="操作成功" show-icon center :closable='false' style='display:none' id='success_tip'></el-alert>
                            <el-form :model="timedata" :rules="timerule" ref='timedata' label-width="30" class='demo-form-inline' :inline="true">
                              <el-form-item label="日期" prop='date'>
                                  <el-date-picker v-model="timedata.date" placeholder="选择日期" type='datetime' value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker>
                              </el-form-item>
                              <el-form-item>
                                  <el-button type='primary' @click="datesave('timedata')">保存</el-button>
                              </el-form-item>
                            </el-form> -->
                            <p class="basic_info">{{$t('sys.kernel')}}：<span>{{sysinfo.kernel}}</span></p>
                            <p class="basic_info">{{$t('sys.board')}}：<span>{{sysinfo.board}}</span></p>
                            <p class="basic_info">{{$t('sys.cpu')}}：<span>{{sysinfo.cpu_module}}</span></p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class='main'>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-cpu iconfont'></i>
                            <span>{{$t('sys.cpu_used')}}(%)</span>
                        </div>
                        <!-- <cpucharts v-bind:data="allnum"></cpucharts> -->
                        <div id='cpu'></div>
                    </el-card>
                </el-col>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'>
                        <div slot='header' class='clearfix'>
                            <i class='el-icon-neicun iconfont' style="font-size:20px"></i>
                            <span>{{$t('sys.mem_used')}}(%)</span>
                        </div>
                        <!-- <menorycharts></menorycharts> -->
                        <div id='menory'></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import 'echarts'
import headerBar from '../common/headerBar'
import cpucharts from './charts/cpucharts'
import menorycharts from './charts/menorycharts'
export default {
    name:'syetem',
    components:{cpucharts,menorycharts,headerBar},
    data(){
        var datecheck=(rule,val,callback)=>{
            if(!val){
                return callback(new Error('请选择日期'))
            }
            else
                callback()
        }
        return{
            timedata:{
                date:''
            },
            timerule:{
                date:[
                    {validator:datecheck, trigger: 'blur'}
                ]
            },
            sysinfo:[],
            hardware:[],
            allnum:[]
        }
    },
    mounted() {
        this.system_info()    
        this.initWebSocket()
    },
    destroyed(){
        this.websocketclose()
    },
    methods:{
        initWebSocket() {
        const wsurl = "ws://" + this.ip + "/ps";
        this.websock = new WebSocket(wsurl);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen() {
        console.log('ok')
        //console.log(JSON.parse(obj))
      },
      websocket() {
        this.initWebSocket()
      },
      websocketonmessage(e) {
        const data = JSON.parse(e.data)
        this.draw(data)
          
        // console.log(_this.allnum)
      },
      websocketsend(Data) {
        // this.websock.send(1);
        console.log(Data)
      },
      websocketclose(e) {
        console.log('断开连接', e);
        this.websock.close()
      },
      draw(datanum){
        //   console.log(datanum)
        var date = new Array()
        var cpu = new Array()
        var mem = new Array()
        var data = datanum.info
        for(let i = 0; i < data.length; i++){
            date.push(data[i][0])
            cpu.push(data[i][1])
            mem.push(data[i][2]) 
        }
        this.draw_cpu(date,cpu)
        this.draw_mom(date,mem)
      },
        system_info(){
            var _this=this
            this.$axios.get(this.$host+'sysinfo').then(res=>{
                _this.sysinfo=res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        draw_cpu(time,data){
            // console.log(time,data)          
            var cpu=this.$echarts.init(document.getElementById('cpu'))
            var option={
              color: ['#67C23A'],
              xAxis: [{
                data: time,
                type : 'category',
                boundaryGap : false,
              },

              ],
              tooltip: {
                trigger: 'axis'
              },
              yAxis: [{
                name:'(%)',
                lineStyle:{
                  color:'black'
                },
                max: 100,

                splitLine: {show: false}
              }],
              series: [{
                name:'CPU',
                data: data,
                type: 'line',
                smooth: true,
                areaStyle: {normal: {}},
                itemStyle : {
                  normal : {
                    lineStyle:{
                      color:'#67C23A',
                      width:5
                    }
                  }
                },
              }]
            };
            cpu.setOption(option)
        },
        draw_mom(time,data){
            // console.log(time,data,'11111111111111111111') 
          var mom=this.$echarts.init(document.getElementById('menory'))
          var option={
            color: ['#F56C6C'],
            xAxis:[{
              data: time,
              type : 'category',
              boundaryGap : false,
            },
            ],
            tooltip: {
              trigger: 'axis'
            },
            yAxis: [{
              name:'(%)',
              lineStyle:{
                color:'block'
              },
              max: 100,

              splitLine: {show: false}
            }],
            series: [{
              name:'Memory',
              data: data,
              type: 'line',
              smooth: true,
              areaStyle: {normal: {}},
              itemStyle : {
                normal : {
                  lineStyle:{
                    color:'#F56C6C',
                    width:5
                  }
                }
              },
            }]
          };
          mom.setOption(option)
        },
    }
}
</script>
<style>
.basic_info{
    font-weight:700;
}
#cpu,#menory{
        width: 100%;height:250px;border-radius: .3em;
    }
</style>