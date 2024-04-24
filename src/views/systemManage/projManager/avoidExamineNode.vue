<template>
    <div>
        <template>
            <div class="avoidExamineNode">
                <div class="leftContent">
                    <div class="leftContentTitle">免审节点显示页面</div>
                    <el-form ref="form" :model="form" label-width="120px">
                        <el-form-item label="项目名称：">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="任务名称：">
                            <el-input v-model="form.taskName"></el-input>
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
                                placeholder="变更配置xxxxx"
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
            form: { name: "", taskName: "", textarea: "" },
        };
    },
};
</script>

<style scoped lang="scss">
.avoidExamineNode {
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
