<template>
  <div><com :ops="ops" :category="2" /></div>
</template>

<script>
import com from './common.vue'
export default {
    components: { com },
    data() {
        return {
            ops: {
                overview: 'overviewForVirtualVip',
                amountAnalysis: 'amountAnalysisForVirtualVip',
                cntAnalysis: 'cntAnalysisForVirtualVip',
                saleRank: 'saleRankForVirtualVip',
                export: 'exportForVirtualVip'
            }
        }
    }
}
</script>

<style>

</style>