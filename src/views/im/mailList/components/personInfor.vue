<template>
  <div class="box_list">
    <div class="t_list">
      <img src="@/assets/logo/logo_small.png"/>
      <span>深圳万顺叫车云信息技术有限公司</span>
    </div>
    <!-- 一级组织 -->
    <div class="t_box">
      <div class="rb-right-breadcrumb">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item v-for="(item,index) in orgPath" :key="item.deptId" :index="index">
            <span  :class="[orgPath.length - 1 != index?'rb-title':'rb-breadcrumb-title']" @click="orgPath.length - 1 != index && clickToDept(item.deptId)">{{ item.deptName }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="scroll-box">
        <template v-if="dataOptions.children?dataOptions.children.length>0:''">
            <div class="con_list sign" v-for="(item, index) in dataOptions.children" :key="index" @click="orgChange(item.id)">
            <div class="con_list_left">
                <img src="@/assets/icons/organization.png"/>
                <p class="txt1">{{item.name}}</p>
                <p class="txt2">（{{item.empCount}}）</p>
            </div>
            <div class="con_list_right">
                <img src="@/assets/images/orderMap/iconright.png"/>
            </div>
            </div>
        </template>
        <template v-if="dataOptions.empList?dataOptions.empList.length>0:''">
            <div class="c_list sign" v-for="(item, index) in dataOptions.empList" :key="index+'b'">
            <div class="c_list_left">
                <div v-if="item.icon"><img :src="item.icon" @click="firendChange(item.id)"/></div>
                <div class="nameIcon" v-if="!item.icon" @click="firendChange(item.id)">{{ item.name.slice(0, 1) }}</div>
                <div style="margin-left:10px;">
                <div class="top">
                    <span>{{item.name}}</span>
                    <p v-if="item.deptHead==1">负责人</p>
                </div>
                <div class="bottom">{{item.positionName}}</div>
                </div>
            </div>
            </div>
        </template>
      </div>
    </div>
    <personMsg :dialogVisible='dialogVisible' @getCancel="getCancel" @getConfirm='getConfirm' ref="person"></personMsg>
  </div>
</template>
<script>
import personMsg from './personMsg.vue'
export default {
  props: {
    idInfor: {
      type: Number,
      default:'',
    },
  },
  components: {
    personMsg
  },
  data(){
    return {
      moduleName: '/mailList',
      dataOptions:{},
      orgPath: [],
      dialogVisible:false,
      addFriendVisible:false,
      dataMsgs:{},
      applicationRemark:null,
      id:'',
      targetId:this.idInfor,
    }
  },
  watch: {
    idInfor: {
      handler: function (val) {
        this.targetId = val;
        this.orgChange(this.targetId);
      },
      immediate: true
    }
  },
  methods: {
    // 二级机构
    orgChange(id) {
      const op = 'selectContacts'
      let data = {
        data: {
          id:id
        },
        op,
      };
      let URL = this.$getModuleUrl(this.moduleName, op);
      this.$axios(URL, data).then((res) => {
        let data = JSON.parse(res.data) || [];
        this.dataOptions = data;
        this.orgPath = this.dataOptions.orgPath;
      });
    },
    clickToDept(id) {
      this.currentNode = {
        id: id
      };
      let spliceIndex = ''
      this.orgPath.forEach((item,index) => {
        if(item.deptId == id) {
            spliceIndex = index + 1
        }
      })
      this.orgPath.splice(spliceIndex)
      this.orgChange(id);
    },
    firendChange(id){
      this.dialogVisible = true;
      this.$refs.person.mesList(id);
    },
    getCancel() {
      this.dialogVisible = false;
    },
    getConfirm() {
      this.orgChange(this.idInfor);
    },
  }
}
</script>
<style lang="scss" scoped>
.box_list {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}
.t_box {
    overflow: hidden;
    padding: 0px 16px 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    .scroll-box {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        flex: 1;
    }
}
.t_list {
  margin: 0px 16px;
  display: flex;
  align-items: center;
  line-height: 73px;
  height: 73px;
  border-bottom: 1px solid #EBEEF5;
  img {
    width: 40px;
    height: 40px;
  }
  span {
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 25px;
    height: 25px;
    margin-left: 15px;
  }
}
.t_line {
  margin-top: 16px;
  border-bottom: 1px solid #EBEEF5;
}
.nameIcon {
  border: 1px border #0088ff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0088ff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  overflow: hidden;
  img {
      width: 100%;
      height: 100%;
  }
}
.nameIcon1 {
  border: 1px border #0088ff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0088ff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  overflow: hidden;
  img {
      width: 100%;
      height: 100%;
  }
}
.title {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #303133;
  line-height: 20px;
  padding: 12px;
}
.title1 {
  padding: 12px;
  .span1 {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0088FF;
    line-height: 20px;
  }
  .span2 {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #303133;
    line-height: 20px;
  }
}
.con_list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-top: 10px;
  padding: 12px;
  .con_list_left {
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .txt1 {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #303133;
      line-height: 22px;
      margin-left: 10px;
    }
  }
  .con_list_right {
    img {
      width: 16px;
      height: 16px;
    }
  }
}
.rb-right-breadcrumb {
  margin-top: 8px;
  .rb-breadcrumb-title {
    cursor: pointer;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #303133;
    line-height: 20px;
  }
  .rb-title {
    cursor: pointer;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0088FF;
    line-height: 20px;
    span:last-child {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
      line-height: 20px;
    }
  }
  /deep/ .el-breadcrumb {
    line-height: 20px;
    padding: 12px;
  }
}
.c_list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 12px;
  .c_list_left {
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .top {
      display: flex;
      span {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
        line-height: 22px;
      }
      p {
        margin-left: 10px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #409EFF;
        width: 44px;
        height: 20px;
        background: #ECF5FF;
        border-radius: 4px;
        text-align: center;
        line-height: 20px;
      }
    }
    .bottom {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
      line-height: 20px;
      margin-top: 2px;
    }
  }
  .c_list_right {
    img {
      width: 16px;
      height: 16px;
    }
  }
  &:hover {
    transition: 300ms;
    background: #F5F7FA !important;
  }
}
.personM {
  .content {
    display: flex;
    img {
        width: 56px;
        height: 56px;
      }
      .left_1 {
        margin-left: 10px;
        div:nth-child(1) {
          padding-top: 2px;
          span:nth-child(1) {
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 25px;
          }
        }
        div:nth-child(2) {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #909399;
          line-height: 20px;
          margin-top: 5px;
        }
      }
  }
  .line {
    margin-top: 10px;
    border-bottom: 1px solid #EBEEF5;
  }
  .con-1 {
    padding-top: 12px;
    div:nth-child(1) {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
      line-height: 22px;
      margin-bottom: 12px;
    }
    div:nth-child(2) {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      span:nth-child(1) {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 22px;
      }
      span:nth-child(2) {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
        line-height: 22px;
      }
    }
    div:nth-child(3) {
      display: flex;
      justify-content: space-between;
      span:nth-child(1) {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 22px;
      }
      .txy {
        width: 59px;
        height: 28px;
        background: #ECF5FF;
        border-radius: 4px;
        line-height: 28px;
        p {
          font-size: 14px;
          text-align: center;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          margin-left: 15px;
          color: #409EFF;
        }
      }
    }
  }
  .con-2 {
    padding-top: 12px;
    div:nth-child(1) {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
      line-height: 22px;
      margin-bottom: 12px;
    }
    .y {
      display: flex;
      justify-content: space-between;
      .left_y {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
      }
      .right_y {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
      }
    }
    .L {
      display: flex;
      justify-content: space-between;
    }
    .text_y {
      font-size: 14px;
      width: 220px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
      line-height: 20px;
      text-align: right;
    }
  }
  /deep/ .el-dialog__footer {
    padding: 15px;
  }
  /deep/ .el-button--default {
    width: 120px;
    height: 36px;
    border: 1px solid #DCDFE6;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #606266;
    line-height: 16px;
  }
  /deep/ .el-button--primary {
    width: 120px;
    height: 36px;
    background: #F05259;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 14px;
  }
}
/deep/ .el-dialog__header {
    height: 57px;
    padding:24px 15px 10px;
  }
  /deep/ .el-dialog__body {
    padding:15px;
  }
  /deep/ .el-dialog__title {
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 18px;
  }
  /deep/ .el-dialog__close {
    font-size: 24px;
  }
.addFriend {
  .block{
    display: flex;
    .remark {
      width: 50px;
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #606266;
      line-height: 14px;
    }
  }
  /deep/ .el-button--default {
    width: 96px;
    height: 36px;
    border: 1px solid #DCDFE6;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #606266;
    line-height: 16px;
  }
  /deep/ .el-button--primary {
    width: 96px;
    height: 36px;
    background: #F05259;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 14px;
  }
}
.active {
  transition: 300ms;
  background: #F5F7FA !important;
}
.sign {
  cursor: pointer;
}
</style>