<!--
 * @Author: DaiYu
 * @Date: 2022-09-20 10:34:26
 * @LastEditors: DaiYu
 * @LastEditTime: 2022-09-20 10:36:39
 * @FilePath: \main\src\views\workbench\order-map\components\el-option-node.vue
-->
<template>
    <el-option :key="label + value" :label="source[label]" :value="source[value]">
        <span>{{ source[label] }}</span>
        <span v-if="isRight" style="float: right; color: #939393">{{ source[value] }}</span>
    </el-option>
</template>
<script>
export default {
    name: 'item-component',
    props: {
        index: {
            type: Number,
        }, // 每一行的索引
        source: {
            type: Object,
            default() {
                return {};
            },
        }, // 每一行的内容
        label: {
            type: String,
        }, // 需要显示的名称
        value: {
            type: String,
        }, // 绑定的值
        isRight: {
            type: Boolean,
            default() {
                return false;
            },
        }, // 右侧是否显示绑定的值
    },
};
</script>
