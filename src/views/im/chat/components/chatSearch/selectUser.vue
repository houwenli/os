<template>
  <div>
    <el-dialog title="选择发送人" :before-close="cancel" :visible.sync="visible" width="1140px">
      <div class="read-list">
        <el-row class="row-con">
          <el-col class="col-con1 " :span="12">
            <el-tag
              v-for="(tag, index) in checkedMember"
              :key="tag.userID"
              type="info"
              closable
              @close="handleTagClose(index)"
            >
              {{ tag.nick }}
            </el-tag>
            <el-autocomplete
              class="tagInput"
              popper-class="selectOption"
              v-model="group"
              :fetch-suggestions="querySearch"
              placeholder="请搜索昵称"
              @select="handleTagSelect"
            >
              <template slot-scope="{ item }">
                <div class="readListWrap">
                  <div class="readListAvatar">
                    <img :src="item.url ? item.url : head_user" alt="" />
                  </div>
                  <div>
                    <div class="readListName">{{ item.nick }}</div>
                  </div>
                </div>
              </template>
            </el-autocomplete>
            <div class="btn">
              <el-button @click="cancel">取消</el-button>
              <el-button
                :class="[checkedMember.length > 0 ? 'checkedBtn' : '']"
                @click="sureMember"
                >确定({{ checkedMember.length }}/{{
                  getMemberList.length
                }})</el-button
              >
            </div>
          </el-col>
          <el-col class="col-con1" :span="12">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="checkedMember"
              @change="handleMemberChange"
              :max="10"
            >
              <div class="checkList">
                <el-checkbox
                  v-for="(member, index) in getMemberList"
                  :label="member"
                  :key="index"
                >
                  <!-- <img :src="member.avatar ? member.avatar : head_user" alt="" /> -->
                  <head-img :imgUrl="member.avatar || member.url" :headName="member.nick || member.name || member.userID" :other_w="'is32w'" style="display: flex;"></head-img>
                  <span>{{ member.nick }}</span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import head_user from "@/assets/images/chat/head_user.png";
import HeadImg from "../headImg"
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    HeadImg
  },
  data() {
    return {
      group: '',
      checkedMember: [],
      isIndeterminate: true,
      checkAll: false,
      head_user,
      params: {
        userIds: []
      }
    }
  },
  computed: {
    getMemberList() {
      return this.userList
    }
  },
  methods: {
    handleTagClose(index) {
      this.checkedMember.splice(index, 1);
    },
    handleTagSelect(item) {
      if (!JSON.stringify(this.checkedMember).includes(JSON.stringify(item))) {
        this.checkedMember.push(item);
      }
    },
    cancel() {
      this.$emit('update:visible', false)
    },
    handleCheckAllChange(val) {
      if(this.getMemberList.length > 10) {
        this.$message.error('最多只能选择10个!')
        return false
      }
      this.checkedMember = val ? this.getMemberList : [];
      this.isIndeterminate = false;
    },
    handleMemberChange(value) {
      let checkedCount = value.length;
      if (checkedCount > 10) {
        this.$message.error('最多只能选择10个!')
        return false
      }
      this.checkAll = checkedCount === this.getMemberList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.getMemberList.length;
    },
    handleTagClose(index) {
      this.checkedMember.splice(index, 1);
    },
    querySearch(queryString, cb) {
      var restaurants = this.getMemberList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.nick.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleTagSelect(item) {
      if (!JSON.stringify(this.checkedMember).includes(JSON.stringify(item))) {
        this.checkedMember.push(item);
      }
    },
    sureMember() {
      this.params.userIds = [];
      this.checkedMember.forEach((item) => {
        this.params.userIds.push(item.userID);
      });
      this.$emit('success', this.params.userIds, this.checkedMember)
      this.cancel();
    }
  }
}
</script>

<style lang="scss" scoped>
.read-list {
    border-top: 1px solid #dcdfe6;
    .row-con {
        .col-con1 {
            height: 509px;
            border-right: 1px solid #dcdfe6;
            padding: 20px;
            position: relative;
            overflow: auto;
            .input {
                /deep/ .el-input__inner {
                    border: none;
                }
            }
            .btn {
                position: absolute;
                left: 30px;
                bottom: 30px;
            }
        }
    }
    /deep/ .el-checkbox {
        display: flex;
        padding-top: 10px;
        img {
            width: 32px;
            height: 32px;
            vertical-align: bottom;
        }
        span {
            margin-left: 10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
}
.readListBox {
    display: flex;
}
.tagInput {
    width: auto !important;
    flex: 1;
    /deep/ .el-input__inner {
        border: none;
        &:focus,
        &:active,
        &:hover {
            border: none !important;
        }
    }
}
.center {
    display: flex;
    justify-content: center;
    padding-top: 15px;
}
.chooseMember {
    height: 36px;
    line-height: 36px;
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding-left: 10px;
    cursor: pointer;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c0c4cc;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
/depp/ .el-autocomplete-suggestion {
    color: red !important;
    width: 1000px !important;
    div.el-scrollbar {
        width: 368px;
        height: 398px;
        overflow: auto;
    }
}
.readListWrap {
    display: flex;
    padding: 11px 0;
    .readListAvatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .readListName {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #303133;
        line-height: 14px;
    }
    .readListPhone {
        width: 211px;
        height: 14px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #909399;
        line-height: 14px;
    }
}
.checkedBtn {
    background: #f05259;
    color: #fff;
}
.el-tag.el-tag--info {
    margin: 0 5px 5px 0 !important;
}
</style>