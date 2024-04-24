<template>
    <div>
        <template>
            <div class="externalReview">
                <div class="leftContent">
                    <div class="leftContentTitle">申请需求外审</div>
                    <el-form ref="form" :model="form" label-width="120px">
                        <el-form-item label="项目名称：">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="参会人员：">
                            <el-col :span="4">
                                <el-input style="width: 100%"></el-input>
                            </el-col>
                            <el-col :span="19" :offset="1">
                                <el-input style="width: 100%"></el-input
                            ></el-col>
                            <el-col :span="4">
                                <el-input
                                    style="width: 100%; margin-top: 10px"
                                ></el-input>
                            </el-col>
                            <el-col :span="19" :offset="1">
                                <el-input
                                    style="width: 100%; margin-top: 10px"
                                ></el-input
                            ></el-col>
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
.externalReview {
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
    }
}
</style>
