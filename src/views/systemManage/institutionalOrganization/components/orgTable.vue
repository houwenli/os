<template>
    <div>
        <table class="mailTable" v-if="tableType=='orgType'">
            <tr>
                <td class="column tittle">机构类型</td>
                <td class="column head" v-if="orgType==4">大区</td>
                <td class="column head" v-if="orgType!=30 && orgType!=40">一级机构</td>
                <td class="column head" v-if="orgType!=40">二级机构</td>
                <td class="column head">实体店</td>
                <td class="column tittle">总计</td>
            </tr>
            <tr>
                <td class="column tittle-content"> 数量 </td>
                <td class="column content" v-if="orgType==4">{{ tableData.bigRegionNum}}</td>
                <td class="column content" v-if="orgType!=30 && orgType!=40">{{ tableData.companyNum}}</td>
                <td class="column content" v-if="orgType!=40">{{ tableData.centerNum}}</td>
                <td class="column content">{{ tableData.stationNum}}</td>
                <td class="column tittle-content">{{ tableData.totalCount}}</td>
            </tr>
        </table>
        <table class="mailTable" v-if="tableType=='orgStatus'">
            <tr>
                <td class="column tittle">状态</td>
                <td class="column head">正常</td>
                <td class="column head">锁定</td>
                <td class="column head">停运</td>
                <td class="column head">禁止入驻</td>
                <td class="column tittle">总计</td>
            </tr>
            <tr>
                <td class="column tittle-content"> 数量 </td>
                <td class="column content">{{ tableData.normalCount}}</td>
                <td class="column content">{{ tableData.lockingCount}}</td>
                <td class="column content">{{ tableData.shutdownCount}}</td>
                <td class="column content">{{ tableData.noEntryCount}}</td>
                <td class="column tittle-content">{{ tableData.totalCount}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    name: 'orgTable',
    props: {
        tableData: {
            type: Object,
            default: '',
        },
        //orgType机构类型，orgStatus机构状态
        tableType: {
            type: String,
            default: '',
        },
        //4：总区
        // 5：大区
        // 20：分公司
        // 30：服务中心
        // 40：实体店/服务站
        orgType: {
            type: Number,
            default: '',
        },
    },
};
</script>
<style lang="scss" scoped>
.mailTable {
    border-radius: 4px;
    border-collapse: collapse;
    border-style: hidden;
    box-shadow: 0 0 0 1px #d8d8d8;
    .head {
        font-size: 14px;
        font-weight: 600;
        color: #606266;
        border-radius: 4px;
        text-align: left;
        width: 200px;
        background: #f5f7fa;
    }
    .tittle {
        font-size: 14px;
        font-weight: 600;
        color: #606266;
        border-radius: 4px;
        text-align: left;
        width: 110px;
        background: #f5f7fa;
    }
    .tittle-content {
        border-radius: 4px;
        text-align: left;
        width: 110px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
    }
    .content {
        border-radius: 4px;
        text-align: left;
        width: 200px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
    }
    .column {
        height: 40px;
        border: 1px solid #dcdfe6;
        padding: 0 16px;
    }
}
</style>