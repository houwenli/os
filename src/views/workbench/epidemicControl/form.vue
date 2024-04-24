<template>
    <div class="epidemicControlEdit">
        <div class="box">
            <div class="wrap">
                <h3 class="base-txt">基础配置</h3>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="ruleForm">
                    <div class="topS" v-loading="loading">
                        <el-form-item prop="rangeType" label="控制范围" class="scope">
                            <el-select v-model="ruleForm.rangeType" placeholder="请选择控制范围" clearable :disabled="type !== 'add'" @change="typeChange">
                                <el-option v-for="item in scopes" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="cityCode" label="城市" class="scope">
                            <ws-city
                                ref="mcity"
                                :key="'city' + type"
                                v-if="ruleForm.rangeType === 1"
                                v-model="ruleForm.cityCode"
                                :data="cityData"
                                :disabled="type !== 'add'"
                                @change="cityChange"
                                :multiple="type === 'add'"
                                :defaultProps="{ checkStrictly: true }"
                            ></ws-city>
                            <ws-city
                                v-if="ruleForm.rangeType !== 1"
                                key="city2"
                                v-model="ruleForm.cityCode"
                                level="2"
                                :data="cityDataDianzi"
                                :disabled="type !== 'add'"
                                @change="cityChange"
                                :defaultProps="{ checkStrictly: false }"
                            ></ws-city>
                        </el-form-item>
                        <el-form-item prop="fenceCode" label="围栏" v-if="ruleForm.rangeType === 2">
                            <el-select v-model="ruleForm.fenceCode" placeholder="请选择围栏" clearable :disabled="type !== 'add'">
                                <el-option v-for="item in fenceCodes" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
                <el-collapse v-model="activeNames" v-loading="loading">
                    <Prove ref="proveCom" :datas="prove" :disabled="disabled" :nodeNames="nodeNames" />
                    <Photolnfos ref="photolnfosCom" :datas="pic" :disabled="disabled" :nodeNames="nodeNames" />
                    <Warn ref="warnCom" :datas="noticeInfo" :disabled="disabled" />
                </el-collapse>
            </div>
            <div class="footer">
                <el-button @click="handelCancel()">{{ disabled ? '返 回' : '取 消' }}</el-button>
                <el-button type="primary" @click="handelSave()" v-if="!disabled" :loading="saveLoading">确 认</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Warn from './components/warn.vue';
import Prove from './components/prove.vue';
import Photolnfos from './components/photoInfos.vue';

