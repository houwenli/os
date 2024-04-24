<template>
    <!-- 入学推荐信 -->
    <div class="on-letter-deatil">
        <div class="on-letter-main">
            <img class="on-letter-img" src="@/assets/images/img_title_entrance.png" alt="">
            <div class="on-letter">
                <personal-info :show="true" :type="2"></personal-info>
                <div class="detail" v-for="(item, index) in detailList" :key="index">
                    <header-title :titleName="item.label"></header-title>
                    <el-input type="textarea" :rows="5" :placeholder="item.placeholder" v-model="form[item.key]"
                        maxlength="1000" show-word-limit>
                    </el-input>
                </div>
                <div class="tips">
                    <img style="width:16px;height:16px;margin-right: 3px;" src="@/assets/images/icon_warning.png" alt="">
                    {{tips}}
                </div>
            </div>
        </div>
        <div class="on-letter-btn">
            <el-button class="cancel-btn" @click="cancel">取消</el-button>
            <el-button class="confirm-btn" @click="save">确定</el-button>
        </div>
    </div>
</template>

<script>
// 未使用
import personalInfo from './personalInfo.vue'
export default {
    name: 'onLetterRecomm',
    components: {
        personalInfo
    },
    data() {
        return {
            sizeForm: {
                name: '1',
                region: '1',
                date1: '1',
                date2: '1',
                resource: '1',
                desc: '1'
            },
            tips: '21321321asdasdas',
            form: {
                reson: '',
                g: '',
                b: '',
            },
            detailList: [
                { label: '推荐理由', key: 'reson', placeholder: '请输入推荐本学员的理由' },
                { label: '学员优势', key: 'g', placeholder: '请输入该学员的优势' },
                { label: '学院劣势', key: 'b', placeholder: '请输入该学员的劣势' },
            ],
            isSaved: false
        };
    },

    methods: {

        onBack() {
            this.$router.push({
                name: 'index'
            })
        },
        handleAvatarSuccess(file, fileList) {
            console.log(file, fileList);
        },
        beforeAvatarUpload(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        add() {
            this.tableData.push(
                { date: '', name: '', address: '' }
            )
        },
        delRow(data, index) {
            console.log(this.tableData, "this.tableData")
            this.tableData.splice(index, 1)
        },
        // 入学推荐信填写或查看
        toEdit() {

        },
        onSubmit() {
            console.log('submit!');
        },
        // 不推荐
        cancel() {
            this.$router.push({
                name: 'detailNotice'
            })
        },
        // 提交
        save() {
            // 提交成功 变成修改
            this.isSaved = true
        }
    }
};
</script>

<style scoped lang="scss">
.on-letter-deatil {
    // width: 100%;
    // min-height: 100%;
    .on-letter-main {
        width: 100%;
        border-radius: 8px;
        border: 1px solid #DCDFE6;
        .on-letter-img {
            width: 100%;
            display: inline-block;
        }
        .on-letter {
            border-radius: 0px 0px 8px 8px;
            padding: 16px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 70%, #F4F6FF 100%);

            .personal-form {
                // border: 1px solid #EBEEF5;
                width: 100%;
                display: inline-block;
                background: #F5F7FA;
                padding: 16px 24px;
                border-radius: 8px;

                /deep/.el-form-item__label {
                    color: #606266;
                }
            }
            .tips {
                padding: 16px 0;
                background: #FEF0F0;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 400;
                color: #F56C6C;
                padding: 10px 16px;
                display: flex;
                align-items: center;
                margin-top: 12px;
                word-break: break-all;
                span {
                    color: #F56C6C;
                }
            }
        }
    }
    .on-letter-btn {
        text-align: center;
        margin: 40px 20px;
        font-size: 14px;
        .cancel-btn {
            min-width: 160px;
            height: 36px;
            font-weight: 400;
            color: #606266;
        }
        .confirm-btn {
            min-width: 160px;
            height: 36px;
            background: #F05259;
            border-radius: 4px;
            color: #fff
        }
    }
}
</style>