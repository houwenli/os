<template>
    <div>
        <div class="org-branch-company">
            <!-- 表单 -->
            <validate-form ref="validateForm" :pageType="pageType" :ruleForm="serviceCenForm" :rules="serviceCenRules" @chooseLocal="chooseLocal"></validate-form>

            <div class="org-branch-company-title to-top">
                附件信息
                <span class="tip-font">(请上传jpg、png格式照片，大小不超过10M)</span>
            </div>
            <div>
                <div class="pic-list" v-for="(item, index) in attachmentList" :key="index">
                    <ws-image-upload ref="imageUpload" class="image-upload" :urlList='handleAttachmentUrl(item)' v-bind="options" :quantity="1" :afterUpload="(...arg) => afterUpload(...arg, item)"></ws-image-upload>
                    <span class="file-name">{{ item.name }}</span>
                </div>
            </div>

            <!-- 地址采集 -->
            <a-map :show-search="true" v-if='mapShow' :show.sync="mapShow" :marker="marker" @select="getMapInfo" :cityOpt="cityOpt"></a-map>
        </div>
        <!-- 审核流程 -->
        <div class="org-branch-company process-box">
            <div class="org-branch-company-title" style="margin-bottom: 0">审核流程</div>
            <audit-process @update:load="updateLoad" class="audit-process" title="" ref="auditProcess" :actions="actions" :query="{ nameCode: 31 }"></audit-process>
        </div>
        <!-- 底部导航 -->
        <footer-fixed>
            <ws-throttle>
                <el-button type="primary" :disabled="disabled" style="width: 160px; height: 36px" @click="submitForm('validateForm')">提交审核</el-button>
            </ws-throttle>
        </footer-fixed>
    </div>
</template>

