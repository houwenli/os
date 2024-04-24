<template>
    <div v-if="isShowAttachment">
        <div class="block_item_container" v-for="(item, i) in listInfo" :key="item.value">
            <div class="attachmentStyle" v-if="nodeForm.attachmentList.filter(v => v.orgType == item.value).some(val=>val.imgUrl)">
                <span class="block_item_title">{{ item.label }}</span>
                <div class="imgList">
                    <div class="imgList_item">
                        <span v-for="(img, index) in filterAttachmentList(item.value)" :key="index">
                            <img :src="img.imgUrl" width="150px" height="150px" @click="onPreview(i, index)" />
                            <div :class="img.opType == 2 ? 'red imgName' : 'imgName'">{{ img.name }}</div>
                        </span>
                    </div>
                    <ws-image-viewer :visible.sync="item.visible" :src-list="item.srcList" :currentIndex="item.currentIndex" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        nodeForm: {
            type: Object,
            default: () => {}
        },
        category: {
            type: String
        }
    },
    computed: {
        isShowAttachment() {
            return (
                this.nodeForm.attachmentList &&
                this.nodeForm.attachmentList.some(v => {
                    return v.imgUrl
                })
            )
        }
    },
    data() {
        return {
            listInfo: [
                { label: '门店附件', value: '200', visible: false, srcList: [], currentIndex: 1, list: [] },
                { label: '申请附件', value: '503', visible: false, srcList: [], currentIndex: 1, list: [] },
                { label: '运营附件', value: '40', visible: false, srcList: [], currentIndex: 1, list: [] }
            ]
        }
    },
    methods: {
        onPreview(i, index) {
            this.listInfo[i].visible = true
            this.listInfo[i].currentIndex = index
        },
        filterAttachmentList(val) {
           return this.nodeForm.attachmentList.filter(v => v.orgType == val)
        },
        // 获取加密后的文件新路径
        async getAuthfileUrl(list,index,value) {
            let opt = {
                data: {
                    urls: list
                },
                op: 'newUrl'
            }
            try {
                const res = await this.$axios('/new/flowable/form/select', opt)
                let result = JSON.parse(res.data)
                this.listInfo[index].srcList = result.urls
            } catch (error) {}
        }
    },
    mounted() {
        // 机构审批，图片、附件权限处理
        if (this.nodeForm.attachmentList && this.nodeForm.attachmentList.length) {
            this.listInfo.forEach((ele, inx) => {
                this.nodeForm.attachmentList.forEach((e, i) => {
                    if ((ele.value == e.orgType) && e.imgUrl) {
                        ele.list.push(e.imgUrl)
                    }
                })
                this.getAuthfileUrl(ele.list,inx,ele.value)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.attachmentStyle {
    background: #fff;
    margin: 16px 0 32px 0;
    border-radius: 8px;
    padding: 15px 0;
}
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
.red {
    color: #e05151;
}
</style>