<template>
    <div>
        <template v-if="$route.meta.isNestRoute">
            <div class="framworkReview">
                <div class="leftContent">
                    <div class="leftContentTitle">架构方案评审</div>
                    <el-form ref="form" :model="form" label-width="120px">
                        <el-form-item label="项目名称：">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="附件：">
                            <div class="attachFile">
                                <i class="el-icon-link"></i>
                                <span>文件名.wav</span>
                                <span>(1.06M)</span>
                                <span style="color: blue">下载</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="描述说明：">
                            <el-input
                                type="textarea"
                                :rows="5"
                                placeholder="此原型涉及数据中心、订单系统等功能模块"
                                v-model="form.textarea"
                            >
                            </el-input
                        ></el-form-item>
                    </el-form>
                </div>
                <div style="width: 50%"></div>
            </div>
        </template>
        <router-view v-else />
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: { name: "", textarea: "" },
        };
    },
};
</script>

<style scoped lang="scss">
.framworkReview {
    width: 100%;
    display: flex;
    .leftContent {
        width: 50%;
        .leftContentTitle {
            height: 50px;
            display: flex;
            justify-content: center;
            color: blue;
        }
        .attachFile {
            display: flex;
            align-items: baseline;
            column-gap: 10px;
        }
    }
}
</style>
