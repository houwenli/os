<template>
    <div>
        <div class="org-physical-store">
            <!-- 表单 -->
            <validate-form ref="validateForm" :pageType="pageType" :ruleForm="physicalStoreForm" :rules="physicalStoreRules" @chooseLocal="chooseLocal" :key="timer"></validate-form>

            <div class="org-physical-store-title to-top" v-if="pageType !== 'addPhysicalStore'">
                运营附件
                <span class="tip-font">(请上传jpg、png格式照片，大小不超过10M)</span>
            </div>
            <div v-if="pageType !== 'addPhysicalStore'">
                <div class="pic-list" v-for="(item, index) in attachmentList" :key="index">
                    <ws-image-upload ref="imageUpload" class="image-upload" :urlList='handleAttachmentUrl(item)' v-bind="options" :quantity="1" :afterUpload="(...arg) => afterUpload(...arg, item)"></ws-image-upload>
                    <span class="file-name">{{ item.name }}</span>
                </div>
            </div>
            <!-- <el-form label-position="left" v-if="pageType === 'addPhysicalStore'" style="margin-top: 20px" :model="physicalStoreForm" :rules="physicalStoreRules" ref="ruleForm">
                <el-row :gutter="40">
                    <el-col :span="8">
                        <el-form-item class="store-form-item" label="开店状态:" prop="openStatus">
                            <el-select required v-model="physicalStoreForm.openStatus" style="width: 100%" @change="openStatusChange" placeholder="请选择开店状态">
                                <el-option v-for="item in openStatusFilters" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="physicalStoreForm.openStatus === 1">
                        <el-form-item class="store-form-item" label="承诺开店时间:" prop="promiseOpenTime">
                            <el-date-picker
                                style="width: 100%"
                                v-model="physicalStoreForm.promiseOpenTime"
                                :picker-options="openStatusPickerOptions"
                                type="date"
                                placeholder="请选择日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form> -->
            <div v-if="storeImgShow && pageType !== 'addPhysicalStore'" class="org-physical-store-title" style="margin-top: 16px">
                门头照
                <span class="tip-font">(请上传jpg、png格式照片，大小不超过10M)</span>
            </div>
            <div v-if="storeImgShow">
                <div class="pic-list" v-for="item in attachmentListStore" :key="item.id">
                    <ws-image-upload ref="imageUploadS" class="image-upload" :urlList='handleAttachmentUrl(item)' v-bind="options" :quantity="1" :afterUpload="(...arg) => afterUpload(...arg, item)"></ws-image-upload>
                    <span class="file-name">{{ item.name }}</span>
                </div>
            </div>
            <!-- 地址采集 -->
            <a-map :show-search="true" v-if="mapShow" :show.sync="mapShow" :marker="marker" @select="getMapInfo" :cityOpt="cityOpt"></a-map>
        </div>
        <div class="org-physical-store process-box" v-show="pageType !== 'addPhysicalStore'">
            <!-- 审核流程 -->
            <div class="org-physical-store-title" style="margin-bottom: 0">审核流程</div>
            <audit-process @update:load="updateLoad" class="audit-process" title="" ref="auditProcess" :actions="actions" :query="{ nameCode: 32 }"></audit-process>
        </div>

        <!-- 底部导航 -->
        <footer-fixed>
            <ws-throttle>
                <el-button type="primary" :disabled="disabled" style="width: 160px; height: 36px" @click="submitForm()">{{pageType === 'addPhysicalStore'?'创建待开业实体店':'提交审核'}}</el-button>
            </ws-throttle>
        </footer-fixed>
    </div>
</template>

