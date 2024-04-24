<template><!-- 人员基本信息 -->
  <div class="personal-detail">
    <div class="panel-title">人员基本信息</div>
    <!-- type 结业是1，入学是2，填写是0 -->
    <div class="personal-form">
      <el-form ref="form" :model="formModel" :rules="readOnly ? {} : rules"
        label-width="100px">
        <el-col :span="12">
          <el-form-item label="姓名:">
            {{ info.user.name }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- v-if='disabled' -->
          <el-form-item label="出行方式:" prop="travelMode">
            <el-select v-if="!readOnly" v-model="formModel.travelMode"
              placeholder="请选择出行方式" @change="onChangeTravelMode"
              style="width: 100%">
              <el-option label="飞机" :value="1"></el-option>
              <el-option label="火车" :value="2"></el-option>
              <el-option label="自驾" :value="3"></el-option>
            </el-select>
            <span v-else>{{ getTravelMode }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号码:" prop="phone">
            <el-input v-if="!readOnly" placeholder="请输入个人真实手机号"
              v-model.trim="formModel.phone" maxlength='11'></el-input>
            <span v-else>{{ formModel.phone }}</span>
          </el-form-item>
        </el-col>


        <el-col :span="12">
          <el-form-item label="抵达时间:" prop="arriveTime">
            <el-date-picker v-if="!readOnly" v-model="formModel.arriveTime"
              type="datetime" placeholder="请选择抵达时间" format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%">
            </el-date-picker>
            <span v-else>{{ formModel.arriveTime }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="分支机构:">
            {{ formModel.deptName }}
          </el-form-item>
        </el-col>
        <!-- v-if="formModel.region != 3 && type != 2" :span="12" -->
        <el-col :span="12">
          <el-form-item v-if="formModel.travelMode !== 3" label="抵达站点:"
            prop="station">
            <el-input v-if="!readOnly" v-model.trim="formModel.station"
              placeholder="请输入自己到达的站点"></el-input>
            <span v-else>{{ formModel.station }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="职位:">{{
            formModel.positionName
          }}</el-form-item>
        </el-col>
        <!-- v-if="formModel.region != 3 && type != 2" -->
        <el-col v-if="formModel.travelMode !== 3" :span="12">
          <el-form-item label="班次:" prop="travelFrequency">
            <el-input v-if='!readOnly' v-model.trim="formModel.travelFrequency"
              placeholder="请输入乘坐班次"></el-input>
            <span v-else>{{ formModel.travelFrequency }}</span>
          </el-form-item>

        </el-col>

        <el-col :span="12">
          <el-form-item label="性别:" prop="gender">
            <el-select v-if="!readOnly" v-model="formModel.gender"
              placeholder="请选择性别" style="width: 100%">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
            <span v-else>{{ formModel.gender }}</span>
          </el-form-item>
        </el-col>

        <el-col v-if="type == 1" :span="12">
          <el-form-item label="会议状态:"></el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="年龄:" prop="age">
            <el-input v-if="!readOnly" v-model.trim="formModel.age"
              placeholder="请输入自己的年龄" maxlength='3'></el-input>
            <span v-else>{{ formModel.age }}</span>
          </el-form-item>
        </el-col>

        <el-col v-if="!type" :span="12">
          <el-form-item label="学员照片:" prop="picture">
            <div class="pic-wrap" v-if="!readOnly">
              <ws-image-upload v-bind="options" :urlList="getPicList"
                :afterUpload="afterUpload" :handleRemove="handleRemove" />
              <div class="pic-tips">*请上传正脸照片</div>
            </div>
            <img v-else class='preview-pic' :src="formModel.picture" alt="">
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div v-if="!show" class="reference-btn">
      <el-button class="cancel-btn" @click="cancel">取消</el-button>
      <el-button class="confirm-btn" @click="onSubmit">{{
        readOnly ? '修改' : '提交信息'
      }}</el-button>
    </div>
  </div>
</template>

<script>
const rules = {
  travelMode: [
    { required: true, message: '请选择出行方式', trigger: ['change', 'blur'] }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: ['change', 'blur'] },
    { pattern: '^1[0-9]{10}$', message: '请输入正确的手机号码', trigger: ['change', 'blur'] },
  ],
  arriveTime: [
    { required: true, message: '请选择抵达时间', trigger: ['change', 'blur'] }
  ],
  station: [
    { required: true, message: '请选择抵达站点', trigger: ['change', 'blur'] }
  ],
  travelFrequency: [
    { required: true, message: '请选择乘坐班次', trigger: ['change', 'blur'] }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: ['change', 'blur'] }
  ],
  picture: [
    {
      required: true,
      message: '请上传照片',
      trigger: ['change', 'blur']
    }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: ['change', 'blur'] }
  ],
}

export default {
  name: 'personalInfo',
  props: {
    info: {
      type: Object,
      default: () => { }
    },
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      rules: rules,

      // 消息id
      id: '',

      formModel: {
        phone: '',
        id: '',
        name: '',
        positionName: '',
        gender: '',
        age: '',
        // 部门名称
        deptName: '',
        // 照片
        picture: '',
        // 出行方式
        travelMode: '',
        // 到达时间
        arriveTime: '',
        // 出行班次
        travelFrequency: '',
        // 抵达站点
        station: ''
      },
      isSaved: false,
      dialogImageUrl: '',
      imageUrl: [],
      dialogVisible: false,
      tableData: [],

      disabled: false,

      options: {
        actions: {
          url: '/file/upload',
          op: 'upload'
        }
      },

      readOnly: false
    };
  },

  computed: {
    getPicList () {
      if (this.formModel.picture) {
        return [this.formModel.picture]
      }

      return []
    },

    getTravelMode () {
      let e = {
        1: '飞机',
        2: '火车',
        3: '自驾'
      }

      return e[this.formModel.travelMode] || ''
    }
  },

  created () {
    this.id = this.$route.query.id

    if (this.info.message.dealStatus === 2) {
      this.readOnly = true
    }

    this.init()
  },

  methods: {
    init () {
      // 将用户信息 和 车次信息 同步过来
      Object.assign(this.formModel, this.info.user, this.info.staffInfo)

      this.formModel.userId = this.info.message.userId
    },


    checkForm () {
      let isOk = true

      this.$refs['form'].validate(valid => {
        isOk = valid
      })

      return isOk
    },

    async onSubmit () {
      if (this.readOnly) {
        this.readOnly = false
        return
      }

      if (!this.checkForm()) return

      let url = this.$getModuleUrl('/index/conference', 'conferenceStaffInfo')

      try {
        await this.$axios(url, {
          data: { ...this.formModel, id: this.id },
          op: 'conferenceStaffInfo'
        })

        this.$message.success('修改成功')
        this.readOnly = true
      } catch (error) {

      }
    },

    onBack () {
      this.$router.push({
        name: 'conference'
      })
    },
    handleAvatarSuccess (file, fileList) {
      console.log(file, fileList);
    },
    beforeAvatarUpload (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 返回列表
    cancel () {
      this.$router.push({
        name: 'conference'
      })
    },

    onChangeTravelMode (val) {
      if (val === 3) {
        this.formModel.travelFrequency = ''
        this.formModel.station = ''
      }
    },

    afterUpload (response) {
      this.formModel.picture = response.data
    },
    handleRemove (a) {
      console.log(a);
      this.formModel.picture = ''
    }
  }
};
</script>

<style scoped lang="scss">
.personal-detail {
  .personal-form {
    border: 1px solid #ebeef5;
    display: flex;
    padding: 16px 24px;
    border-radius: 8px;
  }

  .reference-btn {
    text-align: center;
    margin-top: 32px;
    margin-bottom: 16px;
    font-size: 14px;

    .cancel-btn {
      min-width: 160px;
      height: 36px;
      font-weight: 400;
      color: #606266;
    }

    .confirm-btn {
      min-width: 160px;
      height: 36px;
      background: #f05259;
      border-radius: 4px;
      color: #fff;
    }
  }

  .avatar-uploader {
    background: #fbfdff;
    border-radius: 8px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 88px;
    height: 112px;
    display: inline-flex;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 88px;
    height: 112px;
    line-height: 112px;
    text-align: center;
  }

  .avatar {
    width: 88px;
    height: 112px;
    display: block;
  }
}

.panel-title {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  padding-bottom: 16px;
}

.pic-wrap {
  display: flex;

  /deep/.el-upload--picture-card {
    width: 88px;
    height: 112px;
    line-height: 112px;
  }

  /deep/ .image-viewer {
    width: 88px;
    height: 112px;
  }

  .pic-tips {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #909399;
  }
}

.preview-pic {
  width: 88px;
  height: 112px;
}
</style>