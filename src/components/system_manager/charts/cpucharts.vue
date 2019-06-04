<template>
    <div id='cpu'></div>
</template>
<script>
export default {
    name:'cpucharts',
    props:['data'],
    data(){
        return{
            time:[],
            cpu:[]
        }
    },
    mounted(){
        this.donum(this.data)
    },
    watch:{
      data(){
        return this.data
      }
    },
    methods:{
        donum(data){
          console.log(data)
          var time = data.map(function(item){
            return item[0]
          })
          var cpu = data.map(function(item){
            return item[1]
          })
          this.time=time
          this.cpu=cpu
          this.draw_cpu(this.time,this.cpu)
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
        }
    }
}
</script>
<style>
    #cpu{
        width: 100%;height:250px;border-radius: .3em;
    }
</style>