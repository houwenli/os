<template>
    <div>
        <!-- 个人投诉 -->
        <el-card :class="complaint === 'toComplaint'?'toComplaintBox':'mycomplaintBox'">
            <el-row type="flex" justify="center">
                <!--  tab切换 -->
                <el-button-group>
                    <el-radio-group v-model="complaint">
                        <el-radio-button label="toComplaint">我要投诉</el-radio-button>
                        <el-radio-button label="myComplaint">我的投诉单</el-radio-button>
                    </el-radio-group>
                </el-button-group>
            </el-row>
            <!-- 表单/列表 -->
            <component :is="complaint" @submitSuccess="submitSuccess"></component>
        </el-card>
    </div>
</template>

<script>
import toComplaint from './toComplaint.vue';
import myComplaint from './myComplaint.vue';
export default {
    name: 'components',
    components: { toComplaint, myComplaint },
    data() {
        return {
            // tab
            complaint: 'toComplaint'
        };
    },
    component: {
        toComplaint,
        myComplaint
    },

    methods: {
        submitSuccess() {
            this.complaint = 'myComplaint';
        }
    }
};
</script>

<style lang="scss" scoped>
.toComplaintBox {
    min-height: calc(100% - 64px);
    margin-bottom: 64px;
    box-shadow: none;
    border-radius: 8px;
}
.mycomplaintBox{
    min-height: 100%;
    box-shadow: none;
    border-radius: 8px;
}
/deep/ .el-card__body {
    padding: 32px 0 0 !important;
}
</style>
