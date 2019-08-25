<template>
    <div id='cpu'></div>
</template>
<script>
export default {
    name:'cpucharts',
    props:['alldata','time'],
    data(){
        return{
            // alldata:[],
            // time:[]
        }
    },
    mounted(){
        this.draw_cpu(this.time,this.alldata)
    },
    watch:{
      alldata(){
        this.draw_cpu(this.time,this.alldata)
        return this.alldata
      },
      time(){
        return this.time
      }
    },
    methods:{
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
        }
    }
}
</script>
<style>
    #cpu{
        width:100%;height:300px;border-radius: .3em;
    }
    canvas{
      width: 100% !important
    }
</style>