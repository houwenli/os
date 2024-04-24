<template>
    <div v-if="isShowAttachment">
        <div class="block_item_container">
            <span class="block_item_title">附件资料</span>
            <div class="imgList">
                <div class="imgList_item">
                    <!-- 需判断attachmentInfoList里面每条数据的imgUrl是否存在，不存在就不展示，否则页面上是白框 -->
                    <span v-for="(img, index) in nodeForm.attachmentInfoList" :key="index">
                        <img :src="img.imgUrl" width="150px" height="150px" @click="onPreview(index)" />
                        <div :class="img.opType == 2 ? 'red imgName' : 'imgName'">{{ img.name }}</div>
                    </span>
                </div>
                <ws-image-viewer :visible.sync="visible" :src-list="srcList" :currentIndex="currentIndex" />
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
                this.nodeForm.attachmentInfoList &&
                this.nodeForm.attachmentInfoList.some(v => {
                    return v.imgUrl
                })
            )
        }
    },
    data() {
        return {
            visible:false,
            srcList:['1','2'],
            currentIndex: 0
        }
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
        // 机构审批，图片、附件权限处理
        if(this.nodeForm.attachmentInfoList && this.nodeForm.attachmentInfoList.length) {
            let list = this.nodeForm.attachmentInfoList.map(({imgUrl}) =>imgUrl)
            this.getAuthfileUrl(list)
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