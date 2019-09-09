<template>
    <div>
        <el-dialog
        :title="$t('backup.back')"
        :visible.sync="start"
        width="40%"
        center
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form :model="newback" :rules="backrules" ref="newback" label-width="140px" label-position="left" class="demo-ruleForm">
          <el-form-item :label="$t('backup.filename')" prop="filename">
            <el-input v-model="newback.filename" :placeholder="$t('backup.input7')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('backup.content')" prop="content">
            <el-input v-model="newback.content" :placeholder="$t('backup.input8')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('backup.table')" prop="tabback">
            <el-input v-model="newback.tabback" :placeholder="$t('backup.input9')"></el-input>
            <span style="color:red">{{$t('backup.tips')}}</span>
          </el-form-item>
          <el-form-item :label="$t('backup.func')" prop="func">
            <el-select v-model="newback.func" :placeholder="$t('backup.input10')">
              <el-option :label="$t('backup.fzl')" value="0"></el-option>
              <el-option :label="$t('backup.zl')" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('backup.plan')" prop="plan">
            <el-radio-group v-model="newback.plan">
              <el-radio label="0">{{$t('backup.plana')}}</el-radio>
              <el-radio label="1">{{$t('backup.planb')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('backup.time')" prop="time" v-if="newback.plan == 1">
            <el-select :placeholder="$t('backup.input11')" v-model="newback.time">
              <el-option :label="$t('backup.day')" value="day"></el-option>
              <el-option :label="$t('backup.week')" value="week"></el-option>
              <el-option :label="$t('backup.month')" value="monthday"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="day" v-if="newback.time == 'day'">
            <el-time-picker v-model="newback.day" :placeholder="$t('backup.input12')" value-format="HH" format="HH"></el-time-picker>
          </el-form-item>
          <el-form-item prop="week" v-if="newback.time == 'week'">
            <el-select v-model="newback.week" :placeholder="$t('backup.input13')">
              <el-option :label="$t('backup.mon')" value="1"></el-option>
              <el-option :label="$t('backup.tues')" value="2"></el-option>
              <el-option :label="$t('backup.wed')" value="3"></el-option>
              <el-option :label="$t('backup.thur')" value="4"></el-option>
              <el-option :label="$t('backup.fri')" value="5"></el-option>
              <el-option :label="$t('backup.sat')" value="6"></el-option>
              <el-option :label="$t('backup.sun')" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="month" v-if="newback.time == 'monthday'">
            <el-select v-model="newback.month" :placeholder="$t('backup.input11')" >
              <el-option v-for="i in timedata" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="startsubmit('newback')">{{$t('message.submit')}}</el-button>
            <el-button @click="backreset('newback')">{{$t('message.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
export default {
    name:'Backupstart',
    props:['status','tar'],
    data(){
        return{
            start:false,
            newback:{
                filename:'',
                content:'',
                tabback:'',
                func:'',
                plan:'',
                time:'',
                day:'',
                week:'',
                month:'',
            },
            backrules:{
                filename:[{required:true,message:this.$t('backup.input7'),trigger:'bulr'},{pattern:/^[0-9a-zA-Z_]+$/,message:this.$t('user.reg'),trigger:'blur'}],
                func: [{ required: true, message: this.$t('backup.input10'), trigger: "blur" }],
                plan: [{ required: true, message: this.$t('backup.select3'), trigger: "blur" }],
                time: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                day: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                week: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                month: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
            },
            timedata:[
                {value:'1',label:'1号'},
                {value:'2',label:'2号'},
                {value:'3',label:'3号'},
                {value:'4',label:'4号'},
                {value:'5',label:'5号'},
                {value:'6',label:'6号'},
                {value:'7',label:'7号'},
                {value:'8',label:'8号'},
                {value:'9',label:'9号'},
                {value:'10',label:'10号'},
                {value:'11',label:'11号'},
                {value:'12',label:'12号'},
                {value:'13',label:'13号'},
                {value:'14',label:'14号'},
                {value:'15',label:'15号'},
                {value:'16',label:'16号'},
                {value:'17',label:'17号'},
                {value:'18',label:'18号'},
                {value:'19',label:'19号'},
                {value:'20',label:'20号'},
                {value:'21',label:'21号'},
                {value:'22',label:'22号'},
                {value:'23',label:'23号'},
                {value:'24',label:'24号'},
                {value:'25',label:'25号'},
                {value:'26',label:'26号'},
                {value:'27',label:'27号'},
                {value:'28',label:'28号'},
            ],
        }
    },
    watch:{
        status(val){
            this.start=val
        }
    },
    methods:{
        handleClose(done) {
            done();
            this.$refs["newback"].resetFields();
            this.$emit('changes' ,false)
        },
        startsubmit(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.$axios.post(this.$host+'orcl_back',{sid:this.tar.id,filen:this.newback.filename,type:this.newback.func,tables:this.newback.tabback,content:this.newback.content,plan:this.newback.plan,day:this.newback.day,week:this.newback.week,month:this.newback.month}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                message: this.$t("message.success"),
                                type: "success",
                            })
                        }
                        else{
                            this.$message.error(res.data.msg);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                    this.start=false
                    this.backreset('newback')
                    this.$emit('changes' ,false)
                }
            })
        },
         backreset(formname) {
            this.$refs[formname].resetFields();
        },
    }
}
</script>