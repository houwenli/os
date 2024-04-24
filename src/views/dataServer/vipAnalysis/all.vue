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
                overview: 'overview',
                amountAnalysis: 'amountAnalysis',
                cntAnalysis: 'cntAnalysis',
                saleRank: 'saleRank',
                export: 'export'
            }
        }
    }
}
</script>

<style>

</style>
