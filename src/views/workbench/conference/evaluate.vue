<template>
    <div class="container">
        <div class="form-content-wrap">
            <div class="letter">
                <div class="recommendTitle">
                    <img class="ending" src="https://wsjc-web.wsecar.com/oa/title_ending.png" alt="" />
                    <img class="mess" src="https://wsjc-web.wsecar.com/oa/img_mess.png" alt="" />
                </div>
                <div class="paddingLetter" v-if="hasData">
                    <div class="panel">
                        <div class="title">人员基本信息</div>
                        <el-form class="basic" label-width="100px" :hide-required-asterisk="routeData.type === 'detail'">
                            <div class="person-wrap">
                                <el-col :span="12">
                                    <span class="label-desc">姓名：</span>
                                    {{ detailData.user.name }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">出行方式：</span>
                                    {{ detailData.staffInfo.travelMode | getTravelMode }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">手机号码：</span>
                                    {{ detailData.user.phone }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">抵达时间：</span>
                                    {{ detailData.staffInfo.arriveTime }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">分支机构：</span>
                                    {{ detailData.user.deptName }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">抵达站点：</span>
                                    {{ detailData.staffInfo.station }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">职位：</span>
                                    {{ detailData.user.positionName }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">班次：</span>
                                    {{ detailData.staffInfo.travelFrequency }}
                                </el-col>

                                <el-col :span="12">
                                    <span class="label-desc">性别：</span>
                                    {{ detailData.user.gender === 1 ? '男' : '女' }}
                                </el-col>
                                <el-col :span="12">
                                    <span class="label-desc">会议状态：</span>
                                    {{ detailData.conference.statusName }}
                                </el-col>

                                <el-col :span="12">
                                    <span class="label-desc">年龄：</span>
                                    {{ detailData.user.age }}
                                </el-col>

                                <div class="person-pic-wrap" v-if="detailData.user.picture">
                                    <img class="preview-pic" :src="detailData.user.picture" alt="" />
                                    <div class="desc">学员照片</div>
                                </div>
                            </div>
                        </el-form>
                    </div>
                    <meeting :info="detailData" />
                    <div class="panel m24">
                        <div class="title">人员学习情况</div>
                        <el-checkbox-group class="study" v-model="form.learnSituation" :disabled="routeData.type === 'detail'">
                            <el-checkbox class="study-tag" v-for="(item, index) in tableData" :key="index" :label="item.templateId">{{ item.templateContent }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="other">
                    <div class="title">其他情况</div>
                    <el-input
                        type="textarea"
                        :rows="5"
                        maxlength="1000"
                        show-word-limit
                        v-model="form.otherSituation"
                        placeholder="请输入该学员在本次学习过程中的其他情况"
                        :disabled="routeData.type === 'detail'"
                    ></el-input>
                    <div class="tip">
                        <img src="https://wsjc-web.wsecar.com/oa/icon_warning.png" alt="" />
                        <div>{{ tip }}</div>
                    </div>
                </div>
            </div>
        </div>

        <ws-footer>
            <el-button @click="goBack">{{ routeData.type === 'detail' ? '返回' : '取消' }}</el-button>
            <el-button v-if="routeData.type !== 'detail'" type="primary" @click="onSubmit">确定</el-button>
        </ws-footer>
    </div>
</template>
<script>
import meeting from './components/meeting.vue'
export default {
    name: 'conferenceManagementForm',
    components: {
        meeting
    },
    data() {
        return {
            form: {
                learnSituation: [],
                otherSituation: '',
                confId: this.$route.query.confId,
                userId: this.$route.query.userId,

                // 提示语的模版id
                templateId: ''
            },
            tip: '',
            detailData: {},
            // rules: {
            //     name: [
            //         {
            //             required: true,
            //             message: '请填写会议主题',
            //             trigger: 'change',
            //         },
            //     ],
            //     name: [
            //         {
            //             required: true,
            //             message: '请填写会议主题',
            //             trigger: 'change',
            //         },
            //     ],
            // },
            tableData: [],
            hasData: false,
            routeData: this.$route.query,
            moduleName: '/workbench/conference/management'
        }
    },
    filters: {
        getTravelMode (val) {
            let e = {
                1: '飞机',
                2: '火车',
                3: '自驾'
            }
            return e[val] || ''
        }
    },
    methods: {
        async getDetail() {
            try {
                let data = {
                    data: JSON.stringify({
                        confId: this.routeData.confId,
                        userId: this.routeData.userId
                    }),
                    op: this.routeData.type ? 'confereeCommentDetails' : 'selectCompleteUserEcho'
                }
                let res = await this.$axios(this.getModuleUrl(data.op), data)

                let resData = JSON.parse(res.data)
                this.hasData = true
                this.detailData = resData
                // 结业推荐信没有 未处理的状态下，查询标签列表
                if (resData.completeResult === null) {
                    // 查询原因
                    this.tableData = await this.getTemplate(1)

                    // 查询提示语 取数组第一个
                    let list = await this.getTemplate(3)

                    if (list.length) {
                        this.tip = list[0].templateContent
                        this.form.templateId = list[0].templateId
                    }
                    return
                }
                
                // 推荐结业信已评价的情况下
                // 标签配置缺陷处理（本来取map的key到模板数据去对应, 模板数据可能被更改导致id对应不上）
                let keys = Object.keys(resData.completeResult.learnMap)
                let values = Object.values(resData.completeResult.learnMap)
                this.form.learnSituation = keys

                keys.forEach((item, index) => {
                    this.tableData.push({
                        templateId: item,
                        templateContent: values[index]
                    })
                })
                this.form.otherSituation = resData.completeResult.otherSituation
                this.tip = resData.completeResult.fixedStr
            } catch (error) {
                console.log('error', error)
            }
        },

        /**
         * 查询模版
         * @param {Number} type 1.原因文案，2.推荐信文案，3.结业信文案
         */

        async getTemplate(type) {
            let data = {
                data: JSON.stringify({ type: type }),
                op: 'selectTemplate'
            }

            try {
                let res = await this.$axios(this.getModuleUrl(data.op), data)

                return JSON.parse(res.data) || []
            } catch (error) {
                return []
            }
        },
        checkForm() {
            let flag = true
            this.$refs['form'].validate(valid => {
                flag = valid
            })
            return flag
        },
        async onSubmit() {
            // if(!this.checkForm()) return
            try {
                let data = {
                    data: JSON.stringify(this.form),
                    op: 'confereeComment'
                }
                const res = await this.$axios(this.getModuleUrl(data.op), data)
                if (res.code === 1) {
                    this.$message.success('已完成评价！')
                    this.goBack()
                }
            } catch (error) {}
        },
        goBack() {
            this.$router.push({
                name: 'conferenceConferee',
                query: {
                    confId: this.routeData.confId
                }
            })
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op)
        }
    },
    mounted() {
        this.getDetail()
    }
}
</script>
<style lang="scss" scoped>
.m24 {
    margin-top: 24px;
}
.container {
    height: 100%;
    width: 100%;
    .form-content-wrap {
        width: 100%;
        min-height: 100%;
        background: #ffffff;
        padding: 32px 0px;
        border-radius: 8px;
        margin-bottom: 64px;
        .letter {
            width: 1000px;
            margin: 0 auto;
            border: 1px solid #ebeef5;
            border-radius: 8px;
            box-sizing: border-box;
            .paddingLetter {
                padding: 0 24px;
            }
            .recommendTitle {
                padding: 0px 24px;
                background-image: linear-gradient(to right, #dadfff, #eef0ff, #dedeff);
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 8px 8px 0 0;
                .ending {
                    width: 150px;
                }
                .mess {
                    width: 56px;
                }
            }
            .panel {
                margin-bottom: 32px;
                .title {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    margin-bottom: 16px;
                }
                .study {
                    padding: 24px;
                    border: 1px solid #ebeef5;
                    border-radius: 8px;
                }
            }
            .other {
                padding: 0 24px;
                padding-bottom: 16px;
                border-radius: 0 0 8px 8px;
                background-image: linear-gradient(#ffffff, #f4f6ff);
                .title {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #303133;
                    margin-bottom: 16px;
                }
                .tip {
                    padding: 10px 16px;
                    margin-top: 16px;
                    background-color: #fef0f0;
                    color: #f56c6c;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                    }
                }
            }
        }
    }
}

.person-wrap {
    position: relative;
    background: #f5f7fa;
    border-radius: 8px;

    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #303133;
    padding-top: 14px;
    padding-bottom: 14px;
    margin-bottom: 24px;

    .label-desc {
        color: #606266;
        display: inline-block;
        width: 100px;
        text-align: right;
        line-height: 20px;
        margin: 10px 0;
    }

    &::after {
        display: block;
        visibility: hidden;
        height: 0;
        clear: both;
        content: ' ';
    }

    .person-pic-wrap {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 88px;
        height: 112px;
        background: #606266;
        border-radius: 8px;
        overflow: hidden;

        .preview-pic {
            width: 88px;
            height: 112px;
        }

        .desc {
            margin-top: 4px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909399;
        }
    }
}
.study-tag {
    margin-right: 24px;
    margin-bottom: 16px;
}
</style>
