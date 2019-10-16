<template>
    <div class="content" style="overflow-x:hidden">
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.sysinfo')}}</span>
            </div>
            <el-row :gutter='24' class="main" style="margin-bottom:2em;">
              <div style="width:96%;margin:0 auto">
                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12' >
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
                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12'>
                    <el-card class='box-card'  style='height:27.5em'>
                        <div slot='header' class='clearfix titlebar'>
                            <i class='el-icon-cipan iconfont' style="font-size:20px"></i>
                            <span>{{$t('message.dd')}}</span>
                        </div>
                        <!-- <menorycharts></menorycharts> -->
                            <el-row>
                              <el-col :span='6'>
                                <p style="font-weight:700;font-size:1.1em">{{$t('message.diskuse')}}：</p>
                              </el-col>
                              <el-col :span='18'>
                                <div id='diskstatus' :style="{width:'100%',height:'9em'}" ></div>
                              </el-col>
                            </el-row>

                            <hr style="border-top:1px solid #E4E4E4"></hr>

                            <el-row style="height:6em">
                            <el-col :span="24">
                              <div :style="{width:'100%'}" v-for='(d,index) in diskdata' v-show='target == index'>
                                <span style="margin-right:2rem"><b>{{$t('message.read')}}：</b>{{d.info.read_bytes}}</span>
                                <span><b>{{$t('message.write')}}：</b>{{d.info.write_bytes}}</span>
                              </div>
                            </el-col>
                            <el-col :span="24">
                              <div class="rightbar">
                                <div class="disk" v-for="(p,index) in diskdata" @click="changedisk(index,p)" :id='diskid(index)' :class="target === index?'now':''" >
                                  <img src='../../../static/images/u130.png' class="diskimg"/>
                                  <span class="diskfont">{{p.path}}</span>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        
                    </el-card>
                </el-col>
                </div>
            </el-row>
            <el-row :gutter="24" class='main' style="margin-bottom:2em">
              <div style="width:96%;margin:0 auto">
                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12' >
                    <el-card class='box-card' style="width:100%">
                        <div slot='header' class='clearfix titlebar'>
                            <i class='el-icon-cpu iconfont'></i>
                            <span>{{$t('sys.cpu_used')}}(%)</span>
                        </div>
                        <div id='cpu'></div>
                    </el-card>
                </el-col>
                <el-col :xs='24' :sm='24' :md='12' :lg='12' :xl='12' >
                    <el-card class='box-card' style="width:100%">
                        <div slot='header' class='clearfix titlebar'>
                            <i class='el-icon-neicun iconfont' style="font-size:20px"></i>
                            <span>{{$t('sys.mem_used')}}(%)</span>
                        </div>
                        <div id='menory'></div>
                    </el-card>
                </el-col>
              </div>
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
    },
    destroyed(){
        this.websocketclose()
    },
    methods:{
      diskid(val){
        return 'disk'+val
      },
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
        this.websock.close()
        console.log('断开连接', e);
      },
      draw(datanum){
        var date = new Array()
        var cpu = new Array()
        var mem = new Array()
        var data = datanum.info
        for(let i = 0; i < data.length; i++){
            date.push(data[i][0])
            cpu.push(data[i][1])
            mem.push(data[i][2]) 
        }
        this.diskdata = datanum.disks
        this.netdata = datanum.nets
        this.usedata = datanum.use
        this.draw_cpu(date,cpu)
        this.draw_mom(date,mem)
        for(let a = 0;a<this.netdata.length;a++){
          this.netdata[a].info.bytes_sent=renderSize(this.netdata[a].info.bytes_sent)
          this.netdata[a].info.bytes_recv=renderSize(this.netdata[a].info.bytes_recv)
          if(this.netdata[a].iface == 'all')
            this.netdata[a].iface = '总网速'
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
            this.target= key
        },
        drawdisks(data){
            var dom = this.$echarts.init(document.getElementById('diskstatus'))
            dom.setOption({
                series:[{
                    type:'liquidFill',
                    data: data,
                    radius:'80%',
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
    height:9rem;background-color:#EFF0F4 !important;margin-top:.5rem;overflow-y:scroll
}
.disk{
  display:inline-block;margin:.5rem 0 0 .5rem;width:5.5rem;height:1.5rem;background-color:#B3B3B3;border-radius:5px;text-align:right;overflow: hidden;white-space: nowrap;text-overflow: ellipsiss;cursor: pointer;
}
.diskimg{
  margin-right:1rem;margin-left:.5rem
}
.diskfont{
  font-size:.8rem;margin-right:.5rem;color:white
}
.now{
    background-color: #019589 !important;
}
</style>
