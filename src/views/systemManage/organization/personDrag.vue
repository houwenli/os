<template>
  <div class="bigbox">
    <div class="title">{{companyTitle}}</div>
    <div class="deptCard">{{ dataInfo.deptFullName }}</div>
    <div class="dragContent">
        <div class="personTh" :style="tableWidth ? '' : 'padding-right:8px'">
          <span style="border-radius:8px 0px 0px 0px;background-color: #F5F7FA;">名称</span>
          <span style="background-color: #F5F7FA;">职位</span>
          <span style="background-color: #F5F7FA;">工号</span>
          <span style="border-radius: 0px 8px 0px 0px;background-color: #F5F7FA;">操作</span>
        </div>
        <div class="ulContent" v-if="listLength > 0">
          <transition-group name="drag" class="list" tag="ul">
          <li
              @dragenter="dragenter($event, index)"
              @dragover="dragover($event, index)"
              @dragstart="dragstart(index)"
              draggable
              v-for="(item, index) in dataInfo.userList"
              :key="item.userId"
              class="list-item"
          >
              <span>{{item.userName}}</span>
              <span>{{item.positionName}}</span>
              <span>{{item.code}}</span>
              <span class="iconDrag">
                <img src="../../../assets/icons/icon_drag.png" alt="">
              </span>
          </li>
          </transition-group>
        </div>
        <div class="nolist" v-else>
          <div>
            <img src="../../../assets/images/default-table-content.png" alt="">
            <p>暂无您需要的数据</p>
          </div>
        </div>
    </div>
    <div class="buttonArea">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>  
</template>
<script>
export default {
  data() {
    return {
      dragIndex: "",
      enterIndex: "",
      tableWidth:true,
      listLength:''
    };
  },
  props: {
    departmentName: {
        // 部门名称
        type: String,
        default: '',
    },
    dataInfo: {
        // 部门类型
        type: Object,
        default: () => {},
    },
    companyTitle: {
      type:String,
      default:''
    }
  },
  created() {
    this.listLength = this.dataInfo.userList ? this.dataInfo.userList.length : 0
  },
  mounted() {
    if(this.listLength > 0) {
      let h1 = document.querySelector('.ulContent').clientHeight
      let h2 = document.querySelector('.list').clientHeight
      this.tableWidth = h1 > h2
    }
  },
  methods: {
    dragstart(index) {
      this.dragIndex = index;
    },
    dragenter(e, index) {
      e.preventDefault();
      if (this.dragIndex !== index) {
        const moving = this.dataInfo.userList[this.dragIndex];
        this.dataInfo.userList.splice(this.dragIndex, 1);
        this.dataInfo.userList.splice(index, 0, moving);
        this.dragIndex = index;
      }
    },
    dragover(e, index) {
      e.preventDefault();
    },
    cancel() {
      this.$emit('savePerson',1)
    },
    save() {
      let list = this.dataInfo.userList.map((item,index) => {
        return {
          userId : item.userId,
          deptId : this.dataInfo.id,
          sort: index + 1
        }
      })
      this.$emit('savePerson',2,list)
    }
  },
};
</script>
<style lang="scss" scoped>
.ulContent {
  overflow: auto;
  height: calc(100% - 40px);
}
.nolist {
  height: calc(100% - 40px);
  border: 1px solid #DCDFE6;
  border-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    margin-bottom: 12px;
  }
}
.bigbox {
  padding: 25px;
  padding-bottom: 24px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #303133;
    padding-bottom: 16px;
    border-bottom: 1px solid #DCDFE6;
  }
  .deptCard {
    padding: 12px 16px;
    background-color: #F8F8F8;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    margin: 24px 0
  }
  .dragContent {
    width: 100%;
    height: 80%;
    overflow: auto;
    .personTh {
      width: 100%;
      display: block;
    }
    .list {
      list-style: none;
      border-bottom: 1px solid #EBEEF5;
      .drag-move {
        transition: transform 0.3s;
      }
      .list-item {
        color: #606266;
        text-align: center;
        display: flex;
        .iconDrag {
          display: flex;
          align-items: center;
          img {
            width: 20px;
          }
        }
      }
    }
    span {
      text-align: left;
      padding: 10px 16px;
      width: 25%;
      display: inline-block;
      border-top: 1px solid #EBEEF5;
      border-right: 1px solid #EBEEF5;
    }
    .personTh,
    li {
      span:nth-of-type(1) {
        border-left: 1px solid #EBEEF5;
      }
    }
    
  }
  .buttonArea {
    display: flex;
    justify-content: center;
    padding-top: 24px;
    button {
      width: 160px;
    }
  }
}

</style>
