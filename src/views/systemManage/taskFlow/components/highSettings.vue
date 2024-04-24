<template>
    <div class="setting-panel">
        <div class="setting-item">
            <div class="left">
                <div class="left-icon">
                    <img src="../../../../assets/icons/icon_apostille@2x.png" alt="" />
                </div>
                <div class="left-text">
                    <div class="text-tips">是否开启加签功能</div>
                    <div class="tips">开启后审批单可以新增临时审批人</div>
                </div>
            </div>
            <el-switch :disabled="disabled" v-model="formModel.addSign" :active-value="1" :inactive-value="0"></el-switch>
        </div>
        <div class="setting-item">
            <div class="left">
                <div class="left-icon">
                    <img src="../../../../assets/icons/icon_turn@2x.png" alt="" />
                </div>
                <div class="left-text">
                    <div class="text-tips">是否开启转交功能</div>
                    <div class="tips">开启后审批单可以转交给其他审批人</div>
                </div>
            </div>
            <el-switch :disabled="disabled" v-model="formModel.addTrans" :active-value="1" :inactive-value="0"></el-switch>
        </div>
        <div class="setting-item">
            <div class="left">
                <div class="left-icon">
                    <img src="../../../../assets/icons/icon_send@2x.png" alt="" />
                </div>
                <div class="left-text">
                    <div class="text-tips">是否开启加抄功能</div>
                    <div class="tips">开启后审批人在审核通过时可以添加抄送人</div>
                </div>
            </div>
            <el-switch :disabled="disabled" v-model="formModel.addCcTask" :active-value="1" :inactive-value="0"></el-switch>
        </div>
        <div class="setting-item">
            <div class="left">
                <div class="left-icon">
                    <img src="../../../../assets/icons/icon_comment.png" alt="" />
                </div>
                <div class="left-text">
                    <div class="text-tips">是否开启评论功能</div>
                    <div class="tips">开启后审批人，抄送人可以添加评论</div>
                </div>
            </div>
            <el-switch :disabled="disabled" v-model="formModel.addComment" :active-value="1" :inactive-value="0"></el-switch>
        </div>
        <div class="setting-item">
            <div class="left">
                <div class="left-icon">
                    <img src="../../../../assets/icons/icon_send@2x.png" alt="" />
                </div>
                <div class="left-text">
                    <div class="text-tips">审批人自动去重</div>
                    <div class="tips">审批流程中审批人重复出现时，只需审批一次，其余自动通过</div>
                </div>
            </div>
            <el-switch :disabled="disabled" v-model="formModel.checkFilter" :active-value="1" :inactive-value="0"></el-switch>
        </div>
        <div class="setting-item">
            <div class="left">
                <div class="left-icon">
                    <img src="../../../../assets/icons/icon_comment.png" alt="" />
                </div>
                <div class="left-text">
                    <div class="text-tips">发起人审批自动去重</div>
                    <div class="tips">发起人和审批人是同一个人，审批自动通过</div>
                </div>
            </div>
            <el-switch :disabled="disabled" v-model="formModel.startFilter" :active-value="1" :inactive-value="0"></el-switch>
        </div>
    </div>
</template>

<script>
export default {
  name: 'highSettings',
  props: {
    config: {
      type: Object,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formModel: {
        addSign: false,
        addTrans: false,
        addCcTask: false,
        addComment:false,
        checkFilter:false,
        startFilter:false
      }
    }
  },
  watch: {
    formModel: {
      deep: true,
      handler (val) {
        this.$emit('update', val)
      }
    }
  },

  mounted () {
    if (this.config && Object.keys(this.config).length) {
      Object.assign(this.formModel, this.config)
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-panel {
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    justify-content: space-between;

    .setting-item {
        width: 518px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 8px;
        border: 1px solid #dcdfe6;
        padding: 20px 20px 20px 12px;
        margin-bottom: 16px;
        box-sizing: border-box;
    }
    .left {
        display: flex;
    }
    img {
        width: 40px;
        height: 40px;
        margin-right: 12px;
        -webkit-user-drag: none;
    }
    .text-tips {
        margin-right: 16px;
    }

    .tips {
        margin-top: 12px;
        color: #c0c4cc;
    }
}
</style>
