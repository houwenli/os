<template>
    <div>
        <h3 class="recordHead">修改记录</h3>
        <el-row class="recordRowOne">
            <el-col :span="12">
                <div class="recordCol">
                    <el-col :span="6" class="tabBoeder">
                        <span class="fr">创建人</span>
                    </el-col>
                    <el-col :span="18">
                        <span class="fl">{{ modifyForm.createName }}</span>
                    </el-col>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="recordCol">
                    <el-col :span="6" class="tabBoeder">
                        <span class="fr">修改人</span>
                    </el-col>
                    <el-col :span="18">
                        <span class="fl">{{ modifyForm.updateName }}</span>
                    </el-col>
                </div>
            </el-col>
        </el-row>
        <el-row class="recordRowTWo">
            <el-col :span="12">
                <div class="recordCol">
                    <el-col :span="6" class="tabBoeder">
                        <span class="fr">创建时间</span>
                    </el-col>
                    <el-col :span="18">
                        <span class="fl">{{ modifyForm.createTime }}</span>
                    </el-col>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="recordCol">
                    <el-col :span="6" class="tabBoeder">
                        <span class="fr">修改时间</span>
                    </el-col>
                    <el-col :span="18">
                        <span class="fl">{{ modifyForm.updateTime }}</span>
                    </el-col>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props: ['modifyForm']
};
</script>

<style scoped lang="scss">
.recordHead {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 24px;
}
.recordRowOne .recordCol {
    border-radius: 4px 4px 0 0;
}
.recordRowTWo .recordCol {
    border-top: 0;
    border-radius: 0 0 4px 4px;
    margin-bottom: 12px;
}
.recordCol {
    border: 1px solid #dcdfe6;
    margin-right: 16px;
    height: 48px;
    line-height: 48px;
    overflow: hidden;
    span {
        padding: 0 15px;
    }
}
.tabBoeder {
    border-right: 0.0625rem solid #dcdfe6;
    background-color: #f5f7fa;
}
</style>
