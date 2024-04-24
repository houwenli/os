<template>
  <div><com :ops="ops" :category="3" /></div>
</template>

<script>
import com from './common.vue'
export default {
    components: { com },
    data() {
        return {
            ops: {
                overview: 'overviewForDjVip',
                amountAnalysis: 'amountAnalysisForDjVip',
                cntAnalysis: 'cntAnalysisForDjVip',
                saleRank: 'saleRankForDjVip',
                export: 'exportForDjVip'
            }
        }
    }
}
</script>

<style>

</style>