<script>
import ValidateForm from '../components/addOrgForm.vue';
import FooterFixed from '../components/FooterFixed';
import AuditProcess from '@/components/AuditProcess';
import AMap from '@/components/AMap';
import { serviceCenForm, serviceCenRules } from '../utils/addOrgForm.js';
export default {
    name: 'addServiceCentre',
    components: {
        ValidateForm,
        FooterFixed,
        AMap,
        AuditProcess,
    },
    data() {
        return {
            moduleName: '/addServiceCentre',
            pageType: 'addServiceCentre',
            serviceCenForm,
            serviceCenRules,
            options: {
                quantity: 1,
                actions: {
                    url: '/orgWeb/file/addAllAttachment',
                    op: 'upload', //上传op，优先级高于moduleName
                },
                handleRemove: this.handleRemove,
            },
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode',
            },
            attachmentList: [], //附件列表
            pictureList: [],
            imgList: [],
            fileList: [],
            btnLoading: false,
            imgListMap: new Map(), // 存储已上传图片，主要是存原图，最后提交 (key: 水印地址 value: 原图地址)
            mapShow: false,
            disabled:false,
            cityOpt: {},
            resubmissionData:{},//路由参数
            detailData:{},//详情参数
        };
    },
    computed: {
        marker() {
            const { longitude, latitude } = this.serviceCenForm;
            return longitude && latitude ? [{ longitude, latitude }] : [];
        },
    },
    watch: {
        detailData: {
            handler(val) {
                    this.serviceCenForm=val
                    this.pageType='addServiceCentre'
                    // this.timer = new Date().getTime();
            },
        },
    },
    async created() {

      try {
        let res = await this.getAttachmentNameList({ attachmentType: 30 })
        this.attachmentList = res || [];
        this.imgList = res.map(item => { return { attachmentTypeID: item.id, name: item.name } })


        if (this.$route.query.procInsId) {
            this.resubmissionData = this.$route.query;
            this.getDetailData();
        }

      } catch (error) {

      }
    },

    methods: {
      /**
       * 附件-url回显数据处理
       */
        handleAttachmentUrl(item) {
          // 查询详情的时候-会返回url
          if (item.imgUrl) return [item.imgUrl]

          return []
        },
        updateLoad(val){
            if(val===true){
                this.disabled = true;
            }
        },
               //获取重新提交详情
          async getDetailData() {
            let opt = {
                data: JSON.stringify({
                    procinstId: this.resubmissionData.procInsId,
                    taskId: this.resubmissionData.taskId,
                }),
                op: 'flowDetail',
            };

            try {
                const res = await this.$axios('/new/flowable/form/select', opt);
                let data = JSON.parse(JSON.parse(res.data).nodeFormJson)

                this.pickFormData(data)

                this.detailData={
                    ...data,
                    cityAreaCodeList: [data.submitProvinceCode, data.submitCityCode],
                    cityCodeList: [data.provinceCode, data.cityCode],
                    submitAreaCode: data.areaCode
                }

                // 处理附件
                data.attachmentInfoList = data.attachmentInfoList || []

                this.attachmentList = data.attachmentInfoList;
                this.imgList= data.attachmentInfoList;

            } catch (error) {}
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let rpcWorkFlowAoList = this.createdApprovalInfo();
                    if (!this.uploadImgValidate() || !this.setApprovalPer(rpcWorkFlowAoList)) return;
                    let formData = JSON.parse(JSON.stringify(this.serviceCenForm));
                    // rpcOrgBusinessAo 营业执照
                    // rpcPersonChargeInfoAo 负责人信息
                    let rpcOrgBusinessAo = {}
                        rpcOrgBusinessAo = formData.orgBusiness;
                    let rpcPersonChargeInfoAo = formData.rpcPersonChargeInfoAo;
                    rpcOrgBusinessAo.businessAddress = formData.orgBusiness.address;
                    rpcOrgBusinessAo.legalPerson = rpcPersonChargeInfoAo.personChargeName;
                    rpcOrgBusinessAo.legalPhone = rpcPersonChargeInfoAo.personChargePhone;
                    rpcOrgBusinessAo.legalIdNumber = rpcPersonChargeInfoAo.personChargeNo;
                    delete formData.orgBusiness.address;
                    delete formData.orgBusiness;
                    delete formData.rpcPersonChargeInfoAo;
                    this.btnLoading = true;
                    // 机构所在地
                    formData.submitProvinceCode = this.serviceCenForm.cityAreaCodeList[0];
                    formData.submitCityCode = this.serviceCenForm.cityAreaCodeList[1];
                    // 业务城市
                    (formData.provinceCode = this.serviceCenForm.cityCodeList[0]), (formData.cityCode = this.serviceCenForm.cityCodeList[1]);
                    formData.areaCode = this.serviceCenForm.submitAreaCode;
                    formData.relationId = this.serviceCenForm.parentId;
                    formData.orgType = 30;
                    let opt = {
                        data: {
                            ...formData,
                            rpcOrgBusinessAo,
                            rpcPersonChargeInfoAo,
                            rpcWorkFlowAoList,
                            attachmentInfoList: this.imgList,
                        },
                        op: 'saveBase',
                    };
                    this.$axios(this.getModuleUrl(opt.op), opt)
                        .then(res => {
                            this.btnLoading = false;
                            this.$message.success('新增成功');
                            this.$refs['validateForm'].$refs['ruleForm'].resetFields();
                            this.$router.replace({ path: '/index' });
                        })
                        .catch(err => {
                            if (err.code == -100) {
                                this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提示', {
                                    confirmButtonText: '确定',
                                    type: 'warning',
                                }).then(() => {
                                    this.$refs.auditProcess.getFlowable();
                                });
                            }
                            this.btnLoading = false;
                        });
                }
            });
        },
        uploadImgValidate() {
            if (!this.attachmentList.length) return true;
            let components = this.$refs.imageUpload;
            for (let i = 0; i < components.length; i++) {
                let item = components[i];
                let list = item.getUrlList();
                let upload = this.attachmentList[i];
                // if (!list.length) {
                //     this.$message.error(`${upload.name}上传位图片不能为空`);
                //     return;
                // }
                upload.url = list[0];
            }
            this.pictureList = this.attachmentList.map((v, i) => ({
                ...v,
                url: this.imgListMap.get(components[i].getUrlList()[0]),
                watermarkUrl: components[i].getUrlList()[0],
            }));
            return true;
        },

        getModuleUrl(op) {
            return this.$getModuleUrl(this.moduleName, op);
        },

        afterUpload(res, file, item) {
            try {
                let { publicDownUrl, publicDownWaterMarkUrl, publicWmFileId } = JSON.parse(res.data);
                this.imgListMap.set(publicDownWaterMarkUrl, publicDownUrl);
                this.imgList.forEach((img, index) => {
                    if (img.attachmentTypeID === item.id || img.attachmentTypeID === item.attachmentTypeID) {
                        this.imgList[index] = { ...img, imgUrl: publicDownUrl, waterMarkImageUrl: publicDownWaterMarkUrl, waterMarkImageFileId: publicWmFileId}
                    }
                })
                // this.imgList.push({
                //     imgUrl: publicDownUrl,
                //     waterMarkImageUrl: publicDownWaterMarkUrl,
                //     waterMarkImageFileId: publicWmFileId,
                //     attachmentTypeID: item.id,
                //     name: item.name,
                // });
                return [publicDownWaterMarkUrl];
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        handleRemove(url) {
            this.imgList.forEach((img, index) => {
                if (img.imgUrl === url) {
                    let res = { ...img, imgUrl: '', waterMarkImageUrl: '', waterMarkImageFileId: ''}
                    this.imgList.splice(index, 1, res)
                }
            })
            // this.imgList = this.imgList.filter(item => {
            //     return item.waterMarkImageUrl != url;
            // });
        },
        //审核流程校验
        setApprovalPer(list) {
            if (!list.length) return true;
            for (let item of list) {
                if ((item.memberType == '3' || item.memberType == '4') && item.userIds.length == 0) {
                    this.$message.error(`还有审批人没选择，请补充完整`);
                    return false;
                }
                delete item.memberType;
            }
            return true;
        },
        createdApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            let approvalInfo = allList.map((items, i) => {
                return {
                    memberType: items.memberType,
                    nodeId: items.nodeKey,
                    procDefId: items.procdefId,
                    userIds: items.userInfos
                        .filter((item, j) => {
                            return !item.isDefUser;
                        })
                        .map((item, j) => {
                            return item.id;
                        }),
                };
            });
            return approvalInfo;
        },

        chooseLocal(bool, cityOpt) {
            this.cityOpt = cityOpt;
            this.mapShow = bool;
        },

        getMapInfo({ lat, lng, formattedAddress }) {
            this.serviceCenForm.longitude = lng;
            this.serviceCenForm.latitude = lat;
            this.serviceCenForm.address = formattedAddress ? formattedAddress : '';
        },
        //获取附件名称list-通用接口
        getAttachmentNameList(parm) {
            let data = {
                data: JSON.stringify(parm),
                op: 'attachmentSelect',
            };
            let URL = '/orgWeb/common/select';
            return new Promise((resolve, reject) => {
                $vuex.$axios(URL, data).then(
                    response => {
                        let dataList = JSON.parse(response.data);
                        resolve(dataList);
                    },
                    response => {
                        reject(response.data);
                    }
                );
            });
        },

        /**
         * 接口存在对象为null 直接传入到组件里面就报错了，做数据容错
         */
        pickFormData(obj) {
          if (obj.rpcOrgBusinessAo === null) {
            obj.rpcOrgBusinessAo = Object.assign({}, serviceCenForm.orgBusiness)
          }
          obj.orgBusiness = Object.assign({}, serviceCenForm.orgBusiness)


          if (obj.rpcOrgBusinessConsoleAo === null) {
            obj.rpcOrgBusinessConsoleAo = {}
          }

          if (obj.rpcPersonChargeInfoAo === null) {
            // 将初始化字段拷贝过来
            obj.rpcPersonChargeInfoAo = Object.assign({}, serviceCenForm.rpcPersonChargeInfoAo)
          }
        }
    },
    beforeDestroy() {
        this.$refs['validateForm'].$refs['ruleForm'].resetFields();
    }
};
</script>

<style lang="scss" scoped>
.org-branch-company {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px;

    &-title {
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #303133;
        margin-bottom: 20px;
    }
    .to-top {
        margin-top: 10px;
    }
    ::v-deep.pic-list {
        display: inline-block !important;
        width: 160px;
        text-align: center;
        margin-right: 20px;
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
    .tip-font {
        color: #f56c6c;
        font-size: 14px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
    }
    ::v-deep.audit-process {
        .currency-apply-audit {
            padding: 21px 0 0 0;
        }
        .currency-apply-title {
            margin-bottom: 0;
        }
    }
}
.process-box {
    margin: 16px 0 64px;
}
</style>