<script>
import ValidateForm from '../components/addOrgForm.vue';
import FooterFixed from '../components/FooterFixed';
import AuditProcess from '@/components/AuditProcess';
import AMap from '@/components/AMap';
import { physicalStoreForm, physicalStoreRules } from '../utils/addOrgForm.js';
export default {
    name: 'addPhysicalStore',
    components: {
        ValidateForm,
        FooterFixed,
        AMap,
        AuditProcess,
    },
    data() {
        return {
            moduleName: '/addPhysicalStore',
            pageType: 'addPhysicalStore',
            physicalStoreForm,
            physicalStoreRules,
            options: {
                quantity: 1,
                actions: {
                    url: '/orgWeb/file/addAllAttachment',
                    op: 'upload', //上传op，优先级高于moduleName
                },
                handleRemove: this.handleRemove,
            },
            timer: '',
            actions: {
                moduleName: '/index/todo',
                op: 'flowNode',
            },
            resubmissionData: {}, //路由参数
            detailData: {}, //详情参数
            attachmentList: [], //运营附件
            attachmentListStore: [], // 门头照
            storeImgShow: false,
            pictureList: [],
            imgList: [],
            fileList: [],
            btnLoading: false,
            imgListMap: new Map(), // 存储已上传图片，主要是存原图，最后提交 (key: 水印地址 value: 原图地址)
            mapShow: false,
            disabled:false,
            cityOpt: {},
            openStatusFilters: [
                { id: 1, value: '待开业' },
                { id: 2, value: '已开业' },
            ],
        };
    },
    computed: {
        marker() {
            const { longitude, latitude } = this.physicalStoreForm;
            return longitude && latitude ? [{ longitude, latitude }] : [];
        },
        openStatusPickerOptions() {
            return {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 || time.getTime() > Date.now() + 24 * 60 * 60 * 1000 * 15;
                },
            };
        },
    },
    watch: {
        detailData: {
            handler(val) {
                this.physicalStoreForm = this.pickFormData(val)
                this.pageType = 'addPhysicalStore';
                // this.timer = new Date().getTime();
            },
        },
    },
    async created() {
      try {
        const res = await this.getAttachmentNameList({ attachmentType: 40 })

        this.attachmentList = res || [];
        this.imgList = res.map(item => { return { attachmentTypeID: item.id, name: item.name, orgType: 40 } })

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
        //区分图片属于运营附件 还是门头照
        distinguishPicType(list){
            console.log(list, '==========list')
            if(!list||!list.length){
                return list
            }
            let attachmentList=[];
            let attachmentListStore=[];
            list.forEach(item=>{
                //运营附件
                if(item.orgType && item.orgType===40){
                    attachmentList.push(item)
                }
                //已开业-门头照
                if(this.detailData.openStatus== 2){
                    this.storeImgShow = true;
                    if(item.orgType && item.orgType===200){
                       attachmentListStore.push(item)
                }}
            })
            this.attachmentList=attachmentList||[];
            this.attachmentListStore=attachmentListStore||[];
            console.log(this.attachmentListStore)
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
                let data = JSON.parse(res.data);

                let nodeFormJson = JSON.parse(data.nodeFormJson)

                this.detailData = {
                    ...nodeFormJson,
                    cityAreaCodeList: [nodeFormJson.submitProvinceCode, nodeFormJson.submitCityCode],
                    cityCodeList: [nodeFormJson.provinceCode, nodeFormJson.cityCode],
                    submitAreaCode: nodeFormJson.areaCode,
                    parentId:nodeFormJson.parentId,
                    rpcPersonChargeInfoAo: nodeFormJson.rpcPersonChargeInfoAo,
                };
                // 处理附件
                data.attachmentInfoList = nodeFormJson.attachmentInfoList || []
                console.log(data.attachmentInfoList, '===data.attachmentInfoList')
                //运营附件和门头照回显
                this.distinguishPicType(data.attachmentInfoList)
                this.imgList=data.attachmentInfoList;
            } catch (error) {
              console.log(error)
            }
        },
        checkForm(rpcWorkFlowAoList) {
            let isPhysicalStore = this.pageType === 'addPhysicalStore' ? true : false
            let orgForm = true;
            let form = true;
            this.$refs['validateForm'].$refs['ruleForm'].validate(valid => {
                orgForm = valid;
            });
            // this.$refs['ruleForm'].validate(valid => {
            //     form = valid;
            // });
            // if (!this.uploadImgValidate()) return false;
            if (this.storeImgShow) {
                if (!this.uploadImgValidateS()) return false;
            } else {
                this.imgList = this.imgList.filter(item => {
                    // 无门店附件位  筛选出
                    return item.orgType != 200;
                });
            }
            //判断是否有选择审核人
            // if (!this.setApprovalPer(rpcWorkFlowAoList)) return false;
            if (!isPhysicalStore && !this.uploadImgValidate()) return false;
            return orgForm && form;
        },
        async submitForm() {
            let rpcWorkFlowAoList = this.createdApprovalInfo();
            if (!this.checkForm(rpcWorkFlowAoList)) return;

            let formData = JSON.parse(JSON.stringify(this.physicalStoreForm));
            // orgBusiness 营业执照
            // rpcPersonChargeInfoAo 负责人信息
            let orgBusiness = formData.orgBusiness,
                rpcPersonChargeInfoAo = formData.rpcPersonChargeInfoAo;
            if(this.pageType !== 'addPhysicalStore') {
                orgBusiness.legalPerson = rpcPersonChargeInfoAo.personChargeName;
                orgBusiness.legalPhone = rpcPersonChargeInfoAo.personChargePhone;
                orgBusiness.legalIdNumber = rpcPersonChargeInfoAo.personChargeNo;
            }
            delete formData.orgBusiness;
            delete formData.rpcPersonChargeInfoAo;
            this.btnLoading = true;
            // 机构所在地
            formData.submitProvinceCode = this.physicalStoreForm.cityAreaCodeList[0];
            formData.submitCityCode = this.physicalStoreForm.cityAreaCodeList[1];
            // 业务城市
            formData.provinceCode = this.physicalStoreForm.cityCodeList[0];
            formData.cityCode = this.physicalStoreForm.cityCodeList[1];
            formData.areaCode = this.physicalStoreForm.submitAreaCode;
            formData.relationId = this.physicalStoreForm.parentId;
            formData.orgType = 40;
            let opt = {
                data: {
                    ...formData,
                    orgBusiness,
                    rpcPersonChargeInfoAo,
                    rpcWorkFlowAoList,
                    attachmentInfoList: this.imgList,
                },
                op: 'saveStation',
            };
            this.disabled = true
            try {
                await this.$axios(this.getModuleUrl(opt.op), opt);
                this.$message.success('新增成功');
                this.$router.refresh({ path: 'index' });
                this.$refs['validateForm'].$refs['ruleForm'].resetFields();
                this.$refs['ruleForm'].resetFields();
                this.disabled = false;
            } catch (err) {
                if (err.code == -100) {
                    this.$confirm('当前审批配置的工作流规则有更新。确认后，流程区将按新工作流刷新节点。', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                    }).then(() => {
                        this.$refs.auditProcess.getFlowable();
                    });
                }
                this.disabled = false;
            } finally {
                this.btnLoading = false;
                this.disabled - false;
            }
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
        uploadImgValidateS() {
            if (!this.attachmentListStore.length) return true;
            let components = this.$refs.imageUploadS;
            for (let i = 0; i < components.length; i++) {
                let item = components[i];
                let list = item.getUrlList();
                let upload = this.attachmentListStore[i];
                // if (!list.length) {
                //     this.$message.error(`${upload.name}上传位图片不能为空`);
                //     return;
                // }
                upload.url = list[0];
            }
            this.pictureList = this.attachmentListStore.map((v, i) => ({
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
                console.log(this.imgList)
                // this.imgList.push({
                //     imgUrl: publicDownUrl,
                //     waterMarkImageUrl: publicDownWaterMarkUrl,
                //     waterMarkImageFileId: publicWmFileId,
                //     orgType: item.orgType,
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
            this.imgList = this.imgList.filter(item => {
                return item.waterMarkImageUrl != url;
            });
        },
        //审核流程校验
        setApprovalPer(list) {
            if (!list.length) return true;
            for (let item of list) {
                if ((item.memberType == '3' || item.memberType == '4') && item.userIds.length == 0 && this.pageType !== 'addPhysicalStore') {
                    this.$message.error(`还有审批人没选择，请补充完整`);
                    return false;
                }
                delete item.memberType;
            }
            return true;
        },
        createdApprovalInfo() {
            let allList = this.$refs.auditProcess.allList;
            let approvalInfo = allList.map(items => {
                return {
                    memberType: items.memberType,
                    nodeId: items.nodeKey,
                    procDefId: items.procdefId,
                    userIds: items.userInfos.filter(item => !item.isDefUser).map(item => item.id),
                };
            });
            return approvalInfo;
        },

        chooseLocal(bool, cityOpt) {
            this.cityOpt = cityOpt;
            this.mapShow = bool;
        },

        getMapInfo({ lat, lng, formattedAddress }) {
            this.physicalStoreForm.longitude = lng;
            this.physicalStoreForm.latitude = lat;
            this.physicalStoreForm.address = formattedAddress ? formattedAddress : '';
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
        openStatusChange(val) {
            if (val === 2) {
              // 已开业
                this.physicalStoreForm.promiseOpenTime = '';
                this.getAttachmentNameList({ attachmentType: 200 }).then(res => {
                    this.attachmentListStore = res || [];
                    this.imgList = [...this.imgList, ...res.map(item => { return { attachmentTypeID: item.id, name: item.name, orgType: 200 } })]
                    this.storeImgShow = true;
                });
            } else {
                this.attachmentListStore.forEach(val => {
                    this.imgList = this.imgList.filter(item => {
                        return val.id !== item.attachmentTypeID;
                    });
                });
                this.storeImgShow = false;
            }
        },

        /**
         * 接口存在对象为null 直接传入到组件里面就报错了，做数据容错
         */
        pickFormData(obj) {
          obj.parentId = ''
          if (obj.rpcPersonChargeInfoAo === null) {
            obj.rpcPersonChargeInfoAo = {
              personChargePhone: "",
              personChargeName: "",
              personChargeNo: "",
              personChargePostId: "",
            }
          }

          return obj
        }
    },
    beforeDestroy() {
        this.$refs['validateForm'].$refs['ruleForm'].resetFields();
        // this.$refs['ruleForm'].resetFields();
    },
};
</script>

<style lang="scss" scoped>
.store-form-item{
    display: flex;
}
.org-physical-store {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 40px;
    height: calc(100% - 64px);
    overflow: auto;
    &-title {
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #303133;
        margin-bottom: 16px;
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
