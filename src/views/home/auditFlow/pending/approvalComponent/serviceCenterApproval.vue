<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="140px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />

                <div class="block_item_container">
                    <span class="block_item_title">变动类型</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="变动类型：">{{ nodeForm.opType == 1 ? '新增服务中心' : nodeForm.opType == 2 ? '编辑服务中心' : '' }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">基础信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="服务中心简称：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('simpleName') ? 'red' : ''">{{ nodeForm.simpleName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务中心全称：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('name') ? 'red' : ''">{{ nodeForm.name }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="机构编码：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('agencyNumber') ? 'red' : ''">{{ nodeForm.agencyNumber }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="机构类型：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('centerType') ? 'red' : ''">{{ nodeForm.centerTypeName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上级机构：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('parentName') ? 'red' : ''">{{ nodeForm.parentName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="业务运营范围：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('provinceName') ? 'red' : ''">{{ nodeForm.businessScopeType == 2 ? '电子围栏' : nodeForm.areaNames && nodeForm.areaNames.map(k => ([nodeForm.provinceName, nodeForm.cityName, k]).filter(v => !!v).join('-')).join('，') || [nodeForm.provinceName, nodeForm.cityName].join('-') }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="机构所在地：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('submitAreaName') ? 'red' : ''">
                                    {{ nodeForm.submitProvinceName + '-' + nodeForm.submitCityName + '-' + nodeForm.submitAreaName }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.opType == 2">
                            <el-form-item label="办公场地面积(㎡)：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('spaceArea') ? 'red' : ''">{{ newNodeForm.spaceArea }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="nodeForm.opType == 2">
                            <el-form-item label="办公场地地址：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('address') ? 'red' : ''">{{ nodeForm.rpcOrgBusinessAo.address }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12" v-if="nodeForm.opType == 2">
                            <el-form-item label="是否独立市场：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('marketStatusName') ? 'red' : ''">{{ nodeForm.marketStatusName }}</span>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="详细地址：">
                                <span :class="nodeForm.consoleList && (nodeForm.consoleList.includes('address')||nodeForm.consoleList.includes('supplementAddress')) ? 'red' : ''">{{ nodeForm.address }}{{nodeForm.supplementAddress}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container">
                    <span class="block_item_title">营业执照信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="单位性质：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('bLUnitProperty') ? 'red' : ''">{{ newNodeForm.bLUnitProperty }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="法定代表人：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('bLPersonChargeName') ? 'red' : ''">{{ newNodeForm.bLPersonChargeName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="成立日期：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('establishTime') ? 'red' : ''">{{ (nodeForm.establishTime || '').split(' ')[0] }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办证日期：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('bLHandleTime')?'red':''">{{(newNodeForm.bLHandleTime||'').split(' ')[0]}}</span>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item label="注册资本：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('registeredCapital')?'red':''">{{newNodeForm.registeredCapital}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="统一社会信用代码：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('serviceNo')?'red':''">{{newNodeForm.serviceNo}}</span>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="经营范围：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('bLScope') ? 'red' : ''">{{ newNodeForm.bLScope }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if="nodeForm.opType == 1">
                    <span class="block_item_title">负责人信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="姓名：">{{ newNodeForm.personChargeName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号码：">{{ newNodeForm.personChargeNo }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职务：">{{ newNodeForm.personChargePostName }}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码：">{{ newNodeForm.personChargePhone }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if="nodeForm.attachmentInfoList && nodeForm.attachmentInfoList.length > 0">
                    <span class="block_item_title">附件资料</span>
                    <div class="imgList">
                        <div class="imgList_item">
                            <div v-for="(item, index) in this.nodeForm.attachmentInfoList" :key="index">
                                <img width="150px" height="150px" :src="item.imgUrl" @click="onPreview(index)" />
                                <div :class="['imgName', item.opType == 1 ? 'red' : '']">{{ item.name }}</div>
                            </div>
                        </div>
                        <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import BaseInfo from './base/approvalInfo.vue';
export default {
    //服务中心审批
    name: 'serviceCenterApproval',
    components: { BaseInfo },
    props: {
        nodeFormJson: {
            type: Object,
            default: () => {}
        },
        dataObject: {
            type: Object,
            default: () => {}
        },
        category: {
            type: String,
        }
    },
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson);
        },
        isRed(val) {
            if (val) {
                return 'red';
            } else {
                return '';
            }
        }
    },
    data() {
        return {
            visible: false,
            srcList: [],
            newNodeForm: {},
            currentIndex: 0,
            tableConfig: {
                filterColumns: false,
                pagination: false
            }
        };
    },
    methods: {
        onPreview(index) {
            this.visible = true;
            this.currentIndex = index;
        },
        getSrcList() {
            this.$nextTick(() => {
                this.srcList = this.nodeForm.attachmentInfoList.map(item => {
                    return item.imgUrl;
                });
            });
        },
        // 获取加密后的文件新路径
        async getAuthfileUrl(list) {
            let opt = {
                data: {
                    urls: list
                },
                op: 'newUrl',
            };

          try {
            const res = await this.$axios('/new/flowable/form/select', opt)
            let result = JSON.parse(res.data);
            this.srcList = result.urls
            this.nodeForm.attachmentInfoList = this.nodeForm.attachmentInfoList.map((item,index) => {
                item.imgUrl = result.urls[index]
                return item
            })
          } catch (error) {}
        }
    },
    mounted() {
        console.log(this.dataObject, '11111');
        console.log(this.nodeForm, 'nodeForm');
        this.newNodeForm = {
            ...this.nodeForm.rpcOrgBusinessAo,
            ...this.nodeForm.rpcPersonChargeInfoAo
        };
        console.log(this.newNodeForm, 'newNodeForm');
        // this.getSrcList();
        // 机构审批，图片、附件权限处理
        if(this.nodeForm.attachmentInfoList && this.nodeForm.attachmentInfoList.length) {
            let list = this.nodeForm.attachmentInfoList.map(({imgUrl}) =>imgUrl)
            if(this.category == 3) {
                this.getAuthfileUrl(list)
            } else {
                this.srcList = list
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.imgList {
    margin-top: 16px;
}
.imgList_item {
    display: flex;
    flex-wrap: wrap;
    img {
        margin-left: 16px;
    }
    .imgName {
        text-align: center;
        margin-left: 16px;
    }
}
.red {
    color: rgb(253, 32, 32);
}
</style>
