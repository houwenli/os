<template>
    <div class="flex-column">
        <div class="form-wrap flex-1">
            <div class="base-content">
                <div class="title">基础配置</div>
                <div>
                    <div class="inline-block">
                        <label for class="label">配置城市：</label>
                        <ws-city v-if="enterQuery.type == 'new'" v-model="formData.cityCodeList" level="2" :multiple="true" :defaultProps="{ checkStrictly: false, emitPath: false }"></ws-city>
                        <span class="text" v-else>{{ formData.city }}</span>
                    </div>
                    <div class="inline-block">
                        <label for class="label">包干全国可用：</label>
                        <span class="text" v-if="disabled">{{ formData.scopeSwitch | scopeSwitchFilters }}</span>
                        <el-select v-else v-model="formData.scopeSwitch" placeholder="请选择">
                            <el-option v-for="item in scopeSwitchFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div v-if="formData.cityCode !== 0" class="inline-block">
                        <label for class="label">生效时间：</label>
                        <ws-date-range
                            :startTime.sync="formData.effectiveTime"
                            :endTime.sync="formData.effectiveEndTime"
                            :disabled="disabled"
                        ></ws-date-range>
                    </div>
                    <div class="inline-block" v-if="disabled">
                        <label for class="label">功能状态：</label>
                        <span class="text">{{ formData.statusStr }}</span>
                    </div>
                    <div class="inline-block" v-else>
                        <label for class="label">是否上架：</label>
                        <!-- 后台功能无法实现默认暂时都为否  2022年11月4日15:59:02 -->
                        <el-radio-group disabled v-model="formData.isDirectUp">
                            <el-radio style="width: 50px" :label="1">是</el-radio>
                            <el-radio style="width: 50px" :label="0">否</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>
            <div class="base-content">
                <div class="main-title">
                    <div class="title">包干配置</div>
                    <el-switch v-model="formData.settingStatus" :active-value="1" :inactive-value="0" :disabled="disabled || btnDisabled" style="margin-left: 5px" @change="switchChange($event, 1)"></el-switch>
                </div>
                <div v-if="formData.settingStatus">
                    <div class="configBaogan">
                        <div class="inline-block">
                            <label for class="label">最大有效包干天数：</label>
                            <span class="text" v-if="disabled">{{ formData.maxLocalDriverDay }}</span>
                            <el-input v-else v-model.trim="formData.maxLocalDriverDay" @blur="CheckData(regular[0], 'maxLocalDriverDay')" placeholder="【0, 20000】整数"></el-input>
                        </div>
                        <div class="inline-block">
                            <label for class="label">每日最高减免订单数：</label>
                            <span class="text" v-if="disabled">{{ formData.maxFreeOrderNumPerDay }}</span>
                            <el-input v-else v-model.trim="formData.maxFreeOrderNumPerDay" @blur="CheckData(regular[0], 'maxFreeOrderNumPerDay')" placeholder="【0, 20000】整数"></el-input>
                        </div>
                    </div>
                    <div class="configBaogan">
                        <div class="inline-block">
                            <label for class="label">购买包干城市：</label>
                            <span class="text" v-if="disabled">{{ formData.buyVipCity | buyVipCityFilters }}</span>
                            <el-select v-else v-model="formData.buyVipCity" placeholder="请选择">
                                <el-option v-for="item in buyVipCitys" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="base-content">
                <div class="main-title">
                    <div class="title">适购对象</div>
                    <el-switch v-model="formData.limitStatus" :disabled="disabled || btnDisabled" :active-value="1" :inactive-value="0" style="margin-left: 5px" @change="switchChange($event, 2)"></el-switch>
                </div>
                <div v-if="formData.limitStatus">
                     <div class="inline-block">
                        <label for class="label">车主年龄小于：</label>
                        <span class="text" v-if="disabled">{{ formData.maxAge }}</span>
                        <el-input :disabled="disabled" v-else v-model.trim="formData.maxAge" @blur="checkAgeData(formData.maxAge)" placeholder="【0-100】"/>
                    </div>
                    <div class="inline-block">
                        <label for class="label">开通代驾业务：</label>                       
                        <span class="text" v-if="disabled">{{ formData.limitOptions[0].behalfBusinessType | behalfBusinessTypeFilters }}</span>
                        <el-select v-else v-model="formData.limitOptions[0].behalfBusinessType" placeholder="请选择">
                            <el-option v-for="item in behalfBusinessTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div class="inline-block">
                        <label for class="label">认证包干类型：</label>
                        <span class="text" v-if="disabled">{{ formData.limitOptions[0].vipLumpSumType | vipLumpSumTypeFilters }}</span>
                        <el-select v-else v-model="formData.limitOptions[0].vipLumpSumType" placeholder="请选择">
                            <el-option v-for="item in vipLumpSumTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div class="inline-block">
                        <label for class="label">本地包干类型：</label>
                        <span class="text" v-if="disabled">{{ formData.limitOptions[0].localLumpSumType | localLumpSumTypeFilters }}</span>
                        <el-select v-else v-model="formData.limitOptions[0].localLumpSumType" placeholder="请选择">
                            <el-option v-for="item in localLumpSumTypeFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <RecordInfo v-if="disabled" :recordInfo="formData" />
        </div>
        <div class="footer_btn">
            <el-button plain @click="cancel()">{{ !disabled ? '取消' : '返回' }}</el-button>
            <ws-throttle v-if="!disabled && powerList.save">
                <el-button type="primary" @click="save()">保 存</el-button>
            </ws-throttle>
        </div>
    </div>
