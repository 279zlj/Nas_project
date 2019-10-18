<template>
    <div id='menory'></div>
</template>
<script>
export default {
    name:'menorycharts',
    props:['alldata','time'],
    data(){
        return{
            // alldata:[],
            // time:[]
        }
    },
    watch:{
      alldata(){
        this.draw_mom(this.time,this.alldata)
        return this.alldata
      },
      time(){
        return this.time
      }
    },
    mounted(){
        this.draw_mom(this.time,this.alldata)
    },
    methods:{
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
        },
    }
}
</script>
<style>
    #menory{
        width: 100%;height:300px;border-radius: .3em;
    }
</style>