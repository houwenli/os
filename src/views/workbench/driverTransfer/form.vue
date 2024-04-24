<template>
    <div class="driverTransferForm">
        <div class="box">
            <div class="warp">
                <div>
                    <el-form ref="formGroup" :model="formGroup" label-width="150px" :rules="formRules" @submit.native.prevent>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="司机ID：" prop="driverId">
                                    <el-input :disabled="isDisabled" v-model.trim="formGroup.driverId" placeholder="请输入需要更换身份的司机ID">
                                        <el-button v-if="!isDisabled" slot="append" icon="el-icon-search" @click="searchDriverID">搜索</el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <ws-descriptions title="基础信息">
                    <el-form ref="driverInfoRef" :model="driverInfo" label-width="150px">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="司机ID：" prop="name">{{driverInfo.driverId || '--'}}</el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="姓名：" prop="name">{{driverInfo.name || '--'}}</el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="手机号：" prop="phone">{{driverInfo.phone || '--'}}</el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="身份证号：" prop="idCardNumber">{{driverInfo.idCardNumber || '--'}}</el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="车牌号：" prop="carNum">{{driverInfo.carNum || '--'}}</el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="所属机构：" prop="orgName">{{driverInfo.orgName || '--'}}</el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </ws-descriptions>
                <ws-descriptions title="服务间隔配置">
                    <el-form ref="formGroupRef" :model="formGroup" :disabled="isDisabled" label-width="150px" :rules="formRules" @submit.native.prevent>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="申请原因：" prop="applyReasonType">
                                    <el-radio-group v-model="formGroup.applyReasonType">
                                        <el-radio :label="1">车主身故/残疾</el-radio>
                                        <el-radio :label="2">证件纠纷</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="申请描述：" prop="applyDesc">
                                    <el-input v-model.trim="formGroup.applyDesc" maxlength="200" placeholder="请输入申请描述" type="textarea" show-word-limit :autosize="{ minRows: 3, maxRows: 5}"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="更换姓名：" prop="name">
                                    <el-input v-model.trim="formGroup.name" maxlength="20" placeholder="请输入需要更换的姓名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="更换证件：" prop="idNumber">
                                    <el-input v-model.trim="formGroup.idNumber" maxlength="18" placeholder="请输入需要更换的证件号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="20">
                                <el-form-item label="证明图片：" prop="fileAoList">
                                    <div class="uploadWrap">
                                        <el-upload
                                            :class="isDisabled || (formGroup.fileAoList && formGroup.fileAoList.length >=5) ? 'hide-box': ''"
                                            accept=".jpg, .png, .pdf, .doc, .docx"
                                            :action="actions"
                                            list-type="picture-card"
                                            :limit="5"
                                            :before-upload="beforeUpload"
                                            :on-success="onSuccess"
                                            :on-change="onChange"
                                            :on-exceed="onExceed"
                                            :file-list="formGroup.fileAoList"
                                            :key="imgNum"
                                            :data="{token:token, op:'upload', data:'{}'}">
                                                <i slot="default" class="el-icon-plus"></i>
                                                <div slot="tip" class="el-upload__tip">可上传照片(jpg、png格式)、文档(pdf、doc、docx)，大小不超过10M，最多上传5个</div>
                                                <div slot="file" slot-scope="{file}">
                                                    <div v-if="file.fileName 
                                                        && (file.fileName.substring(file.fileName.lastIndexOf('.') + 1) === 'png' 
                                                        || file.fileName.substring(file.fileName.lastIndexOf('.') + 1) === 'jpg')">
                                                        <img class="el-upload-list__item-thumbnail" :src="file.cdnUrl" alt=""/>
                                                    </div>
                                                    <div v-else>
                                                        <img src="@/assets/index/file_icon.png" />
                                                        <a style="display:block;" :href="file.cdnUrl" target="_blank">{{file.fileName}}</a>
                                                    </div>
                                                    <span class="el-upload-list__item-actions">
                                                        <span
                                                            class="el-upload-list__item-preview"
                                                            @click="handlePictureCardPreview(file)"
                                                            >
                                                            <i class="el-icon-zoom-in"></i>
                                                        </span>
                                                        <span
                                                            v-if="!isDisabled"
                                                            class="el-upload-list__item-delete"
                                                            @click="handleRemove(file)"
                                                            >
                                                            <i class="el-icon-delete"></i>
                                                        </span>
                                                    </span>
                                                </div>
                                        </el-upload>
                                        <el-dialog :visible.sync="dialogVisible">
                                            <img width="100%" :src="dialogImageUrl" alt="">
                                        </el-dialog>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </ws-descriptions>
                <div class="footer">
                    <el-button plain @click="back()">返 回</el-button>
                    <el-button type="primary" v-if="query_.type == 'add'" @click="saveData">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            moduleName: '/workbench/BRdriverTransfer',
            query_: '',
            formGroup: {
                driverId: '',
                applyReasonType: '',// 申请原因
                applyDesc: '', // 申请描述
                name: '',// 变更姓名
                idNumber: '',// 更新证件
                fileAoList: [], // 证明图片
            },
            driverInfo: {}, // 司机详情
            formRules: {
                driverId: [
                    { required: true, message: '请输入需要更换身份的司机ID', trigger: 'blur'},
                    { pattern: /^([0-9]*)$/, message: '限制纯数字' }],
                applyReasonType: [{ required: true, message: '请选择申请原因', trigger: 'blur' }],
                applyDesc: [
                    { required: true, message: '请输入申请描述', trigger: 'blur' },
                ],
                name: [{ required: true, message: '请输入变更姓名', trigger: 'change' }],
                idNumber: [
                    { required: true, message: '请输入更新证件', trigger: 'change' },
                    { pattern: /^[1-9]([0-9]{16}|[0-9]{13})[xX0-9]$/, message: '限制数字及字母X（不区分大小写），15或18个字' }
                ],
                fileAoList: [{ required: true, message: '请上传证明图片', trigger: 'blur' }],
            },
            isDisabled: false,
            actions: process.env.VUE_APP_DRIVERMANAGER_API + '/driver/file/uploadFile',
            dialogImageUrl: '', // 图片预览
            dialogVisible: false, // 预览展示隐藏
            token: this.$baseMethod.getStore('_ccmUser').token,
            imgNum: 0
        };
    },
    created() {
        this.query_ = this.$route.query;
        if (this.query_.type !== 'add') {
            this.getData();
            this.isDisabled = true;
        }
    },
    methods: {
        // 根据司机ID查询
        searchDriverID(){
            let _this = this;
            let reg = /^([0-9]*)$/;
            if(!this.formGroup.driverId || !reg.test(this.formGroup.driverId)) return;
            let params = {
                data: {
                    driverId: this.formGroup.driverId
                },
                op: 'driverInfo'
            };
            this.$axios(this.getModuleUrl(params.op), params)
                .then(res => {
                    _this.driverInfo = {...JSON.parse(res.data)}
                    _this.driverInfo['driverId'] = _this.formGroup.driverId
                })
                .catch(err => {
                    err.msg === '查询不到详情';
                });
        },
        // 保存
        saveData(){
            let _this = this;
            this.$refs['formGroup'].validate(valid => {
                if (!valid) return;
                _this.$refs['formGroupRef'].validate(valid1 => {
                    if (!valid1) return;
                    let params = {
                        data: {
                            ..._this.formGroup,
                        },
                        op: 'saveSubmit'
                    };
                    params.data.idNumber = params.data.idNumber.toUpperCase()
                    params.data.driverId = _this.driverInfo.driverId;
                    _this.$axios(this.getModuleUrl(params.op), params)
                        .then(res => {
                            if(res.code == 1){
                                _this.back();
                            }
                        })
                        .catch(err => {
                            err.msg === '查询不到详情';
                        });
                })
            })
        },
        // 上传前
        beforeUpload(file){
            if(!this.getModuleUrl('upload')){
                return false;
            }
            const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            const whiteList = ['jpg', 'png', "pdf", "doc", "docx"];

            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$message.error('可上传照片(jpg、png格式)、文档(pdf、doc、docx)，大小不超过10M!');
                return false;
            }
            // (file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg');
            const isLt2M = file.size / 1024 / 1024 < 10; // 限制小于10M
            if (!isLt2M) {
                this.$message.error('可上传照片(jpg、png格式)、文档(pdf、doc、docx)，大小不超过10M!');
            }
            return (whiteList.indexOf(fileSuffix) !== -1) && isLt2M;
        },
        // 上传成功
        onSuccess(res, file){
            if(res.code == 1){
                this.formGroup.fileAoList.push(JSON.parse(res.data))
            }else{
                this.$message.error(res.msg);
                if(res.code === -25){
                    this.$router.replace({name: 'login'});
                }
            }
        },
        // 判断是否上传成功
        onChange(res){
            if(res.response && res.response.code != 1){
                this.imgNum++;
            }
        },
        // 删除图片
        handleRemove(file){
            let index = this.formGroup.fileAoList.findIndex(item => {
                return item.cdnUrl === file.cdnUrl
            })
            this.formGroup.fileAoList.splice(index,1)
        },
        // 图片预览
        handlePictureCardPreview(file) {
            if(!file.cdnUrl) return;
            const fileSuffix = file.cdnUrl.substring(file.cdnUrl.lastIndexOf(".") + 1);
            const whiteList = ['jpg', 'png']
            if(whiteList.indexOf(fileSuffix) === -1){
                window.open(file.cdnUrl);
            }else{
                this.dialogImageUrl = file.cdnUrl;
                this.dialogVisible = true;
            }
        },
        // 上传超出限制
        onExceed(){
            this.$message.error('最多上传5个!');
        },
        // 获取详情
        getData() {
            let _this = this;
            let params = {
                data: {
                    changeApplyId: this.query_.id
                },
                op: 'selectDetail'
            };
            this.$axios(this.getModuleUrl(params.op), params)
                .then(res => {
                    let result = JSON.parse(res.data);
                    _this.formGroup = {...result};
                    _this.formGroup.name = result.updateName;
                    _this.formGroup.idNumber = result.updateIdCardNumber;
                    _this.driverInfo = {
                        name: result.name,
                        phone: result.phone,
                        idCardNumber: result.idCardNumber,
                        carNum: result.carNum,
                        orgName: result.orgName,
                        driverId: result.driverId,
                    }
                    _this.formGroup.fileAoList = [...result.imageList, ...result.fileList];
                })
                .catch(err => {
                    err.msg === '查询不到详情' && this.$router.push({ name: 'chartervaluation' });
                });
        },
        // 返回上一页
        back() {
            // this.$router.push({ name: 'BRdriverTransfer' });
            this.$router.push({ path: this.moduleName });
        },
        // 根据权限获取路径
        getModuleUrl(op) {
            let url = this.$getModuleUrl(this.moduleName, op);
            if(url){
                return url;
            }else{
                this.$message.error('未获取当前op权限');
                return ;
            }
             
        }
    }
};
</script>

<style lang="scss" scoped>
.driverTransferForm .box{
    // height: 100%;
    overflow: auto;
    background: #F0F2F5;
    // padding: 0px 24px 24px 24px !important;
}
 .driverTransferForm .box .warp{
    background: #fff;
    border-radius: 8px;
    padding: 24px 40px 40px 40px;
    font-family: PingFangSC-Medium, PingFang SC;
    // margin-bottom: 64px;
}
.footer {
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 64px;
    line-height: 64px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.04);
    text-align: center;
    z-index: 2001;
    .el-button {
        width: 160px;
    }
}
.uploadWrap {
    position: relative;
    .upload-tips {
        width: 300px;
        height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #909399;
        line-height: 18px;
        position: absolute;
        left: 180px;
        top: 10px;
    }
}
</style>
<style lang="scss">
.driverTransferForm {
    .el-input-group__append {
        background-color: #F05259;
        border-color: #F05259;
        color: #fff;
    }
    .el-upload-list--picture-card .el-upload-list__item{
        word-break: break-all;
    }
}
.hide-box .el-upload--picture-card{
    display: none;
}
</style>