<template>
    <div>
        <div class="apply-store">
            <div class="apply-main">
                <section>
                    <div class="title">基础信息</div>
                    <el-form class="basics-style" ref="storeForm" :model="storeForm" :rules="storeFormRule" label-width="78px">
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="门店地址:" label-width="85px" required>
                                    <div style="display: flex">
                                        <el-input class="addressName" :disabled="true" resize="none" type="textarea" :rows="1" style="flex: 1; margin-right: 8px;" v-model="storeForm.addressName"></el-input>
                                        <el-input style="flex: 2" resize="none" placeholder="请输入开店详细地址(30字以内)" v-model.trim="storeForm.detailAddress" maxlength="30"></el-input>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="描述:" label-width="85px">
                                    <div style="display: flex">
                                        <el-input type="textarea" :autosize="{ minRows: 5 }" resize="none" placeholder="最多200字" maxlength="200" v-model.trim="storeForm.description"></el-input>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </section>
                <section>
                    <div class="title">附件信息</div>
                    <div class="img-box">
                        <div class="pic-list" v-for="(item, index) in attachmentList" :key="index">
                            <ws-image-upload ref="imageUpload" class="image-upload" v-bind="options" :quantity="1" @change="imgChange(item)"></ws-image-upload>
                            <span class="file-name">{{ item.name }}</span>
                        </div>
                    </div>
                </section>
                <section>
                    <div class="title">流程:</div>
                    <audit-process ref="auditProcess" title=" " :actions="actions" :query="{ nameCode: 33 }"></audit-process>
                </section>
                <div class="btnBox">
                    <el-button class="backBtn" @click="onBack">返回</el-button>
                    <el-button class="backBtn" v-if='oaPowerList.applyOpenStation' @click="submitForm">提交审核</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuditProcess from '@/components/AuditProcess';
import { _axios } from '@/utils/commMethods';
export default {
    name: 'applyStore',
    components: {
        AuditProcess
    },
    data() {
        return {
            moduleName: '/personalCenter/personInfo',
            storeForm: {
                address: [],
                addressName: '',
                detailAddress: '',
                description: '',
                name:'',
                orgType: '36',
                id:null
            },
            storeFormRule: {
                localJurisdiction: [{ required: true, message: '请输入开店详细地址', trigger: 'blur' }]
            },
            picUrlList: [], //图片列表
            rowData: {},
            options: {
                quantity: 1,
                actions: {
                    url: '/orgWeb/file/addAllAttachment',
                    op: 'upload' //上传op，优先级高于moduleName
                },
                afterUpload: this.afterUpload,
                handleRemove: this.handleRemove
            },
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode'
            },
            attachmentList: [], //附件列表
            pictureList: [],
            imgList: [],
            mapShow: false,
            cityOpt: {},
            fileList: [],
            btnLoading: false,
            imgListMap: new Map(), // 存储已上传图片，主要是存原图，最后提交 (key: 水印地址 value: 原图地址)
            imgBackData: {}
        };
    },
    created() {
        let vm = this;
        vm.rowData = { ...vm.$route.query };
        vm.orgDetail();
        vm.getAttachmentList();
    },
    methods: {
        //审核流程校验
        setApprovalPer(list) {
            if (!list.length) return true;
            for(let item of list){
                  if((item.memberType=='3'||item.memberType=='4')&&item.userIds.length==0 ){
                    this.$message.error(`还有审批人没选择，请补充完整`);
                    return false
                  }
                  delete item.memberType
            }
            return true
        },
        //提交审核
        async submitForm() {
            if (!this.storeForm.address || !this.storeForm.detailAddress) {
                this.$message.error('门店地址为必填');
                return;
            }
            let vm = this;
            let approvalInfo = vm.setApprovalInfo();
            //上传 审核流 校验
            if (!this.uploadImgValidate()||!this.setApprovalPer(approvalInfo)) return;
            let imgList=vm.imgList.map(item=>{
                item.orgType = 200
                return item;
            })
            try {
                let param = {
                    id: vm.storeForm.id,
                    address: vm.storeForm.detailAddress,
                    orgBusiness: {
                        remark: vm.storeForm.description
                    },
                    attachmentInfoList: imgList,
                    rpcWorkFlowAoList: approvalInfo,
                    submitProvinceCode: vm.storeForm.address[0]||'',
                    submitCityCode: vm.storeForm.address[1]||'',
                    submitAreaCode: vm.storeForm.address[2]||'',
                    submitProvinceName:vm.storeForm.nameList[0]||'',
                    submitCityName:vm.storeForm.nameList[1]||'',
                    submitAreaName:vm.storeForm.nameList[2]||'',
                    name:vm.storeForm.name,
                    op: 'applyOpenStation'
                };
                const url = this.$vuex.$getModuleUrl('/personalCenter/personInfo', 'applyOpenStation')
                const res = await this.$axios(url, {
                  data: param,
                  op: 'applyOpenStation'
                })

               if(res.code == -100){
                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        this.$refs.auditProcess.getFlowable();
                    });
                }else if(res.code == 1){
                    vm.$message({
                        message: '申请成功！',
                        type: 'success'
                    });
                    vm.$router.push('/personalCenter');
                }
            } catch (err) {
                throw err;
            }
        },
        //审核流程信息处理
        setApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            let approvalInfo = allList.map((items, i) => {
                return {
                    memberType:items.memberType,
                    nodeId: items.nodeKey,
                    procDefId:items.procdefId,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return !item.isDefUser;
                        })
                        .map((item, j) => {
                            return item.id;
                        })
                };
            });
            return approvalInfo;
        },
        // 分公司详情
        async orgDetail() {
            let vm = this;
            try {
                let param = {
                    agencyNumber: vm.$route.query.agencyNumber,
                    op: 'selectStationDetail'
                };
                let res = await _axios(param, vm.moduleName, '/resource/companyServiceStation/select');
                if (res.code == 1) {
                    res = res.data;
                    vm.storeForm.address = [res.submitProvinceCode, res.submitCityCode, res.submitAreaCode];
                    vm.storeForm.addressName = (res.submitProvinceName||'') + '-' + (res.submitCityName||'') + '-' + (res.submitAreaName||'');
                    vm.storeForm.nameList=vm.storeForm.addressName.split('-');
                    vm.storeForm.name=res.name;
                    vm.storeForm.id=res.id;
                }
            } catch (err) {
                throw err;
            }
        },
        //获取附件信息
        async getAttachmentList() {
            let vm = this;
            try {
                let param = {
                    orgType: 200,
                    op: 'detail'
                };
                let res = await _axios(param, vm.moduleName, '/orgWeb/attachment/select');
                if (res.code == 1) {
                    vm.attachmentList = res.data;
                }
            } catch (err) {
                throw err;
            }
        },
        getUrlList(item) {
            if (this.picUrlList) {
                let list = this.picUrlList.filter(o => item.id == o.attachmentTypeID) || [];
                if (list.length) {
                    let url = list[0].waterMarkImageUrl || list[0].imgUrl;
                    return [url];
                }
                return [];
            }
        },
        //判断是否为空
        uploadImgValidate() {
            if (!this.attachmentList.length) return true;
            let components = this.$refs.imageUpload;
            for (let i = 0; i < components.length; i++) {
                let item = components[i];
                let list = item.getUrlList();
                let upload = this.attachmentList[i];
                if (!list.length) {
                    this.$message.error(`${upload.name}上传位图片不能为空`);
                    return;
                }
                upload.url = list[0];
            }
            this.pictureList = this.attachmentList.map((v, i) => ({
                ...v,
                url: this.imgListMap.get(components[i].getUrlList()[0]),
                watermarkUrl: components[i].getUrlList()[0]
            }));
            return true;
        },
        //上传返回
        afterUpload(res, file) {
            try {
                let { publicDownUrl, publicDownWaterMarkUrl, publicWmFileId } = JSON.parse(res.data);
                this.imgListMap.set(publicDownWaterMarkUrl, publicDownUrl);
                this.imgList.push({
                    imgUrl: publicDownUrl,
                    waterMarkImageUrl: publicDownWaterMarkUrl,
                    waterMarkImageFileId: publicWmFileId,
                    attachmentTypeID: this.imgBackData.id
                });
                this.imgBackData = {};
                return [publicDownWaterMarkUrl];
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        //删除图片触发事件
        handleRemove(url) {
            this.imgList = this.imgList.filter(item => {
                return item.waterMarkImageUrl != url;
            });
        },
        imgChange(item) {
            this.imgBackData = item;
        },

        onBack() {
          this.$router.push({
            name: 'personalCenter'
          })
        }
    }
};
</script>

