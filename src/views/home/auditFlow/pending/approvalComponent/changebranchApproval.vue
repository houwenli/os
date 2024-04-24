<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="150px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">变动类型</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="变动类型：">{{ nodeForm.opType == 1 ? '新增分公司' : nodeForm.opType == 2 ? '编辑分公司' : '' }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">基础信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="分公司简称：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('simpleName') ? 'red' : ''">{{ newNodeForm.simpleName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分公司全称：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('name') ? 'red' : ''">{{ newNodeForm.name }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="机构编码：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('agencyNumber') ? 'red' : ''">{{ newNodeForm.agencyNumber }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分公司类别：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('importantStatus') ? 'red' : ''">
                                    {{ newNodeForm.importantStatusName }}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上级机构：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('parentName') ? 'red' : ''">{{ newNodeForm.parentName }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item label="分公司等级：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('grade') ? 'red' : ''">{{ newNodeForm.grade | gradeFilters }}</span>
                            </el-form-item>
                        </el-col> -->
                        <!-- <el-col :span="12" v-if="nodeForm.opType == 2">
                            <el-form-item label="是否有牌照：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('licenseStatus') ? 'red' : ''">
                                    {{ newNodeForm.licenseStatus == 1 ? '是' : newNodeForm.licenseStatus == 2 ? '否' : '' }}
                                </span>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="业务城市：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('provinceName') ? 'red' : ''">{{ newNodeForm.provinceName }}-{{ newNodeForm.cityName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="机构所在地：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('submitAreaName') ? 'red' : ''">
                                    {{ newNodeForm.submitProvinceName }}-{{ newNodeForm.submitCityName }}-{{ newNodeForm.submitAreaName }}
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
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('address') ? 'red' : ''">{{ nodeForm.rpcCompanyBusinessAo&&nodeForm.rpcCompanyBusinessAo.address }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="详细地址：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('address') ? 'red' : ''">{{ nodeForm.rpcCompanyConsoleAo&&nodeForm.rpcCompanyConsoleAo.address}}{{nodeForm.rpcCompanyConsoleAo&&nodeForm.rpcCompanyConsoleAo.supplementAddress || ''}}</span>
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
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('establishTime') ? 'red' : ''">{{ (newNodeForm.establishTime || '').split(' ')[0] }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办证日期：">
                                <span :class="nodeForm.businessList && nodeForm.businessList.includes('bLHandleTime') ? 'red' : ''">{{ (newNodeForm.bLHandleTime || '').split(' ')[0] }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="注册资本：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('registeredCapital') ? 'red' : ''">{{ newNodeForm.registeredCapital }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="统一社会信用代码：">
                                <span :class="nodeForm.consoleList && nodeForm.consoleList.includes('serviceNo') ? 'red' : ''">{{ newNodeForm.serviceNo }}</span>
                            </el-form-item>
                        </el-col>
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

                <div class="block_item_container" v-if="nodeForm.opType == 2&&(newNodeForm.partyMemberNumber||newNodeForm.associationName||nodeForm.rpcCompanyAssociationAo)">
                    <span class="block_item_title">党建社团信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="所属党组织：" label-width="150px">
                                <span :class="nodeForm.associationList && nodeForm.associationList.includes('associationName') ? 'red' : ''">{{ newNodeForm.associationName }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="党员数量：" label-width="150px">
                                <span :class="nodeForm.associationList && nodeForm.associationList.includes('partyMemberNumber') ? 'red' : ''">{{ newNodeForm.partyMemberNumber }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="nodeForm.rpcCompanyAssociationAo.rpcJAAoList.length">
                            <el-form-item label="参与社团/行业组织：" label-width="150px">
                                 <ws-table-el ref="table" v-bind="tableConfig" :data="nodeForm.rpcCompanyAssociationAo.rpcJAAoList || []">
                                    <template>
                                        <ws-table-column-el prop="orgName" label="组织名称">
                                            <template slot-scope="scope">
                                                <span :class="[scope.row.opType == 1 ? 'red' : '']">{{ scope.row.orgName }}</span>
                                            </template>
                                        </ws-table-column-el>
                                        <ws-table-column-el prop="duties" label="职务">
                                            <template slot-scope="scope">
                                                <span :class="[scope.row.opType == 1 ? 'red' : '']">{{ scope.row.duties }}</span>
                                            </template>
                                        </ws-table-column-el>
                                        <ws-table-column-el prop="joinTime" label="加入日期">
                                            <template slot-scope="scope">
                                                <span :class="[scope.row.opType == 1 ? 'red' : '']">{{ (scope.row.joinTime || '').split(' ')[0] }}</span>
                                            </template>
                                        </ws-table-column-el>
                                    </template>
                                </ws-table-el>
                            </el-form-item>
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
import { mapState } from 'vuex';
export default {
    //分公司变更审批
    name: 'changebranchApproval',
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
    computed: {
        ...mapState('personalCenter', ['gradeFilters']),
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson);
        }
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
        this.newNodeForm = {
            ...this.nodeForm.rpcCompanyConsoleAo,
            ...this.nodeForm.rpcCompanyBusinessAo,
            ...this.nodeForm.rpcPersonChargeInfoAo,
            ...this.nodeForm.rpcCompanyAssociationAo
        };
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
/deep/.ws-table__wrapper .ws-table__body-warp table tr td {
    height: 40px !important;
}
/deep/.ws-table__wrapper .ws-table__body-warp table tr th {
    height: 40px !important;
}
/deep/.ws-table__wrapper{
    margin-top: 10px;
}
/deep/.clearfix{
    display: none;
}

</style>
