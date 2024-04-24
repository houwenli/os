<template>
    <div class="map-box">
        <div class="map-title">网约车车主数据监控</div>
        <div class="tab-box">
            <span v-for="(item, index) in tabItem" :key="index" @click="changeTab(item.status)" :class="item.status === activeName ? 'active-css' : ''">
                {{ item.name }}
            </span>
            <div class="active-title" v-if="activeName === 'position'">【全国】</div>
        </div>
        <components :is="activeName"></components>
    </div>
</template>

<script>
import belong from './belong.vue';
import position from './position.vue';
export default {
    components: {
        belong,
        position,
    },
    data() {
        return {
            activeName: 'belong',
            tabItem: [
                {
                    name: '车主归属城市分布图',
                    status: 'belong',
                },
                {
                    name: '车主定位城市分布图',
                    status: 'position',
                },
            ],
        };
    },
    beforeRouteEnter(to, from, next) {
        if (from.fullPath == '/') {
            sessionStorage.removeItem('map-cityCode');
            sessionStorage.removeItem('map-updateCode');
            // sessionStorage.removeItem('map-parentInfo');
        }
        next();
    },
    methods: {
        changeTab(e) {
            if (e === 'belong') {
                this.activeName = 'belong';
            } else {
                this.activeName = 'position';
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.map-box {
    position: relative;
    .map-title {
        position: absolute;
        z-index: 999;
        font-size: 28px;
        font-weight: 600;
        color: #ffffff;
        top: 25px;
        left: 42px;
        line-height: 40px;
    }
    .tab-box {
        // width: 800px;
        position: absolute;
        left: 42px;
        top: 76px;
        z-index: 999;
    }
    span {
        display: inline-block;
        width: 158px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #606266;
        cursor: pointer;
        padding: 10px 16px;
        background: #ffffff;
    }
    span:nth-of-type(1) {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    span:nth-of-type(2) {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .active-css {
        color: #ffffff;
        background: #f05259;
    }
    .active-title {
        width: 64px;
        position: absolute;
        top: 8px;
        left: 332px;
        color: #ffffff;
        z-index: 999;
        font-weight: 600;
        font-size: 16px;
    }
}
</style>
