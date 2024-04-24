<template>
  <div><com :ops="ops" :category="1" /></div>
</template>

<script>
import com from './common.vue'
export default {
    components: { com },
    data() {
        return {
            ops: {
                overview: 'overviewForWycVip',
                amountAnalysis: 'amountAnalysisForWycVip',
                cntAnalysis: 'cntAnalysisForWycVip',
                saleRank: 'saleRankForWycVip',
                export: 'exportForWycVip'
            }
        }
    }
}
</script>

<style>

</style>