</template>

<script>
import RecordInfo from '../components/recordInfo.vue';
import { mapState } from 'vuex';
export default {
    components: {
        RecordInfo,
    },
    data() {
        return {
            btnDisabled:false,
            pickerOptions: {
                disabledDate(val) {
                    return val.getTime() > new Date().getTime();
                },
            },
            formData: {
                cityCodeList: [],
                effectiveTime: '',
                effectiveEndTime: '',
                settingStatus: 0,
                limitStatus: 0,
                isDirectUp: 0,
                maxLocalDriverDay: '',
                maxFreeOrderNumPerDay: '',
                maxAge:'',
                limitOptions: [{
                    behalfBusinessType: null,
                    vipLumpSumType: null,
                    localLumpSumType: null,
                }],
                buyVipCity: ''
            },
            disabled: false,
            regular: [
                /^([0-9]\d{0,3}|1\d{4}|20000)$/, // [0，20000)整数
                /^(100|[0-9]|[1-9][0-9])$/ //[0,100]整数
            ],
            moduleName: '/workbench/baoganManage/drivingRuleSet/list',
            enterQuery: null,
            effectiveTimePickerOptions: {
                disabledDate(time) {
                    let curDay = new Date().toLocaleDateString();
                    return time.getTime() < new Date(curDay).getTime() || time.getTime() > new Date(curDay).getTime() + 24 * 3600 * 1000 * 31;
                },
            },
        };
    },
    computed: {
        ...mapState({
            scopeSwitchFilters: state => state.baogan.scopeSwitchFilters,
            behalfBusinessTypeFilters: state => state.baogan.behalfBusinessTypeFilters,
            vipLumpSumTypeFilters: state => state.baogan.vipLumpSumTypeFilters,
            localLumpSumTypeFilters: state => state.baogan.localLumpSumTypeFilters,
            buyVipCitys: state => state.baogan.drivongBuyVipCityFilters
        }),
        formContentStatus() {
            return {
                new: '新增',
                edit: '修改',
                detail: '详情',
            }[this.enterQuery.type];
        },
    },
    created() {
        let { query } = this.$route;
        this.enterQuery = query;
        this.disabled = query.type == 'detail';
        query.type !== 'new' && this.getDetail();
    },
    mounted() {},
    methods: {
        checkAgeData(val){
            const reg = /^(100|[0-9]|[1-9][0-9])$/
            if(!reg.test(val)){
                this.$message.error('请输入【0-100】的整数')
                return false
            }else{
                return true
            }
        },
        switchChange(val, type) {
            if (type === 1) {
                // 包干配置
                if (!val) {
                    this.formData.maxLocalDriverDay = '';
                    this.formData.maxFreeOrderNumPerDay = '';
                    this.formData.buyVipCity = '';
                }
            } else if (type === 2) {
                // 限购对象
                if (!val) {
                    this.formData.maxAge = ''
                    this.formData.limitOptions = [{
                        behalfBusinessType: null,
                        vipLumpSumType: null,
                        localLumpSumType: null,
                    }]
                }
            }
        },
        // 获取详情信息
        getDetail() {
            let data = {
                id: this.enterQuery.id,
                op: 'detail',
            };
            this._axios(data,this.moduleName ).then(res => {
                let resultData = res.data;
                if(resultData.cityCode===0){
                    this.btnDisabled = true
                }
                this.formData = resultData;
                if(this.formData.cityCode == 0){
                    this.formData.settingStatus = 1
                    this.formData.limitStatus = 1

                    if(!this.formData.limitOptions.length){
                        this.formData.limitOptions = [{
                            behalfBusinessType: null,
                            vipLumpSumType: null,
                            localLumpSumType: null,
                        }]
                    }
                }
                // 修改默认是否上架为否
                this.$set(this.formData,'isDirectUp',0)
            });
        },
        convertCertGroup(val) {
            let driver = [];
            if (typeof val === 'string') {
                driver = val.split(',').map(data => {
                    return {
                        A: 'A类车主',
                        B: 'B类车主',
                        C: 'C类车主',
                        D: 'D类车主',
                        E: 'E类车主',
                        F: 'F类车主',
                        G: 'G类车主',
                        H: 'H类车主',
                        K: 'K类车主',
                    }[data];
                });
            }
            return driver.join(',');
        },
        CheckData(reg, type) {
            if (!reg.test(this.formData[type])) {
                if (type == 'maxLocalDriverDay') {
                    this.formData[type] = '20000';
                } else if (type == 'maxFreeOrderNumPerDay') {
                    this.formData[type] = '20000';
                }
                return false;
            }
        },
        // 新增 || 修改
        async save() {
            // 校验基础配置
            let {
                cityCodeList,
                cityCode,
                scopeSwitch,
                effectiveTime,
                effectiveEndTime,
                settingStatus,
                maxLocalDriverDay,
                maxFreeOrderNumPerDay,
                limitStatus,
                maxAge,
                limitOptions,
                status,
                id,
                isDirectUp,
                buyVipCity
            } = this.formData;
            if (this.enterQuery.type === 'new' && !cityCodeList.length) {
                return this.$message.error('请选择包干地区');
            }
            if (scopeSwitch === undefined) {
                return this.$message.error('请选择是否开启包干全国可用');
            }
            if (cityCode || cityCodeList?.length) {
                // 非全国数据生效时间校验
                if (!effectiveTime || !effectiveEndTime) {
                    return this.$message.error('请选择生效时间');
                }
                // if (new Date(effectiveTime).getTime() < new Date().getTime()) {
                //     return this.$message.error('开始生效时间不能小于当前时间');
                // }
            }
            // 校验包干配置
            if (!!settingStatus) {
                if (!maxLocalDriverDay && maxLocalDriverDay !== 0) {
                    this.$message.error('请填写最大有效包干天数');
                    return;
                }
                if (buyVipCity == null || buyVipCity === '') {
                    this.$message.error('请选择购买包干城市');
                    return;
                }
                if (!maxFreeOrderNumPerDay && maxFreeOrderNumPerDay !== 0) {
                    this.$message.error('请填写每日最高减免订单数');
                    return;
                }
            }
            // 校验限购对象
            if (limitStatus && !maxAge) return this.$message.error('请输入车主年龄小于值');
            if (limitStatus && !limitOptions[0].behalfBusinessType && limitOptions[0].behalfBusinessType!==0) return this.$message.error('请选择开通代驾业务');
            if (limitStatus && !limitOptions[0].vipLumpSumType && limitOptions[0].vipLumpSumType!==0) return this.$message.error('请选择认证包干类型');
            if (limitStatus && !limitOptions[0].localLumpSumType && limitOptions[0].localLumpSumType!==0) return this.$message.error('请选择本地包干类型');
            if (limitStatus && !this.checkAgeData(maxAge)) return;
            let op;
            let data = {
                scopeSwitch,
                settingStatus,
                maxLocalDriverDay,
                maxFreeOrderNumPerDay,
                limitStatus,
                isDirectUp,
                buyVipCity,
                maxAge,
                limitOptions
            };
            if (cityCode || cityCodeList?.length) {
                // 全国无生效时间
                data.effectiveTime = effectiveTime;
                data.effectiveEndTime = effectiveEndTime;
            }
            if (this.enterQuery.type === 'new') {
                data.cityCodeList = cityCodeList;
                op = 'save';
            } else {
                data.id = id;
                data.status = status;
                data.cityCode = cityCode;
                op = 'setting';
            }
            let params = {
                data,
                op,
            };
            let URL = this.powerList[op];
           
            try {
                await this.$axios(URL, params).then(res => {
                    if (res.code == 1) {
                        this.$message.success('操作成功');
                        this.cancel();
                    }
                });
            } catch (err) {}
        },
        cancel() {
            this.$router.push({ path: this.moduleName });
        },
    },
};
</script>

