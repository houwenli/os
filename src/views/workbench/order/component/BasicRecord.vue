<template>
    <div class="content-table">
        <table  v-if="endAddrList">   <!-- 修改终点记录 -->
            <thead>
            <tr>
                <td>终点</td>
                <td>修改时间</td>
            </tr>
            </thead>
            <tbody>
                <tr v-for="item in endAddrList">
                    <td>{{item.endAddr}}</td>
                    <td>{{item.updateTime}}</td>
                </tr>
            </tbody>
        </table>
        <table  v-if="rpcRepairVolist">  <!-- 修改修复计费记录记录 -->
            <thead>
            <tr>
                <td>载客里程（公里）</td>
                <td>载客时长（分钟）</td>
                <td>操作时间</td>
                <td>操作人</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in rpcRepairVolist" >
                <td>{{item.mileage|regRiceToKm}}</td>
                <td>{{item.timeCount|regSecondToMinute}}</td>
                <td>{{item.createTime}}</td>
                <td>{{item.userName}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props:['endAddrList', 'rpcRepairVolist'],
}
</script>