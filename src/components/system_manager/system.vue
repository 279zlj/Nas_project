<template>
    <div class="content">
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.sysinfo')}}</span>
            </div>
            <el-row class="main" style="margin-bottom:2em">
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                      <el-card class='box-card' style="height:27.5em">
                          <div slot='header' class='clearfix titlebar'>
                              <i class='el-icon-wangluo iconfont' style="font-size:20px"></i>
                              <span>{{$t('message.net')}}</span>
                          </div>
                          <!-- <menorycharts></menorycharts> -->
                          <el-row style='line-height:3em'>
                            <el-col :span="8">
                              <b>{{$t('network.interface')}}</b>
                            </el-col>
                            <el-col :span="8">
                              <b>{{$t('message.sent')}}</b>
                            </el-col>
                            <el-col :span="8">
                              <b>{{$t('message.recv')}}</b>
                            </el-col>
                          </el-row>
                          <div style="height:18em;overflow-y:scroll">
                          <el-row v-for="n in netdata" v-bind:key="n.id" style='line-height:2.5em;'>
                            <el-col :span="8">
                              {{n.iface}}
                            </el-col>
                            <el-col :span="8">
                              <el-tag type="success">{{n.info.bytes_sent}}</el-tag>
                            </el-col>
                            <el-col :span="8">
                              <el-tag type="danger">{{n.info.bytes_recv}}</el-tag>
                            </el-col>
                          </el-row>
                          </div>
                      </el-card>
                </el-col>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card'  style='height:27.5em'>
                        <div slot='header' class='clearfix titlebar'>
                            <i class='el-icon-cipan iconfont' style="font-size:20px"></i>
                            <span>{{$t('message.dd')}}</span>
                        </div>
                        <!-- <menorycharts></menorycharts> -->
                          <el-row style="height:6em">
                            <el-col :xs='18' :sm='18' :md='18' :lg='18' :xl='18'>
                              <!-- <div :style="{width:'100%'}">
                                <p><b>{{$t('message.read')}}：</b>{{read_bytes}}</p>
                                <p><b>{{$t('message.write')}}：</b>{{write_bytes}}</p>
                              </div> -->
                              <div :style="{width:'100%'}" v-for='(d,index) in diskdata' v-show='target == index'>
                                <p><b>{{$t('message.read')}}：</b>{{d.info.read_bytes}}</p>
                                <p><b>{{$t('message.write')}}：</b>{{d.info.write_bytes}}</p>
                              </div>
                            </el-col>
                            <el-col :xs='6' :sm='6' :md='6' :lg='6' :xl='6'>
                              <el-row class="rightbar">
                                  <p style="margin:0" v-for="(p,index) in diskdata" @click="changedisk(index,p)" :id='index' >{{p.path}}</p>
                              </el-row>
                            </el-col>
                          </el-row>
                          <hr style="border-top:1px solid #E4E4E4"></hr>
                            <el-row>
                              <el-col :span='6'>
                                <p style="font-weight:700;font-size:1.1em">{{$t('message.diskuse')}}：</p>
                              </el-col>
                              <el-col :span='18'>
                                <div id='diskstatus' :style="{width:'100%',height:'15em'}" ></div>
                              </el-col>
                            </el-row>
                        
                    </el-card>
                </el-col>
            </el-row>
            <el-row class='main' style="margin-bottom:2em">
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card' style="width:100%">
                        <div slot='header' class='clearfix titlebar'>
                            <i class='el-icon-cpu iconfont'></i>
                            <span>{{$t('sys.cpu_used')}}(%)</span>
                        </div>
                        <div id='cpu'></div>
                    </el-card>
                </el-col>
                <el-col :xs='21' :sm='21' :md='10' :lg='10' :xl='10' :offset='1'>
                    <el-card class='box-card' style="width:100%">
                        <div slot='header' class='clearfix titlebar'>
                            <i class='el-icon-neicun iconfont' style="font-size:20px"></i>
                            <span>{{$t('sys.mem_used')}}(%)</span>
                        </div>
                        <div id='menory'></div>
                    </el-card>
                </el-col>
            </el-row>
            
    </div>
