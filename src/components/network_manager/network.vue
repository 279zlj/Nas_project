<template>
    <div class='content'>
        <div>
            <div class='tip_bg'>
                <span class='tip'>{{$t('message.net_setting')}}</span>
            </div>
            <el-row class='other_table'>
                <div style="width:96%;margin:0 auto">
                <el-table :data='netdata.slice((currpage - 1) * pagesize, currpage * pagesize)' border :header-cell-style="getRowClass" class="table_cell"  style='width:100%;min-height:32rem'>
                    <el-table-column :label="$t('network.interface')" prop='interface' width="120"></el-table-column>
                    <el-table-column :label="$t('network.ip')" prop='addr'  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column :label="$t('network.mask')" prop='netmask'  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column :label="$t('gateway.port')" prop='bond_iface'  :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-for='(i,index) in scope.row.bond_iface' :key='index'>
                                <span style="margin-right:.5em">{{i}}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('network.mac')" prop='link'>
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.link === 'yes' ? 'success' : 'danger' " disable-transitions>{{scope.row.link}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.state')" prop='state'>
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.state === 'UP' ? 'success' : 'warning'" disable-transitions>{{scope.row.state}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('network.Speed')" prop="speed" ></el-table-column>
                    <el-table-column :label="$t('message.oper')" width='130'>
                        <template slot-scope='scope'>
                            <el-tooltip :content="$t('message.modify')" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifynet(scope.row)'></el-button></el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10,20]"
                    :page-size="pagesize"
                    :total="pageTotal" style="text-align: right;margin: 1em">
                    </el-pagination>
                </div>
            </el-row>
            <el-dialog :title="$t('network.modify')" :before-close="handleClose" :visible.sync="modifyn" width="30%" :close-on-click-modal="false" center>
                <el-form :model="modifydata" :rules="netrule" ref='modifydata' label-width="100px" label-position="left" class="demo-ruleForm">
                  <el-form-item :label="$t('network.interface')">
                    <span>{{rowdata.interface}}</span>
                  </el-form-item>
                  <el-form-item :label="$t('network.ip')" prop='IP'>
                    <el-input v-model="modifydata.IP" :placeholder="rowdata.addr" clearable ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('network.mask')" prop='mask'>
                    <el-input v-model="modifydata.mask" :placeholder="rowdata.netmask" clearable ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('network.dns')" prop="DNS">
                    <el-input v-model="modifydata.DNS" :placeholder="rowdata.dns" clearable ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="netsubmit('modifydata')">{{$t('message.submit')}}</el-button>
                    <el-button @click="netreset('modifydata')">{{$t('message.reset')}}</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
    
</template>
<script>
export default {
    name:'network',
    data(){
        return{
            getRowClass:{
                'background-color':'#009588',
                'color':'#fff'
            },
            netdata:[],
            pagesize: 10,
            currpage: 1,
            pageTotal: 0,
            modifyn:false,
            rowdata:[],
            modifydata:{
                IP:'',
                mask:'',
                DNS:''
            },
            netrule:{
                IP:[
                    {required:true,message:this.$t('bond.ip'), trigger:'blur'},
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('network.input'),trigger:'blur'}
                ],
                mask:[
                    {required:true,message:this.$t('network.input1'), trigger:'blur'},
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('network.input2'),trigger:'blur'}
                ],
                DNS:[
                    {pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,message:this.$t('network.input3'), trigger:'blur'}
                ]
            }
        }
    },
    mounted() {
        this.netget()
    },
    watch:{
      pageTotal(){
        if(this.pageTotal==(this.currpage-1)*this.pagesize&& this.pageTotal!=0){
          this.currpage-=1;
        //   getuser(this);//获取列表数据
        }
      }
    },
    methods: {
        netget(){
            var _this=this
            this.$axios.get(this.$host+'network').then(res=>{
                var data=res.data.network
                for(let i=0;i<data.length;i++){
                    if(data[i].addr==undefined||data[i].addr=='')
                        data[i].addr='—'
                    if(data[i].interface==undefined||data[i].interface=='')
                        data[i].interface='—'
                    if(data[i].netmask==undefined||data[i].netmask=='')
                        data[i].netmask='—'
                    if(data[i].mac==undefined)
                        data[i].mac='—'
                    if(data[i].dns==undefined)
                        data[i].dns='—'
                    if(data[i].state==undefined)
                        data[i].state='—'
                }
                _this.netdata=res.data.network
                _this.pageTotal = _this.netdata.length
            }).catch(error=>{
                console.log(error)
            })
        },
        modifynet(row){
            this.rowdata=row
            this.modifydata.IP = row.addr
            this.modifydata.mask = row.netmask
            this.modifydata.DNS = row.dns
            this.modifyn=true

        },
        netsubmit(formname){
            var _this=this
            this.$refs[formname].validate((valid)=>{
                if(valid){
                    _this.$axios.post(this.$host+'network',{iface:_this.rowdata.interface,addr:_this.modifydata.IP,netmask:_this.modifydata.mask,dns:_this.modifydata.DNS}).then(res=>{
                        _this.modifyn=false
                        _this.$message({
                            message:this.$t('message.success'),
                            type:'success',
                            offset:''
                        })
                        _this.netget()
                        _this.netreset('modifydata')
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        },
        netreset(formname){
            this.$refs[formname].resetFields();
        },
        handleClose(done){
            done();
            this.$refs['modifydata'].resetFields();
        },
        handleCurrentChange(cpage) {
          this.currpage = cpage;
        },
        handleSizeChange(psize) {
          this.pagesize = psize;
        },
    },
}
</script>
<style>

</style>