<style lang="scss" scoped>
.form-wrap {
    padding: 32px 40px;
    background: #fff;
    border-radius: 8px;
    .main-title {
        display: flex;
        align-items: center;
        padding-top: 32px;
    }
    .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
    }
    /deep/ .inpt_.el-input.is-disabled .el-input__inner {
        background-color: #fff !important;
    }
    .ws-city {
        /deep/ .el-input__inner{
            width: 400px;
        }
    }
}
.operation-btn {
    margin-left: 14px;
    display: inline-block;
    .subBtn {
        color: rgb(0, 136, 255);
        margin-right: 14px;
        cursor: pointer;
    }
}
.base-content {
    .label {
        display: inline-block;
        width: 160px;
        text-align: right;
        color: #606266;
        font-weight: 600;
    }
    .inline-block {
        display: inline-block;
        margin: 16px 0 0 20px;
        .el-input {
            width: 200px;
        }
    }
    .text {
        display: inline-block;
        width: 200px;
    }
}
.configBaogan {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-top: 16px;
    .inline-block {
        flex: 1;
        // padding: 0 20px;
        display: flex;
        align-items: center;
        .el-select, .el-input {
            flex: 1;
        }
    }
    .label {
        width: 200px;
        text-align: right;
        color: #606266;
        font-weight: 600;
    }
    .text {
        flex: 1;
    }
}
</style>
