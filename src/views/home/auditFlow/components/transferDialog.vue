<template>
    <div v-loading="loading">
        <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="formModel" label-width="90px">
                <el-form-item label="转交备注" prop="remark">
                    <el-input type="textarea" v-model="formModel.remark" maxlength="500" rows="8" placeholder="请输入转交备注" show-word-limit></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" style="text-align: center">
                <el-button @click="closeModal">取消</el-button>
                <el-button type="danger" @click="submit">确认转交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { debounce } from 'lodash-es'
import { mapGetters } from 'vuex'

export default {
  name: 'transferDialog',
  props: {
    value: {
      type: Boolean,
      require: true
    },

    /**
     * 流程id
     */
    procinstId: {
      type: [String, Number]
    },

    /**
     * 转交人数据
     */
    list: {
      type: Array,
      default: () => []
    },

    /**
     * 任务id
     */
    taskId: {
      type: String,
      required: true
    },
    /**
     * 审批流中当前节点-用户id
     */
    currentNodesUserIds: {
      type: Array,
      default: () => []
    },
    approvalType: {
      type: Number
    }
  },
  data () {
    return {
      formModel: {
        remark: ''
      },
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('update:value', val)
      }
    },
    title () {
      return `转交给${this.list[0].name}`
    },
    ...mapGetters(['login/userInfo'])
  },
  methods: {
    /**
     * @return {Boolean} 检查添加的节点人员和当前审批的人是否存在重复
     */
    checkDuplicatePerson () {
      // 获取当前登录帐号的信息，转交人，或者加抄人不能是自己
      const userId = this['login/userInfo'].id
      const selectedUserIds = this.list.map(p => p.id)

      if (userId && selectedUserIds.includes(userId)) return false

      return !this.currentNodesUserIds.some(p => selectedUserIds.includes(Number(p)))
    },
    closeModal () {
      this.dialogVisible = false
    },

    submit: debounce(async function () {
      if (!this.checkDuplicatePerson()) {
        this.$message.warning('审核人已存在，不可重复添加')
        return
      }

      this.loading = true

      try {
        const url = this.$getModuleUrl('/index/todo', 'complete')
        const params = {
          op: 'complete',
          data: {
            procinstId: this.procinstId,
            changeUserIds: [this.list[0].id],
            changeType: 4,
            ...this.formModel,
            taskId: this.taskId,
            approvalType: this.approvalType
          }
        }

        await this.$axios(url, params)
        this.dialogVisible = false

        this.$message.success('转交成功')
        this.$router.replace({
          name: 'index'
        })
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }, 3000, {
      leading: true,
      trailing: false
    })
  }
}
</script>
