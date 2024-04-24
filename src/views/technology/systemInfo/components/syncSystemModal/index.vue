<template>
  <div>
    <el-dialog title="系统同步" :visible.sync="dialogVisible" width="40%" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="systemSyncForm" :model="formModel" :rules="rules" label-width="120px">
        <el-form-item label="同步系统：" prop="oaSysInfoId" style="width: 100%">
          <el-select v-model="formModel.oaSysInfoId" filterable clearable placeholder="请选择需要同步的系统" :disabled="loading" style="width: 100%">
            <el-option v-for="(item, index) in systemListOptions" :key="index" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: right">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="onCheckSystemSyncForm" :disabled="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 同步子系统
export default {
  name: 'syncSystemModal',
  props: {
    value: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      moduleName: '/technology/systemInfo',
      formModel: {
        oaSysInfoId: ''
      },

      systemListOptions: [],
      loading: false,

      rules: {
        oaSysInfoId: [
          {
            required: true,
            message: '请选择需要同步的系统',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },

  created() {
    this.getSystemListOptions()
  },

  methods: {
    closeModal() {
      this.dialogVisible = false
    },
    /**
     * 查询子系统列表
     */
    async getSystemListOptions() {
      try {
        let res = await this._axios(
          {
            op: 'selectListByFuzzName'
          },
          '',
          '/authority/systemInfo/select'
        )

        console.log(res)

        this.systemListOptions = res.data || []
      } catch (error) {
        this.$message.error('获取子系统列表失败')
      }
    },
    onCheckSystemSyncForm() {
      let isOk = true

      this.$refs['systemSyncForm'].validate(valid => {
        isOk = valid
      })

      if (isOk) {
        this.onSync()
      }
    },
    /**
     * 同步子系统
     */
    async onSync() {
      this.loading = true

      try {
        let url = this.$getModuleUrl(this.moduleName, 'syncSystemMenusFromOA')
        if (!url) {
          this.$message.error('帐号无权限')
          return
        }

        await this.$axios(url, {
          data: {
            oaSysInfoId: this.formModel.oaSysInfoId
          },
          op: 'syncSystemMenusFromOA'
        })

        this.$message.success('同步成功')
        this.$emit('updateData')

          this.dialogVisible = false
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
