<template>
    <div class='content'>
        <headerBar></headerBar>
        <div>
            <div class='tip_bg'>
                <span class='tip'>网关配置</span>
            </div>
            <el-row>
              <el-col :xs='20' :sm='20' :md='20' :lg='20' :xl='20' :offset='2'>
                <el-table :data='gwdata' height='400' border style='width:100%'>
                        <el-table-column label="网口" prop='name'></el-table-column>
                        <el-table-column label="网关地址" prop='type'></el-table-column>
                        <el-table-column label="操作" width:='150'>
                            <template slot-scope='scope'>
                                <el-tooltip content="修改" placement="bottom"><el-button type='warning' icon="el-icon-edit-outline" size='mini' @click='modifygw(scope.row)'></el-button></el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
              </el-col>
            </el-row>
            <el-dialog title="修改网关" :visible.sync="gwdialog" width="30%" center :close-on-click-modal="false">
                <el-form :model="modifydata" ref='modifydata' :rules='gerule' label-width="30" class="demo-ruleForm">
                  <el-form-item label="网口">
                    {{rowdata.name}}
                  </el-form-item>
                  <el-form-item label="网关地址" prop='gwip'>
                    <el-input v-model="modifydata.gwip" :placeholder='rowdata.gw' style='width:80%'></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="gwsubmit('modifydata')">提交</el-button>
                    <el-button @click="gwreset('modifydata')">重置</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    name:'gateway',
    data(){
        return{
            gwdata:[],
            rowdata:[],
            gwdialog:false
        }
    },
    methods: {
        modifygw(row){
            this.gwdialog=true;
            this.rowdata=row.name
        },
        gwsubmit(formname){

        },
        gwreset(formname){

        }
    },    
}
</script>
<style>

</style>