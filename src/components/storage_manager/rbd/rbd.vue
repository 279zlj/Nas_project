<template>
    <div class="content">
        <div>
            <div class="tip_bg">
                <span class="tip">{{$t('message.external')}}</span>
            </div>
            <el-row class="other_table">
                <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset="2">
                    <el-table :data='rbddata.slice((currpage - 1) * pagesize, currpage * pagesize)' border :header-cell-style="getRowClass" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"  class='table_cell' style="width:100%;min-height:310px;max-height:100%">
                      <el-table-column :label="$t('rbd.name')" prop="rbd"></el-table-column>
                      <el-table-column :label="$t('rbd.pool')" prop='pool'></el-table-column>
                      <el-table-column :label="$t('rbd.device')" prop="device"></el-table-column>
                      <el-table-column :label="$t('message.oper')">
                          <template slot-scope="scope">
                                <el-tooltip :content="$t('rbd.map')" placement="bottom"><el-button type="primary" icon="el-icon-guazai iconfont" size='mini' @click="rbd_mounted(scope.row)" :disabled="scope.row.is_map"></el-button></el-tooltip>
                                <el-tooltip :content="$t('rbd.unmap')" placement="bottom"><el-button type='danger' icon='el-icon-xiezai iconfont' size='mini' @click="rbd_unmount(scope.row)" :disabled="!scope.row.is_map"></el-button></el-tooltip>
                          </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5, 10]"
                    :page-size="pagesize"
                    :total="rbddata.length" style="text-align: right;margin: 1em">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-dialog :title="$t('rbd.map')" :visible.sync="r_mounted" width="30%" :close-on-click-modal="false">
                <p>{{$t('rbd.map')}}：{{mount_target.rbd}}？</p>
                <el-button type='primary' @click="sure_mounted()" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.sure')}}</el-button>
                <el-button @click="r_mounted=false">{{$t('message.cancel')}}</el-button>
            </el-dialog>
            <el-dialog :title="$t('rbd.unmap')" :visible.sync="r_unmount" width="30%" :close-on-click-modal="false">
                <p>{{$t('rbd.unmap')}}：{{unmount_target.rbd}}？</p>
                <el-button type="primary" @click="sure_unmount()" v-loading.fullscreen.lock="fullscreenLoading">{{$t('message.sure')}}</el-button>
                <el-button @click="r_unmount=false">{{$t('message.cancel')}}</el-button>
            </el-dialog>
        </div>
    </div>    
</template>
<script>
export default {
    name:'rbd',
    data(){
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            rbddata:[],
            currpage:1,
            pagesize:5,
            r_mounted:false,
            r_unmount:false,
            loading:true,
            mount_target:'',
            unmount_target:'',
            fails_tip:'',
            fullscreenLoading: false
        }
    },
    mounted(){
        this.getrbd()
    },
    methods:{
        getrbd(){
            var _this=this
            this.$axios.get(this.$host+'rbd').then(res=>{
                var data=res.data.rbd
                this.loading=false
                for(let i=0;i<data.length;i++){
                    if(data[i].device==''||data[i].device==undefined)
                        data[i].device='—'
                }
                _this.rbddata=res.data.rbd
            }).catch(error=>{
                console.log(error)
            })
        },
        rbd_mounted(row){
            this.mount_target=row
            this.r_mounted=true
        },
        rbd_unmount(row){
            this.unmount_target=row
            this.r_unmount=true
        },
        sure_mounted(){
            var _this=this
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
            });
            this.$axios.post(this.$host+'rmap',{path:_this.mount_target.rbd,pool:_this.mount_target.pool}).then(function(res){
                _this.r_mounted=false
                if(res.data.success){
                    loading.close()
                    _this.$message({
                        message:this.$t('message.success'),
                        type:'success',
                        offset:''
                    })
                    
                }
                else if(!res.data.success){
                    loading.close();
                    _this.fails_tip=res.data.state
                    _this.$message.error(res.data.msg)
                    
                }
                _this.getrbd()
            })
        },
        sure_unmount(){
            var _this=this
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
            });
            this.$axios.delete(this.$host+'rmap',{data:{path:_this.unmount_target.device}}).then(function(res){
                _this.r_unmount=false
                if(res.data.data.success){
                    loading.close();
                    _this.$message({
                        message:this.$t('message.success'),
                        type:'success',
                        offset:''
                    })
                }
                else if(!res.data.data.success){
                    loading.close();
                    _this.fails_tip=res.data.data.res
                    _this.$message.error(res.data.msg)
                }
                _this.getrbd()
            })
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
    }
}
</script>
<style>

</style>

