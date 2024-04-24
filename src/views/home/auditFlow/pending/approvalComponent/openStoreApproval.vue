<template>
    <div class="__approval_field_wrap_container">
        <div class="block_container">
            <el-form label-position="right" label-width="150px" ref="el-form">
                <BaseInfo :dataObject="dataObject" />
                <div class="block_item_container">
                    <span class="block_item_title">门店信息</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="24">
                            <el-form-item label="所属实体店：">{{ nodeForm.name }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="门店所在地区：">{{ nodeForm.submitProvinceName + '-' + nodeForm.submitCityName + '-' + nodeForm.submitAreaName }}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="门店详细地址：">{{ nodeForm.address }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container">
                    <span class="block_item_title">申请详情</span>
                    <el-row class="block_item_wrap">
                        <el-col :span="24">
                            <el-form-item label="开店申请详情：">{{ nodeForm.orgBusiness.remark }}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="block_item_container" v-if="nodeForm.attachmentInfoList && nodeForm.attachmentInfoList.length > 0">
                    <span class="block_item_title">附件资料</span>

                    <div class="imgList">
                        <div class="imgList_item">
                            <div v-for="(img, index) in nodeForm.attachmentInfoList" :key="index">
                                <img :src="img.imgUrl" width="150px" height="150px" @click="onPreview(index)" />
                                <div class="imgName">{{ img.name }}</div>
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
        }
    },
    data() {
        return {
            visible: false,
            srcList: ['1', '2'],
            currentIndex: 1
        };
    },
    methods: {
        onPreview(index) {
            this.visible = true;
            this.currentIndex = index;
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
        // this.$nextTick(() => {
        //     this.srcList = this.nodeForm.attachmentInfoList.map(item => {
        //         return item.imgUrl;
        //     });
        // });
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
    img,
    .imgName {
        text-align: center;
        margin-left: 16px;
    }
}
// /deep/.el-form-item__label {
//     width: 180px !important;
// }
</style>
