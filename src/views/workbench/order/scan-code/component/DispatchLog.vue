<template>
    <div class="wrapper orderinfo">
        <div class="wrapper-content" >
            <el-collapse v-model="activeNames">
                <el-collapse-item title="分单日志" name="1">
                    <dispatchLogs  fromPage="scanCode"></dispatchLogs>
                </el-collapse-item>
            </el-collapse>
        </div>
        
    </div>
</template>
<script>

import dispatchLogs from '../../component/DisPatchLogs'
export default {
    components: {
        dispatchLogs
    },
    data(){
        return {
            activeNames: '1',
        }
    },
}
</script>