export default {
    name: 'epidemicControlDetail',
    components: { Warn, Prove, Photolnfos },
    data() {
        return {
            type: 'add',
            ruleForm: {
                rangeType: 1,
                cityCode: '',
                fenceCode: null,
            },
            // 健康证明
            prove: {
                open: false,
                healthNodes: [],
                healthApproves: [
                    { approveType: 1, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false },
                    { approveType: 4, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false },
                    { approveType: 2, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false },
                    { approveType: 3, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false, delayDay: '' },
                ],
            },
            // 防疫拍照
            pic: {
                open: false,
                photoInfos: [
                    { photoType: 5, alias: '', description: '', picUrl: '', open: false },
                    { photoType: 6, alias: '', description: '', picUrl: '', open: false },
                    { photoType: 7, alias: '', description: '', picUrl: '', open: false },
                ],
                photoNodes: [],
                controlFrequency: '',
            },
            // 防疫提醒
            noticeInfo: {
                open: false,
                picUrl: '',
                title: '请在开始计费前确认以下信息',
                subTitle: '如不符合请与乘客沟通',
                content1: '确认乘客手机尾号为',
                content2: '确认乘客健康码为',
                content3: '确认乘客是否佩戴口罩',
            },
            rules: {
                rangeType: [{ required: true, message: '请选择控制范围', trigger: 'blur' }],
                cityCode: [{ required: true, message: '请选择城市', trigger: 'blur' }],
                fenceCode: [{ required: true, message: '请选择围栏', trigger: 'blur' }],
            },
            scopes: [
                { id: 1, value: '按城市区县控制' },
                { id: 2, value: '按电子围栏控制' },
            ],
            fenceCodes: [],
            activeNames: ['1', '2', '3'],
            loading: false,
            moduleName: '/workbench/BRepidemicControl',
            nodeNames: [{ nodeName: '出车', nodeURL: '' }],
            saveLoading: false,
            cityData: [],
            cityDataDianzi: [],
        };
    },
    computed: {
        disabled() {
            return this.type === 'detail';
        },
    },
    created() {
        const query = this.$route.query;
        // console.log(query)
        this.type = query.type;
        // console.log(this.type)
        if (this.type !== 'add') {
            this.getDatas(query.id);
        }
        this.getCityData();
    },
    methods: {
        async getCityData() {
            try {
                let res = await this._axios({ op: 'getProvincesTree' }, '', '/trafficTrip/local/select');
                if (res.code === 1 && res.data instanceof Array) {
                    this.diffCityData(res.data);
                    let options = JSON.parse(JSON.stringify(res.data));
                    for (const key in options) {
                        // 删除第三层children属性
                        for (const i in options[key].children) {
                            delete options[key].children[i].children
                        }
                    }
                    this.cityDataDianzi = options
                    this.cityData = res.data
                        .map(item => {
                            return {
                                ...item,
                                disabled: true,
                            };
                        })
                        .filter(data => data.code !== 0);
                }
            } catch (err) {
                console.log(err);
            }
        },

        diffCityData(data) {
            for (let item of data) {
                if (item.children && item.children.length > 0) {
                    this.diffCityData(item.children);
                } else {
                    delete item.children;
                }
            }
        },

        handelSave() {
            this.saveLoading = true;
            const proveValidate = this.$refs.proveCom.toValidate();
            const phoneValidate = this.$refs.photolnfosCom.toValidate();
            const warnValidate = this.$refs.warnCom.toValidate();

            this.$refs['ruleForm'].validate(valid => {
                if (valid && proveValidate && phoneValidate && warnValidate) {
                    let params = this.getParams({
                        proveObj: this.$refs.proveCom.form,
                        pObj: this.$refs.photolnfosCom.form,
                        warnObj: this.$refs.warnCom.form,
                    });

                    if (!params.healthApproves && !params.photoInfos && !params.noticeInfo) {
                        this.$message.error('至少勾选一项！');
                        this.saveLoading = false;
                        return false;
                    }
                    this.save(params);
                } else {
                    this.$message.error('请完善勾选配置项！');
                    this.saveLoading = false;
                    return false;
                }
            });
        },
        save(params) {
            let datas = {
                data: JSON.stringify({
                    id: this.$route.query.id,
                    ...params,
                }),
                op: this.type === 'add' ? 'add' : 'update',
            };
            let msg = this.type === 'add' ? '新增' : '修改';
            let URL = this.getModuleUrl(datas.op);
            this.$axios(URL, datas)
                .then(res => {
                    this.saveLoading = false;
                    if (res.code === 1) {
                        // console.log(res)
                        this.$message.success(msg + '成功！');
                        this.$router.push({ path: '/workbench/BRepidemicControl?update="y"' });
                    }
                })
                .catch(err => {
                    this.saveLoading = false;
                });
        },
        // 数据处理
        getParams(datas) {
            let { proveObj, pObj, warnObj } = datas;
            let healthApproves = proveObj.healthApproves.filter(item => {
                return item.open;
            });
            // let healthNodes = healthApproves.length > 0 ? proveObj.healthNodes : []
            // let healthNodes = this.nodeNames.filter(item => {
            //     return proveObj.healthNodes.indexOf(item.nodeName) !== -1
            // })
            // healthNodes = healthApproves.length > 0 ? healthNodes : []

            let photoInfos = pObj.photoInfos.filter(item => {
                item.controlFrequency = pObj.controlFrequency;
                return item.open;
            });
            // let photoNodes = this.nodeNames.filter(item => {
            //     return pObj.photoNodes.indexOf(item.nodeName) !== -1
            // })
            // photoNodes = photoInfos.length > 0 ? photoNodes : []
            const { rangeType, cityCode, fenceCode } = this.ruleForm;
            let obj = {};
            if (rangeType === 1) {
                obj = { rangeType, codes: this.type === 'add' ? cityCode : [cityCode] };
            } else {
                obj = { rangeType, cityCode, fenceCode };
            }

            return {
                ...obj,
                healthApproves: healthApproves.length > 0 ? healthApproves : null,
                // healthNodes: healthNodes.length > 0 ? healthNodes : null,
                // photoNodes: photoNodes.length > 0 ? photoNodes : null,
                photoInfos: photoInfos.length > 0 ? photoInfos : null,
                noticeInfo: warnObj.open ? warnObj : null,
            };
        },
        handelCancel() {
            this.cache = false;
            // 关闭页面
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push({ name: 'epidemicControl' });
            });
        },
        // 获取详情
        getDatas(id) {
            this.loading = true;
            let params = {
                data: JSON.stringify({
                    id,
                }),
                op: 'detail',
            };
            let URL = this.getModuleUrl(params.op);
            this.$axios(URL, params)
                .then(res => {
                    if (res.code === 1) {
                        // console.log(res)
                        let result = JSON.parse(res.data).data;
                        // console.log(result)
                        this.setData(result);
                    }
                    this.loading = false;
                })
                .catch(err => {
                    // this.loading = false
                });
        },
        /**
         * 后端不存是否勾选字段
         * 通过返回数据有无设置是否勾选
         * 没有做原始默认数据处理
         */
        setData(data) {
            // console.log(data)
            let { rangeType, cityCode, fenceCode, healthApproves, healthNodeNames: healthNodes, photoInfos, photoInfoNodeNames: photoNodes, noticeInfo } = data;
            if (rangeType === 2) {
                this.getEnclosure(cityCode);
            }
            this.ruleForm = { rangeType, cityCode, fenceCode };
            let healthApprovesDef = [
                { approveType: 1, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false },
                { approveType: 4, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false },
                { approveType: 2, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false },
                { approveType: 3, alias: '', description: '', picUrl: '', deadline: 1, expireRule: 2, validDays: '', open: false, delayDay: '' },
            ];
            if (healthApproves.length > 0) {
                healthApproves.forEach(el => {
                    if (!this.isVoidObj(el)) {
                        let index = healthApprovesDef.findIndex(item => {
                            return item.approveType === el.approveType;
                        });
                        healthApprovesDef[index] = { ...el, open: true };
                    }
                });
                this.prove = {
                    open: true,
                    healthNodes,
                    healthApproves: healthApprovesDef,
                };
            } else {
                this.prove = {
                    open: false,
                    healthNodes: [],
                    healthApproves: healthApprovesDef,
                };
            }

            let photoInfosDef = [
                { photoType: 5, alias: '', description: '', picUrl: '', open: false },
                { photoType: 6, alias: '', description: '', picUrl: '', open: false },
                { photoType: 7, alias: '', description: '', picUrl: '', open: false },
            ];
            if (photoInfos.length > 0) {
                photoInfos.forEach(el => {
                    if (!this.isVoidObj(el)) {
                        let index = photoInfosDef.findIndex(item => {
                            return item.photoType - 0 === el.photoType - 0;
                        });
                        photoInfosDef[index] = { ...el, open: true };
                    }
                });
                this.pic = {
                    open: true,
                    photoNodes,
                    controlFrequency: photoInfos[0].controlFrequency,
                    photoInfos: photoInfosDef,
                };
            } else {
                this.pic = {
                    open: false,
                    photoNodes: [],
                    controlFrequency: '',
                    photoInfos: photoInfosDef,
                };
            }

            if (!this.isVoidObj(noticeInfo)) {
                this.noticeInfo = { ...noticeInfo, open: true };
            }
        },
        // 判断对象是否空
        isVoidObj(data) {
            if (data && Object.prototype.toString.call(data) === '[object Object]' && Object.keys(data).length !== 0) {
                return false;
            }
            return true;
        },
        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },
        // 城市选择变动
        cityChange(val) {
            if (val) {
                this.$refs.ruleForm.clearValidate('cityCode');
                if (this.ruleForm.rangeType === 2) {
                    this.getEnclosure(val);
                } else {
                    this.fenceCodes = [];
                }
            } else {
                this.fenceCodes = [];
            }
            this.ruleForm = {
                ...this.ruleForm,
                fenceCode: '',
            };
        },
        typeChange(val) {
            // this.citySelect();
            this.fenceCodes = [];
            this.ruleForm = {
                ...this.ruleForm,
                fenceCode: '',
                cityCode: '',
            };
        },
        // 获取围栏
        getEnclosure(cityCode) {
           let datas = {
                data: JSON.stringify({
                    cityCode,
                }),
                op: 'list',
            };
            let URL = this.getModuleUrl(datas.op);
            this.$axios(URL, datas)
                .then(res => {
                    if (res.code === 1) {
                        const reslut = JSON.parse(res.data);
                        this.fenceCodes = reslut.body || [];
                        if (this.fenceCodes.length === 0) {
                            this.$message.error('此城市区/县没有围栏，请按城市配置');
                        }
                    }
                })
                .catch(err => {});
        },
    },
};
</script>

