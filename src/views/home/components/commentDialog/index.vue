
<template>
    <div>
        <el-dialog title="留言" :visible.sync="dialogVisible" width="50%" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="formModel" :rules="rules" ref='form'>
                <el-form-item prop='comment'>
                  <el-input type="textarea" v-model="formModel.comment" placeholder="说点什么吧" maxlength="300" show-word-limit rows='6'></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" style="text-align: right">
                <el-button @click="closeModal">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { debounce } from 'lodash-es'

export default {
  name: 'detail',
  props: {
    value: {
      type: Boolean,
      require: true
    }
  },
  data () {
    return {
      formModel: {
        comment: ''
      },
      rules: {
        comment: [
          { required: true, message: '请输入留言内容', trigger: ['change', 'blur'] }
        ]
      }
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
    }
  },
  methods: {
    checkForm() {
      let isOk = true
      this.$refs['form'].validate(valid => {
        isOk = valid
      })

      return isOk
    },
    closeModal () {
      this.dialogVisible = false
    },
    submit: debounce(async function () {
      console.log(this.checkForm())
      if (!this.checkForm()) return

      try {
        this.$emit('updateData')

        this.dialogVisible = false
      } catch (e) {
        this.$message.error(e.message)
      }
    }, 2000, {
      leading: true,
      trailing: false
    })
  }
}
</script>
