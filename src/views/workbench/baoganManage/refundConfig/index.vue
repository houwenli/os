<template>
    <div class="bg-page">
        <div class="sidebar"> 
            <tabs></tabs>
        </div>
        <div class="box">
            <div class="border">
                <div class="center">
                    <div class="title">退款和审核操作限制</div>
                    <el-card class="box-card" shadow="hover">
                        <div slot="header" class="header">
                            <div class="left">
                                <span class="detail">详情</span>
                                <span class="desc">退款和审核操作限制</span>
                            </div>
                            <div class="right">
                                <el-button v-if="!isEdit && powerList.update" class="btn" type="text" @click="modify">修改</el-button>
                            </div>
                        </div>
                        <div class="text item" v-for="item in dataList" :key="item.id">
                            <label class="label">{{ item.confName }}：</label>
                            <el-input-number :min="item.min" :max="item.max" v-model="item.confValue" :placeholder="item.remark" :disabled="!isEdit"></el-input-number>
                        </div>
                        <div class="btn" v-if="isEdit">
                            <el-button @click="cancel">取消</el-button>
                            <el-button type="primary" @click="submit">提交设置</el-button>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Tabs from '../components/tabs.vue';
export default {
    components: { Tabs },
    data() {
        this.$regexList.set('int1-28', /^(2[0-8]|1[0-9]|[1-9])$/);
        const ruleArr = [
            { key: 'every_month_operation_time_limit', min: 1, max: 30 },
            { key: 'february_operation_time_limit', min: 1, max: 28 },
        ];
        //这里存放数据
        return {
            dataList: [],
            originData: null,
            isEdit: false,
            ruleMap: new Map(
                ruleArr.map(({ key, min, max }) => {
                    return [key, { rule: this.$regexList.get(`int${min}-${max}`), msg: `${min}-${max}的整数`, min, max }];
                })
            ),
            moduleName: '/workbench/baoganManage/refundConfig',
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        getList() {
            let param = {
                op: 'list',
            };
            let URL = this.getModuleUrl(param.op);
            this.$axios(URL, param).then(res => {
                this.dataList = JSON.parse(res.data);
                this.dataList.forEach(item => {
                    const { min, max } = this.ruleMap.get(item.confKey);
                    item.min = min;
                    item.max = max;
                });
                this.originData = this.$baseMethod.deepClone(this.dataList);
            });
        },
        modify() {
            this.isEdit = true;
        },
        cancel() {
            this.dataList = this.$baseMethod.deepClone(this.originData);
            this.isEdit = false;
        },
        checkdata() {
            let passFlag = true;
            for (let item of this.dataList) {
                const { rule, msg } = this.ruleMap.get(item.confKey);
                if (rule && !rule.test(item.confValue)) {
                    this.$message.error(`${item.confName}需输入${msg}`);
                    passFlag = false;
                    break;
                }
            }
            return passFlag;
        },
        submit() {
            if (this.checkdata()) {
                let param = {
                    data: {
                        list: this.dataList.map(item => ({
                            id: item.id,
                            confKey: item.confKey,
                            confValue: item.confValue,
                        })),
                    },
                    op: 'update',
                };
                let URL = this.powerList.update;
                this.$axios(URL, param).then(res => {
                    this.$message.success('提交成功');
                    this.isEdit = false;
                });
            }
        },
         getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getList();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="scss" scoped>
.bg-page{
    display:flex;
    .sidebar{
        flex:1;
        width:200px;
        margin-right:14px;
    }
    .box {
        display: flex;
        border-radius: 0 0 8px 8px;
        padding: 15px 24px;
        // flex: 1;
        background: #fff;
        width: 100%;
        .border {
            display: flex;
            justify-content:center;
            flex: 1;
            padding: 32px 40px;
            border-radius: 8px;
            border: 1px solid #dcdfe6;
            .title {
                font-weight: 600;
                color: #303133;
                font-size: 16px;
            }
            .center {
                flex: 0 1 1000px;
            }
        }
        .box-card {
            margin-top: 24px;
            ::v-deep {
                .el-card__header {
                    height: 52px;
                    padding: 8px 24px;
                }
                .el-card__body {
                    padding: 24px 32px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 100%;
                    font-size: 14px;
                    .detail {
                        margin-right: 20px;
                        color: #606266;
                        font-weight: 600;
                    }
                    .desc {
                        color: #606266;
                    }
                }
            }
            .item {
                margin-bottom: 18px;
                &:last-of-type {
                    margin-bottom: 0;
                }
            }
            .label {
                width: 130px;
                text-align: left;
                display: inline-block;
                font-weight: normal;
            }
            .btn {
                text-align: center;
            }
            /deep/ input[type='number'] {
                -moz-appearance: textfield;
                &::-webkit-inner-spin-button,
                &::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            }
            /deep/ .el-input-number__decrease,
            /deep/ .el-input-number__increase {
                display: none;
            }
            /deep/ .el-input input {
                padding: 0 15px;
                text-align: left;
                width: 340px;
            }
        }
    }
}


</style>
