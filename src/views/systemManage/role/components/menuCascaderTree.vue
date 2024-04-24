<template>
    <div>
        <el-cascader clearable :key="refreshKey" :options="options" v-model="menuIds" :props="propsConfig" v-bind="$attrs"></el-cascader>
    </div>
</template>

<script>
// 菜单树
export default {
  name: 'menuCascaderTree',
  props: {
    /**
     * 角色层级
     */
    orgType: {
      type: [String, Number]
    }
  },
  data () {
    return {
      options: [],
      refreshKey: 0,
      menuIds: [],
      propsConfig: {
        // 取消父子级联
        checkStrictly: true,
        lazy: true,
        label: 'name',
        value: 'id',
        leaf: 'isLeaf',
        lazyLoad: this.getMenuTree
      }
    }
  },
  watch: {
    orgType (val) {
      // 懒加载-触发组件重新刷新-执行lazyLoad
      this.refreshKey = Date.now()

      if (val === '' || val === null) {
        this.menuIds = []
        return
      }
    },

    menuIds (val) {
      const v = val[val.length - 1]
      this.$emit('input', v)
    }
  },

  methods: {
    getMenuTree (node, resolve) {
      if (this.orgType === '') {
        resolve([])
        return
      }

      let id = node.level === 0 ? '' : node.value

      // 说明没有子节点了
      if (node.level !== 0 && node.data.isLeaf) {
        resolve([])
        return
      }

      let url = this.$getModuleUrl('/systemManage/role', 'selectMenuTreeLazy')

      this.$axios(url, {
        op: 'selectMenuTreeLazy',
        data: {
          orgType: this.orgType,
          id: id
        }
      }).then(res => {
        let list = JSON.parse(res.data) || []
        resolve(list)
      }).catch((err) => {
        console.log(err)
        resolve([])
      })
    }
  }
}
</script>