<style lang="scss" scoped>
.apply-store {
    padding: 25px 32px 0px;
    background: #fff;
    margin-bottom: 59px !important;
    min-height: 100vh;
    min-width: 1000px;
    border-radius: 8px;
    .apply-main {
        max-width: 1000px;
        margin: 0 auto;
        section{
            padding-bottom: 32px;
            .title {
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #303133;
                height: 22px;
                line-height: 22px;
                margin-bottom: 16px;
                span {
                    font-size: 15px;
                    color: #f56c6c;
                    font-weight: 500;
                    margin-left: 5px;
                }
            }
            /deep/ .el-form-item__label{
                font-weight: 500 !important;
            }
            .basics-style {
                /deep/ .el-form-item {
                    margin-bottom: 16px;
                }
                /deep/ .el-col:nth-child(2){
                   .el-form-item {
                    margin-bottom: 0px !important;
                  }
                }
                /deep/ .el-textarea__inner {
                    color: #606266;
                }
            }
            /deep/.pic-list {
                display: inline-block !important;
                width: 160px;
                text-align: center;
                margin: 10px;
                .image-upload {
                    width: 150px;
                    height: 150px;
                }
                .file-name {
                    display: block;
                    margin-top: 8px;
                    word-break: break-all;
                }
            }
            .img-box {
                padding: 0 85px 0;
                /deep/.pic-list,
                /deep/.el-upload--picture-card {
                    margin: 0px !important;
                }
            }
            /deep/ .currency-apply {
                padding: 0px 0px 0px 40px;
                .el-timeline {
                    .el-timeline-item:last-child {
                        padding-bottom: 0px;
                    }
                }
            }
            .addressName /deep/ .el-textarea__inner{
                height: 36px;
            }
        }
        .btnBox {
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
            .backBtn {
                width: 160px;
                margin-right: 16px;
                &:last-child {
                    color: #fff;
                    background-color: #f05259;
                }
            }
        }
    }
}
</style>
