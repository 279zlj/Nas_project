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
          <el-form-item :label="$t('backup.time')" prop="type" v-if="newback.plan == 1">
            <el-select :placeholder="$t('backup.input11')" v-model="newback.type">
              <el-option :label="$t('backup.day')" value="day"></el-option>
              <el-option :label="$t('backup.week')" value="week"></el-option>
              <el-option :label="$t('backup.month')" value="monthday"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="week" v-if="newback.type == 'week'">
            <el-select v-model="newback.week" :placeholder="$t('backup.input13')" >
              <el-option :label="$t('backup.mon')" value="1"></el-option>
              <el-option :label="$t('backup.tues')" value="2"></el-option>
              <el-option :label="$t('backup.wed')" value="3"></el-option>
              <el-option :label="$t('backup.thur')" value="4"></el-option>
              <el-option :label="$t('backup.fri')" value="5"></el-option>
              <el-option :label="$t('backup.sat')" value="6"></el-option>
              <el-option :label="$t('backup.sun')" value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="month" v-if="newback.type == 'monthday'">
            <el-select v-model="newback.month" :placeholder="$t('backup.input11')" >
              <el-option v-for="i in timedata" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="day" v-if="newback.type">
            <el-time-picker v-model="newback.day" :placeholder="$t('backup.input12')" value-format="HH" format="HH"></el-time-picker>
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
                type:'',
                day:'',
                week:'',
                month:'',
                dot:''
            },
            backrules:{
                filename:[{required:true,message:this.$t('backup.input7'),trigger:'bulr'},{pattern:/^[\u4e00-\u9fa5_0-9a-zA-Z]+$/,message:this.$t('user.reg1'),trigger:'blur'}],
                func: [{ required: true, message: this.$t('backup.input10'), trigger: "blur" }],
                plan: [{ required: true, message: this.$t('backup.select3'), trigger: "blur" }],
                type: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                day: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                week: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                month: [{ required: true, message: this.$t('backup.input11'), trigger: "blur" }],
                dot:[{required:true, message: this.$t('backup.input11'),trigger:'blur'}]
            },
            timedata:[],
        }
    },
    watch:{
        status(val){
            this.start=val
        }
    },
    mounted(){
      for (let i = 1;i<29;i++){
        let time = {}
        time.value = i
        time.label = i + '号'
        this.timedata.push(time)
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
                    this.$axios.post(this.$host+'db_back',{sid:this.tar.id,filen:this.newback.filename,
                    content:this.newback.content,tables:this.newback.tabback,form:this.newback.func,
                    plan:this.newback.plan,type:this.newback.type,hour:this.newback.day,day_of_week:this.newback.week,day:this.newback.month}).then(res=>{
                        if(res.data.success){
                            this.$message({
                                message: this.$t("message.success"),
                                type: "success",
                            })
                            var date = new Date()
                            this.resetSetItem('backup',date.toLocaleString().replace('上午','').replace('下午',''))
                        }
                        else{
                            this.$message.error(res.data.msg);
                        }
                    
                    }).catch(error => {
                        console.log(error);
                    });
                    this.start=false
                    this.$emit('changes' ,false)
                    this.backreset('newback')
                }
            })
        },
         backreset(formname) {
            this.$refs[formname].resetFields();
        },
    }
}
</script>