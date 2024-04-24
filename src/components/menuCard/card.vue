<template>
    <el-row :gutter="20" class="flex-wrap">
        <el-col :span="4" v-for="item in list" :key="item.id">
            <el-card shadow="hover" class="sub-content" @click.native="$emit('goToPage', item)" v-if="isShowMenu(item)">
                <!-- iconType === 1： 字体图标 -->
                <i v-if="item.iconType == 1" :class="`${item.imgName} iconfont`"></i>

                <!-- iconType === 2： 图片上传 -->
                <img v-if="item.iconType == 2 && item.pic" class="icon-img" :src="item.pic" />
                <div v-else class="img-placeholder"></div>
                <p>{{ item.resourcesName }}</p>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        isShowMenu() {
            return function ({ resourcesUrl }) {
                if (resourcesUrl) {
                    //   0:总部  4:总区 5:大区  20:分公司  30:服务站 40:实体店
                    // 分公司以上才需要显示大屏(服务中心也需要展示20221212修改)
                    const orgType = (this.$baseMethod.getStore('roleOption') && this.$baseMethod.getStore('roleOption').orgType) || 0;
                    return resourcesUrl.includes('datascreenSystem') ? orgType <= 30 : true;
                }
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.sub-content {
    margin-bottom: 16px;
}

.flex-wrap {
    .iconfont {
        font-size: 38px;
    }
}
.el-card {
    border: none;
}
.img-placeholder {
    width: 40px;
    height: 40px;
}
</style>
