<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="150px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">公司信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="独立法人公司名称：">{{nodeForm.companyName}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办公场地：">{{nodeForm.officeSpace}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实际控制人姓名：">{{nodeForm.controlName}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实际控制人电话：">{{nodeForm.controlPhone}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实际控制人身份证：">{{nodeForm.controlIdNumber}}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container">
                    <span class="block_item_title">法人信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="法定代表人：">{{nodeForm.legalRepresentative}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="法人身份证：">{{nodeForm.legalIdNumber}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="法人性别：">{{nodeForm.legalSex==0?'女':'男'}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="法人电话：">{{nodeForm.legalPhone}}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container">
                    <span class="block_item_title">签约信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="12">
                            <el-form-item label="分公司简称：">{{nodeForm.signCompanySimpleName}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分公司全称：">{{nodeForm.signCompanyName}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="机构编码：">{{nodeForm.companyAgencyNumber}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上级机构：">{{nodeForm.parentOrg}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分公司总经理：">{{nodeForm.manager}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码：">{{nodeForm.signContactPhone}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="签约时间：">{{(nodeForm.signTime||'').split(' ')[0]}}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="block_item_container" v-if='nodeForm.rpcStaffAos && nodeForm.rpcStaffAos.length>0'>
                    <span class="block_item_title ">人员信息</span>
                    <ws-table-el ref="table" v-bind="tableConfigfour" :data="nodeForm.rpcStaffAos" class="header_top">
                        <template>
                            <ws-table-column-el prop="staffName" label="姓名"></ws-table-column-el>
                            <ws-table-column-el prop="dutiesName" label="职务">
                            </ws-table-column-el>
                            <ws-table-column-el prop="phone" label="联系电话"></ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>

                <div class="block_item_container" v-if='nodeForm.rpcAccountAos && nodeForm.rpcAccountAos.length>0'>
                    <span class="block_item_title">账户信息</span>
                    <ws-table-el ref="table" v-bind="tableConfigfive" :data="nodeForm.rpcAccountAos" class="header_top">
                        <template>
                            <ws-table-column-el prop="accountType" label="账户类型">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.accountType==1?'基本账户':scope.row.accountType==2?'一般账号':''}}</span>
                                </template>
                            </ws-table-column-el>
                            <ws-table-column-el prop="account" label="银行卡账号"></ws-table-column-el>
                            <ws-table-column-el prop="bankName" label="开户行"> </ws-table-column-el>
                        </template>
                    </ws-table-el>
                </div>
                <div class="block_item_container header_top" v-if="nodeForm.rpcFileAos && nodeForm.rpcFileAos.length > 0">
                    <span class="block_item_title">附件资料</span>
                    <div class="imgList">
                        <div class="imgList_item">
                            <div v-for="(item, index) in this.nodeForm.rpcFileAos" :key="index">
                                <img width="150px" height="150px" :src="item.imgUrl" @click="onPreview(index, 'rpcFileAos')" />
                                <div class="imgName">{{item.name}}</div>
                            </div>
                        </div>
                        <!-- <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" /> -->
                    </div>
                </div>
                <div class="block_item_container header_top" v-if="nodeForm.terminationFiles && nodeForm.terminationFiles.length > 0">
                    <span class="block_item_title">解约附件资料</span>
                    <div class="imgList">
                        <div class="imgList_item">
                            <div v-for="(item, index) in this.nodeForm.terminationFiles" :key="index">
                                <img width="150px" height="150px" :src="item.imgUrl" @click="onPreview(index, 'terminationFiles')" />
                                <div class="imgName">{{item.name}}</div>
                            </div>
                        </div>
                        <!-- <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" /> -->
                    </div>
                </div>
            </el-form>
            <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
        </div>
    </div>
</template>

<script>
import { _axios } from '../../../../../utils/commMethods';
import BaseInfo from './base/approvalInfo.vue';
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
    computed: {
        nodeForm() {
            return JSON.parse(this.dataObject.nodeFormJson);
        },
    },
    data() {
        return {
            visible: false,
            srcList: [],
            newNodeForm: {},
            currentIndex: 0,
            tableConfigfour: {
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                autoHeight: false,
            },
            tableConfigfive: {
                filterColumns: false,
                pagination: false,
                indexColumn: false,
                autoHeight: false,
            }
        };
    },
    methods: {
        onPreview(index, key) {
            this.getSrcList(key)
            this.visible = true;
            this.currentIndex = index;
        },
        getSrcList(key='rpcFileAos') {
            this.srcList = this.nodeForm[key].map(item => {
                return item.imgUrl;
            });
        },
        openDept(val) {
            this.$alert(val, '完整部门信息', {
                confirmButtonText: '取消'
            });
        },
        // 获取加密后的文件新路径
        async getAuthfileUrl(list, key) {
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
            this.nodeForm[key] = this.nodeForm[key].map((item,index) => {
                item.imgUrl = result.urls[index]
                return item
            })
          } catch (error) {}
        }
    },
    mounted() {
        console.log(this.dataObject, '11111');
        console.log(this.nodeForm, 'nodeForm');
        // this.getSrcList();
        // 机构审批，图片、附件权限处理
        if(this.nodeForm.rpcFileAos && this.nodeForm.rpcFileAos.length) {
            let list = this.nodeForm.rpcFileAos.map(({imgUrl}) =>imgUrl)
            this.getAuthfileUrl(list, 'rpcFileAos')

        }
        if(this.nodeForm.terminationFiles && this.nodeForm.terminationFiles.length) {
            let list = this.nodeForm.terminationFiles.map(({imgUrl}) =>imgUrl)
            this.getAuthfileUrl(list, 'terminationFiles')
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
.header_top {
    margin: 16px 0 32px 0;
}
// /deep/.ws-table__wrapper .ws-table__body-warp table tr td {
//     height: 40px !important;
// }
// /deep/.ws-table__wrapper .ws-table__body-warp table tr th {
//     height: 40px !important;
// }
</style>