</template>
<script>
import 'echarts'
import {renderSize} from '../../assets/change_bytes'
import 'echarts-liquidfill/src/liquidFill'
import cpucharts from './charts/cpucharts'
import menorycharts from './charts/menorycharts'
export default {
    name:'syetem',
    components:{cpucharts,menorycharts},
    data(){
        return{
            sysinfo:[],
            hardware:[],
            allnum:[],
            netdata:[],
            diskdata:[],
            val:[],
            read_bytes:'',
            write_bytes:'',
            usedata:[],
            num:[],
            alldisk:'',
            target:0,
            cpu:[],
            mem:[],
            date:[]
        }
    },
    mounted() {
        this.system_info()    
        this.initWebSocket()
        var _this=this
        setTimeout(function(){
          _this.changedisk(0)
        },100)
        
    },
    destroyed(){
        this.websocketclose()
    },
    methods:{
      initWebSocket() {
        const wsurl = "ws://" + this.ip + "/ps";
        this.websock = new WebSocket(wsurl);
        this.websock.onopen = this.websocketonopen;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen() {
        
        // console.log(this.websock.readyState)
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
        // console.log(Data)
      },
      websocketclose(e) {
        console.log('断开连接', e);
        this.websock.close()
      },
      draw(datanum){
          // console.log(datanum)
        var date = new Array()
        var cpu = new Array()
        var mem = new Array()
        var data = datanum.info
        for(let i = 0; i < data.length; i++){
            date.push(data[i][0])
            cpu.push(data[i][1])
            mem.push(data[i][2]) 
        }
        // this.cpu=cpu
        // this.mem=mem
        // this.date=date
        this.diskdata = datanum.disks
        this.netdata = datanum.nets
        this.usedata = datanum.use
        this.draw_cpu(date,cpu)
        this.draw_mom(date,mem)
        // console.log(this.diskdata)
        for(let a = 0;a<this.netdata.length;a++){
          this.netdata[a].info.bytes_sent=renderSize(this.netdata[a].info.bytes_sent)
          this.netdata[a].info.bytes_recv=renderSize(this.netdata[a].info.bytes_recv)
          if(this.netdata[a].iface == 'all')
            this.netdata[a].iface = '总网速'
          // console.log(this.netdata[a].info.bytes_sent,this.netdata[a].info.bytes_recv)
        }
        for(let a = 0;a<this.diskdata.length;a++){
          this.diskdata[a].info.read_bytes=renderSize(this.diskdata[a].info.read_bytes)
          this.diskdata[a].info.write_bytes=renderSize(this.diskdata[a].info.write_bytes)  
          if(this.diskdata[a].path == 'all'){
            
            for(let b = 0;b<this.usedata.length;b++){
              if(this.usedata[b].path == 'all'){
                this.num = []
                this.num = this.usedata[b].use / 100
                
                let da = []
                da.push(this.num)
                this.drawdisks(da)
              }
            }
            this.diskdata[a].path = '总读写'
          }
          
          // console.log(this.diskdata[a].info.read_bytes,this.diskdata[a].info.write_bytes)
        }
        
      },
        system_info(){
            var _this=this
            this.$axios.get(this.$host+'sysinfo').then(res=>{
                _this.sysinfo=res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        changedisk(key,val){
            $("#"+key+"").addClass('now')
            $("#"+key+"").siblings().removeClass('now')
           
        },
        drawdisks(data){
            var dom = this.$echarts.init(document.getElementById('diskstatus'))
            dom.setOption({
                series:[{
                    type:'liquidFill',
                    data: data,
                    radius:'70%',
                    itemStyle:{
                        shadowBlur:0
                    },
                    outline:{
                        borderDistance:0,
                        itemStyle:{
                            borderWidth: 3,
                            borderColor: '#156ACF',
                            shadowBlur: 1,
                        }
                    },
                    label: {
                    normal: {
                        textStyle: {
                        color: 'red',
                        insideColor: 'yellow',
                        fontSize: 48
                        }
                    }
                    },
                }],
                tooltip: {
                    show: true
                }
            })
            window.addEventListener("resize", () => { dom.resize();});
        },
        draw_cpu(time,data){
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
            window.addEventListener("resize", () => { cpu.resize();});
        },
        draw_mom(time,data){
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
          window.addEventListener("resize", () => { mom.resize();});
        },
    }
}
</script>
<style>
.basic_info{
    font-weight:700;
}

.titlebar{
    height:1.5em !important;
}
.rightbar{
    height:5.5em;overflow-y:scroll;background-color:#EFF0F4;text-align:center;border-radius:.5em;line-height:2.5em
}
.rightbar p{
    cursor: pointer;
}
.now{
    background-color: white !important;
}
</style>