<style lang="scss" scoped>
.epidemicControlEdit {
    height: 100%;
    // overflow-y: hidden;
    box-sizing: border-box;
    position: relative;
    box-sizing: border-box;
    // .box {
    //     height: 100%;
    //     position: relative;
    //     overflow: auto;
    //     background: #f0f2f5;
    //     padding: 0px 24px 24px 24px !important;
    // }
}
.wrap {
    background: #fff;
    border-radius: 8px;
    padding: 20px 40px 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    margin-bottom: 64px;
    .base-txt {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        line-height: 16px;
    }
    .ruleForm {
        /deep/ .el-select {
            width: 100%;
        }
        .ws-city {
            width: 100%;
            /deep/ .el-cascader {
                width: 100%;
            }
        }
        .topS {
            margin: 25px 0 10px 0;
            padding: 0 24px;
            display: flex;
            .scope {
                margin-right: 30px;
            }
            /deep/ .el-form-item {
                flex: 1;
                max-width: 446px;
            }
        }
    }
    .ws-descriptions {
        margin-bottom: 24px;
        border: 1px solid #dcdfe6;
        border-radius: 8px;
        overflow: hidden;
    }
    /deep/ .ws-descriptions__header {
        border: 0;
        background: #f5f7fa;
        padding: 0 16px 0 12px !important;
        height: 48px;
        line-height: 46px;
        .checkTxt {
            margin-left: 12px;
            font-size: 13px;
            color: #303133;
            font-weight: 500;
        }
        .el-icon-arrow-right {
            transform: rotate(-90deg);
            &.active {
                transform: rotate(90deg);
            }
        }
    }
    /deep/ .ws-descriptions__container {
        border: 0;
        border-top: 0;
        padding: 16px 24px;
    }
    /deep/ .el-collapse {
        border: 0;
        .el-collapse-item__wrap {
            border-bottom: 0 !important;
        }
    }
    /deep/ .el-form-item {
        margin-bottom: 16px !important;
    }
    /deep/ .el-form-item__error {
        padding-top: 2px !important;
    }
}
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% + 166px);
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    .el-button {
        width: 160px;
        height: 40px;
    }
}
</style>
