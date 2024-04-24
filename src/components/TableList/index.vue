<template>
    <table class="mailTable" :style="styleObject" v-show="tableData.length > 0">
        <tr v-for="(item,index) in tableData" :key="index">
            <td class="column head">{{ item.label }}</td>
            <td class="column">{{ item.value }}</td>
        </tr>
    </table>
</template>

<script>
export default {
    data() {
        return {
            styleObject: {},
        };
    },
    name: "tableList",
    props: ["tableData", "tableStyle"],
    created() {
        this.styleObject = this.tableStyle;
    },
};
</script>
<style lang="scss" scoped>
.mailTable {
    margin: 0 auto;
    border-radius: 4px;
    border-collapse: collapse;
    border-style: hidden;
    box-shadow: 0 0 0 1px #d8d8d8;
}
.head {
    border-radius: 4px;
    background-color: #f5f7fa;
    text-align: left;
    width: 30%;
}
.column {
    height: 48px;
    border: 1px solid #dcdfe6;
    padding: 0 16px;
}
</style>