<template>
    <div>
        <!-- 一级标题 -->
        <div class="ws-first-level-title" v-if='title || $slots.title'>
            <template v-if="$slots.title">
                <slot name="title"></slot>
            </template>
            <template v-if="title">{{ title }}</template>
        </div>

        <div class="list-table-panel" :class='showBorder?"list-table-panel-border" : ""'>
            <div class="default-bg" v-if="$slots.content">
                <slot name="content"></slot>
            </div>

            <div class="list-container">
                <el-table :data="list" v-bind="$attrs" :header-cell-style="{ background: '#F5F7FA' }" border>
                    <el-table-column type="index" width="50" label="序号" :index="indexMethod" />
                    <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" v-bind="item">
                        <!-- 这里要想使用slot 只能这样写 -->
                        <template slot-scope="{ row, column, $index }">
                            <div v-if="item.slotName">
                                <slot :name="item.slotName" v-bind="{ row, column, $index }"></slot>
                            </div>

                            <template v-else>{{ row[item.prop] }}</template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
// 纯UI组件 - 请不要在内部添加任何的业务逻辑和业务场景判断
export default {
  name: 'showTable',
  props: {
    // 表格描述
    columns: {
      type: Array,
      default: () => []
    },
    // 表格数据
    list: {
      type: Array,
      default: () => []
    },
    /**
     * 一级标题
     */
    title: {
      type: String,
      default:''
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    showBorder: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    indexMethod(index) {
      return index + 1
    }
  }
}
</script>

<style lang='scss' scoped>
// 一级标题
.ws-first-level-title {
    position: relative;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #333;
    padding-left: 8px;
    margin-top: 32px;
    margin-bottom: 16px;

    &::before {
        position: absolute;
        left: 0;
        top: 3px;
        content: ' ';
        width: 4px;
        height: 16px;
        background: #f05259;
        border-radius: 0px 84px 84px 0px;
    }
}

.list-table-panel {
    margin: 16px 0;
    padding: 16px;
    border-radius: 4px;
}
.list-table-panel-border {
  border: 1px solid #dcdfe6;
}

.list-container {
    border-radius: 8px;
    overflow: hidden;

    /deep/ .el-table {
        .el-table__header-wrapper .el-table__cell {
            font-size: 14px;
            font-weight: 600;
            color: #666;
        }
    }
}

.default-bg {
    width: 100%;
    box-sizing: border-box;
    background: #f5f7fa;
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 24px;
}
</style>
